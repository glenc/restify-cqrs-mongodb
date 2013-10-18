var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;

var commandSchema = new Schema({
  command:      { type: String, required: true },
  payload:      { type: Schema.Types.Mixed },
  result:       { type: Schema.Types.Mixed },
  error:        { type: Schema.Types.Mixed },
  submittedAt:  { type: Date, required: true },
  completedAt:  { type: Date }
});

var model = mongoose.model('Command', commandSchema);
module.exports = model;
