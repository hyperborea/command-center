Template.applications.helpers({
  applications: function () {
    return Applications.find();
  }
});

Template.applicationForm.helpers({
  saveLabel: function () {
    return this._id ? 'Save' : 'Create';
  },

  saved: function () {
    return this._id;
  }
});

Template.applicationForm.events({
  'click .js-save': function (e, template) {
    e.preventDefault();

    var application = {
      name    : template.find('input[name=name]').value,
      command : template.find('input[name=command]').value
    };

    var _ = (this._id) ? Applications.update(this._id, {$set: application}) : Applications.insert(application);
    $(template.find('.js-reset')).click();
  },

  'click .js-reset': function (e, template) {
    template.find('input[name=name]').value = this.name || '';
    template.find('input[name=command]').value = this.command || '';
  },

  'click .js-delete': function (e, template) {
    Applications.remove(this._id);
  }
});