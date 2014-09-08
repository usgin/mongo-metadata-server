### MongoDB Metadata Server

Server and algorithms implemented in JavaScript and node.js for harvesting and 
processing metadata from **CSV**, **ISO.xml**, **Atom.xml** and **FGDC.xml** 
sources and serving out metadata in **ISO.xml**, **Atom.xml**, **JSON** and 
**GeoJSON** formats.

#### Dependencies
* (MongoDB v2.6.4)[http://www.mongodb.org/]
* (Node.js v0.10.29 64-bit)[http://nodejs.org/]
* (npmjs v1.4.16)[https://www.npmjs.org/]

#### Installation
MongoDB should be running at this point.
```
$ git clone https://github.com/usgin/mongo-metadata-server.git
$ cd mongo-metadata-server
$ npm install
```

#### Start the server
By default, the metadata server will run on localhost port 3000.
```
$ cd mongo-metadata-server
$ node server.js
```

#### Tests
By default, the tests will run on localhost port 3030.  Run the tests with 
(mocha)[https://visionmedia.github.io/mocha/]:
```
$ cd mongo-metadata-server
$ mocha test
```

#### REST API
Built on top of the (expressjs)[http://expressjs.com/] web application 
framework.  Have a look at the 
(tests)[https://github.com/usgin/mongo-metadata-server/tree/master/test] for 
actual code samples and example data.

##### POST


##### GET

##### PUT