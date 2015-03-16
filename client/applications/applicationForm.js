Template.applicationForm.created = function () {
  this.showParameters = new ReactiveVar(false);
};

Template.applicationForm.helpers({
  saveLabel: function () {
    return this._id ? 'Save' : 'Create';
  },

  saved: function () {
    return this._id;
  },

  showParameters: function () {
    return Template.instance().showParameters.get();
  },

  parametersCount: function () {
    return this.parameters && this.parameters.length;
  }
});

Template.applicationForm.events({
  'submit': function (e, template) {
    var application = template.$('.application.form').form('get values');

    if (template.showParameters.get()) {
      var parameters = _.map(template.$('.parameter'), function (param){
        return $(param).form('get values');
      });

      application['parameters'] = _.filter(parameters, function (param) { return param.param; });
    }

    var f = (this._id) ? Applications.update(this._id, {$set: application}) : Applications.insert(application);
    template.find('.reset.button').click();
  },

  'reset': function (e, template) {
    console.log(e);
  },

  'click .reset.button': function(e, template) {
    template.$('.application.form').form('reset');
    template.$('.parameter.form').each(function() {
      $(this).form('reset');
    });
  },

  'click .js-delete': function (e, template) {
    if (confirm("Are you sure you want to delete the application '" + this.name + "'?")) {
      Applications.remove(this._id);
    }
  },

  'click .js-toggle-parameters': function (e, template) {
    var showParam = template.showParameters;
    showParam.set(!showParam.get());
  }
});

Template.applicationForm.rendered = function () {
  var template = this;

  template.$('.application.form').form({
    name: {
      identifier: 'name',
      rules: [
        {
          type   : 'empty',
          prompt : 'Please label the application'
        }
      ]
    },
    command: {
      identifier: 'command',
      rules: [
        {
          type   : 'empty',
          prompt : 'Please enter a command'
        }
      ]
    }
  }, {
    inline: true
  });

  // Blaze reuses DOM elements, make sure to update form on data changes.
  template.autorun(function () {
    template.$('.application.form').form('set values', Blaze.getData());
  });
};