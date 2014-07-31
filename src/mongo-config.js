var mongoose = require('mongoose')
  , _ = require('underscore');

var config = {dbHost: 'localhost', dbPort: '27071', dbName: 'cinergi'}
  , mongoUrl = ['mongodb:/', config.dbHost, config.dbName].join('/');


// *****************************
// * Records collection schema *
// *****************************
var recordsSchema = new mongoose.Schema({});

// ******************************************************************
// * Collections collection schema... Might want to rename this one *
// ******************************************************************
var collectionsSchema = new mongoose.Schema({});

// ******************************
// * Harvests collection schema *
// ******************************
var harvestsSchema = new mongoose.Schema({});

var mongoDb = mongoose.connect(mongoUrl);
mongoDb.connection.on('error', function (err) {
  console.log('Error connecting to MongoDB', err);
});
mongoDb.connection.on('open', function () {
  console.log('Connected to MongoDB');
});

function connectToMongoCollection (mongoDb, collection, schema) {
  return mongoDb.model(collection, schema);
}

function getCollection (collection) {
  switch (collection) {
    case 'record':
      return connectToMongoCollection(mongoDb, 'Records', recordsSchema);
      break;
    case 'collection':
      return connectToMongoCollection(mongoDb, 'Collections',
        collectionsSchema);
      break;
    case 'harvest':
      return connectToMongoCollection(mongoDb, 'Harvests', harvestsSchema);
      break;
  }
}

exports.getCollection = getCollection;