function map () {
  var doc
    , geojson
    , n
    , s
    , e
    , w
    ;

  doc = this;

  function objGet (obj, prop, defVal) {
    var props
      , count
      , i
      , p
      ;

    if (!obj) {
      return defVal;
    }

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
      , obj
      , p
      , props
      , i
      , results
      ;

    props = prop.split('.');
    count = 0;
    results = [];
    for (i = 0; i < props.length; i++) {
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

  geojson = {};

  setProperty(geojson, "id", doc._id);
  setProperty(geojson, "type", "Feature");
  setProperty(geojson, "properties.Title", objGet(doc, "Title", "No Title Given"));
  setProperty(geojson, "properties.Description", objGet(doc, "Description", "No Description Given"));
  setProperty(geojson, 'properties.Authors', objGet(doc, 'Authors', []));
  setProperty(geojson, 'properties.PublicationDate', objGet(doc, 'PublicationDate', 'No Publication Date Given'));
  setProperty(geojson, 'properties.Keywords', objGet(doc, 'Keywords', []));
  setProperty(geojson, 'properties.Distributors', objGet(doc, 'Distributors', []));
  setProperty(geojson, 'properties.Links', objGet(doc, 'Links', []));
  setProperty(geojson, 'properties.ModifiedDate', objGet(doc, 'ModifiedDate', ''));
  n = parseFloat(objGet(doc, "GeographicExtent.NorthBound", "89"));
  s = parseFloat(objGet(doc, "GeographicExtent.SouthBound", "-89"));
  e = parseFloat(objGet(doc, "GeographicExtent.EastBound", "179"));
  w = parseFloat(objGet(doc, "GeographicExtent.WestBound", "-179"));
  setProperty(geojson, "bbox", [w, s, e, n]);
  setProperty(geojson, "geometry.type", "polygon");
  setProperty(geojson, "geometry.coordinates", [[]]);
  setProperty(geojson, "geometry.coordinates.0.0", [w, n]);
  setProperty(geojson, "geometry.coordinates.0.1", [w, s]);
  setProperty(geojson, "geometry.coordinates.0.2", [e, s]);
  setProperty(geojson, "geometry.coordinates.0.3", [e, n]);
  setProperty(geojson, "geometry.coordinates.0.4", [w, n]);
  setProperty(geojson, "crs.type", "name");
  setProperty(geojson, "crs.properties.name", "urn:ogc:def:crs:OGC:1.3:CRS84");

  emit(this._id, geojson);
}

function reduce (data) {
  return data;
}

exports.map = map;
exports.reduce = reduce;