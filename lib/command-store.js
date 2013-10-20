var schema = require('./schema');

module.exports.create = function() {
  return new CommandStore();
};

var CommandStore = function() {

  this.save = function(command, callback) {
    schema.create(command, function(err, doc) {
      if (err) return callback(err);
      return callback(null, doc.id);
    });
  };

  this.update = function(command, callback) {
    var id = command.id;
    delete command.id;
    schema.findByIdAndUpdate(id, command, function(err, result) {
      if (err) return callback(err);
      return callback();
    });
  };

  this.get = function(id, callback) {
    schema.findById(id, function(err, doc) {
      if (err) return callback(err);
      var obj = doc.toObject();
      obj.id = obj._id;
      delete obj._id;
      return callback(err, obj);
    });
  };

};
