var mongoose = require('mongoose')
  , _ = require('underscore');

var config = {
  dbHost: 'localhost',
  dbPort: '27071',
  dbName: 'cinergi'
};

var mongoUrl = 'mongodb://' + config.dbHost
  , collections = {};

// *****************************
// * Records collection schema *
// *****************************
var recordsSchema = new mongoose.Schema({});
collections['Records'] = recordsSchema;

// ******************************************************************
// * Collections collection schema... Might want to rename this one *
// ******************************************************************
var collectionsSchema = new mongoose.Schema({});
collections['Collections'] = collectionsSchema;

// ******************************
// * Harvests collection schema *
// ******************************
var harvestsSchema = new mongoose.Schema({});
collections['Harvests'] = harvestsSchema;

function connectToMongoDB (mongoUrl, db) {
  var dbUrl = [mongoUrl, db].join('/')
    , connection = mongoose.createConnection(dbUrl);

  connection.on('error', function (err) {
    console.log('MongoDB connection error:', err);
  });

  connection.on('open', function () {
    console.log('Connected to MongoDB server');
  });

  return connection;
}

function connectToMongoCollection (mongoUrl, )

function initializeMongoDB (callback) {
  connectToMongoDB(mongoUrl, config.dbName, function (connection) {
    var dbModels = {}, schema, schemaObj;
    connection.db.collectionNames(function (err, names) {
      if (err) console.log (err);

      for (schema in collections) {
        if (collections.hasOwnProperty(schema)) {
          schemaObj = collections[schema];
          if (names.indexOf(schema) === -1) {
            dbModels[schema] = connection.model(schema, schemaObj);
            console.log('Created collection --', schema);
          }
          if (names.indexOf(schema) > -1) {
            dbModels[schema] = connection.model(schema);
            console.log('Found collection --', schema);
          }
        }
      }

      callback(dbModels);
    })
  });
}

initializeMongoDB(function (models) {
  console.log(models);
});


/*
function getCollection (resourceType) {
  switch (resourceType) {
    case 'record':
      return connectToMongoCollection(mongoUrl, config.dbName,
        'Records', recordsSchema);
      break;
    case 'collection':
      return connectToMongoCollection(mongoUrl, config.dbName,
        'Collections', collectionsSchema);
      break;
    case 'harvest':
      return connectToMongoCollection(mongoUrl, config.dbName,
        'Harvests', harvestsSchema);
      break;
  }
}

exports.mongo = mongo;
exports.getCollection = getCollection;*/