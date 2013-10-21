
module.exports.create = function(db) {
  return new CommandStore(db);
}

var CommandStore = function(db) {

  this.save = function(command, callback) {
    db.Command.create(command, function(err, doc) {
      if (err) return callback(err);
      return callback(null, doc.id);
    });
  };

  this.update = function(command, callback) {
    var id = command.id;
    delete command.id;
    db.Command.findByIdAndUpdate(id, command, function(err, result) {
      if (err) return callback(err);
      return callback();
    });
  };

  this.get = function(id, callback) {
    db.Command.findById(id, function(err, doc) {
      if (err) return callback(err);
      var obj = doc.toObject();
      obj.id = obj._id;
      delete obj._id;
      return callback(err, obj);
    });
  };

};
