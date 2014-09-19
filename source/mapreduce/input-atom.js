function map () {
  var doc
    , type
    , author
    , extent
    , serviceTypes
    , capServiceTypes
    , atomAuthors
    , docAuthors
    , atom
    , atomLink
    , atomLinks
    , scastSemantics
    , adjSemantics
    , serviceType
    , docLinks;

  atom = this;

  function objGet (obj, prop, defVal) {
    var i
      , p
      , props
      , count;
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

  doc = {
    setProperty: function (prop, value) {
      var i
        , p
        , props
        , obj
        , count
        , results;
      obj = this;
      props = prop.split('.');
      count = 0;
      results = [];
      for (i = 0; i < props.length; i++) {
        p = props[i];
        if (obj[p]) {
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

  serviceTypes = ["OGC:WMS", "OGC:WFS", "OGC:WCS", "esri", "opendap"];
  capServiceTypes = (function () {
    var i
      , results;

    results = [];
    for (i = 0; i < serviceTypes.length; i++) {
      type = serviceTypes[i];
      results.push(type.toUpperCase());
    }
    return results;
  })();

  function guessServiceType (url) {
    var i
      , j
      , satisfied
      , condition
      , conditionSet
      , conditions;

    conditions = [
      [/getcapabilities/i, /wms/i]
      , [/getcapabilities/i, /wfs/i]
      , [/getcapabilities/i, /wcs/i]
      , [/\/services\//i, /\/mapserver\/?$/i]
      , [/\.dds$/]
    ];

    for (i = 0; i < serviceTypes.length; i++) {
      type = serviceTypes[i];
      conditionSet = conditions[i];
      satisfied = true;
      if ((function () {
        var j
          , results;

        results = [];
        for (j = 0; j < conditionSet.length; j++) {
          condition = conditionSet[j];
          results.push(url.match(condition) == null);
        }
        return results;
      })()) {
        satisfied = false;
      }
      if (satisfied) {
        return type;
      }
    }
    return null;
  }

  doc.setProperty('Title', objGet(atom, 'title.t', 'No Title Was Given'));
  doc.setProperty('Description', objGet(atom, 'summary.t', 'No Abstract Was Given'));

  atomAuthors = objGet(atom, 'author', []);
  if (atomAuthors.name) atomAuthors = [atomAuthors];

  docAuthors = (function () {
    var i
      , results;

    results = [];
    for (i = 0; i < atomAuthors.length; i++) {
      author = atomAuthors[i];
      results.push({
        Name: objGet(author, 'name.t', 'No Name Was Given'),
        ContactInformation: {
          Phone: objGet(author, 'contactInformation.phone.t', 'No Phone Was Given'),
          email: objGet(author, 'contactInformation.email.t', 'No email Was Given'),
          Address: {
            Street: objGet(author, "contactInformation.address.street.t", "No address found"),
            City: objGet(author, "contactInformation.address.city.t", "No city found"),
            State: objGet(author, "contactInformation.address.state.t", "No state found"),
            Zip: objGet(author, "contactInformation.address.zip.t", "No zip found")
          }
        }
      });
    }
    return results;
  })();

  if (docAuthors.length === 0) {
    docAuthors.push({
      Name: "No name found",
      ContactInformation: {
        Phone: "No phone found",
        email: "No email found",
        Address: {
          Street: "No address found",
          City: "No city found",
          State: "No state found",
          Zip: "No zip found"
        }
      }
    });
  }

  doc.setProperty('Authors', docAuthors);
  doc.setProperty('PublicationDate', '1900-01-01T0:00:00');
  extent = objGet(atom, 'georss:box.t', null);
  if (extent) {
    extent = extent.split(' ');
  } else {
    extent = [-179, -89, 179, 89];
  }

  doc.setProperty('GeographicExtent.WestBound', parseFloat(extent[0]) || -179);
  doc.setProperty('GeographicExtent.SouthBound', parseFloat(extent[1]) || -89);
  doc.setProperty('GeographicExtent.EastBound', parseFloat(extent[2]) || 179);
  doc.setProperty('GeographicExtent.NorthBound', parseFloat(extent[3]) || 89);
  doc.setProperty('Distributors', [docAuthors[0]]);

  function buildLink (atomLink, serviceType) {
    var guess
      , rel
      , result;

    result = {
      URL: objGet(atomLink, 'href', 'No URL Found')
    };

    if (serviceType) {
      rel = objGet(atomLink, 'rel', 'alternate');
      if (['scast:interfaceDescription', 'scast:serviceInterface'].indexOf(rel) > -1) {
        result.serviceType = serviceType;
      }
    }

    if (result.ServiceType == null) {
      guess = guessServiceType(result.URL);
      if (guess) {
        result.ServiceType = guess;
      }
    }

    return result;
  }

  atomLinks = objGet(atom, 'link', []);

  if (atomLinks.href) atomLinks = [atomLinks];

  scastSemantics = objGet(atom, 'scast:serviceSemantics.t', null);

  if (scastSemantics) {
    adjSemantics = scastSemantics.replace(/\./, ':').toUpperCase();
    for (i = 0; i < capServiceTypes.length; i++) {
      type = capServiceTypes[i];
      if (type.search(adjSemantics) > -1) {
        serviceType = type;
      }
    }
  }

  docLinks = (function () {
    var i
      , results;
    results = [];
    for (i = 0; i < atomLinks.length; i++) {
      atomLink = atomLinks[i];
      results.push(buildLink(atomLink, serviceType));
    }
    return results;
  })();

  doc.Links = docLinks;
  doc.setProperty('Published', false);

  doc.HarvestInformation = {
    OriginalFileIdentifier: this['resource_id'] || 'this_metadata'
  };

  doc._id = objGet(atom, 'id.t');

  emit(this._id, doc);
}

function reduce (data) {
  return data;
}

exports.map = map;
exports.reduce = reduce;