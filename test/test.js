var expect        = require('chai').expect;
var async         = require('async');
var Db            = require('../lib/db');
var CommandStore  = require('../lib/command-store');

describe('CommandStore', function() {
  var db = Db.create('mongodb://localhost/restify-cqrs-mongodb-test');
  var store = CommandStore.create(db);

  describe('save', function() {
    var result = {};
    var cmd = { command: 'test', submittedAt: new Date(), payload: { one: 2 } };
    before(function(done) {
      async.waterfall([
        function(cb) { db.Command.remove({}, cb); },
        function(num, cb) { store.save(cmd, cb); },
        function(id, cb) { result.id = id; cb(); }
      ], done);
    });

    it('returns an id', function() {
      expect(result.id).to.exist;
    });

    it('saves command in database', function(done) {
      db.Command.findById(result.id, function(err, doc) {
        expect(err).not.to.exist;
        expect(doc).to.exist;
        expect(doc.id).to.equal(result.id);
        expect(doc.command).to.equal(cmd.command);
        expect(doc.payload).to.deep.equal(cmd.payload);
        expect(doc.submittedAt).to.deep.equal(cmd.submittedAt);
        done();
      });
    });
  });

  describe('update', function() {
    var result = {};
    var cmd =  { command: 'test', submittedAt: new Date(), payload: { one: 2 } };
    var cmd2 = { command: 'test', submittedAt: new Date(), payload: { one: 2 }, error: null, result: { two: 3 }, completedAt: new Date() };
    before(function(done) {
      async.waterfall([
        function(cb) { db.Command.remove({}, cb); },
        function(num, cb) { db.Command.create(cmd, cb); },
        function(doc, cb) { result.id = doc.id; cb(null, doc.id); },
        function(id, cb) { cmd2.id = id; store.update(cmd2, cb); }
      ], done);
    });

    it('updates the command in the database', function(done) {
      db.Command.findById(result.id, function(err, doc) {
        expect(err).not.to.exist;
        expect(doc).to.exist;
        expect(doc.error).not.to.exist;
        expect(doc.result).to.deep.equal(cmd2.result);
        expect(doc.completedAt).to.deep.equal(cmd2.completedAt);
        done();
      });
    });

  });

  describe('get', function() {
    var result = {};
    var cmd =  { command: 'test', submittedAt: new Date(), payload: { one: 2 } };
    before(function(done) {
      async.waterfall([
        function(cb) { db.Command.remove({}, cb); },
        function(num, cb) { db.Command.create(cmd, cb); },
        function(doc, cb) { result.id = doc.id; cb(); }
      ], done);
    });

    it('returns the command from the db', function(done) {
      store.get(result.id, function(err, doc) {
        expect(err).not.to.exist;
        expect(doc).to.exist;
        expect(doc.id.toString()).to.equal(result.id.toString());
        expect(doc.command).to.equal(cmd.command);
        expect(doc.payload).to.deep.equal(cmd.payload);
        expect(doc.submittedAt).to.deep.equal(cmd.submittedAt);
        done();
      });
    });
  });

});
