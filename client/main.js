Template.topbar.helpers({
  'user': function () {
    return Meteor.user();
  }
});

Template.login.helpers({
  'loggedIn': function () {
    return Meteor.userId();
  }
});