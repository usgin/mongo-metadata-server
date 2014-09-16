function map () {
  var input
    , doc
    , ident
    , pubDate
    , resParties
    , resParty
    , i
    ;

  function objGet (obj, prop, defVal) {
    var props
      , count
      , i
      , p;

    if (!obj) return defVal;

    props = prop.split('.');
    count = 0;

    for (i = 0; i < props.length; i++) {
      p = props[i];
      if (obj[p]) {
        obj = obj[p];
        count++;
        if (count === props.length) {
          return obj;
        }
      } else {
        return defVal;
      }
    }
  }

  function setProperty (obj, prop, value) {
    var count
      , p
      , props
      , i
      , results;

    props = prop.split('.');
    count = 0;
    results = [];

    for (i = 0; i < props.length; i ++) {
      p = props[i];
      if (obj[p]) {
        obj = obj[p];
        results.push(count++);
      } else {
        if (count + 1 === props.length) {
          results.push(obj[p] = value);
        } else {
          obj[p] = {};
          obj = obj[p];
          results.push(count++);
        }
      }
    }
    return results;
  }

  input = this;
  doc = {};

  ident = objGet(input, 'gmd:MD_DataIdentification', objGet(input, 'srv:SV_ServiceIdentification', {}));
  setProperty(doc, 'Title', objGet(ident, 'gmd:citation.gmd:CI_Citation.gmd:title.gco:CharacterString._$', 'No Title Was Given'));
  setProperty(doc, 'Description', objGet(ident, 'gmd:abstract.gco:CharacterString._$', 'No Description Was Given'));

  pubDate = objGet(ident, 'gmd:citation.gmd:CI_Citation.gmd:date.gmd:CI_Date.gmd:date.gco:DateTime._$', 'Publication Date Not Given').trim();
  if (pubDate.match(/T\d\d:\d\d(?!:)/)) {
    pubDate = pubDate + ":00Z";
  }
  setProperty(doc, 'PublicationDate', pubDate);
  setProperty(doc, 'ResourceId', objGet(input, 'gmd:MD_Metadata.gmd:dataSetURI.gco:CharacterString._$', null));

  doc.Authors = [];
  resParties = objGet(ident, "gmd:citation.gmd:CI_Citation.gmd:citedResponsibleParty", []);
  if (resParties['gmd:CI_ResponsibleParty']) {
    resParties = [resParties];
  }
  for (i = 0; i < resParties.length; i++) {
    resParty = resParties[i];
  }

  emit(this._id, doc);
}

function reduce (data) {
  return data;
}

exports.map = map;
exports.reduce = reduce;