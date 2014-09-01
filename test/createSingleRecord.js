var should = require('should')
  , assert = require('assert')
  , supertest = require('supertest')
  , mongoose = require('mongoose')
  , mocha = require('mocha')
  , request = require('request')
  , metadataServer = require('./../src/server');

describe('Create Single Record', function () {
  var req
    , testDataServer;

  before(function (done) {
    testDataServer = require('./test-data-server');
    done();
  });

  describe('Post record and save', function () {
    it('should return 200 when posting to the server', function (done) {

      request({
        url: 'http://localhost:3030/sample-post.json',
        json: true
      }, function (err, res, body) {
        if (res.statusCode === 200) {

          req = body;

          supertest(metadataServer)
            .post('/metadata/record')
            .send(req)
            .expect(200, done)
        }
      })
    })
  })
});