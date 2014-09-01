var mongoose = require('mongoose')
  , _ = require('underscore');

var config = {dbHost: 'localhost', dbPort: '27071', dbName: 'cinergi'}
  , mongoUrl = ['mongodb:/', config.dbHost, config.dbName].join('/');

// *****************************
// * Records collection schema *
// *****************************
var recordsSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  Title: String,
  Description: String,
  PublicationDate: Date,
  ResourceId: String,
  Authors: [{
    Name: String,
    OrganizationName: String,
    ContactInformation: {
      Phone: String,
      email: String,
      Address: {
        Street: String,
        City: String,
        State: String,
        Zip: String
      }
    }
  }],
  Keywords: [],
  GeographicExtent: {
    NorthBound: Number,
    SouthBound: Number,
    EastBound: Number,
    WestBound: Number
  },
  Distributors: [{
    Name: String,
    OrganizationName: String,
    ContactInformation: {
      Phone: String,
      email: String,
      Address: {
        Street: String,
        City: String,
        State: String,
        Zip: String
      }
    }
  }],
  Links: [{
    URL: String,
    Name: String,
    Description: String,
    Distributor: String,
    ServiceType: String
  }],
  MetadataContact: {
    Name: String,
    OrganizationName: String,
    ContactInformation: {
      Phone: String,
      email: String,
      Address: {
        Street: String,
        City: String,
        State: String,
        Zip: String
      }
    }
  },
  HarvestInformation: {
    OriginalFileIdentifier: String,
    OriginalFormat: String,
    HarvestRecordId: String,
    HarvestURL: String,
    HarvestDate: String
  },
  Collections: [],
  Published: Boolean
});

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