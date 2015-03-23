// inspired by https://github.com/binocarlos/spawn-args
spawn_args = function (command) {
  var args = [];

  var quoteType = null;
  var currentArg = '';

  function addCurrent () {
    var arg = currentArg.trim();

    if (arg) {
      args.push(arg);
      currentArg = '';
    }
  }

  _.each(command, function (c, i) {
    if (c == " ") {
      if (quoteType) {
        currentArg += c;
      }
      else {
        addCurrent();
      }
    }

    else if (_.contains(['\'', '"'], c)) {
      if (quoteType) { // already in quote
        if (quoteType === c) {
          addCurrent();
          quoteType = null;
        }
        else {
          currentArg += c;
        }
      }
      else { // open quote
        addCurrent();
        quoteType = c;
      }
    }

    else {
      currentArg += c;
    }
  });

  addCurrent();

  return args;
};