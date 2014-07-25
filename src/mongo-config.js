var mongoose = require('mongoose');
var _ = require('underscore');

var config = {
  dbHost: 'localhost',
  port: '27071'
};

var mongoUrl = 'mongodb://' + config.dbHost;

// These three functions return a connection to the database and nothing more.  The db
// object that's returned from each of these functions can be used to actually open
// up the database and perform operations within it.  Use mongoose's
// createConnection() function to make connections to more than one database.
function connectToMongoDb (mongoUrl, db) {
  var dbUrl = [mongoUrl, db].join('/')
    , connection = mongoose.createConnection(dbUrl);

  connection.on('error', function (err) {
    console.log('MongoDB connection error:', err);
  });

  return connection;
}

var mongo = {
  recordsDb: connectToMongoDb(mongoUrl, 'records'),
  collectionsDb: connectToMongoDb(mongoUrl, 'collections'),
  harvestsDb: connectToMongoDb(mongoUrl, 'harvests')
};

// Make this into a search Url!  ElasticSearch?
var searchUrl = 'http://' + config.dbHost + ':' + config.dbPort;

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
      return connectToMongoDb(mongoUrl, 'records');
      break;
    case 'collection':
      return connectToMongoDb(mongoUrl, 'collections');
      break;
    case 'harvest':
      return connectToMongoDb(mongoUrl, 'harvests');
      break;
  }
}

exports.mongo = mongo;
exports.fileUrl = fileUrl;
exports.searchUrl = searchUrl;
exports.getDb = getDb;