// Subscribe to Action-Collection and preselect latest.
Meteor.subscribe('actions', function () {
  var action = Actions.findOne({}, {sort: {createdAt: -1}});
  Session.set('selectedAction', action ? action._id : null);
});

var cycleIndex = 0;
var cycleCommand = function (offset) {
  cycleIndex += offset;
  if (cycleIndex > Actions.find().count() || cycleIndex < 0) {
    cycleIndex = 0;
  }

  if (cycleIndex === 0) {
    return '';
  }
  else {
    return Actions.findOne({}, {sort: {createdAt: -1}, skip: cycleIndex-1}).command;
  }
};

Template.command.events({
  'click .js-nuke': function () {
    Meteor.call('nuke');
  }
});

Template.input.events({
  'submit': function (e, template) {
    e.preventDefault();
    
    var input = $(template.find('input'));
    Session.set('output', '');

    Meteor.call('cmd', input.val(), function (err, _id) {
      input.val('');
      cycleIndex = 0;
      Session.set('selectedAction', _id);
    });
  },

  'keydown': function (e, template) {
    if (e.keyCode == 38) { // arrow-up
      e.preventDefault();
      $(template.find('input')).val( cycleCommand(1) );
    }
    if (e.keyCode == 40) { // arrow-down
      e.preventDefault();
      $(template.find('input')).val( cycleCommand(-1) );
    }
  }
});


Template.history.helpers({
  actions: function () {
    return Actions.find({}, {sort: {createdAt: -1}});
  },

  itemClass: function () {
    return Session.equals('selectedAction', this._id) ? 'active': null;
  },
  activeClass: function () {
    return Session.equals('selectedAction', this._id) ? 'unhide icon': 'angle right icon';
  },
  statusClass: function () {
    switch (this.exitCode) {
      case null:
        return 'spinner loading icon';
      case 0:
        return 'checkmark green icon';
      default:
        return 'remove red icon';
    }
  }
});

Template.history.events({
  'click .item': function (e, template) {
    Session.set('selectedAction', this._id);
  }
});


Template.output.helpers({
  rows: function () {
    var action = Actions.findOne(Session.get('selectedAction'));
    return action ? action.output : [];
  }
});
