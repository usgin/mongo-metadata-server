function map () {
  var geojson
    , n
    , s
    , e
    , w
    ;

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

  geojson = {
    setProperty: function (prop, value) {
      var count
        , obj
        , p
        , props
        , i
        , results
        ;
      obj = this;
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
  };

  geojson.setProperty("id", doc._id);
  geojson.setProperty("type", "Feature");
  geojson.setProperty("properties.Title", objGet(doc, "Title", "No Title Given"));
  geojson.setProperty("properties.Description", objGet(doc, "Description", "No Description Given"));
  geojson.setProperty('properties.Authors', objGet(doc, 'Authors', []));
  geojson.setProperty('properties.PublicationDate', objGet(doc, 'PublicationDate', 'No Publication Date Given'));
  geojson.setProperty('properties.Keywords', objGet(doc, 'Keywords', []));
  geojson.setProperty('properties.Distributors', objGet(doc, 'Distributors', []));
  geojson.setProperty('properties.Links', objGet(doc, 'Links', []));
  geojson.setProperty('properties.ModifiedDate', objGet(doc, 'ModifiedDate', ''));
  n = parseFloat(objGet(doc, "GeographicExtent.NorthBound", "89"));
  s = parseFloat(objGet(doc, "GeographicExtent.SouthBound", "-89"));
  e = parseFloat(objGet(doc, "GeographicExtent.EastBound", "179"));
  w = parseFloat(objGet(doc, "GeographicExtent.WestBound", "-179"));
  geojson.setProperty("bbox", [w, s, e, n]);
  geojson.setProperty("geometry.type", "polygon");
  geojson.setProperty("geometry.coordinates", [[]]);
  geojson.setProperty("geometry.coordinates.0.0", [w, n]);
  geojson.setProperty("geometry.coordinates.0.1", [w, s]);
  geojson.setProperty("geometry.coordinates.0.2", [e, s]);
  geojson.setProperty("geometry.coordinates.0.3", [e, n]);
  geojson.setProperty("geometry.coordinates.0.4", [w, n]);
  geojson.setProperty("crs.type", "name");
  geojson.setProperty("crs.properties.name", "urn:ogc:def:crs:OGC:1.3:CRS84");

  emit(this._id, doc);
}

function reduce () {

}