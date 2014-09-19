function map () {
  var doc
    , iso
    , useIds
    , serviceTypes
    , capServiceTypes
    , type
    , azgsContact
    , metaContact
    , dsId
    , docAuthor
    , docAuthors
    , docKeyword
    , docKeywords
    , docDistributors
    , docLink
    , docLinks
    , docDistributor
    , distName
    , dl
    , i
    , j
    , k
    , l
    , m
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

  function toXmlValidText (value) {
    if (value && typeof value === 'string') {
      value = value.replace(/&(?!(amp;|lt;|gt;|quot;|apos;|nbsp;))/g, '&amp;');
      value = value.replace(/</g, '&lt;');
      value = value.replace(/>/g, '&gt;');
      value = value.replace(/"/g, '&quot;');
      value = value.replace(/'/g, '&apos;');
      value = value.replace(/&nbsp;/g, ' ');
    }
    return value;
  }

  function setProperty (obj, prop, value) {
    var count
      , props
      , results
      , i
      , p
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
          results.push(obj[p] = toXmlValidText(value));
        } else {
          obj[p] = {};
          obj = obj[p];
          results.push(count++);
        }
      }
    }
    return results;
  }

  iso = {};

  function writeContactInfo (contactObj, isoLocation, role) {
    setProperty(iso, isoLocation + ".gmd:CI_ResponsibleParty.gmd:individualName.gco:CharacterString.t", objGet(contactObj, "Name", "No Name Was Given"));
    setProperty(iso, isoLocation + ".gmd:CI_ResponsibleParty.gmd:organisationName.gco:CharacterString.t", objGet(contactObj, "OrganizationName", "No Organization Name Was Given"));
    setProperty(iso, isoLocation + ".gmd:CI_ResponsibleParty.gmd:contactInfo.gmd:CI_Contact.gmd:phone.gmd:CI_Telephone.gmd:voice.gco:CharacterString.t", objGet(contactObj, "ContactInformation.Phone", "No Phone Number Was Given"));
    setProperty(iso, isoLocation + ".gmd:CI_ResponsibleParty.gmd:contactInfo.gmd:CI_Contact.gmd:address.gmd:CI_Address.gmd:deliveryPoint.gco:CharacterString.t", objGet(contactObj, "ContactInformation.Address.Street", "No Street Was Given"));
    setProperty(iso, isoLocation + ".gmd:CI_ResponsibleParty.gmd:contactInfo.gmd:CI_Contact.gmd:address.gmd:CI_Address.gmd:city.gco:CharacterString.t", objGet(contactObj, "ContactInformation.Address.City", "No Street Was Given"));
    setProperty(iso, isoLocation + ".gmd:CI_ResponsibleParty.gmd:contactInfo.gmd:CI_Contact.gmd:address.gmd:CI_Address.gmd:administrativeArea.gco:CharacterString.t", objGet(contactObj, "ContactInformation.Address.State", "No State Was Given"));
    setProperty(iso, isoLocation + ".gmd:CI_ResponsibleParty.gmd:contactInfo.gmd:CI_Contact.gmd:address.gmd:CI_Address.gmd:postalCode.gco:CharacterString.t", objGet(contactObj, "ContactInformation.Address.Zip", "No Zip Code Was Given"));
    setProperty(iso, isoLocation + ".gmd:CI_ResponsibleParty.gmd:contactInfo.gmd:CI_Contact.gmd:address.gmd:CI_Address.gmd:electronicMailAddress.gco:CharacterString.t", objGet(contactObj, "ContactInformation.email", "No email Address Was Given"));
    setProperty(iso, isoLocation + ".gmd:CI_ResponsibleParty.gmd:role.gmd:CI_RoleCode.codeList", "http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/Codelist/gmxCodelists.xml#CI_RoleCode");
    setProperty(iso, isoLocation + ".gmd:CI_ResponsibleParty.gmd:role.gmd:CI_RoleCode.codeListValue", role);
    setProperty(iso, isoLocation + ".gmd:CI_ResponsibleParty.gmd:role.gmd:CI_RoleCode.t", role);
  }

  function writeLinkInfo (linkObj, isoLocation, addId) {
    var descriptionString
      , layerId
      , name
      , serviceType
      ;
    if (addId) {
      setProperty(iso, isoLocation + ".gmd:MD_DigitalTransferOptions.id", computeId(linkObj));
    }
    setProperty(iso, isoLocation + ".gmd:MD_DigitalTransferOptions.gmd:onLine.gmd:CI_OnlineResource.gmd:linkage.gmd:URL.t", objGet(linkObj, "URL", "No URL Was Given"));
    serviceType = objGet(linkObj, "ServiceType", null);
    descriptionString = objGet(linkObj, "Description", "");
    layerId = objGet(linkObj, "LayerId", null);
    if (serviceType) {
      name = objGet(linkObj, "Name", "Service Description");
      setProperty(iso, isoLocation + ".gmd:MD_DigitalTransferOptions.gmd:onLine.gmd:CI_OnlineResource.gmd:protocol.gco:CharacterString.t", serviceType);
      setProperty(iso, isoLocation + ".gmd:MD_DigitalTransferOptions.gmd:onLine.gmd:CI_OnlineResource.gmd:name.gco:CharacterString.t", name);
      if (layerId && serviceType === 'OGC:WMS') {
        descriptionString += " parameters: {\"featureTypes\": \"" + layerId + "\"}";
      }
      if (layerId && serviceType === 'OGC:WFS') {
        descriptionString += " parameters: {\"featureTypes\": \"" + layerId + "\"}";
      }
      if (descriptionString !== '') {
        setProperty(iso, isoLocation + ".gmd:MD_DigitalTransferOptions.gmd:onLine.gmd:CI_OnlineResource.gmd:description.gco:CharacterString.t", descriptionString);
      }
      setProperty(iso, isoLocation + ".gmd:MD_DigitalTransferOptions.gmd:onLine.gmd:CI_OnlineResource.gmd:function.gmd:CI_OnLineFunctionCode.codeListValue", "381");
      setProperty(iso, isoLocation + ".gmd:MD_DigitalTransferOptions.gmd:onLine.gmd:CI_OnlineResource.gmd:function.gmd:CI_OnLineFunctionCode.codeList", "http://www.fgdc.gov/nap/metadata/register/registerItemClasses.html#IC_88");
      return  setProperty(iso, isoLocation + ".gmd:MD_DigitalTransferOptions.gmd:onLine.gmd:CI_OnlineResource.gmd:function.gmd:CI_OnLineFunctionCode.t", "webService");
    } else {
      name = objGet(linkObj, "Name", "Downloadable File");
      setProperty(iso, isoLocation + ".gmd:MD_DigitalTransferOptions.gmd:onLine.gmd:CI_OnlineResource.gmd:name.gco:CharacterString.t", name);
      if (descriptionString !== '') {
        setProperty(iso, isoLocation + ".gmd:MD_DigitalTransferOptions.gmd:onLine.gmd:CI_OnlineResource.gmd:description.gco:CharacterString.t", descriptionString);
      }
      setProperty(iso, isoLocation + ".gmd:MD_DigitalTransferOptions.gmd:onLine.gmd:CI_OnlineResource.gmd:function.gmd:CI_OnLineFunctionCode.codeListValue", "375");
      setProperty(iso, isoLocation + ".gmd:MD_DigitalTransferOptions.gmd:onLine.gmd:CI_OnlineResource.gmd:function.gmd:CI_OnLineFunctionCode.codeList", "http://www.fgdc.gov/nap/metadata/register/registerItemClasses.html#IC_88");
      return setProperty(iso, isoLocation + ".gmd:MD_DigitalTransferOptions.gmd:onLine.gmd:CI_OnlineResource.gmd:function.gmd:CI_OnLineFunctionCode.t", "download");
    }
  }

  useIds = [];
  function computeId (linkObj, addToUsed) {
    var out;
    if (!addToUsed) {
      addToUsed = true;
    }
    out = linkObj.URL.replace(/^[^A-Za-z]/, "id-");
    out = out.replace(/[^_A-Za-z0-9]/g, "_");
    if (addToUsed) {
      if (useIds.indexOf(out) >= 0) {
        out = "" + out + "-duplicate";
      }
      useIds.push(out);
    }
    return out;
  }

  serviceTypes = ["OGC:WMS", "OGC:WFS", "OGC:WCS", "esri", "opendap"];
  capServiceTypes = (function () {
    var i
      , results
      ;
    results = [];
    for (i = 0; i < serviceTypes.length; i++) {
      type = serviceTypes[i];
      results.push(type.toUpperCase());
    }
    return results;
  })();

  setProperty(iso, "gmd:MD_Metadata.xmlns:gml", "http://www.opengis.net/gml");
  setProperty(iso, "gmd:MD_Metadata.xmlns:xlink", "http://www.w3.org/1999/xlink");
  setProperty(iso, "gmd:MD_Metadata.xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance");
  setProperty(iso, "gmd:MD_Metadata.xmlns:gmd", "http://www.isotc211.org/2005/gmd");
  setProperty(iso, "gmd:MD_Metadata.xmlns:gco", "http://www.isotc211.org/2005/gco");
  setProperty(iso, "gmd:MD_Metadata.xsi:schemaLocation", "http://www.isotc211.org/2005/gmd http://schemas.opengis.net/csw/2.0.2/profiles/apiso/1.0.0/apiso.xsd");
  setProperty(iso, "gmd:MD_Metadata.gmd:fileIdentifier.gco:CharacterString.t", doc._id);
  setProperty(iso, "gmd:MD_Metadata.gmd:language.gco:CharacterString.t", "eng");
  setProperty(iso, "gmd:MD_Metadata.gmd:characterSet.gmd:MD_CharacterSetCode.codeList", "http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/Codelist/gmxCodelists.xml#MD_CharacterSetCode");
  setProperty(iso, "gmd:MD_Metadata.gmd:characterSet.gmd:MD_CharacterSetCode.codeListValue", "utf8");
  setProperty(iso, "gmd:MD_Metadata.gmd:characterSet.gmd:MD_CharacterSetCode.t", "UTF-8");
  setProperty(iso, "gmd:MD_Metadata.gmd:hierarchyLevel.gmd:MD_ScopeCode.codeList", "http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/Codelist/gmxCodelists.xml#MD_ScopeCode");
  setProperty(iso, "gmd:MD_Metadata.gmd:hierarchyLevel.gmd:MD_ScopeCode.codeListValue", "Dataset");
  setProperty(iso, "gmd:MD_Metadata.gmd:hierarchyLevel.gmd:MD_ScopeCode.t", "Dataset");
  setProperty(iso, "gmd:MD_Metadata.gmd:hierarchyLevelName.gco:CharacterString.t", "Dataset");

  azgsContact = {
    OrganizationName: 'Arizona Geological Survey',
    ContactInformation: {
      Phone: '520-770-3500',
      email: 'metadata@usgin.org',
      Address: {
        Street: '416 W. Congress St. Ste. 100',
        City: 'Tucson',
        State: 'AZ',
        Zip: '85701'
      }
    }
  };

  metaContact = objGet(doc, "MetadataContact", azgsContact);
  writeContactInfo(metaContact,  "gmd:MD_Metadata.gmd:contact", "pointOfContact");
  setProperty(iso, "gmd:MD_Metadata.gmd:dateStamp.gco:DateTime.t", objGet(doc, "ModifiedDate", ""));
  setProperty(iso, "gmd:MD_Metadata.gmd:metadataStandardName.gco:CharacterString.t", "ISO-USGIN");
  setProperty(iso, "gmd:MD_Metadata.gmd:metadataStandardVersion.gco:CharacterString.t", "1.2");
  dsId = objGet(doc, "ResourceId", null);

  if (dsId) {
    setProperty(iso, "gmd:MD_Metadata.gmd:dataSetURI.gco:CharacterString.t", dsId);
  }

  setProperty(iso, "gmd:MD_Metadata.gmd:identificationInfo.gmd:MD_DataIdentification.gmd:citation.gmd:CI_Citation.gmd:title.gco:CharacterString.t", objGet(doc, "Title", "No Title Was Given"));
  setProperty(iso, "gmd:MD_Metadata.gmd:identificationInfo.gmd:MD_DataIdentification.gmd:citation.gmd:CI_Citation.gmd:date.gmd:CI_Date.gmd:date.gco:DateTime.t", objGet(doc, "PublicationDate", "No Publication Date Was Given"));
  setProperty(iso, "gmd:MD_Metadata.gmd:identificationInfo.gmd:MD_DataIdentification.gmd:citation.gmd:CI_Citation.gmd:date.gmd:CI_Date.gmd:dateType.gmd:CI_DateTypeCode.codeList", "http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/Codelist/gmxCodelists.xml#CI_DateTypeCode");
  setProperty(iso, "gmd:MD_Metadata.gmd:identificationInfo.gmd:MD_DataIdentification.gmd:citation.gmd:CI_Citation.gmd:date.gmd:CI_Date.gmd:dateType.gmd:CI_DateTypeCode.codeListValue", "publication");
  setProperty(iso, "gmd:MD_Metadata.gmd:identificationInfo.gmd:MD_DataIdentification.gmd:citation.gmd:CI_Citation.gmd:date.gmd:CI_Date.gmd:dateType.gmd:CI_DateTypeCode.t", "publication");
  docAuthors = objGet(doc, 'Authors', []);
  setProperty(iso, "gmd:MD_Metadata.gmd:identificationInfo.gmd:MD_DataIdentification.gmd:citation.gmd:CI_Citation.gmd:citedResponsibleParty", []);

  for (i = 0; i < docAuthors.length; i++) {
    docAuthor = docAuthors[i];
    writeContactInfo(docAuthor, "gmd:MD_Metadata.gmd:identificationInfo.gmd:MD_DataIdentification.gmd:citation.gmd:CI_Citation.gmd:citedResponsibleParty." + i, "originator");
  }

  setProperty(iso, "gmd:MD_Metadata.gmd:identificationInfo.gmd:MD_DataIdentification.gmd:abstract.gco:CharacterString.t", objGet(doc, "Description", "No Description Was Given"));
  setProperty(iso, "gmd:MD_Metadata.gmd:identificationInfo.gmd:MD_DataIdentification.gmd:status.gmd:MD_ProgressCode.codeList", "http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/Codelist/gmxCodelists.xml#MD_ProgressCode");
  setProperty(iso, "gmd:MD_Metadata.gmd:identificationInfo.gmd:MD_DataIdentification.gmd:status.gmd:MD_ProgressCode.codeListValue", "completed");
  setProperty(iso, "gmd:MD_Metadata.gmd:identificationInfo.gmd:MD_DataIdentification.gmd:status.gmd:MD_ProgressCode.t", "completed");
  setProperty(iso, "gmd:MD_Metadata.gmd:identificationInfo.gmd:MD_DataIdentification.gmd:descriptiveKeywords", []);
  setProperty(iso, "gmd:MD_Metadata.gmd:identificationInfo.gmd:MD_DataIdentification.gmd:descriptiveKeywords.0.gmd:MD_Keywords.gmd:keyword", []);
  setProperty(iso, "gmd:MD_Metadata.gmd:identificationInfo.gmd:MD_DataIdentification.gmd:descriptiveKeywords.0.gmd:MD_Keywords.gmd:type.gmd:MD_KeywordTypeCode.codeList", "http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/Codelist/gmxCodelists.xml#MD_KeywordTypeCode");
  setProperty(iso, "gmd:MD_Metadata.gmd:identificationInfo.gmd:MD_DataIdentification.gmd:descriptiveKeywords.0.gmd:MD_Keywords.gmd:type.gmd:MD_KeywordTypeCode.codeListValue", "theme");
  setProperty(iso, "gmd:MD_Metadata.gmd:identificationInfo.gmd:MD_DataIdentification.gmd:descriptiveKeywords.0.gmd:MD_Keywords.gmd:type.gmd:MD_KeywordTypeCode.t", "theme");

  docKeywords = objGet(doc, 'Keywords', []);
  for (j = 0; j < docKeywords.length; j++) {
    docKeyword = docKeywords[j];
    setProperty(iso, "gmd:MD_Metadata.gmd:identificationInfo.gmd:MD_DataIdentification.gmd:descriptiveKeywords.0.gmd:MD_Keywords.gmd:keyword." + j + ".gco:CharacterString.t", docKeyword);
  }

  setProperty(iso, "gmd:MD_Metadata.gmd:identificationInfo.gmd:MD_DataIdentification.gmd:language.gco:CharacterString.t", "eng");
  setProperty(iso, "gmd:MD_Metadata.gmd:identificationInfo.gmd:MD_DataIdentification.gmd:topicCategory.gmd:MD_TopicCategoryCode.t", "geoscientificInformation");
  setProperty(iso, "gmd:MD_Metadata.gmd:identificationInfo.gmd:MD_DataIdentification.gmd:extent.gmd:EX_Extent.gmd:geographicElement.gmd:EX_GeographicBoundingBox.gmd:westBoundLongitude.gco:Decimal.t", "" + (objGet(doc, 'GeographicExtent.WestBound')));
  setProperty(iso, "gmd:MD_Metadata.gmd:identificationInfo.gmd:MD_DataIdentification.gmd:extent.gmd:EX_Extent.gmd:geographicElement.gmd:EX_GeographicBoundingBox.gmd:eastBoundLongitude.gco:Decimal.t", "" + (objGet(doc, 'GeographicExtent.EastBound')));
  setProperty(iso, "gmd:MD_Metadata.gmd:identificationInfo.gmd:MD_DataIdentification.gmd:extent.gmd:EX_Extent.gmd:geographicElement.gmd:EX_GeographicBoundingBox.gmd:southBoundLatitude.gco:Decimal.t", "" + (objGet(doc, 'GeographicExtent.SouthBound')));
  setProperty(iso, "gmd:MD_Metadata.gmd:identificationInfo.gmd:MD_DataIdentification.gmd:extent.gmd:EX_Extent.gmd:geographicElement.gmd:EX_GeographicBoundingBox.gmd:northBoundLatitude.gco:Decimal.t", "" + (objGet(doc, 'GeographicExtent.NorthBound')));

  docDistributors = objGet(doc, 'Distributors', []);
  docLinks = objGet(doc, 'Links', []);

  setProperty(iso, "gmd:MD_Metadata.gmd:distributionInfo.gmd:MD_Distribution.gmd:distributor", []);
  setProperty(iso, "gmd:MD_Metadata.gmd:distributionInfo.gmd:MD_Distribution.gmd:transferOptions", []);

  for (k = 0; k < docLinks.length; k++) {
    docLink = docLinks[k];
    writeLinkInfo(docLink, "gmd:MD_Metadata.gmd:distributionInfo.gmd:MD_Distribution.gmd:transferOptions." + k, true);
  }

  for (l = 0; l < docDistributors.length; l++) {
    docDistributor = docDistributors[l];
    writeContactInfo(docDistributor, "gmd:MD_Metadata.gmd:distributionInfo.gmd:MD_Distribution.gmd:distributor." + l + ".gmd:MD_Distributor.gmd:distributorContact", "distributor");
    dl = 0;
    for (m = 0; m < docLinks.length; m++) {
      docLink = docLinks[m];
      distName = objGet(docLink, 'Distributor', 'None').trim();
      if (distName === objGet(docDistributor, 'Name', null || distName === objGet(docDistributor, 'OrganizationName', null))) {
        if (!objGet(iso, "gmd:MD_Metadata.gmd:distributionInfo.gmd:MD_Distribution.gmd:distributor." + l + ".gmd:MD_Distributor.gmd:distributorTransferOptions", false)) {
          setProperty(iso, "gmd:MD_Metadata.gmd:distributionInfo.gmd:MD_Distribution.gmd:distributor." + l + ".gmd:MD_Distributor.gmd:distributorTransferOptions", []);
        }
        setProperty(iso, "gmd:MD_Metadata.gmd:distributionInfo.gmd:MD_Distribution.gmd:distributor." + l + ".gmd:MD_Distributor.gmd:distributorTransferOptions." + dl + ".xlink:href", "#" + computeId(docLink, false));
        dl++;
      }
    }
  }

  emit(this._id, iso);
}

function reduce (data) {
  return data;
}

exports.map = map;
exports.reduce = reduce;