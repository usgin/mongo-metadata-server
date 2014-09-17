function map () {
  var input
    , doc
    , ident
    , pubDate
    , resParties
    , resParty
    , descKeywords
    , keywords
    , keyword
    , words
    , word
    , split
    , extent
    , validExtents
    , ext
    , isoDistributors
    , isoDist
    , linksList
    , distributions
    , linkLookup
    , distribution
    , id
    , distOptions
    , distOutput
    , dist
    , distOpt
    , responsibleParty
    , distributorLinks
    , link
    , url
    , i
    , j
    , k
    , l
    , m
    , n
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

  function buildContact (responsibleParty) {
    var contact
      , role;
    role = objGet(responsibleParty, "gmd:CI_ResponsibleParty.gmd:role.gmd:CI_RoleCode.codeListValue", "");
    contact = {
      Name: objGet(responsibleParty, "gmd:CI_ResponsibleParty.gmd:individualName.gco:CharacterString._$", "No Name Was Given"),
      ContactInformation: {
        Phone: objGet(responsibleParty, "gmd:CI_ResponsibleParty.gmd:contactInfo.gmd:CI_Contact.gmd:phone.gmd:CI_Telephone.gmd:voice.gco:CharacterString._$", "No Phone Number Was Given"),
        email: objGet(responsibleParty, "gmd:CI_ResponsibleParty.gmd:contactInfo.gmd:CI_Contact.gmd:address.gmd:CI_Address.gmd:electronicMailAddress.gco:CharacterString._$", "No email Was Given"),
        Address: {
          Street: objGet(responsibleParty, "gmd:CI_ResponsibleParty.gmd:contactInfo.gmd:CI_Contact.gmd:address.gmd:CI_Address.gmd:deliveryPoint.gco:CharacterString._$", "No Street Address Was Given"),
          City: objGet(responsibleParty, "gmd:CI_ResponsibleParty.gmd:contactInfo.gmd:CI_Contact.gmd:address.gmd:CI_Address.gmd:city.gco:CharacterString._$", "No City Was Given"),
          State: objGet(responsibleParty, "gmd:CI_ResponsibleParty.gmd:contactInfo.gmd:CI_Contact.gmd:address.gmd:CI_Address.gmd:administrativeArea.gco:CharacterString._$", "No State Was Given"),
          Zip: objGet(responsibleParty, "gmd:CI_ResponsibleParty.gmd:contactInfo.gmd:CI_Contact.gmd:address.gmd:CI_Address.gmd:postalCode.gco:CharacterString._$", "No Zip Was Given")
        }
      }
    };
    if (['Missing', 'missing', 'No Name Was given'].indexOf(contact.Name) > -1) {
      contact["OrganizationName"] = objGet(responsibleParty, "gmd:CI_ResponsibleParty.gmd:organisationName.gco:CharacterString.t", "No Organization Name Was Given");
    }
    return contact;
  }

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

  function buildLink (onlineResource, responsibleParty) {
    var url
      , protocol
      , link
      , guess
      , serviceType
      , name;

    url = objGet(onlineResource, "gmd:linkage.gmd:URL.t", "No URL Was Given");
    protocol = objGet(onlineResource, "gmd:protocol.gco:CharacterString.t", "No Protocol Was Given");
    protocol = protocol.toUpperCase();

    if (capServiceTypes.indexOf(protocol) >= 0) {
      serviceType = protocol;
    } else {
      guess = guessServiceType(url);
      if (guess) serviceType = guess;
    }

    name = null;
    if (responsibleParty) {
      name = objGet(responsibleParty, "gmd:CI_ResponsibleParty.gmd:individualName.gco:CharacterString.t", "No Name Was Given");
      if (['Missing', 'missing', 'No Name Was Given'].indexOf(name) > -1) {
        name = objGet(responsibleParty, "gmd:CI_ResponsibleParty.gmd:organisationName.gco:CharacterString.t", "No Organization Name Was Given");
      }
    }

    link = {
      URL: url,
      Description: objGet(onlineResource, "gmd:description.gco:CharacterString.t", "No Description Was Given")
    };

    if (serviceType) {
      link.serviceType = serviceType;
    }

    if (name) {
      link.Distributor = name;
    }

    return link;
  }

  input = this;
  doc = {};

  ident = objGet(input, 'gmi:MI_Metadata.gmd:identificationInfo', objGet(input, 'srv:SV_ServiceIdentification', {}));
  ident = objGet(ident[2], 'gmd:MD_DataIdentification', objGet(input, 'srv:SV_ServiceIdentification', {}));
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
    doc.Authors.push(buildContact(resParty));
  }

  doc.Keywords = [];
  descKeywords = objGet(ident, 'gmd:descriptiveKeywords', []);
  if (descKeywords['gmd:MD_Keywords']) {
    descKeywords = [descKeywords];
  }
  for (j = 0; j < descKeywords.length; j++) {
    descKeyword = descKeywords[k];
    keywords = objGet(descKeyword, "gmd:MD_Keywords.gmd:keyword", []);
    if (keywords['gco:CharacterString']) {
      keywords = [keywords];
    }
    for (k = 0; k < keywords.length; k++) {
      keyword = keywords[k];
      words = objGet(keyword, "gco:CharacterString._$", null);
      split = words.split(',');
      for (l = 0; l < split.length; l++) {
        word = split[l];
        doc.Keywords.push(word.trim());
      }
    }
  }

  extent = objGet(ident, "gmd:extent", objGet(ident, "srv:extent", {}));
  if (extent['0']) {
    validExtents = [];
    for (m = 0; m < extent.length; m++) {
      ext = extent[m];
      if (objGet(ext, 'gmd:EX_Extent.gmd:geographicElement', null)) {
        validExtents.push(ext);
      }
    }
    extent = validExtents[0];
  }

  doc.GeographicExtent = {};

  setProperty(doc.GeographicExtent, "NorthBound", parseFloat(objGet(extent, "gmd:EX_Extent.gmd:geographicElement.gmd:EX_GeographicBoundingBox.gmd:northBoundLatitude.gco:Decimal._$", 89)));
  setProperty(doc.GeographicExtent, "SouthBound", parseFloat(objGet(extent, "gmd:EX_Extent.gmd:geographicElement.gmd:EX_GeographicBoundingBox.gmd:southBoundLatitude.gco:Decimal._$", -89)));
  setProperty(doc.GeographicExtent, "EastBound", parseFloat(objGet(extent, "gmd:EX_Extent.gmd:geographicElement.gmd:EX_GeographicBoundingBox.gmd:eastBoundLongitude.gco:Decimal._$", 179)));
  setProperty(doc.GeographicExtent, "WestBound", parseFloat(objGet(extent, "gmd:EX_Extent.gmd:geographicElement.gmd:EX_GeographicBoundingBox.gmd:westBoundLongitude.gco:Decimal._$", -179)));

  isoDistributors = objGet(input, "gmi:MI_Metadata.gmd:distributionInfo.gmd:MD_Distribution.gmd:distributor", []);
  if (isoDistributors['gmd:MD_Distributor']) {
    isoDistributors = [isoDistributors];
  }
  doc.Distributors = [];
  for (n = 0; n < isoDistributors.length; n++) {
    isoDist = isoDistributors[n];
    doc.Distributors.push(buildContact(objGet(isoDist, 'gmd:MD_Distributor.gmd:distributorContact', {})));
  }

  linksList = {};
  function onlineResource (distOption) {
    return objGet(distOption, "gmd:MD_DigitalTransferOptions.gmd:onLine.gmd:CI_OnlineResource", {});
  }

  // Links that are not attached to a distributor
  distributions = objGet(input, "gmd:MD_Metadata.gmd:distributionInfo.gmd:MD_Distribution.gmd:transferOptions", []);
  if (distributions["gmd:MD_DigitalTransferOptions"]) {
    distributions = [distributions];
  }
  moreLinks = (function () {
    var i
      , results;
    results = [];
    for (i = 0; i < distributions.length; i++) {
      distOpt = distributions[i];
      results.push(buildLink(onlineResource(distOpt)));
    }
    return results;
  })();

  // Distributor links
  linkLookup = {};
  for (i = 0; i < distributions.length; i++) {
    distribution = distributions[i];
    id = objGet(distribution, "gmd:MD_DigitalTransferOptions.id", "");
    linkLookup[id] = distribution;
  }

  function getDistributorLink (dist) {
    id = dist['xlink:href'].replace('#', '');
    return linkLookup[id];
  }

  for (i = 0; i < isoDistributors.length; i++) {
    isoDist = isoDistributors[i];
    distOptions = objGet(isoDist, "gmd:MD_Distributor.gmd:distributorTransferOptions", []);
    if (distOptions['gmd:MD_DigitalTransferOptions'] || distOptions['xlink:href']) {
      distOptions = [distOptions];
    }
    distOutput = [];
    for (l = 0; l < distOptions.length; l++) {
      dist = distOptions[l];
      if (dist['xlink:href']) {
        distOutput.push(getDistributorLink(dist));
      } else {
        distOutput.push(dist);
      }
    }
    responsibleParty = objGet(isoDist, "gmd:MD_Distributor.gmd:distributorContact", {});
    distributorLinks = (function () {
      var i
        , results;
      results = [];
      for (i = 0; i < distOutput.length; i++) {
        distOpt = distOutput[i];
        results.push(buildLink(onlineResource(distOpt), responsibleParty));
      }
      return results;
    })();
    for (m = 0; m < distOutput.length; m++) {
      link = distributorLinks[m];
      linksList[link.URL] = link;
    }
  }

  doc.Links = [];
  for (url in linksList) {
    link = linksList[url];
    doc.Links.push(link);
  }

  emit(this._id, doc);
}

function reduce (data) {
  return data;
}

exports.map = map;
exports.reduce = reduce;