var mongoose = require('mongoose');

// *********************
// * Records DB Schema *
// *********************
var recordsSchema = new mongoose.Schema({});
var Records = mongoose.model('Records', recordsSchema);

// **********************
// * Harvests DB Schema *
// **********************
var harvestsSchema = new mongoose.Schema({});
var Harvests = mongoose.model('Harvests', harvestsSchema);

// *************************
// * Collections DB Schema *
// *************************
var collectionsSchema = new mongoose.Schema({});
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



exports.Records = Records;
exports.Harvests = Harvests;
exports.Collections = Collections;