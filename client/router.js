// Subscribe to Action-Collection and preselect latest.
Meteor.subscribe('actions', function () {
  var action = Actions.findOne({}, {sort: {createdAt: -1}});
  Session.set('selectedAction', action ? action._id : null);
});

Meteor.subscribe('applications');
Meteor.subscribe('processes');


Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', {
  name: 'home',
  template: 'center'
});

Router.route('/applications', {
  template: 'applications'
});

Router.route('/workflow', {
  template: 'workflow'
});