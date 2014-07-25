var mongoose = require('mongoose');



var recordsSchema = new mongoose.Schema({

});

var Records = mongoose.model('Records', recordsSchema);

exports.Records = Records;


var mongoose = require('mongoose');

var harvestsSchema = new mongoose.Schema({
  // Did harvest objects have a schema in CouchDB?
});

var Harvests = mongoose.model('Harvests', harvestsSchema);

exports.Harvests = Harvests;

//atom.xml, csv, iso.xml, fgdc.xml

var mongoose = require('mongoose');

var collectionsSchema = new mongoose.Schema({
  id: {
    type: String,
    default: 'http://resources.usgin.org/uri-gin/usgin/schema/json-metadata-collection/'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  parentCollections: [{
    type: String,
    required: false
  }]
});

var Collections = mongoose.model('Collections', collectionsSchema);

collectionsSchema.methods.allNames = function (callback) {
  return this.model('Collections').find({ title: this.title }, callback);
};

collectionsSchema.methods.children = function (callback) {
  // Should be a loop to iterate through the returned array
  return this.model('Collections').find({ parentCollections: this.parentCollections }, callback);
};

collectionsSchema.methods.ids = function (callback) {

};

exports.Collections = Collections;