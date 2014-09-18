var inputAtomMapReduce = require('./mapReduce/input-atom')
  , inputCsvMapReduce = require('./mapReduce/input-csv')
  , inputFgdcMapReduce = require('./mapReduce/input-fgdc')
  , inputIsoMapReduce = require('./mapReduce/input-iso')
  , inputTransformMapReduce = require('./mapReduce/input-transform')
  , inputToCINERGIMapReduce = require('./mapReduce/toCINERGI.js')
  , outputAtomMapReduce = require('./mapReduce/output-atom')
  , outputGeoJsonMapReduce = require('./mapReduce/output-geojson')
  , outputIsoMapReduce = require('./mapReduce/output-iso')
  , request = require('request')
  , _ = require('underscore');

function cleanDoc (doc) {
  var cleaned = _.extend({}, doc);
  if (doc.id) cleaned.id = doc._id;
  delete cleaned._id;
  delete cleaned._rev;
  delete cleaned._attatchments;
  return cleaned;
}

function cleanKeywords (doc) {
  if (!doc.Keywords) doc.Keywords = [];
  _.each(doc.Keywords, function (keyword) {
    if (keyword.split(',').length > 1) {
      return doc.Keywords = _.union(doc.Keywords, keyword,split(','));
    } else if (keyword.split(';').length > 1) {
      return doc.Keywords = _.union(doc.Keywords, keyword.split(';'));
    }
  });

  doc.Keywords = _.map(doc.Keywords, function (keyword) {
    return keyword.toLowerCase().trim();
  });

  doc.Keywords = _.reject(doc.Keywords, function (keyword) {
    return keyword === ''
      || keyword.indexOf(',') !== -1
      || keyword.indexOf(';') !== -1;
  });

  return doc;
}

// Create a single document in the database
function createDoc (dbModel, options) {
  options.data = options.data !== null ? options.data : {};
  options.success = options.success !== null ? options.success : function () {};
  options.error = options.error !== null ? options.error : function () {};

  options.data = cleanKeywords(options.data);

  dbModel.create(options.data, function (err, res) {
    if (err) {
      return options.error(err);
    } else {
      return options.success(res);
    }
  })
}

function createTransformDoc (dbModel, options) {
  options.data = options.data !== null ? options.data : {};
  options.success = options.success !== null ? options.success : function () {};
  options.error = options.error !== null ? options.error : function () {};

  options.data = cleanKeywords(options.data);

  dbModel.collection.insert(options.data, function (err, res) {
    if (err) {
      return options.error(err);
    } else {
      return options.success(res);
    }
  })
}

// Create multiple documents in the given database
function createDocs (dbModel, options) {
  if (!options.docs) options.docs = [];
  if (!options.success) options.success = function () {};
  if (!options.error) options.error = function () {};

  options.docs = _.map(options.docs, cleanKeywords);

  dbModel.collection.insert(options.docs, function (err, res) {
    if (err) {
      return options.error(err)
    } else {
      return options.success(res);
    }
  })
}

// Retrieve a document by it's ID from a given database
function getDoc (dbModel, options) {
  var query;
  if (!options.success) options.success = function () {};
  if (!options.error) options.error = function () {};
  if (!options.id) options.id = '';

  query = { _id: options.id };

  dbModel.find(query, function (err, res) {
    if (err) {
      return options.error(err);
    } else {
      return options.success(JSON.stringify(res));
    }
  })
}

// Check that a document exists in a given database
function exists (db, options) {

}

// List all documents in a given database
function listDocs (dbModel, options) {
  var params
    , ids
    ;

  if (!options.include_docs) options.include_docs = false;
  if (!options.clean_docs) options.clean_docs = false;
  if (!options.success) options.success = function () {};
  if (!options.error) options.error = function () {};

  ids = [];
  dbModel.find({}, function (err, res) {
    if (err) {
      return options.error(err);
    } else {
      _.each(res, function (doc) {
        ids.push(doc._id);
      });
      return options.success(ids);
    }
  })
}

// Pass all or specific documents through a specified database view
function mapReduce (dbModel, options) {
  var thisMapReduce;

  if (!options.method) options.method = '';
  if (!options.format) options.format = '';
  if (!options.query) options.query = '';
  if (!options.success) options.success = function () {};
  if (!options.error) options.error = function () {};

  if (options.method === 'POST') {
    switch (options.format) {
      case 'atom.xml':
        thisMapReduce = inputAtomMapReduce;
        break;
      case 'csv':
        thisMapReduce = inputCsvMapReduce;
        break;
      case 'fgdc.xml':
        thisMapReduce = inputFgdcMapReduce;
        break;
      case 'iso.xml':
        thisMapReduce = inputIsoMapReduce;
        break;
      case 'czo.iso.xml':
        thisMapReduce = inputToCINERGIMapReduce;
        break;
      case 'transformedjson':
        thisMapReduce = inputTransformMapReduce;
        break;
    }
  }

  if (options.method === 'GET') {
    switch (options.format) {
      case 'iso.xml':
        thisMapReduce = outputIsoMapReduce;
        break;
      case 'atom.xml':
        thisMapReduce = outputAtomMapReduce;
        break;
      case 'geojson':
        thisMapReduce = outputGeoJsonMapReduce;
        break;
    }
  }

  var o = {};
  o.map = thisMapReduce.map;
  o.reduce = thisMapReduce.reduce;
  o.query = options.query;

  dbModel.mapReduce(o, function (err, res) {
    if (err) {
      return options.error(err);
    } else {
      return options.success(res);
    }
  })
}

// Delete a single document
function deleteDoc (dbModel, options) {
  var query;
  if (!options.id) options.id = '';
  if (!options.fileName) options.fileName = '';
  if (!options.success) options.success = function () {};
  if (!options.error) options.error = function () {};

  query = { _id: options.id };

  dbModel.remove(query, function (err, res) {
    if (err) {
      return options.error(err);
    } else {
      res = 'Deleted ' + res + ' record';
      return options.success(res);
    }
  })
}

// Empty an entire collection
function emptyCollection (dbModel, options) {
  if (!options.id) options.id = '';
  if (!options.fileName) options.fileName = '';
  if (!options.success) options.success = function () {};
  if (!options.error) options.error = function () {};

  dbModel.remove({}, function (err, res) {
    if (err) {
      return options.error(err);
    } else {
      res = 'Deleted ' + res + ' records';
      return options.success(res);
    }
  })
}

// Delete an attachment
function deleteFile (db, options) {

}

// Get collection names
function getCollectionNames (options) {

}

// Perform a search
function search (searchUrl, options) {

}

// Pass all or specific documents through a specified map reduce output
function viewDocs (dbModel, options) {
  var params;
  if (!options.design) options.design = '';
  if (!options.format) options.format = '';
  if (!options.success) options.success = '';
  if (!options.error) options.error = '';

  params = {};
  if (options.key) params.key = options.key;
  if (options.keys) params.keys = options.keys;
  if (options.reduce) params.reduce = options.reduce;

}

exports.createDoc = createDoc;
exports.createDocs = createDocs;
exports.getDoc = getDoc;
exports.exists = exists;
exports.listDocs = listDocs;
exports.mapReduce = mapReduce;
exports.deleteDoc = deleteDoc;
exports.deleteFile =deleteFile;
exports.getCollectionNames = getCollectionNames;
exports.search = search;
exports.emptyCollection = emptyCollection;
exports.viewDocs = viewDocs;
exports.createTransformDoc = createTransformDoc;