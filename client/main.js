Template.topbar.helpers({
  'username': function () {
    return Meteor.user() && Meteor.user().emails[0].address;
  }
});

Template.topbar.events({
  'click .js-nuke': function () {
    Meteor.call('nuke');
  }
});