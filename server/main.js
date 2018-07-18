import { Meteor } from 'meteor/meteor';


Meteor.startup(() => {
  // code to run on server at startup

});

Meteor.methods({
  'items.find'(){
     return Items.find().fetch();
  },
  'items.insert'(id, type, coordinates, radius){
    Items.insert({_id: id, type: type, coordinates: coordinates, radius: radius});
  },
  'items.update'(id, coordinates, radius){
    Items.update({_id: id}, {$set: {coordinates: coordinates, radius: radius} });
  },
  'items.remove'(id){
    Items.remove({_id: id});
  }
})
