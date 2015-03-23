Meteor.users.helpers({
  name: function () {
    return this.username || this.emails[0].address;
  }
});