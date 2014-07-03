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