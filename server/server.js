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
  cmd: function (command) {
    var parts = command.split(' ');
    var cmd = parts[0];
    var args = parts.splice(1, parts.length);

    var _id = Actions.insert({command: command});

    var proc = spawn(cmd, args, {
      env: {
        'PYTHONUNBUFFERED': 'true',
      }
    });

    proc.stdout.on('data', Meteor.bindEnvironment(function (data) {
      updateOutput(_id, readStream(data));
    }));

    proc.stderr.on('data', Meteor.bindEnvironment(function (data) {
      updateOutput(_id, readStream(data));
    }));

    proc.on('error', Meteor.bindEnvironment(function (error) {
      updateOutput(_id, String(error));
    }));

    proc.on('close', Meteor.bindEnvironment(function (code) {
      Actions.update(_id, {$set: {exitCode: code}});
    }));

    return _id;
  },

  nuke: function () {
    Actions.remove({});
  }
});

// python /Users/sven/spotify/test.py