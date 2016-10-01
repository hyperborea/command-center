Accounts.onCreateUser(function (options, user) {
  // assume that the first user is the system owner
  if (Meteor.users.find().count() === 0) {
    user.roles = ['user', 'admin'];
  }

  return user;
});