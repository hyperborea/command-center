Template.applicationFormParameterList.onRendered(function () {
  var template = this;

  template.sortable = Sortable.create(this.find('.parameters'), {
    handle   : '.move',
    onUpdate : function () {
      template.parent().formChanged.set(true);
    }
  });
});

Template.applicationFormParameterList.onDestroyed(function () {
  this.sortable.destroy();
});


Template.applicationFormParameter.rendered = function () {
  var template = this;

  // Initialise components.
  template.$('.ui.dropdown').dropdown();
  template.$('.ui.checkbox').checkbox();
  template.$('.parameter.form').form();

  // Blaze reuses DOM elements, make sure to update components on data changes.
  template.autorun(function () {
    template.$('.parameter.form').form('set values', Blaze.getData());
  });
};

Template.applicationFormParameter.helpers({
  types: function () {
    return ['text', 'month', 'bool', 'int'];
  },

  selectedType: function () {
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