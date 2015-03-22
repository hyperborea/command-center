Meteor.subscribe('applications');

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

Router.route('/users', {
  template: 'users',
  onBeforeAction: function () {
    return requireRole('admin', this);
  }
});

Router.route('/workflow', {
  template: 'workflow'
});