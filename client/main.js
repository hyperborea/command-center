Template.topbar.helpers({
  'username': function () {
    return Meteor.user() && Meteor.user().emails[0].address;
  }
});

Template.login.helpers({
  'loggedIn': function () {
    return Meteor.userId();
  }
});