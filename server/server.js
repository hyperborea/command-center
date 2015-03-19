var spawn = Npm.require('child_process').spawn;

var readStream = function (data) {
  if (typeof data == 'object') {
    var chars = [];
    _.each(data, function (char) {
      chars.push(String.fromCharCode(char));
    });
    return chars.join('');
  }
  else {
    return data;
  }
};

var updateOutput = function (_id, buffer) {
  Actions.update(_id, {
    $push: {
      output: { $each: buffer.split('\n').filter(function(s){return s;}) }
    }
  });
};


Meteor.methods({
  runCommand: function (command, path) {
    var parts = command.split(' ');
    var cmd = parts[0];
    var args = parts.splice(1, parts.length);

    var proc = spawn(cmd, args, {
      cwd: path,
      env: {
        'PYTHONUNBUFFERED' : 'true',
        'PYTHONPATH'       : path
      }
    });

    var _id = Actions.insert({command: command, pid: proc.pid});

    proc.stdout.on('data', Meteor.bindEnvironment(function (data) {
      updateOutput(_id, readStream(data));
    }));

    proc.stderr.on('data', Meteor.bindEnvironment(function (data) {
      updateOutput(_id, readStream(data));
    }));

    proc.on('error', Meteor.bindEnvironment(function (error) {
      updateOutput(_id, String(error));
    }));

    proc.on('close', Meteor.bindEnvironment(function (code, signal) {
      if (_.isNull(code)) {
        updateOutput(_id, "[system] Process was closed with signal " + signal);
        code = -1;
      }

      Actions.update(_id, {$set: {exitCode: code}});
    }));

    return _id;
  },

  runApplication: function (request) {
    var app = Applications.findOne(request.applicationId);
    var parameters = app.parameters || [];
    var paramString = "";

    for (var i=0; i<parameters.length; i++) {
      var p = parameters[i];
      var providedValue = request.hasOwnProperty(p.param) ? String( request[p.param] ) : null;

      if (providedValue) {
        if (p.kw) {
          paramString += " " + p.param + " " + providedValue;
        } else {
          paramString += " " + providedValue;
        }
      }
      else if (p.required) {
        throw new Meteor.Error( 400, "Missing required parameter: " + p.param );
      }
    }

    return Meteor.call('runCommand', app.command + paramString, app.path);
  },

  kill: function (_id) {
    var proc = Actions.findOne(_id);
    if (proc && proc.pid && _.isNull(proc.exitCode)) {
      process.kill(proc.pid, 'SIGTERM');
    }
  },

  nuke: function () {
    Actions.remove({});
  }
});