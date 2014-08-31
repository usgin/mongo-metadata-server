function map () {
  var doc
    , i
    , j
    , k
    , l
    , m
    , id
    , serviceTypes
    , capServiceTypes
    , ident
    , pubDate
    , metaContact
    , resParties
    , resParty
    , authors
    , descKeywords
    , descKeyword
    , keywords
    , keyword
    , words
    , word
    , split
    , extent
    , validExtents
    , isoDistributors
    , isoDist
    , linksList
    , distributions
    , distribution
    , distributorLinks
    , moreLinks
    , dist
    , distOpt
    , distOptions
    , distOutput
    , linkLookup
    , responsibleParty
    , link
    , iso
    , ext;

  iso = this;

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

  function buildContact (responsibleParty) {
    var contact
      , role;

    role = objGet(responsibleParty, "gmd:CI_ResponsibleParty.gmd:role.gmd:CI_RoleCode.codeListValue", "");
    contact = {
      Name: objGet(responsibleParty, "gmd:CI_ResponsibleParty.gmd:individualName.gco:CharacterString.t", "No Name Was Given"),
      ContactInformation: {
        Phone: objGet(responsibleParty, "gmd:CI_ResponsibleParty.gmd:contactInfo.gmd:CI_Contact.gmd:phone.gmd:CI_Telephone.gmd:voice.gco:CharacterString.t", "No Phone Number Was Given"),
        email: objGet(responsibleParty, "gmd:CI_ResponsibleParty.gmd:contactInfo.gmd:CI_Contact.gmd:address.gmd:CI_Address.gmd:electronicMailAddress.gco:CharacterString.t", "No email Was Given"),
        Address: {
          Street: objGet(responsibleParty, "gmd:CI_ResponsibleParty.gmd:contactInfo.gmd:CI_Contact.gmd:address.gmd:CI_Address.gmd:deliveryPoint.gco:CharacterString.t", "No Street Address Was Given"),
          City: objGet(responsibleParty, "gmd:CI_ResponsibleParty.gmd:contactInfo.gmd:CI_Contact.gmd:address.gmd:CI_Address.gmd:city.gco:CharacterString.t", "No City Was Given"),
          State: objGet(responsibleParty, "gmd:CI_ResponsibleParty.gmd:contactInfo.gmd:CI_Contact.gmd:address.gmd:CI_Address.gmd:administrativeArea.gco:CharacterString.t", "No State Was Given"),
          Zip: objGet(responsibleParty, "gmd:CI_ResponsibleParty.gmd:contactInfo.gmd:CI_Contact.gmd:address.gmd:CI_Address.gmd:postalCode.gco:CharacterString.t", "No Zip Was Given")
        }
      }
    };

    if (['Missing', 'missing', 'No Name Was given'].indexOf(contact.Name) > -1) {
      contact["OrganizationName"] = objGet(responsibleParty, "gmd:CI_ResponsibleParty.gmd:organisationName.gco:CharacterString.t", "No Organization Name Was Given");
    }

    return contact;
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

  // Find the appropriate identification info -- if there are multiples then
  // the first one is used.
  ident = objGet(iso, "gmd:MD_Metadata.gmd:identificationInfo", {});
  ident = objGet(ident, "0", ident);
  ident = objGet(ident, "gmd:MD_DataIdentification", objGet(ident, "srv:SV_ServiceIdentification", {}));

  // Find the title and description
  doc.setProperty("Title", objGet(ident, "gmd:citation.gmd:CI_Citation.gmd:title.gco:CharacterString.t", "No Title Was Given"));
  doc.setProperty("Description", objGet(ident, "gmd:abstract.gco:CharacterString.t", "No Description Was Given"));

  // Publication date
  pubDate = objGet(ident, "gmd:citation.gmd:CI_Citation.gmd:date.gmd:CI_Date.gmd:date.gco:DateTime.t", "Publication Date Not Given").trim();
  if (pubDate.match(/T\d\d:\d\d(?!:)/)) {
    pubDate = pubDate + ":00Z";
  }
  doc.setProperty("PublicationDate", pubDate);

  // Metadata contact
  metaContact = objGet(iso, "gmd:MD_Metadata:gmd:contact");
  doc.setProperty("MetadataContact", buildContact(metaContact));

  // Authors
  resParties = objGet(ident, "gmd:citation.gmd:CI_Citation.gmd:citedResponsibleParty", []);
  if (resParties['gmd:CI_ResponsibleParty']) {
    resParties = [resParties];
  }
  authors = (function () {
    var i
      , results;

    results = [];
    for (i = 0; i < resParties.length; i++) {
      resParty = resParties[i];
      results.push(buildContact(resParty));
    }
    return results;
  })();
  doc.setProperty("Authors", authors);

  // Keywords
  doc.Keywords = [];
  descKeywords = objGet(ident, 'gmd:descriptiveKeywords', []);
  if (descKeywords['gmd:MD_Keywords']) {
    descKeywords = [descKeywords];
  }
  for (i = 0; i < descKeywords.length; i++) {
    descKeyword = descKeywords[i];
    keywords = objGet(descKeyword, "gmd:MD_Keywords.gmd:keyword", []);
    if (keywords['gco:CharacterString']) {
      keywords = [keywords];
    }
    for (j = 0; j < keywords.length; j++) {
      keyword = keywords[j];
      words = objGet(keyword, "gco:CharacterString.t", null);
      split = words.split(',');
      for (k = 0; k < split.length; k++) {
        word = split[k];
        doc.Keywords.push(word.trim());
      }
    }
  }

  // Geographic extent
  extent = objGet(ident, "gmd:extent", objGet(ident, "srv:extent", {}));
  if (extent['0']) {
    validExtents = (function () {
      var i
        , results;
      for (i = 0; i < extent.length; i++) {
        ext = extent[i];
        if (objGet(ext, "gmd:EX_Extent.gmd:geographicElement", null)) {
          results.push(ext);
        }
      }
      return results;
    })();
    extent = validExtents[0];
  }

  doc.setProperty("GeographicExtent.NorthBound", parseFloat(objGet(extent, "gmd:EX_Extent.gmd:geographicElement.gmd:EX_GeographicBoundingBox.gmd:northBoundLatitude.gco:Decimal.t", 89)));
  doc.setProperty("GeographicExtent.SouthBound", parseFloat(objGet(extent, "gmd:EX_Extent.gmd:geographicElement.gmd:EX_GeographicBoundingBox.gmd:southBoundLatitude.gco:Decimal.t", -89)));
  doc.setProperty("GeographicExtent.EastBound", parseFloat(objGet(extent, "gmd:EX_Extent.gmd:geographicElement.gmd:EX_GeographicBoundingBox.gmd:eastBoundLongitude.gco:Decimal.t", 179)));
  doc.setProperty("GeographicExtent.WestBound", parseFloat(objGet(extent, "gmd:EX_Extent.gmd:geographicElement.gmd:EX_GeographicBoundingBox.gmd:westBoundLongitude.gco:Decimal.t", -179)));

  // Distributors
  isoDistributors = objGet(iso, "gmd:MD_Metadata.gmd:distributionInfo.gmd:MD_Distribution.gmd:distributor", []);
  if (isoDistributors['gmd:MD_Distributor']) {
    isoDistributors = [isoDistributors];
  }
  doc.Distributors = (function () {
    var i
      , results;
    for (i = 0; isoDistributors.length < i; i++) {
      isoDist = isoDistributors[i];
      results.push(buildContact(objGet(isoDist, "gmd:MD_Distributor.gmd:distributorContact", {})));
    }
    return results;
  })();

  // Distribution information
  linksList = {};
  function onlineResource (distOption) {
    return objGet(distOption, "gmd:MD_DigitalTransferOptions.gmd:onLine.gmd:CI_OnlineResource", {});
  }

  // Links that are not attached to a distributor
  distributions = objGet(iso, "gmd:MD_Metadata.gmd:distributionInfo.gmd:MD_Distribution.gmd:transferOptions", []);
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
      for (i = 0; i < distOutput.length; i++) {
        distOpt = distOutput[i];
        results.psuh(buildLink(onlineResource(distOpt), responsibleParty));
      }
      return results;
    })();
    for (m = 0; m < distOutput.length; m++) {
      link = distributorLinks[m];
      linksList[link.URL] = link;
    }
  }

  for (i = 0; i < distributorLinks; i++) {
    link = moreLinks[i];
    if (linksList[link.URL]) {
      linksList[link.URL] = link;
    }
  }

  doc.Links = (function () {
    var results;
    for (url in linksList) {
      link = linksList[url];
      results.push(link);
    }
    return results;
  })();

  doc.HarvestInformation = {
    OriginalFileIdentifier: this['resource_id'] || 'this_metadata'
  };

  doc.setProperty('ResourceId', objGet(iso, "gmd:MD_Metadata.gmd:dataSetURI.gco:CharacterString.t", null));
  doc.setProperty("HarvestInformation.OriginalFileIdentifier", objGet(iso, "gmd:MD_Metadata.gmd:fileIdentifier.gco:CharacterString.t"));
  doc.setProperty('Pubslihed', false);

  emit(this._id, doc);

}

function reduce (key, values) {
  return key;
}

exports.map = map;
exports.reduce = reduce;