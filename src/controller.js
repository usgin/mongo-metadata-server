var routes = require('./routes');

var harvestRecord
  , textSearch;

function setParams (req, res, next) {
  switch (req.routeId) {
    case 'search':
      req.searchTerms = req.body.searchTerms;
      req.publishedOnly = req.body.publishedOnly || false;
      if (req.body.limit) req.limit = req.body.limit;
      if (req.body.skip) req.skip = req.body.skip;
      break;
    case 'listResources':
    case 'newResource':
      req.resourceType = req.params[0];
      break;
    case 'viewRecords':
      req.format = req.params[0];
      break;
    case 'harvestRecord':
      req.url = req.body.recordUrl;
      req.format = req.body.inputFormat;
      if (req.body.destinationCollections) req.collections = req.body.desinationCollections;
      break;
    case 'uploadRecord':
      if (req.body.destinationCollections) req.collections = req.body.desinationCollections;
      req.format = req.body.format;
      req.data = req.body.data;
      break;
    case 'getResource':
    case 'updateResource':
    case 'deleteResource':
      req.resourceType = req.params[0];
      req.resourceId = req.params[1];
      break;
    case 'viewRecord':
    case 'viewCollectionRecords':
      req.resourceId = req.params[0];
      req.format = req.params[1];
      break;
    case 'listFiles':
    case 'newFile':
    case 'getCollectionRecords':
      req.resourceId = req.params[0];
      break;
    case 'getFile':
    case 'deleteFile':
      req.resourceId = req.params[0];
      req.fileName = req.params[1];
      break;
    case 'getSchema':
      req.schemaId = req.params[0];
      var params = ['resolve', 'emptyInstance'];
      for (var i = 0; i < params.length; i++) {
        if ((req.query[params[i]] != null) && req.query[params[i]] === 'true') {
          req.query[params[i]] = JSON.parse(req.query[params[i]]);
        } else {
          req.query[params[i]] = false;
        }
      }
  }
  return next();
}

// ********
// * POST *
// ********
// Text-based search for records
textSearch = {
  route: function (req, res, next) {
    req.routeId = 'search';
    return next();
  },
  params: setParams,
  search: routes.search
};

// Harvest an existing record
harvestRecord = {
  route: function (req, res, next) {
    req.routeId = 'harvestRecord';
    return next();
  },
  params: setParams,
  harvest: routes.harvestRecord,
  save: routes.saveRecord
};

exports.harvestRecord = harvestRecord;
exports.textSearch = textSearch;