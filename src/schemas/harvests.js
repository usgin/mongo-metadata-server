var mongoose = require('mongoose');

var harvestsSchema = new mongoose.Schema({
  // Did harvest objects have a schema in CouchDB?
});

var Harvests = mongoose.model('Harvests', harvestsSchema);

exports.Harvests = Harvests;

//atom.xml, csv, iso.xml, fgdc.xml