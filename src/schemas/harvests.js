var mongoose = require('mongoose');

var harvestsSchema = new mongoose.Schema({

});

var Harvests = mongoose.model('Harvests', harvestsSchema);

exports.Harvests = Harvests;

//atom.xml, csv, iso.xml, fgdc.xml