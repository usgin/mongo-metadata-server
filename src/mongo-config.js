var mongoose = require('mongoose');
var _ = require('underscore');

var config = {
  dbHost: 'localhost',
  dbPort: 27071
};

var mongoUrl = 'http://' + config.dbHost + ':' + config.dbPort;

// These three functions return a connection to the database and nothing more.  The db
// object that's returned from each of these functions can be used to actually open
// up the database and perform operations within it.
var recordsDb = function (mongoUrl) {
  var dbUrl = [mongoUrl, 'records'].join('/');
  mongoose.connect(dbUrl);
  return mongoose.connection;
};

var collectionsDb = function (mongoUrl) {
  var dbUrl = [mongoUrl, 'collections'].join('/');
  mongoose.connect(dbUrl);
  return mongoose.connection;
};

var harvestsDb = function (mongoUrl) {
  var dbUrl = [mongoUrl, 'collections'].join('/');
  mongoose.connect(dbUrl);
  return mongoose.connection;
};


var mongo = {
  recordsDb: recordsDb(mongoUrl),
  collectionsDb: collectionsDb(mongoUrl),
  harvestsDb: harvestsDb(mongoUrl)
};

function createDb (dbName) {
  // Not sure if we really need this with Mongo.  Collections are created by connecting to a
  // database and inserting a piece of data.  So, the way we make connections to MongoDB
  // completely takes the worry out of whether or not we need to check if a database exists
  // first.  Kind of a genius workflow...
}

function saveDesignDoc (dbName, designDoc) {
  // Not really sure if we need this either.  Mongo supports flexible schema mapping, so we
  // should just be able to populate collections with records in the schemas that we want.
  // But it doesn't seem like Mongo needs records of these design docs in the database.
}

function fileUrl (id, fileName) {
  return [mongoUrl, 'records', id, fileName].join('/');
}
function getDb (resourceType) {
  switch (resourceType) {
    case 'record':
      return recordsDb(mongoUrl);
      break;
    case 'collection':
      return collectionsDb(mongoUrl);
      break;
    case 'harvest':
      return harvestsDb(mongoUrl);
      break;
  }
}

exports.mongo = mongo;
exports.fileUrl = fileUrl;
exports.getDb = getDb;