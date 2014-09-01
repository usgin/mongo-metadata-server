var should = require('should')
  , assert = require('assert')
  , supertest = require('supertest')
  , mongoose = require('mongoose')
  , mocha = require('mocha')
  , request = require('request')
  , metadataServer = require('./../src/server');

describe('Tests', function () {
  var req
    , testDataServer;

  before(function (done) {
    testDataServer = require('./test-data-server');
    done();
  });

  describe('Harvest *.csv and save records', function () {
    it('should return 200 when posting to the server', function (done) {
      req = {
        "destinationCollections": [""],
        "inputFormat": "csv",
        "recordUrl": "http://localhost:3030/sample-csv.csv"
      };

      supertest(metadataServer)
        .post('/metadata/harvest')
        .send(req)
        .expect(200, done)
    })
  });

  describe('Harvest atom.xml and save records', function () {
    it('should return 200 when posting to the server', function (done) {
      req = {
        "destinationCollections": [""],
        "inputFormat": "atom.xml",
        "recordUrl": "http://localhost:3030/sample-atom.xml"
      };

      supertest(metadataServer)
        .post('/metadata/harvest')
        .send(req)
        .expect(200, done)
    })
  });

  describe('Harvest fgdc.xml and save records', function () {
    it('should return 200 when posting to the server', function (done) {
      req = {
        "destinationCollections": [""],
        "inputFormat": "fgdc.xml",
        "recordUrl": "http://localhost:3030/sample-fgdc.xml"
      };

      supertest(metadataServer)
        .post('/metadata/harvest')
        .send(req)
        .expect(200, done)
    })
  });

  describe('Harvest iso.xml and save records', function () {
    it('should return 200 when posting to the server', function (done) {
      req = {
        "destinationCollections": [""],
        "inputFormat": "iso.xml",
        "recordUrl": "http://localhost:3030/sample-iso.xml"
      };

      supertest(metadataServer)
        .post('/metadata/harvest')
        .send(req)
        .expect(200, done)
    })
  });

  describe('List all documents in collection by _id', function () {
    it('should return 200 when getting from the server', function (done) {
      supertest(metadataServer)
        .get('/metadata/record')
        .expect(200, done)
    })
  });

  describe('Empty records collection', function () {
    it('should return 200 when deleting from the server', function (done) {
      supertest(metadataServer)
        .del('/metadata/record')
        .expect(200, done)
    })
  });

  describe('Empty harvests collection', function () {
    it('should return 200 when deleting from the server', function (done) {
      supertest(metadataServer)
        .del('/metadata/harvest')
        .expect(200, done)
    })
  });

  describe('Post json and save record', function () {
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
  });

});