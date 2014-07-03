var mongoose = require('mongoose');

var recordsSchema = new mongoose.Schema({

});

var Records = mongoose.model('Records', recordsSchema);

exports.Records = Records;