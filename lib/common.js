hasRole = function (user, role) {
  return user && Roles.userIsInRole(user, role);
};