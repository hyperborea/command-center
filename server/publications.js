Meteor.publish('actions', function () {
  return Actions.find({}, {sort: {createdAt: -1}, limit: 10});
});

Meteor.publish('commands', function () {
  return Commands.find();
});