Template.inputApplication.helpers({
  applications: function () {
    return Applications.find();
  },

  selectedApplication: function () {
    return Session.get('selectedApplication');
  }
});

Template.inputApplication.events({
  'change input[name=applicationId]': function (e, template) {
    var appId = Applications.findOne(e.target.value);
    Session.set('selectedApplication', appId);
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
    var app = Session.get('selectedApplication');

    if (app) {
      template.$('.ui.dropdown').dropdown('set value', app._id);

      var paramSchema = {};
      var paramDefaults  = {};
      _.each(app.parameters, function (param) {
        var schema = {
          identifier: param.param,
          rules: []
        };

        if (param.required) {
          schema.rules.push({
            type   : 'empty',
            prompt : 'required'
          });
        }

        paramSchema[param.param] = schema;

        var defaultValue = null;
        if (param.default) {
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
        paramDefaults[param.param] = defaultValue;
      });

      // Need to wait until parameter form elements have been rendered.
      Meteor.setTimeout(function () {
        var form = template.$('.ui.form');

        form.form('destroy');
        form.find('.submit').off('click'); // https://github.com/Semantic-Org/Semantic-UI/pull/1978

        form.form(paramSchema, { inline: true });
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