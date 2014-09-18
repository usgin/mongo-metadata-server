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
  'cmd:CINERGI_ID': {type: String, required: true, unique: true},
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