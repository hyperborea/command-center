Template.commands.helpers({
  commands: function () {
    return Commands.find();
  }
});

Template.commands.events({
  'submit form': function (e, template) {
    e.preventDefault();

    commandInput = $(template.find('input[name=command]'));

    Commands.insert({
      command: commandInput.val()
    });

    commandInput.val('');
  },

  'click .js-delete': function (e, template) {
    Commands.remove(this._id);
  }
});