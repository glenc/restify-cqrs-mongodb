var schema = require('./schema');

var Commands = module.exports = (function() {

  var save = function(command, callback) {
    var cmd = {
      command: command.command,
      payload: command.payload,
      submittedAt: new Date()
    };

    schema.create(cmd, function(err, doc) {
      if (err) return callback(err);
      return callback(null, doc.id);
    });
  };

  var saveResult = function(id, err, result, callback) {
    var update = {
      $set: {
        error: err ? err.toString() : null,
        result: result,
        completedAt: new Date()
      }
    };

    schema.findByIdAndUpdate(id, update, function(err, result) {
      if (err) return callback(err);
      return callback();
    });
  };

  var get = function(id, callback) {
    schema.findById(id, function(err, doc) {
      if (err) return callback(err);
      return callback(err, doc.toObject());
    });
  };

  return {
    save: save,
    saveResult: saveResult,
    get: get
  };
})();
