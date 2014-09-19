var errors = require('./errors')
  , csv = require('csv')
  ;

// Logic for reading CSV files and doing some basic validation
function readCsv (body, req, res, next) {
  var requiredFields = [
    'title', 'description', 'publication_date', 'north_bounding_latitude', 'south_bounding_latitude',
    'east_bounding_longitude', 'west_bounding_longitude', 'metadata_contact_org_name', 'metadata_contact_email',
    'originator_contact_org_name', 'originator_contact_person_name', 'originator_contact_position_name',
    'originator_contact_email', 'originator_contact_phone', 'metadata_uuid', 'metadata_date'
  ];
  var fields = [];
  var entries = [];

  return csv().from(body).transform(function (data) {
    return data;
  }).on('record', function (data, index) {
    if (index === 0) {
      for (var i = 0; i < requiredFields.length; i++) {
        if (data.indexOf(requiredFields[i]) === -1) {
          next(new errors.ValidationError('This is not a valid CSV metadata.'));
        }
      }
      for (var i = 0; i < data.length; i++) {
        fields.push(data[i]);
      }
    } else {
      // This block of code does validation
      if (data.length === fields.length) {
        record = {};
        for (var i = 0, len = data.length; i < len; i++) {
          record[fields[i]] = data[i];
        }
        return entries.push(record);
      } else {
        return console.log('Record', index, 'is not correct!');
      }
    }
  }).on('end', function (count) {
    req.entries = entries;
    return next();
  })
}

exports.readCsv = readCsv;