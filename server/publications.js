Meteor.publish('actions', function () {
  return Actions.find({}, {sort: {createdAt: -1}, limit: 10});
});

Meteor.publish('applications', function () {
  return Applications.find();
});

Meteor.publish('processes', function () {
  return Processes.find({}, { sort: { name: 1 } });
});