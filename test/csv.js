var should = require('should')
  , assert = require('assert')
  , request = require('supertest')
  , mongoose = require('mongoose')
  , mocha = require('mocha')
  , metadataServer = require('./../src/server');

describe('CSV', function () {
  var req
    , testDataServer;

  before(function (done) {
    testDataServer = require('./test-data-server');
    done();
  });

  describe('Harvest and save', function () {
    it('should return 200 when posting to the server', function (done) {
      req = {
        "destinationCollections": [""],
        "inputFormat": "csv",
        "recordUrl": "http://localhost:3030/sample-csv.csv"
      };

      request(metadataServer)
        .post('/metadata/harvest')
        .send(req)
        .expect(200, done)
    })
  })
});