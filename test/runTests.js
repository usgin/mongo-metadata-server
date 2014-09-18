var should = require('should')
  , assert = require('assert')
  , supertest = require('supertest')
  , mongoose = require('mongoose')
  , mocha = require('mocha')
  , request = require('request')
  , fs = require('fs')
  , path = require('path')
  , metadataServer = require('./../src/server');

describe('Tests', function () {
  var testDataServer;

  before(function (done) {
    testDataServer = require('./test-data-server');
    done();
  });
/*
  describe('Harvest *.csv and save records', function () {
    it('should return 200 when posting to the server', function (done) {
      var req;
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
      var req;
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
      var req;
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
      var req;
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
*/
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
/*
  describe('Post single json record and save', function () {
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

  describe('Retrieve single record as json', function () {
    it('should return 200 when getting data from the server', function (done) {
      supertest(metadataServer)
        .get('/metadata/record/hd943huo492hjnqpqncq384923d')
        .expect(200, done);
    })
  });

  describe('View single record as iso.xml', function () {
    it('should return 200 when getting data from the server', function (done) {
      supertest(metadataServer)
        .get('/metadata/record/hd943huo492hjnqpqncq384923d.iso.xml')
        .expect(200, done);
    })
  });

  describe('View single record as atom.xml', function () {
    it('should return 200 when getting data from the server', function (done) {
      supertest(metadataServer)
        .get('/metadata/record/hd943huo492hjnqpqncq384923d.atom.xml')
        .expect(200, done);
    })
  });

  describe('View single record as GeoJSON', function () {
    it('should return 200 when getting data from the server', function (done) {
      supertest(metadataServer)
        .get('/metadata/record/hd943huo492hjnqpqncq384923d.geojson')
        .expect(200, done);
    })
  });

  describe('Delete single record', function () {
    it('should return 200 when deleting from the server', function (done) {
      supertest(metadataServer)
        .del('/metadata/record/hd943huo492hjnqpqncq384923d')
        .expect(200, done);
    })
  });

  describe('Ingest a single transformed JSON document', function () {
    it('should return 200 and a json document', function (done) {
      var json = path.join(__dirname, 'transformed-data-post.json');
      fs.readFile(json, 'utf8', function (err, data) {
        if (err) throw err;
        var req = {
          data: data
        };
        supertest(metadataServer)
          .post('/metadata/transformedrecord')
          .set('Content-Type', 'application/json')
          .send(req)
          .expect(200, done);
      })
    })
  });
*/
  describe('Harvest CZO iso.xml and save records', function () {
    it('should return 200 when posting to the server', function (done) {
      var req;
      req = {
        "destinationCollections": [""],
        "inputFormat": "czo.iso.xml",
        "recordUrl": "http://localhost:3030/sample-czo-iso.xml"
      };

      supertest(metadataServer)
        .post('/metadata/harvest')
        .send(req)
        .expect(200, done)
    })
  });

});