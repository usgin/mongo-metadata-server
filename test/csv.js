var should = require('should')
  , assert = require('assert')
  , request = require('supertest')
  , mongoose = require('mongoose')
  , mocha = require('mocha')
  , config = require('./config-debug')
  , server = require('./../src/server');

describe('CSV', function () {
  var url
    , req;

  url = 'http://localhost:3000';

  before(function (done) {
    //mongoose.connect(config.db.mongodb);
    done();
  });

  describe('Harvest', function () {
    it('should return 200 when posting to the server', function (done) {
      req = {
        "destinationCollections": [""],
        "inputFormat": "csv",
        "recordUrl": "http://repository.stategeothermaldata.org/resources/metadata/TestNRRC/NRRCMetadataCompilation_ALL.csv"
      };

      request(url)
        .post('/metadata/harvest')
        .send(req)
        .expect(200, done)
    })
  })
});