Template.taskForm.onRendered(function () {
  this.$('.ui.checkbox').checkbox();
  this.$('.ui.form').form({
    name: {
      identifier: 'name',
      rules: [{ type: 'empty' }]
    }
  });
});

Template.taskForm.helpers({
  tasks: function () {
    return Tasks.find({}, {sort: {root: -1, name: 1}});
  }
});

Template.taskForm.events({
  'submit': function (e, template) {
    var form = template.$('.ui.form');
    var data = form.form('get values');

    Tasks.insert(data);
    form.form('reset');
  },

  'click .js-delete-task': function (e, template) {
    if (confirm('Sure you want to delete this task?')) {
      Tasks.remove(this._id);
    }
  }
});