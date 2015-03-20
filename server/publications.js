Meteor.publish('actions', function (limit) {
  limit = limit || 20;
  return Actions.find({}, {sort: {createdAt: -1}, limit: limit});
});

Meteor.publish('applications', function () {
  return Applications.find({}, {sort: {name: 1}});
});

Meteor.publish('tasks', function () {
  return Tasks.find({}, { sort: { name: 1 } });
});