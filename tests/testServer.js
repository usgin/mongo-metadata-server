var express = require('express')
  , fs = require('fs')
  , path = require('path')
  , csv = require('csv');

var app
  , testServer
  , testCsv;

app = express();
testCsv = path.join(__dirname, 'test-csv.csv');

app.get('/test-csv.csv', function (req, res) {
  res.attachment('test-csv.csv');
  csv().from(testCsv).to(res);
});

testServer = app.listen(3030);