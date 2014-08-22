var express = require('express')
  , bodyParser = require('body-parser')
  , errorHandler = require('errorhandler')
  , routes = require('./routes')
  , errors = require('./errors')
  , controller = require('./controller');

var server = express();
server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());
server.use(errorHandler({showStack: true, dumpExceptions: true}));

// ********
// * POST *
// ********
// Text-based search for records
server.post(/^\/metadata\/search\/$/
  , controller.textSearch.route
  , controller.textSearch.params
  , controller.textSearch.search);

// Harvest an existing record
server.post(/^\/metadata\/harvest\/$/
  , controller.harvestRecord.route
  , controller.harvestRecord.params
  , controller.harvestRecord.harvest
  , controller.harvestRecord.save);

/*

// Create a new record or collection
server.post(/^\/metadata\/(record|collection)\/$/, function (req, res, next) {
  req.routeId = 'newResource';
  return next();
}, setParams, routes.newResource);

// Upload an existing record
server.post(/^\/metadata\/upload\/$/, function (req, res, next) {
  req.routeId = 'uploadRecord';
  return next();
}, setParams, routes.uploadRecord, routes.saveRecord);


// Associate a new file with a specific record
server.post(/^\/metadata\/record\/([^\/]*)\/file\/$/, function (req, res, next) {
  req.routeId = 'newFile';
  return next();
}, setParams, routes.newFile);

*/

// *******
// * GET *
// *******
// List records or collections as (JSON)
/*

server.get(/^\/metadata\/(record|collection)\/$/, function (req, res, next) {
  req.routeId = 'listResources';
  return next();
}, setParams, routes.listResources);

// List records in a specific format
server.get(/^\/metadata\/record\.(iso\.xml|atom\.xml|geojson)$/, function (req, res, next) {
  req.routeId = 'viewRecords';
  return next();
}, setParams, routes.viewRecords);

// Retrieve a specific record or collection (as JSON)
server.get(/^\/metadata\/(record|collection)\/([^\/]*)\/$/, function (req, res, next) {
  req.routeId = 'getResource';
  return next();
}, setParams, routes.getResource);

// Retrieve a specific record in a specific format
server.get(/^\/metadata\/record\/([^\/]*)\.(iso.xml|atom\.xml|geojson)$/, function (req, res, next) {
  req.routeId = 'viewRecord';
  return next();
}, setParams, routes.viewRecord);

// Retrieve all the records in a specific collection (as JSON)
server.get(/^\/metadata\/collection\/([^\/]*)\/records\/$/, function (req, res, next) {
  req.routeId = 'getCollectionRecords';
  return next();
}, setParams, routes.getCollectionRecords);

// Retrieve all the records in a specific collection in a specific format
server.get(/^\/metadata\/collection\/([^\/]*)\/records\.(iso.xml|atom\.xml|geojson)$/, function (req, res, next) {
  req.routeId = 'viewCollectionRecords';
  return next();
}, setParams, routes.viewCollectionRecords);

// Retrieve a specific schema by ID
server.get(/^\/metadata\/schema\/([^\/]*)\/$/, function (req, res, next) {
  req.routeId = 'getSchema';
  return next();
}, setParams, routes.getSchema);

// Retrieve a list of schemas used by the server
server.get(/^\/metadata\/schema\/$/, routes.listSchemas);

// List files associated with a specific record
server.get(/^\/metadata\/record\/([^\/]*)\/file\/$/, function (req, res, next) {
  req.routeId = 'listFiles';
  return next();
}, setParams, routes.listFiles);

// Retrieve a specific file associated with a specific record
server.get(/^\/metadata\/record\/([^\/]*)\/file\/(.*)$/, function (req, res, next) {
  req.routeId = 'getFile';
  return next();
}, setParams, routes.getFile);

*/

// *******
// * PUT *
// *******
/*

// Update an existing record or collection
server.put(/^\/metadata\/(record|collection)\/([^\/]*)\/$/, function (req, res, next) {
  req.routeId = 'updateResource';
  return next();
}, setParams, routes.updateResource);

*/

// *******
// * DEL *
// *******
/*

// Delete a record or collection
server.del(/^\/metadata\/(record|collection)\/([^\/]*)\/$/, function (req, res, next) {
  req.routeId = 'deleteResource';
  return next();
}, setParams, routes.deleteResource);

// Delete a specific file associated with a specific record
server.del(/^\/metadata\/record\/([^\/]*)\/file\/(.*)$/, function (req, res, next) {
  req.routeId = 'deleteFile';
  return next();
}, setParams, routes.deleteFile);


*/

// Error handler for express server
function errorHandler (err, req, res, next) {
  res.send(err.msg. err.status);
  return next(err);
}

server.use(errorHandler);

server.listen(3000);