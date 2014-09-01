var mongoose = require('mongoose')
  , _ = require('underscore');

var config
  , mongoUrl
  , recordsSchema
  , harvestsSchema
  , collectionsSchema
  , mongoDb
  ;

config = {dbHost: 'localhost', dbPort: '27071', dbName: 'cinergi'};
mongoUrl = ['mongodb:/', config.dbHost, config.dbName].join('/');

// *****************************
// * Records collection schema *
// *****************************
recordsSchema = new mongoose.Schema({
  id: {type: String, required: true},
  Title: {type: String, required: true},
  Description: {type: String, required: true},
  PublicationDate: {type: Date, required: true},
  ResourceId: {type: String, required: false},
  Authors: [{
    Name: {type: String, required: false},
    OrganizationName: {type: String, required: false},
    ContactInformation: {
      Phone: {type: String, required: false},
      email: {type: String, required: true},
      Address: {
        Street: {type: String, required: true},
        City: {type: String, required: true},
        State: {type: String, required: true},
        Zip: {type: String, required: true}
      }
    }
  }],
  Keywords: [],
  GeographicExtent: {
    NorthBound: {type: Number, required: true, min: -90, max: 90},
    SouthBound: {type: Number, required: true, min: -90, max: 90},
    EastBound: {type: Number, required: true, min: -180, max: 180},
    WestBound: {type: Number, required: true, min: -180, max: 180}
  },
  Distributors: [{
    Name: {type: String, required: false},
    OrganizationName: {type: String, required: false},
    ContactInformation: {
      Phone: {type: String, required: false},
      email: {type: String, required: true},
      Address: {
        Street: {type: String, required: true},
        City: {type: String, required: true},
        State: {type: String, required: true},
        Zip: {type: String, required: true}
      }
    }
  }],
  Links: [{
    URL: {type: String, required: true},
    Name: {type: String, required: false},
    Description: {type: String, required: false},
    Distributor: {type: String, required: false},
    ServiceType: {type: String, required: false}
  }],
  MetadataContact: {
    Name: {type: String, required: false},
    OrganizationName: {type: String, required: false},
    ContactInformation: {
      Phone: {type: String, required: false},
      email: {type: String, required: true},
      Address: {
        Street: {type: String, required: true},
        City: {type: String, required: true},
        State: {type: String, required: true},
        Zip: {type: String, required: true}
      }
    }
  },
  HarvestInformation: {
    OriginalFileIdentifier: {type: String, required: false},
    OriginalFormat: {type: String, required: false},
    HarvestRecordId: {type: String, required: true},
    HarvestURL: {type: String, required: true},
    HarvestDate: {type: String, required: true}
  },
  Collections: {type: Array, required: true},
  Published: {type: Boolean, required: true}
});

// ******************************************************************
// * Collections collection schema... Might want to rename this one *
// ******************************************************************
collectionsSchema = new mongoose.Schema({});

// ******************************
// * Harvests collection schema *
// ******************************
harvestsSchema = new mongoose.Schema({});

mongoDb = mongoose.connect(mongoUrl);
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