var express = require('express')
  , fs = require('fs')
  , path = require('path')
  , csv = require('csv');

var app
  , testServer
  , sampleCsv;

app = express();
sampleCsv = path.join(__dirname, 'sample-csv.csv');

app.get('/sample-csv.csv', function (req, res) {
  res.attachment('sample-csv.csv');
  csv().from(sampleCsv).to(res);
});

testServer = app.listen(3030);

exports.testServer = testServer;