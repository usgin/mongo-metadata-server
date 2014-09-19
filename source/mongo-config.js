var mongoose = require('mongoose')
  , _ = require('underscore')
  ;

var config
  , mongoUrl
  , minimalistRecordsSchema
  , cinergiRecordsSchema
  , harvestsSchema
  , collectionsSchema
  , mongoDb
  ;

config = {dbHost: 'localhost', dbPort: '27071', dbName: 'cinergi'};
mongoUrl = ['mongodb:/', config.dbHost, config.dbName].join('/');

// ****************************************
// * Minimalist records collection schema *
// ****************************************
minimalistRecordsSchema = new mongoose.Schema({
  _id: {type: String, required: true, unique: true},
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

// *************************************
// * CINERGI records collection schema *
// *************************************
cinergiRecordsSchema = new mongoose.Schema({
  'cmd:CINERGI_ID': {type: String, required: true},
  'cmd:harvestInformation': {
    'cmd:version': {type: Number},
    'cmd:crawlDate': {type: Date},
    'cmd:indexDate': {type: String},
    'cmd:originalFileIdentifier': {type: String},
    'cmd:originalFormat': {type: String},
    'cmd:harvestURL': {type: String},
    'cmd:sourceInfo': {
      'cmd:harvestSourceID': {type: String},
      'cmd:viewID': {type: String},
      'cmd:harvestSourceName': {type: String}
    }
  },
  'cmd:originalHarvestedDoc': {},
  'cmd:processingStatus': {type: String},
  'cmd:metadataProperties': {
    'cmd:metadataContact': {
      'cmd:relatedAgent': {
        'cmd:agentRole': {
          'cmd:agentRoleURI': {type: String},
          'cmd:agentRoleLabel': {type: String},
          'cmd:individual': {
            'cmd:personURI': {type: String},
            'cmd:personName': {type: String},
            'cmd:personPosition': {type: String}
          },
          'cmd:organizationName': [],
          'cmd:organizationURI': {type: String},
          'cmd:phoneNumber': {type: String},
          'cmd:contactEmail': {type: String},
          'cmd:contactAddress': {type: String}
        }
      }
    },
    'cmd:metadataUpdateDate': {type: String},
    'cmd:metadataRecordHistory': [{
      'cmd:stepSequenceNo': {type: Number},
      'cmd:processStepStatement': {type: String},
      'cmd:batchId': {type: String},
      'cmd:provenanceLink': {
        'cmd:LinkObject': {
          'cmd:url': {type: String},
          'cmd:linkRelation': [{
            'cmd:relLabel': {type: String},
            'cmd:relURI': {type: String}
          }],
          'cmd:linkTitle': {type: String},
          'cmd:linkTargetResourceType': {type: String},
          'cmd:linkContentResourceType': {type: String},
          'cmd:linkOverlayAPI': {
            'cmd:APILabel': {type: String},
            'cmd:API-URI': {type: String}
          },
          'cmd:linkProfile': {
            'cmd:profileLabel': {type: String},
            'cmd:profileURI': {type: String}
          },
          'cmd:linkParameters': [{
            'cmd:linkParameterLabel': {type: String},
            'cmd:linkParameterURI': {type: String},
            'cmd:linkParameterValue': {type: String}
          }],
          'cmd:linkDescription': {type: String},
          'cmd:linkTransferSize': {type: Number}
        }
      }
    }]
  },
  'cmd:resourceDescription': {
    'cmd:resourceTitle': {type: String},
    'cmd:resourceDescription': {type: String},
    'cmd:resourceURI': [{
      'cmd:citationIdentifier': {type: String},
      'cmd:scopedIdentifierAuthority': {
        'cmd:authorityURI': {type: String},
        'cmd:authorityLabel': {type: String}
      }
    }],
    'cmd:citedSourceAgents': {
      'cmd:relatedAgent': {
        'cmd:agentRole': {
          'cmd:agentRoleURI': {type: String},
          'cmd:agentRoleLabel': {type: String},
          'cmd:individual': {
            'cmd:personURI': {type: String},
            'cmd:personName': {type: String},
            'cmd:personPosition': {type: String}
          },
          'cmd:organizationName': [],
          'cmd:organizationURI': {type: String},
          'cmd:phoneNumber': {type: String},
          'cmd:contactEmail': {type: String},
          'cmd:contactAddress': {type: String}
        }
      }
    },
    'cmd:citationDates': {
      'cmd:EventDateObject': {
        'cmd:eventType': [{
          'cmd:dateTypeLabel': {type: String},
          'cmd:dateTypeURI': {type: String},
          'cmd:dateTypeVocabularyURI': {type: String}
        }],
        'cmd:dateTime': {type: String}
      }
    },
    'cmd:recommendedCitation': {type: String},
    'cmd:resourceContacts': {
      'cmd:relatedAgent': {
        'cmd:agentRole': {
          'cmd:agentRoleURI': {type: String},
          'cmd:agentRoleLabel': {type: String},
          'cmd:individual': {
            'cmd:personURI': {type: String},
            'cmd:personName': {type: String},
            'cmd:personPosition': {type: String}
          },
          'cmd:organizationName': [],
          'cmd:organizationURI': {type: String},
          'cmd:phoneNumber': {type: String},
          'cmd:contactEmail': {type: String},
          'cmd:contactAddress': {type: String}
        }
      }
    },
    'cmd:resourceAccessOptions': [{
      'cmd:distributor': {
        'cmd:relatedAgent': {
          'cmd:agentRole': {
            'cmd:agentRoleURI': {type: String},
            'cmd:agentRoleLabel': {type: String},
            'cmd:individual': {
              'cmd:personURI': {type: String},
              'cmd:personName': {type: String},
              'cmd:personPosition': {type: String}
            },
            'cmd:organizationName': [],
            'cmd:organizationURI': {type: String},
            'cmd:phoneNumber': {type: String},
            'cmd:contactEmail': {type: String},
            'cmd:contactAddress': {type: String}
          }
        }
      },
      'cmd:accessLinks': [{
        'cmd:LinkObject': {
          'cmd:url': {type: String},
          'cmd:linkRelation': [{
            'cmd:relLabel': {type: String},
            'cmd:relURI': {type: String}
          }],
          'cmd:linkTitle': {type: String},
          'cmd:linkTargetResourceType': {type: String},
          'cmd:linkContentResourceType': {type: String},
          'cmd:linkOverlayAPI': {
            'cmd:APILabel': {type: String},
            'cmd:API-URI': {type: String}
          },
          'cmd:linkProfile': {
            'cmd:profileLabel': {type: String},
            'cmd:profileURI': {type: String}
          },
          'cmd:linkParameters': [{
            'cmd:linkParameterLabel': {type: String},
            'cmd:linkParameterURI': {type: String},
            'cmd:linkParameterValue': {type: String}
          }],
          'cmd:linkDescription': {type: String},
          'cmd:linkTransferSize': {type: Number}
        }
      }]
    }],
    'cmd:geographicExtent': {
      'cmd:extentLabel': {type: String},
      'cmd:extentStatement': {type: String},
      'cmd:extentReference': {
        'cmd:referencedExtentLabel': {type: String},
        'cmd:referencedExtentURI': {type: String},
        'cmd:extentVocabularyURI': {type: String}
      },
      'cmd:boundingBoxWGS84': [{
        'cmd:northBoundLatitude': {type: Number, min: -90, max: 90},
        'cmd:southBoundLatitude': {type: Number, min: -90, max: 90},
        'cmd:eastBoundLongitude': {type: Number, min: -180, max: 180},
        'cmd:westBoundLongitude': {type: Number, min: -180, max:180}
      }],
      'cmd:geoJSONgeometry': {
        'cmd:extentGeometryType': {
          'cmd:geometryTypeLabel': {type: String},
          'cmd:geometryTypeURI': {type: String},
          'cmd:geometryTypeVocabularyURI': {type: String}
        },
        'cmd:extentGeometry': [/* https://raw.githubusercontent.com/fge/sample-json-schemas/master/geojson/geojson.json */]
      },
      'cmd:verticalExtent': {
        'cmd:verticalExtentMinimum': {type: Number},
        'cmd:verticalExtentMaximum': {type: Number},
        'cmd:verticalExtentCRS': {
          'cmd:verticalCRSLabel': {type: String},
          'cmd:verticalCRS-URI': {type: String},
          'cmd:verticalCRSVocabularyURI': {type: String}
        }
      }
    },
    'cmd:resourceTemporalExtent': [{
      'temporalExtentBegin': {type: String},
      'temporalExtentEnd': {type: String}
    }],
    'cmd:resourceUsageConstraints': [{
      'cmd:constraintsStatement': {type: String},
      'cmd:constraintTerms': [{
        'cmd:constraintTypeLabel': {type: String},
        'cmd:constraintTypeURI': {type: String},
        'cmd:constraintTypeVocabularyURI': {type: String},
        'cmd:constraintTerm': {type: String},
        'cmd:constraintURI': {type: String},
        'cmd:constraintVocabularyURI': {type: String}
      }],
      'cmd:license': [{
        'cmd:licenseURI': {type: String},
        'cmd:licenseName': {type: String}
      }]
    }],
    'cmd:resourceBrowseGraphic': {
      'cmd:url': {type: String},
      'cmd:linkRelation': [/* #/definitions/Reference */],
      'cmd:linkTitle': {type: String},
      'cmd:linkContentResourceType': {type: String}
    },
    'cmd:resourceLanguage': [/* #/definitions/Reference */],
    'cmd:resourceSpatialDescription': {
      'cmd:resourceSpatialRepresentationType': {
        'cmd:resourceSpatialRepresentationTypeLabel': {type: String},
        'cmd:resourceSpatialRepresentationTypeURI': {type: String},
        'cmd:resourceSpatialRepresentationTypeVocabularyURI': {type: String}
      },
      'cmd:resourceSpatialReferenceSystem': {
        'cmd:resourceSpatialReferenceSystemLabel': {type: String},
        'cmd:resourceSpatialReferenceSystemURI': {type: String},
        'cmd:resourceSpatialReferenceSystemVocabularyURI': {type: String}
      }
    },
    'cmd:relatedResources': [{
      'cmd:LinkObject': {
        'cmd:url': {type: String},
        'cmd:linkRelation': [{
          'cmd:relLabel': {type: String},
          'cmd:relURI': {type: String}
        }],
        'cmd:linkTitle': {type: String},
        'cmd:linkTargetResourceType': {type: String},
        'cmd:linkContentResourceType': {type: String},
        'cmd:linkOverlayAPI': {
          'cmd:APILabel': {type: String},
          'cmd:API-URI': {type: String}
        },
        'cmd:linkProfile': {
          'cmd:profileLabel': {type: String},
          'cmd:profileURI': {type: String}
        },
        'cmd:linkParameters': [{
          'cmd:linkParameterLabel': {type: String},
          'cmd:linkParameterURI': {type: String},
          'cmd:linkParameterValue': {type: String}
        }],
        'cmd:linkDescription': {type: String},
        'cmd:linkTransferSize': {type: Number}
      }
    }]
  },
  'cmd:extras': {}
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
    case 'minmalistRecords':
      return connectToMongoCollection(mongoDb, 'Records', minimalistRecordsSchema);
      break;
    case 'cinergiRecords':
      return connectToMongoCollection(mongoDb, 'Records', cinergiRecordsSchema);
      break;
    case 'harvests':
      return connectToMongoCollection(mongoDb, 'Harvests', harvestsSchema);
      break;
  }
}

exports.getCollection = getCollection;