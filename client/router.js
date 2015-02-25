// Subscribe to Action-Collection and preselect latest.
Meteor.subscribe('actions', function () {
  var action = Actions.findOne({}, {sort: {createdAt: -1}});
  Session.set('selectedAction', action ? action._id : null);
});

Meteor.subscribe('commands');


Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', {
  name: 'command.center',
  template: 'center'
});

Router.route('/commands', {
  name: 'command.list',
  template: 'commands'
});