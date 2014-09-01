var express = require('express')
  , fs = require('fs')
  , path = require('path')
  , csv = require('csv');

var app
  , server
  , sampleCsv
  , isoXml
  , atomXml
  , fgdcXml
  , sampleJson
  ;

app = express();
sampleCsv = path.join(__dirname, 'sample-csv.csv');
isoXml = path.join(__dirname, 'sample-iso.xml');
atomXml = path.join(__dirname, 'sample-atom.xml');
fgdcXml = path.join(__dirname, 'sample-fgdc.xml');
sampleJson = path.join(__dirname, 'sample-post.json');

app.get('/sample-csv.csv', function (req, res) {
  res.attachment('sample-csv.csv');
  csv().from(sampleCsv).to(res);
});

app.get('/sample-iso.xml', function (req, res) {
  fs.readFile(isoXml, 'utf8', function (err, xml) {
    if (err) throw err;
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(xml)
  })
});

app.get('/sample-atom.xml', function (req, res) {
  fs.readFile(atomXml, 'utf8', function (err, xml) {
    if (err) throw err;
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(xml)
  })
});

app.get('/sample-fgdc.xml', function (req, res) {
  fs.readFile(fgdcXml, 'utf8', function (err, xml) {
    if (err) throw err;
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(xml)
  })
});

app.get('/sample-post.json', function (req, res) {
  fs.readFile(sampleJson, 'utf8', function (err, data) {
    data = JSON.parse(data);
    res.json(data)
  })
});

server = app.listen(3030);

module.exports = server;