var appFilter = function (userId) {
  return hasRole(userId, 'admin') ? {} : {roles: {$in: Roles.getRolesForUser(userId)}};
};


Meteor.publish('actions', function (limit) {
  if (!hasRole(this.userId, 'user')) return [];

  limit = limit || 20;
  check(limit, Number);
  
  var applications = Applications.find(appFilter(this.userId), {fields: {_id: 1}});
  var filter = {
    'request.applicationId': {$in: applications.map(function (app) { return app._id; })}
  };

  return Actions.find(filter, {sort: {createdAt: -1}, limit: limit});
});

Meteor.publish('applications', function () {
  if (!hasRole(this.userId, 'user')) return [];

  return Applications.find(appFilter(this.userId), {sort: {name: 1}});
});

Meteor.publish('users', function () {
  if (!hasRole(this.userId, 'admin')) return [];

  return Meteor.users.find({}, {fields: {username: 1, emails: 1, roles: 1}});
});

Meteor.publish('tasks', function () {
  if (!hasRole(this.userId, 'user')) return [];

  return Tasks.find({}, {sort: {name: 1}});
});