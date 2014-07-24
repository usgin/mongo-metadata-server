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
    opts = {
      search_terms: req.searchTerms,
      limit: req.limit,
      skip: req.skip,
      published_only: req.publishedOnly || false,
      error: function (err) {
        return next(new errors.DatabaseReadError(
          'Error searching for documents'))
      },
      success: function (result) {
        console.log('SEARCH FOR ' + req.searchTerms);
        res.header('Content-Type', 'application/json');
        return res.send(result);
      }
    };
    return da.search(mongo.searchUrl, opts);
  },
  // List records or collections (as JSON)
  listResources: function (req, res, next) {

  },
  // List records in a specific format
  viewRecords: function (req, res, next) {

  },
  // Create a new record or collection
  newResource: function (req, res, next) {

  },
  // Harvest an existing record
  harvestRecord: function (req, res, next) {

  },
  // Upload an existing record
  uploadRecord: function (req, res, next) {

  },
  // Put data in the database
  saveRecord: function (req, res, next) {

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