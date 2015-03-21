hasRole = function (user, role) {
  return user && Roles.userIsInRole(user, role);
};

requireRole = function (user, role) {
  if (!hasRole(user, role)) {
    throw new Meteor.Error(403, "Access denied");
  }
};

tokenize = function (string) {
  return String(string).split(/\s*,\s*/);
};