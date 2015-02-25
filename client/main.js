Template.topbar.events({
  'click .js-nuke': function () {
    Meteor.call('nuke');
  }
});