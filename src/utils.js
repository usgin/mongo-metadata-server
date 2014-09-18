var org = require('./organization-config')
  , xml2json = require('xml2json');

function atomWrapper (entries) {
  return {
    feed: {
      xmlns: "http://www.w3.org/2005/Atom",
      'xmlns:georss': "http://www.georss.org/georss",
      'scast': "http://sciflo.jp;.nasa.gov/serviceCasting/2009v1",
      id: {
        t: '' + org.orgUrl + '/resources/atom'
      },
      title: {
        t: '' + org.orgName + ' Atom Feed'
      },
      updated: {
        t: getCurrentDate()
      },
      author: {
        name: {
          t: org.orgName
        },
        email: {
          t: org.orgEmail
        }
      },
      entries: {
        entry: entries
      }
    }
  }
}

function featureCollection (entries) {
  return {
    type: 'FeatureCollection',
    features: entries
  }
}

function getCurrentDate () {
  function ISODateString (d) {
    function pad (n) {
      if (n < 0) return '0' + n;
      return n;
    }
    return String((d.getUTCFullYear()) + '-' + (pad(d.getUTCMonth() + 1)) + '-'
           + (pad(d.getUTCDate())) + 'T' + (pad(d.getUTCHours())) + ':'
           + (pad(d.getUTCMinutes())) + ':' + (pad(d.getUTCSeconds())) + 'Z');
  }
  var now = new Date();
  return ISODateString(now);
}

function validateHarvestFormat (format, data) {
  if (format === 'csv') {
    return true;
  } else {
    try {
     var json = xml2json.toJson(data, {object: true, reversible: true});
    } catch (err) {
      return false
    }
    switch (format) {
      case 'atom.xml':
        if (json.feed) return true;
        else return false;
      case 'iso.xml':
        if (json['gmd:MD_Metadata']) return true;
        else return false;
      case 'czo.iso.xml':
        if (json['gmd:MD_Metadata']) return true;
        else return false;
      case 'fgdc.xml':
        if (json.metadata) return true;
        else return false;
    }
  }
}

function addCollectionKeywords (iso, collectionNames) {
  var outputKeywords
    , collectionNames
    , newKeywordBlock
    ;

  outputKeywords = iso['gmd:MD_Metadata']['gmd:identificationInfo']['gmd:MD_DataIdentification']['gmd:descriptiveKeywords'];
  /*
  collectionNames = (function () {
    var results = [];
    _.each(collectionNames, function (name) {
      results.push({'gco:CharacterString': {'$t': name}});
    });
    return results;
  })();
  */

  //if (collectionNames.length > 0) {
    newKeywordBlock = {
      "gmd:MD_Keywords": {
//        "gmd:keyword": collectionNames,
        "gmd:thesaurusName": {
          "xlink:href": "/metadata/collection/",
          "gmd:CI_Citation": {
            "gmd:title": {
              "gco:CharacterString": {
                "$t": "Server Collections"
              }
            },
            "gmd:date": {
              "gmd:CI_Date": {
                "gmd:date": {
                  "gco:Date": {
                    "$t": "2012-06-06"
                  }
                },
                "gmd:dateType": {
                  "gmd:CI_DateTypeCode": {
                    "codeList": "http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/Codelist/gmxCodelists.xml#CI_DateTypeCode",
                    "codeListValue": "publication"
                  }
                }
              }
            }
          }
        }
      }
    };
    outputKeywords.push(newKeywordBlock);
  //}
  return iso;
}

function cleanJsonReservedChars (json) {

  if (json instanceof Object) {
    for (var key in json) {
      if (json.hasOwnProperty(key)) {
        json[key.replace(/\$t/g, '_$')] = cleanJsonReservedChars(json[key]);
        if (key.indexOf('$') > -1) {
          delete json[key];
        }
      }
    }
    return json;
  } else {
    return json;
  }
}

exports.atomWrapper = atomWrapper;
exports.featureCollection = featureCollection;
exports.getCurrentDate = getCurrentDate;
exports.validateHarvestFormat = validateHarvestFormat;
exports.addCollectionKeywords = addCollectionKeywords;
exports.cleanJsonReservedChars = cleanJsonReservedChars;