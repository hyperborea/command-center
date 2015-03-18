Meteor.publish('actions', function () {
  return Actions.find({}, {sort: {createdAt: -1}, limit: 10});
});

Meteor.publish('applications', function () {
  return Applications.find({}, {sort: {name: 1}});
});

Meteor.publish('tasks', function () {
  return Tasks.find({}, { sort: { name: 1 } });
});