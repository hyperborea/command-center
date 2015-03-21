Meteor.users.helpers({
  username: function () {
    return this.emails[0].address;
  }
});