function map () {
  var fgdc
    , doc
    , serviceTypes
    , capServiceTypes
    , ident
    , desc
    , pubdate
    , origins
    , origin
    , themeKeywords
    , placeKeywords
    , stratKeywords
    , tempKeywords
    , keyword
    , distributors
    , distributor
    , linksCite
    , linkCite
    , crossRefs
    , crossRef
    , linksRef
    , linkRef
    , onlink
    , srcInfos
    , srcInfo
    , linksSrc
    , linkSrc
    , metaContact
    , entity
    , contPer
    , contOrg
    , contTel
    , contEma
    , address
    , contStr
    , contact
    , contCit
    , contSta
    , contZip
    , i
    , j
    , k
    , l
    , m
    , n
    , o
    , p
    , q
    , r
    , s
    , t
    ;

  fgdc = this;

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

  doc = {
    setProperty: function (prop, value) {
      var count
        , obj
        , p
        , props
        , i
        , results;

      obj = this;
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
  };

  serviceTypes = ['OGC:WMS', 'OGC:WFS', 'OGC:WCS', 'esri', 'opendap'];

  capServiceTypes = (function () {
    var results = [], i, type;
    for (i = 0; i < serviceTypes.length; i++) {
      type = serviceTypes[i];
      results.push(type.toUpperCase());
    }
    return results;
  })();

  function guessServiceType (url) {
    var condition
      , conditions
      , conditionSet
      , i
      , j
      , satisfied
      , type;

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
      for (j = 0; j < conditionSet.length; j++) {
        condition = conditionSet[j];
        if (!url.match(condition)) satisfied = false;
      }
      if (satisfied) return type;
    }
    return null;
  }

  function buildContact (contact) {
    return {
      Name: contact.name || 'Missing',
      OrganizationName: contact.organization || 'Missing',
      ContactInformation: {
        Phone: contact.phone || 'Missing',
        email: contact.email || 'Missing',
        Address: {
          Street: contact.street || 'Missing',
          City: contact.city || 'Missing',
          State: contact.state || 'Missing',
          Zip: contact.zip || 'Missing'
        }
      }
    }
  }

  function buildLink (url) {
    var guess
      , link;
    link = {
      URL: url,
      Name: 'Missing',
      Description: 'No Description Was Provided',
      Distributor: 'Missing'
    };
    guess = guessServiceType(url);
    if (guess) {
      link.ServiceType = guess;
    }
    return link;
  }

  ident = objGet(fgdc, 'metadata.idinfo', {});
  doc.setProperty('Title', objGet(ident, 'citation.citeinfo.title.t', 'Missing'));
  desc = objGet(ident, 'descript.abstract.t', null);
  desc = desc + objGet(ident, 'descript.purpose.t', null);
  desc = desc + objGet(ident, 'descript.supplinf', null);

  if (desc) {
    doc.setProperty('Description', desc);
  } else {
    doc.setProperty('Description', 'Missing');
  }

  pubdate = objGet(ident, 'citation.citeinfo.pubdate.t', null);
  pubdate = pubdate + objGet(ident, 'citation.citeinfo.pubtime.t', null);

  if (pubdate) {
    doc.setProperty('PublicationDate', pubdate.toString());
  } else {
    doc.setProperty('PublicationDate', 'Missing');
  }

  doc.setProperty('ResourceId', (objGet(fgdc, 'metadata.distinfo.resdesc.t', 'metadata')) + '-' + (objGet(ident, 'citation.citeinfo.onlink.t', 'Missing')));
  doc.Authors = [];
  origins = objGet(ident, 'citation.citeinfo.origin', []);

  if (origins['t']) {
    origins = [origins];
  }

  for (i = 0; i < origins.length; i++) {
    origin = origins[i];
    doc.Authors.push(buildContact(origin['t']));
  }

  doc.Keywords = [];

  themeKeywords = objGet(ident, 'keywords.theme.themekey', []);
  for (j = 0; j < themeKeywords.length; j++) {
    keyword = themeKeywords[j];
    doc.Keywords.push(keyword['t']);
  }

  placeKeywords = objGet(ident, 'keywords.stratum.stratkey', []);
  for (k = 0; k < placeKeywords.length; k++) {
    keyword = placeKeywords[k];
    doc.Keywords.push(keyword['t']);
  }

  stratKeywords = objGet(ident, 'keywords.stratum.stratkey', []);
  for (l = 0; l < stratKeywords.length; l++) {
    keyword = stratKeywords[l];
    doc.Keywords.push(keyword['t']);
  }

  tempKeywords = objGet(ident, 'keywords.temporal.tempkey', []);
  for (m = 0; m < tempKeywords.length; m++) {
    keyword = tempKeywords[m];
    doc.Keywords.push(keyword['t']);
  }

  doc.setProperty("GeographicExtent.WestBound", objGet(ident, "spdom.bounding.westbc.$t", "Missing"));
  doc.setProperty("GeographicExtent.EastBound", objGet(ident, "spdom.bounding.eastbc.$t", "Missing"));
  doc.setProperty("GeographicExtent.NorthBound", objGet(ident, "spdom.bounding.northbc.$t", "Missing"));
  doc.setProperty("GeographicExtent.SouthBound", objGet(ident, "spdom.bounding.southbc.$t", "Missing"));

  doc.Distributors = [];

  distributors = objGet(fgdc, "metadata.distinfo", []);
  if (distributors.distrib) {
    distributors = [distributors];
  }

  for (n = 0; n < distributors.length; n++) {
    distributor = distributors[n];
    contact = {
      name: objGet(distributor, "distrib.cntinfo.cntorgp.cntper.$t", "Missing"),
      organization: objGet(distributor, "distrib.cntinfo.cntorgp.cntorg.$t", "Missing"),
      phone: objGet(distributor, "distrib.cntinfo.cntvoice.$t", "Missing"),
      email: objGet(distributor, "distrib.cntinfo.cntemail.$t", "Missing"),
      street: objGet(distributor, "distrib.cntinfo.cntaddr.address.$t", "Missing"),
      city: objGet(distributor, "distrib.cntinfo.cntaddr.city.$t", "Missing"),
      state: objGet(distributor, "distrib.cntinfo.cntaddr.state.$t", "Missing"),
      zip: objGet(distributor, "distrib.cntinfo.cntaddr.postal.$t", "Missing")
    };
    doc.Distributors.push(buildContact(contact));
  }

  doc.Links = [];
  linksCite = objGet(ident, 'citation.citeinfo.onlink', null)

  if (linksCite['t']) {
    linksCite = [linksCite];
  }

  for (o = 0; o < linksCite.length; o++) {
    linkCite = linksCite[o];
    if (linkCite['t']) {
      doc.Links.push(buildLink(linkCite['t']));
    }
  }

  crossRefs = objGet(ident, 'crossref', []);
  if (crossRefs['citeinfo']) {
    crossRefs = [crossRefs];
  }

  for (p = 0; p < crossRefs.length; p++) {
    crossRef = crossRefs[p];
    linksRef = objGet(crossRef, 'citeinfo.onlink', []);
    if (linksRef['t']) {
      linksRef = [linksRef];
    }
    for (q = 0; q < linksRef.length; q++) {
      linkRef = linksRef[q];
      onlink = objGet(linkRef, 't', null);
      if (onlink) {
        doc.Links.push(buildLink(onlink));
      }
    }
  }

  srcInfos = objGet(fgdc, 'metadata.dataqual.lineage.srcinfo', []);
  if (srcInfos['srccite']) {
    srcInfos = [srcInfos];
  }

  for (r = 0; r < srcInfos.length; r++) {
    srcInfo = srcInfos[r];
    linksSrc = objGet(srcInfo, 'srccite.citeinfo.onlink', []);
    if (linksSrc['t']) {
      linksSrc = [linksSrc];
    }
    for (s = 0; s < linksSrc.length; s++) {
      linksSrc = linksSrc[s];
      onlink = objGet(linkSrc, 't', null);
      if (onlink) {
        doc.Links.push(buildLink(onlink));
      }
    }
  }

  metaContact = objGet(ident, 'ptcontac.ctinfo', {});
  entity = (objGet(metaContact, 'cntperp', null)) || (objGet(metaContact, 'cntorgp', 'Missing'));
  contPer = objGet(entity, 'cntper.t', 'Missing');
  contOrg = objGet(entity, 'cntorg.t', 'Missing');
  contTel = objGet(metaContact, 'cntvoice', 'Missing');

  if ((contTel['t'] == null) && (contTel !== 'Missing')) {
    contTel = objGet(contTel[0], 't', 'Missing');
  } else {
    if (contTel !== 'Missing') {
      contTel = objGet(contTel, 't', 'Missing');
    }
  }

  contEma = objGet(metaContact, 'cntemail', 'Missing');
  if ((contEma['t'] == null) && (contEma !== 'Missing')) {
    contEma = objGet(contEma[0], 't', 'Missing');
  } else {
    if (contEma !== 'Missing') {
      contEma = objGet(contEma, 't', 'Missing');
    }
  }

  address = objGet(metaContact, 'cntaddr', 'Missing');
  if ((address['address'] == null) && (address !== 'Missing')) {
    address = address[0];
  }

  contStr = objGet(address, 'address', 'Missing');
  if ((contStr['t'] == null) && (contStr !== 'Missing')) {
    contStr = contStr[0];
  } else {
    if (contStr !== 'Missing') {
      contStr = objGet(contStr, 't', 'Missing');
    }
  }

  contact = {
    name: contPer,
    organization: contOrg,
    phone: contTel,
    email: contEma,
    street: contStr,
    city: contCit,
    state: contSta,
    zip: contZip
  };

  contCit = objGet(address, 'city.t', 'Missing');
  contSta = objGet(address, 'state.t', 'Missing');
  contZip = objGet(address, 'postal.t', 'Missing');
  doc.setProperty('MetadataContact', buildContact(contact));
  doc.setProperty('HarvestInformation.OriginalFileIdentifier', (objGet(fgdc, 'metadata.distinfo.resdesc.t', 'metadata')) + '-' + (objGet(ident, 'citation.citeinfo.onlink.t', 'Missing')));
  doc.setProperty('Published', false);

  emit(fgdc._id, doc);
}

function reduce (data) {
  return data;
}

exports.map = map;
exports.reduce = reduce;