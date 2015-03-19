Template.center.events({
  'click .js-modal': function (e, template) {
    $('.modal').modal('show');
  }
});


Template.commandHistory.helpers({
  actions: function () {
    return Actions.find({}, {sort: {createdAt: -1}});
  },

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

Template.commandHistory.events({
  'click .item': function (e, template) {
    Session.set('selectedAction', this._id);
  },

  'click .js-kill': function (e, template) {
    Meteor.call('killAction', this._id);
  }
});


Template.commandOutput.helpers({
  rows: function () {
    var action = Actions.findOne(Session.get('selectedAction'));
    return action ? action.output : [];
  }
});

Template.commandOutput.events({
  'click .js-fullscreen': function (e, template) {
    $('.modal').modal('show');
  },
  
  'click .js-export': function (e, template) {
    var filename = prompt("Download output under filename", "export.txt");

    if (filename) {
      var action = Actions.findOne(Session.get('selectedAction'));
      var pom = document.createElement('a');
      pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent( action.output.join("\n") ));
      pom.setAttribute('download', filename);
      pom.click();
    }
  }
});
