var mongo = require('./mongo-config')
  , da = require('./data-access')
  , errors = require('./errors')
  , utils = require('./utils')
  , schemas = require('./schemas')
  , csv2json = require('./csv2json')
  , _ = require('underscore')
  , fs = require('fs')
  , request = require('request')
  , xml2json = require('xml2json');

// Text-based search for records
function search (req, res, next) {
  var opts = {
    search_terms: req.searchTerms,
    limit: req.limit,
    skip: req.skip,
    published_only: req.publishedOnly || false,
    error: function (err) {
      return next(new errors.DatabaseReadError(
        'Error searching for documents'));
    },
    success: function (result) {
      res.header('Content-Type', 'application/json');
      return res.send(result);
    }
  };
  return da.search(mongo.searchUrl, opts);
}

// List records or collections (as JSON)
function listResources (req, res, next) {
  var db = mongo.getDb(req.resourceType)
    , opts = {
        include_docs: true,
        clean_docs: true,
        error: function (err) {
          return next(new errors.DatabaseReadError(
            'Error searching for documents'));
        },
        success: function (result) {
          console.log('GET ALL', req.resourceType, 's');
        }
      };
  return da.listDocs(db, opts);
}

// List records in a specific format
function viewRecords (req, res, next) {
  var db = mongo.getDb('record');
}

// Create a new record or collection
function newResource (req, res, next) {

}

// Harvest an existing record
function harvestRecord (req, res, next) {
  if ((!req.url) || (!req.format)) {
    return next(new errors.ArgumentError(
      'Request did not supply the requisite arguments: url and format.'))
  } else {
    var opts = {uri: req.url};
    request(opts, function (err, response, body) {
      if (err) {
       return next(new errors.RequestError(
           'The given URL resulted in an error: ' + err));
      } else {
        if (!utils.validateHarvestFormat(req.format, body)) {
          return next(new errors.ValidationError(
            'The document at the given URL did not match the format specified.'));
        } else {
          if (req.format === 'csv') {
            csv2json.readCsv(body, req, res, next);
          } else {
            var json = xml2json.toJson(body, {object: true, reversible: true})
              , data = utils.cleanJsonReservedChars(json)
              , entries;
            switch (req.format) {
              case 'atom.xml':
                var entry = data.feed.entries.entry;
                if (_.isArray(entry)) {
                  entries = entry;
                } else if (_.isObject(entry)) {
                  entries = [entry];
                } else {
                  entries = [];
                }
                break;
              case 'iso.xml':
                entries = [data];
                break;
              case 'fgdc.xml':
                entries = [data];
                break;
            }
            req.entries = entries;
            return next();
          }
        }
      }
    })
  }
}

// Upload an existing record
function uploadRecord (req, res, next) {
  var body = req.data;
  if ((!req.data) || (!req.format)) {
    return next(new errors.ArgumentError(
      'Request did not supply the requisite arguments: data and format.'))
  } else {
    if (req.format === 'csv') {
      req.entries = body;
    } else {
      var data = xml2json.toJson(body, {object: true, reversible: true})
        , entries;
      switch (req.format) {
        case 'atom.xml':
          var entry = data.feed.entry;
          if (_.isArray(entry)) {
            entries = entry;
          } else if (_.isObject(entry)) {
            entries = [entry];
          } else {
            entries = [];
          }
          break;
        case 'iso.xml':
          entries = [data];
          break;
        case 'fgdc.xml':
          entries = [data];
          break;
      }
      req.entries = entries;
      return next();
    }
  }
}

// Put data in the database
function saveRecord (req, res, next) {
  var entries = req.entries
    , dbModel = mongo.getCollection('harvest');
  var opts = {
    docs: entries,
    error: function (err) {
      return next(new errors.DatabaseWriteError(
        'Error writing to the database'));
    },
    success: function (newHarvestDocs) {
      var opts = {
        format: req.format,
        query: (function () {
          var docIds = [];
          _.each(newHarvestDocs, function (doc) {
            docIds.push(doc._id);
          });
          return { _id: { $in: docIds }};
        })(),
        error: function (err) {
          return next(new errors.DatabaseReadError(
            'Error reading document from database'));
        },
        success: function (transformedDocs) {
          var dbModel = mongo.getCollection('record');
          _.each(transformedDocs, function (doc) {
            var harvestInfo = {
              OriginalFormat: req.format,
              HarvestURL: req.url,
              HarvestDate: utils.getCurrentDate(),
              HarvestRecordId: doc.id
            };
            _.extend(doc.value.HarvestInformation, harvestInfo);
            _.extend(doc.value, {
              Collections: req.collections || [],
              ModifiedDate: utils.getCurrentDate()
            })
          });
          var opts = {
            docs: (function () {
              var docVals = [];
              _.each(transformedDocs, function (doc) {
                docVals.push(doc.value);
              });
              return docVals;
            })(),
            error: function (err) {
              return next(new errors.DatabaseWriteError(
                'Error writing to the database'));
            },
            success: function (newRecords) {
              var resBody = (function () {
                var results = [];
                _.each(newRecords, function (rec) {
                  results.push('/metadata/record/' + rec.id + '/');
                });
                return results;
              })();
              return res.send(resBody, 200);
            }
          };
          return da.createDocs(dbModel, opts);
        }
      };
      return da.mapReduce(dbModel, opts);
    }
  };
  return da.createDocs(dbModel, opts);
}

// Retrieve a specific record or collection (as JSON)
function getResource (req, res, next) {

}

// Retrieve a specific record in a specific format
function viewRecord (req, res, next) {

}

// Retrieve all the records in a specific collection (as JSON)
function getCollectionRecords (req, res, next) {

}

// Retrieve all the records in a specific collection in a specific format
function viewCollectionRecords (req, res, next) {

}

// Update an existing record or collection
function updateResource (req, res, next) {

}

// Delete a record or collection
function deleteResource (req, res, next) {

}

// List files associated with a specific record
function listFiles (req, res, next) {

}

// Associate a new file with a specific record
function newFile (req, res, next) {

}

// Retrieve a specific file associated with a specific record
function getFile (req, res, next) {

}

// Delete a specific file associated with a specific record
function deleteFile (req, res, next) {

}

// List the schemas used by this application
function listSchemas (req, res, next) {

}

// Get a specific schema used by this application
function getSchema (req, res, next) {

}

exports.search = search;
exports.listResources = listResources;
exports.viewRecords = viewRecords;
exports.newResource = newResource;
exports.harvestRecord = harvestRecord;
exports.uploadRecord = uploadRecord;
exports.saveRecord = saveRecord;
exports.getResource = getResource;
exports.viewRecord = viewRecord;
exports.getCollectionRecords = getCollectionRecords;
exports.viewCollectionRecords = viewCollectionRecords;
exports.updateResource = updateResource;
exports.deleteResource = deleteResource;
exports.listFiles = listFiles;
exports.newFile = newFile;
exports.getFile = getFile;
exports.deleteFile = deleteFile;
exports.listSchemas = listSchemas;
exports.getSchema = getSchema;