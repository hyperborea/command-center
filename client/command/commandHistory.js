var LIMIT_INCREMENT = 20;
Session.setDefault('historyLimit', LIMIT_INCREMENT);


Template.commandHistory.onCreated(function () {
  var template = this;

  template.autorun(function () {
    template.subscribe('actions', Session.get('historyLimit'), function () {
      var action = Actions.findOne({}, {sort: {createdAt: -1}});
      Session.set('selectedAction', action ? action._id : null);
    });
  });
});

Template.commandHistory.helpers({
  actions: function () {
    return Actions.find({}, {sort: {createdAt: -1}});
  },

  hasMore: function () {
    return Actions.find().count() == Session.get('historyLimit');
  },

  loading: function () {
    return Template.instance().subscriptionsReady() ? null : 'loading';
  }
});

Template.commandHistory.events({
  'click .js-load-more': function (e, template) {
    Session.set('historyLimit', Session.get('historyLimit') + LIMIT_INCREMENT);
  }
});


Template.commandHistoryItem.helpers({
  itemClass: function () {
    return Session.equals('selectedAction', this._id) ? 'active': null;
  },

  activeIcon: function () {
    return Session.equals('selectedAction', this._id) ? 'unhide icon': 'angle right icon';
  },

  statusIcon: function () {
    switch (this.exitCode) {
      case null:
        return 'spinner loading icon';
      case 0:
        return 'checkmark green icon';
      default:
        return 'remove red icon';
    }
  },

  isRunning: function () {
    return _.isNull(this.exitCode);
  },

  isOwn: function () {
    return this.createdBy == Meteor.userId();
  }
});

Template.commandHistoryItem.events({
  'click .item': function (e, template) {
    Session.set('selectedAction', this._id);
  },

  'click .js-kill': function (e, template) {
    Meteor.call('killAction', this._id);
  },

  'click .copy.icon': function (e, template) {
    Session.set('commandRequest', this.request);
  },
});