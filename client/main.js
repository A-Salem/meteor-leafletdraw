window.onload= function(){

  L.Icon.Default.imagePath = 'images';

  var ID = function () {

    return  Math.random().toString(36).substr(2, 9);
  };



  var getShapeType = function(layer) {

      if (layer instanceof L.Circle) {
          return 'circle';
      }
      if (layer instanceof L.Marker) {
          return 'marker';
      }
      if ((layer instanceof L.Polyline) && ! (layer instanceof L.Polygon)) {
          return 'polyline';
      }
      if ((layer instanceof L.Polygon) && ! (layer instanceof L.Rectangle)) {
          return 'polygon';
      }
      if (layer instanceof L.Rectangle) {
          return 'rectangle';
      }

  };

    // create a map in the "map" div, set the view to a given place and zoom
    var map = L.map('map').setView([29.9766575, 31.2679858], 13);

    // add an OpenStreetMap tile layer
      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Initialize the FeatureGroup to store editable layers
    var drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    Meteor.call('items.find', function(error, res){
      Session.set('mapItems', res);
      mapItems= Session.get('mapItems');

      _.each(mapItems,function(Item){
        if(Item.type=="marker"){
          var marker= L.marker(Item.coordinates);
          marker.id= Item._id;
          drawnItems.addLayer(marker);
        }
        if(Item.type=="polyline"){
          var polyline= L.polyline(Item.coordinates, {color: "#f06eaa", weight: 4});
          polyline.id= Item._id;
          drawnItems.addLayer(polyline);
        }
        if(Item.type=="polygon"){
          var polygon= L.polygon(Item.coordinates, {color: "#f06eaa", weight: 4});
          polygon.id= Item._id;
          drawnItems.addLayer(polygon);
        }
        if(Item.type=="circle"){
          var circle = L.circle(Item.coordinates, Item.radius, {
            color: "#f06eaa",
            fillOpacity: 0.2,
            weight: 4
          });
          circle.id= Item._id;
          drawnItems.addLayer(circle);
        }
        if(Item.type=="rectangle"){
          var rectangle= L.rectangle(Item.coordinates, {color: "#f06eaa", weight: 4});
          rectangle.id= Item._id;
          drawnItems.addLayer(rectangle);
        }
      })

  });


    // Initialize the draw control and pass it the FeatureGroup of editable layers
    var drawControl = new L.Control.Draw({
        edit: {
            featureGroup: drawnItems
        }
    });
    map.addControl(drawControl);


    map.on('draw:created', function (e) {
        var type = e.layerType,
            layer = e.layer;
            id = ID();
            layer.id = id;

        if (type === 'marker') {
            var coordinates= [];
            coordinates[0]= layer._latlng.lat;
            coordinates[1]= layer._latlng.lng;


            Meteor.call('items.insert', id, "marker", coordinates);
          }

        if (type === 'polyline') {
            var coordinates= [];
            _.each(layer._latlngs, function(latlng){
              var array= [];
              array[0]= latlng.lat;
              array[1]= latlng.lng;
              coordinates.push(array);
            });

            Meteor.call('items.insert', id, "polyline", coordinates);
          }

        if (type === 'polygon') {
            var coordinates= [];
            _.each(layer._latlngs, function(latlng){
              var array= [];
              array[0]= latlng.lat;
              array[1]= latlng.lng;
              coordinates.push(array);
            });

            Meteor.call('items.insert', id, "polygon", coordinates);
          }

        if (type === 'circle') {
            var coordinates= [];
            coordinates[0]= layer._latlng.lat;
            coordinates[1]= layer._latlng.lng;

            var radius= layer._mRadius;

            Meteor.call('items.insert', id, "circle", coordinates, radius);
          }

          if (type === 'rectangle') {
              var coordinates= [];
              _.each(layer._latlngs, function(latlng){
                var array= [];
                array[0]= latlng.lat;
                array[1]= latlng.lng;
                coordinates.push(array);
              });

              Meteor.call('items.insert', id, "rectangle", coordinates);
            }
        // Do whatever else you need to. (save to db, add to map etc)
        drawnItems.addLayer(layer);

    });

    map.on('draw:edited', function (e) {
        // Update db to save latest changes.
        var layers = e.layers;
        layers.eachLayer(function (layer) {
          id= layer.id;
           //do whatever you want, most likely save back to db
          if (getShapeType(layer) === 'marker') {
              // Do marker specific actions
              var coordinates= [];
              coordinates[0]= layer._latlng.lat;
              coordinates[1]= layer._latlng.lng;

              Meteor.call('items.update', id, coordinates);

          }

          if (getShapeType(layer) === 'polyline') {
            var coordinates= [];
            _.each(layer._latlngs, function(latlng){
              var array= [];
              array[0]= latlng.lat;
              array[1]= latlng.lng;
              coordinates.push(array);
            });

             Meteor.call('items.update', id, coordinates);
          }

          if (getShapeType(layer) === 'polygon') {
            var coordinates= [];
            _.each(layer._latlngs, function(latlng){
              var array= [];
              array[0]= latlng.lat;
              array[1]= latlng.lng;
              coordinates.push(array);
            });

             Meteor.call('items.update', id, coordinates);
          }

          if (getShapeType(layer) === 'circle') {
              // Do marker specific actions
              var coordinates= [];
              coordinates[0]= layer._latlng.lat;
              coordinates[1]= layer._latlng.lng;

              var radius= layer._mRadius;

              Meteor.call('items.update', id, coordinates, radius);

          }

          if (getShapeType(layer) === 'rectangle') {
            var coordinates= [];
            _.each(layer._latlngs, function(latlng){
              var array= [];
              array[0]= latlng.lat;
              array[1]= latlng.lng;
              coordinates.push(array);
            });

             Meteor.call('items.update', id, coordinates);
          }

       });

    });

    map.on('draw:deleted', function (e) {
        // Update db to save latest changes.
        var layers = e.layers;
        layers.eachLayer(function (layer) {
          id= layer.id;
          if (getShapeType(layer) === 'marker') {
              // Do marker specific actions
              Meteor.call('items.remove', id);
          }

          if (getShapeType(layer) === 'polyline') {
              Meteor.call('items.remove', id);
          }

          if (getShapeType(layer) === 'polygon') {
              Meteor.call('items.remove', id);
          }

          if (getShapeType(layer) === 'circle') {
              Meteor.call('items.remove', id);
          }

          if (getShapeType(layer) === 'rectangle') {
              Meteor.call('items.remove', id);
          }
        });

      });
}
