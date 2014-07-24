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

module.exports = routes = {
  // Text-based search for records
  search: function (req, res, next) {
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
        console.log('SEARCH FOR', req.searchTerms);
        res.header('Content-Type', 'application/json');
        return res.send(result);
      }
    };
    return da.search(mongo.searchUrl, opts);
  },
  // List records or collections (as JSON)
  listResources: function (req, res, next) {
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
  },
  // List records in a specific format
  viewRecords: function (req, res, next) {
    var db = mongo.getDb('record');
  },
  // Create a new record or collection
  newResource: function (req, res, next) {

  },
  // Harvest an existing record
  harvestRecord: function (req, res, next) {
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
              csv2json.readCSV(body, req, res, next);
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
      })
    }
  },
  // Upload an existing record
  uploadRecord: function (req, res, next) {

  },
  // Put data in the database
  saveRecord: function (req, res, next) {
    var entries = req.entries
      , db = mongo.getDb('harvest');
    var opts = {
      docs: entries,
      error: function (err) {
        return next(new errors.DatabaseWriteError(
          'Error writing to the database'));
      },
      success: function (newHarvestDocs) {
        var opts = {
          design: 'input',
          format: req.format,
          keys: (function () {
            var docIds = [];
            _.each(newHarvestDocs, function (doc) {
              docIds.push(doc.id);
            });
            return docIds;
          })(),
          error: function (err) {
            return next(new errors.DatabaseReadError(
              'Error reading document from database'));
          },
          success: function (transformedDocs) {
            var db = mongo.getDb('record');
            _.each(transformedDocs.row, function (doc) {
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
                _.each(transformedDocs.rows, function (doc) {
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
            return da.createDocs(db, opts);
          }
        };
        return da.viewDocs(db, opts);
      }
    };
    return da.createDocs(db, opts);
  },
  // Retrieve a specific record or collection (as JSON)
  getResource: function (req, res, next) {

  },
  // Retrieve a specific record in a specific format
  viewRecord: function (req, res, next) {

  },
  // Retrieve all the records in a specific collection (as JSON)
  getCollectionRecords: function (req, res, next) {

  },
  // Retrieve all the records in a specific collection in a specific format
  viewCollectionRecords: function (req, res, next) {

  },
  // Update an existing record or collection
  updateResource: function (req, res, next) {

  },
  // Delete a record or collection
  deleteResource: function (req, res, next) {

  },
  // List files associated with a specific record
  listFiles: function (req, res, next) {

  },
  // Associate a new file with a specific record
  newFile: function (req, res, next) {

  },
  // Retrieve a specific file associated with a specific record
  getFile: function (req, res, next) {

  },
  // Delete a specific file associated with a specific record
  deleteFile: function (req, res, next) {

  },
  // List the schemas used by this application
  listSchemas: function (req, res, next) {

  },
  // Get a specific schema used by this application
  getSchema: function (req, res, next) {

  }
};