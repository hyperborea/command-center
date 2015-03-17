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

Template.input.events({
  'keydown input[name=command]': function (e, template) {
    if (e.keyCode == 13) { // enter
      e.preventDefault();
    
      var input = $(template.find('input[name=command]'));
      Session.set('output', '');

      Meteor.call('runCommand', input.val(), function (err, _id) {
        input.val('');
        cycleIndex = 0;
        Session.set('selectedAction', _id);
      });
    }

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

Template.inputApplication.helpers({
  applications: function () {
    return Applications.find();
  },

  selectedApplication: function () {
    return Session.get('selectedApplication');
  }
});

Template.inputApplication.events({
  'change input[name=application]': function (e, template) {
    var application = Applications.findOne(e.target.value);
    Session.set('selectedApplication', application);
  },

  'click .submit.button': function (e, template) {
    var application = Session.get('selectedApplication');
    if (application) {
      Meteor.call('runApplication', application._id, function (err, actionId) {
        Session.set('selectedAction', actionId);
      });
    }
  }
});

Template.inputApplication.rendered = function () {
  this.$('.ui.dropdown').dropdown();
};

Template.inputApplicationParameter.helpers({
  'isType': function () {
    for (var i = 0; i < arguments.length; i++) {
      if (arguments[i] === this.type) return true;
    }
    return false;
  }
});

Template.inputApplicationParameter.rendered = function () {
  this.$('.ui.checkbox').checkbox();
};


Template.history.helpers({
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
  }
});

Template.history.events({
  'click .item': function (e, template) {
    Session.set('selectedAction', this._id);
  },

  'click .js-kill': function (e, template) {
    Meteor.call('kill', this._id);
  }
});


Template.output.helpers({
  rows: function () {
    var action = Actions.findOne(Session.get('selectedAction'));
    return action ? action.output : [];
  }
});
