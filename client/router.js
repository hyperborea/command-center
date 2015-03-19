// Subscribe to Action-Collection and preselect latest.
Meteor.subscribe('actions', function () {
  var action = Actions.findOne({}, {sort: {createdAt: -1}});
  Session.set('selectedAction', action ? action._id : null);
});

Meteor.subscribe('applications');
Meteor.subscribe('tasks');

var requireRole = function (role, route) {
  if (!hasRole(Meteor.user(), role) && !Meteor.loggingIn()) {
    route.render('login');
  } else {
    route.next();
  }
};


Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', {
  name: 'home',
  template: 'center'
});

Router.route('/login');
Router.onBeforeAction(function () {
  return requireRole('user', this);
});

Router.route('/applications', {
  template: 'applications',
  onBeforeAction: function () {
    return requireRole('admin', this);
  }
});

Router.route('/workflow', {
  template: 'workflow'
});