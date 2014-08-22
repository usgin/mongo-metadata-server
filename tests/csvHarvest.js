var controller = require('../../scripts/controller')
  , vows = require('vows')
  , assert = require('assert');

var req
  , res
  , next;

req = {};
req.format = 'csv';
req.url = 'http://localhost:3030/sample-csv.csv';

res = {};

vows.describe('Harvest and reduce a CSV').addBatch({
  'Request a route for harvesting': {
    topic: controller.harvestRecord.route(req, res, next),
    ''
  }
}).run();

harvestRecord = {
  route: function (req, res, next) {
    req.routeId = 'harvestRecord';
    return next();
  },
  params: setParams,
  harvest: routes.harvestRecord,
  save: routes.saveRecord
};