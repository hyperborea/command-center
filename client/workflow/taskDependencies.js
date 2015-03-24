Template.taskDependencies.helpers({
  rootTasks: function () {
    return Tasks.find({root: true});
  }
});

Template.dependencyItem.helpers({
  dependencies: function () {
    return Tasks.find({ _id: { $in: this.dependencies || [] } });
  },

  tasks: function () {
    return Tasks.find();
  },

  isDependency: function () {
    return Template.parentData();
  },

  showSelect: function () {
    return Session.equals('showSelectForProcess', this._id);
  }
});

Template.dependencyItem.events({
  'click .js-remove-dep': function (e, template) {
    e.stopPropagation();

    var parent = Template.parentData();
    Tasks.update(parent._id, { $pull: { dependencies: this._id } });
  },

  'click .js-show-select': function (e, template) {
    Session.set('showSelectForProcess', this._id);
  },

  'change select': function (e, template) {
    e.stopPropagation();

    Tasks.update(this._id, { $addToSet: { dependencies: e.target.value } });
    $(e.target).val('');
  }
});