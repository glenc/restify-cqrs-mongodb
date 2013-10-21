var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;

module.exports.create = function(connection) {
  return new Db(connection);
};

var Db = function(connection) {
  // schemas
  var commandSchema = new Schema({
    command:      { type: String, required: true },
    payload:      { type: Schema.Types.Mixed },
    result:       { type: Schema.Types.Mixed },
    error:        { type: Schema.Types.Mixed },
    submittedAt:  { type: Date, required: true },
    completedAt:  { type: Date }
  });

  // connect
  var conn = mongoose.createConnection(connection);
  var Command = conn.model('Command', commandSchema);

  return {
    Command: Command
  };
};
