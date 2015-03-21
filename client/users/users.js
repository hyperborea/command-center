Template.users.onCreated(function () {
  this.subscribe('users');
});


Template.users.helpers({
  users: function () {
    return Meteor.users.find();
  }
});


Template.userRolesForm.onCreated(function () {
  this.formChanged = new ReactiveVar(false);
});

Template.userRolesForm.onRendered(function () {
  var template = this;
  var input = template.$('input[name=roles]');

  input.selectize({
    create       : true,
    createOnBlur : true,
  });

  template.autorun(function () {
    var roles = Blaze.getData().roles || [];
    var selectize = input[0].selectize;
    
    selectize.clear();
    _.each(roles, function (role) {
      selectize.createItem(role, true);
    });
    template.formChanged.set(false);
  });
});

Template.userRolesForm.helpers({
  buttonsClass: function () {
    return Template.instance().formChanged.get() ? null : 'invisible';
  }
});

Template.userRolesForm.events({
  'change input': function (e, template) {
    template.formChanged.set(true);
  },

  'click .submit.button': function (e, template) {
    var selectize = template.find('input[name=roles]').selectize;
    Meteor.call('updateRoles', this._id, selectize.items);
    template.formChanged.set(false);
  },

  'click .reset.button': function (e, template) {
    var selectize = template.find('input[name=roles]').selectize;
    selectize.setValue(this.roles, true);
    template.formChanged.set(false);
  }
});