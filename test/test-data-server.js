var express = require('express')
  , fs = require('fs')
  , path = require('path')
  , csv = require('csv');

var app
  , server
  , sampleCsv
  , isoXml
  , czoIsoXml
  , atomXml
  , fgdcXml
  , sampleJson
  , sampleWaf
  , sampleWafIsoXml1
  , sampleWafIsoXml2
  , sampleWafIsoXml3
  ;

app = express();
sampleCsv = path.join(__dirname, 'data', 'sample-csv.csv');
isoXml = path.join(__dirname, 'data', 'sample-iso.xml');
czoIsoXml = path.join(__dirname, 'data', 'sample-czo-iso.xml');
atomXml = path.join(__dirname, 'data', 'sample-atom.xml');
fgdcXml = path.join(__dirname, 'data', 'sample-fgdc.xml');
sampleJson = path.join(__dirname, 'data', 'sample-post.json');
sampleWaf = path.join(__dirname, 'data', 'sample-waf.html');
sampleWafIsoXml1 = path.join(__dirname, 'data', 'sample-waf-iso-1.xml');
sampleWafIsoXml2 = path.join(__dirname, 'data', 'sample-waf-iso-2.xml');
sampleWafIsoXml3 = path.join(__dirname, 'data', 'sample-waf-iso-3.xml');

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

app.get('/sample-czo-iso.xml', function (req, res) {
  fs.readFile(czoIsoXml, 'utf8', function (err, xml) {
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
    if (err) throw err;
    data = JSON.parse(data);
    res.json(data)
  })
});

app.get('/sample-waf', function (req, res) {
  fs.readFile(sampleWaf, 'utf8', function (err, text) {
    if (err) throw err;
    res.send(text);
  })
});

app.get('/sample-waf/sample-iso-1.xml', function (req, res) {
  fs.readFile(sampleWafIsoXml1, 'utf8', function (err, xml) {
    if (err) throw err;
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(xml);
  })
});

app.get('/sample-waf/sample-iso-2.xml', function (req, res) {
  fs.readFile(sampleWafIsoXml2, 'utf8', function (err, xml) {
    if (err) throw err;
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(xml);
  })
});

app.get('/sample-waf/sample-iso-3.xml', function (req, res) {
  fs.readFile(sampleWafIsoXml3, 'utf8', function (err, xml) {
    if (err) throw err;
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(xml);
  })
});

server = app.listen(3030);

module.exports = server;