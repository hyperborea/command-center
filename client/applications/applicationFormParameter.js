Template.applicationFormParameter.rendered = function () {
  var template = this;

  // Initialise components.
  template.$('.ui.dropdown').dropdown();
  template.$('.ui.checkbox').checkbox();

  template.$('.parameter.form').form({
    param: {
      identifier: 'param',
      // rules: [{ type: 'empty' }]
    },
    type: {
      identifier: 'type',
      // rules: [{ type: 'empty' }]
    },
    required: {
      identifier: 'required'
    }
  });

  // Blaze reuses DOM elements, make sure to update components on data changes.
  template.autorun(function () {
    var data = Blaze.getData();
    template.$('.parameter.form').form('set values', data);
    template.$('.ui.dropdown').dropdown('set value', data.type);
  });
};

Template.applicationFormParameter.helpers({
  types: function () {
    return ['text', 'month', 'bool'];
  },

  selected: function () {
    return (this == Template.parentData().type) ? 'selected' : null;
  }
});

Template.applicationFormParameter.events({
  'click .js-add-parameter': function (e, template) {
    var formNode = template.$('.form');
    var data = formNode.form('get values');

    Applications.update(Template.parentData()._id, {$addToSet: {parameters: data}});
    formNode.form('reset');
  },

  'click .js-remove-parameter': function (e, template) {
    Applications.update(Template.parentData()._id, {$pull: {parameters: {param: this.param}}});
  }
});