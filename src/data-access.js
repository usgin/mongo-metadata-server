var schemas = require('./schemas')
  , orgConfig = require('./organization-config')
  , request = require('request')
  , _ = require('underscore');

function cleanKeywords (doc) {

}

// Create a single document in the database
function createDoc (db, options) {
  options.data = options.data !== null ? options.data : {};
  options.success = options.success !== null ? options.success : function () {};
  options.error = options.error !== null ? options.error : function () {};

  // We might need to call 'cleanKeywords()' here

  function results (err, response) {
   if (err) {
     return options.error(err);
   } else {
     return options.success(response);
   }
  }

  if (options.id) {
    return db.instert
  }
}

// Create multiple documents in the given database
function createDocs (db, options) {

}

// Retrieve a document by it's ID from a given database
function getDoc (db, options) {

}

// Check that a document exists in a given database
function exists (db, options) {

}

// Return the revision ID for a specific document from a given database
function getRev (db, options) {

}

// List all documents in a given database
function listDocs (db, options) {

}

// Pass all or specific documents through a specified database view
function viewDocs (db, options) {

}

// Delete a document
function deleteDoc (db, options) {

}

// Delete an attachment
function deleteFile (db, options) {

}

// Get collection names
function getCollectionNames (options) {

}

// Validate data
function validateRecord (data, resourceType) {

}

// Perform a search
function search (searchUrl, options) {

}

exports.createDoc = createDoc;
exports.createDocs = createDocs;
exports.getDoc = getDoc;
exports.exists = exists;
exports.getRev = getRev;
exports.listDocs = listDocs;
exports.viewDocs = viewDocs;
exports.deleteDoc = deleteDoc;
exports.deleteFile =deleteFile;
exports.getCollectionNames = getCollectionNames;
exports.validateRecord = validateRecord;
exports.search = search;