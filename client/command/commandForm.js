Template.inputApplication.helpers({
  applications: function () {
    return Applications.find();
  },

  selectedApplication: function () {
    var request = Session.get('commandRequest');
    return request && Applications.findOne(request.applicationId);
  }
});

Template.inputApplication.events({
  'change input[name=applicationId]': function (e, template) {
    var newAppId = e.target.value;
    var request = Session.get('commandRequest');

    // Only trigger when the application has actually changed.
    if (!request || newAppId !== request.applicationId) {
      Session.set('commandRequest', { applicationId: newAppId });
    }
  },

  'submit': function (e, template) {
    var request = template.$('.ui.form').form('get values');

    if (request && request.applicationId) {
      Meteor.call('runApplication', request, function (err, actionId) {
        if (err) {
          alert(err.reason);
        } else {
          Session.set('selectedAction', actionId);
        }
      });
    }
  }
});

Template.inputApplication.rendered = function () {
  var template = this;
  template.$('.ui.dropdown').dropdown();

  template.autorun(function () {
    var request = Session.get('commandRequest');
    var app = request && Applications.findOne(request.applicationId);

    if (app) {
      template.$('.ui.dropdown').dropdown('set selected', app._id);

      var paramSchema = {};
      var paramDefaults  = {};
      _.each(app.parameters, function (param) {
        var paramName = param.param;
        var schema = {
          identifier: paramName,
          rules: []
        };

        if (param.required) {
          schema.rules.push({
            type   : 'empty',
            prompt : 'required'
          });
        }

        paramSchema[paramName] = schema;

        var defaultValue = null;
        if (request.hasOwnProperty(paramName)) {
          defaultValue = request[paramName];
        }
        else if (param.default) {
          switch (param.type) {
            case 'bool':
              defaultValue = (param.default == 'true');
              break;

            case 'month':
              defaultValue = moment().subtract(1, 'month').format(param.default);
              break;

            default:
              defaultValue = param.default;
          }
        }
        paramDefaults[paramName] = defaultValue;
      });

      // Need to wait until parameter form elements have been rendered.
      Meteor.setTimeout(function () {
        var form = template.$('.ui.form');

        form.form('destroy');
        form.find('.submit').off('click'); // https://github.com/Semantic-Org/Semantic-UI/pull/1978

        form.form(paramSchema, { inline: true, keyboardShortcuts: false });
        form.form('set values', paramDefaults);
      });
    }
  });
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