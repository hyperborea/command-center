Meteor.publish('actions', function() {
  return Actions.find({}, {sort: {createdAt: -1}, limit: 10});
});