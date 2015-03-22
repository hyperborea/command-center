Template.commandOutput.helpers({
  command: function () {
    var action = Actions.findOne(Session.get('selectedAction'));
    return action ? action.command : null;
  },

  rows: function () {
    var action = Actions.findOne(Session.get('selectedAction'));
    return action ? action.output : [];
  }
});

Template.commandOutput.events({
  'click .js-fullscreen': function (e, template) {
    $('.modal').modal('show');
  },
  
  'click .js-export': function (e, template) {
    var filename = prompt("Download output under filename", "export.txt");

    if (filename) {
      var action = Actions.findOne(Session.get('selectedAction'));
      var pom = document.createElement('a');
      pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent( action.output.join("\n") ));
      pom.setAttribute('download', filename);
      pom.click();
    }
  }
});