var CommandStore = require('./lib/command-store');
var Db           = require('./lib/db');

module.exports = {
  CommandStore: function(connection) {
    var db = Db.create(connection);
    return CommandStore.create(db);
  };
};
