function map () {
  var doc
    , csv
    , obj
    , kws
    , links
    , i
    , serviceType
    , serviceTypes
    , capServiceTypes
    , objLink
    , urls
    , link;

  csv = this;

  doc = {};
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
      [/getcapabilities/i, /wms/i],
      [/getcapabilities/i, /wfs/i],
      [/getcapabilities/i, /wcs/i],
      [/\/services\//i, /\/mapserver\/?$/i],
      [/\.dds$/]
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

  function setContacts (prop, obj) {
    var persons
      , person
      , author
      , i
      , a
      , org
      , results;

    persons = csv[obj.person];
    if (persons) {
      persons = persons.split('|');
    } else {
      persons = csv[obj.position];
      if (persons) {
        persons = persons.split('|');
      }
    }
    if (persons) {
      for (i = 0; i < persons.length; i++) {
        person = persons[i];
        author = { Name: person };
        prop.push(author);
      }
    } else {
      author = { Name: 'Missing' };
      prop.push(author);
    }

    results = [];
    org = csv[obj.organization] || 'Missing';
    for (i = 0; i < prop.length; i++) {
      a = prop[i];
      a.OrganizationName = org;
      coninfo = a.ContactInformation = {};
      coninfo.Phone = csv[obj.phone] || 'Missing';
      coninfo.email = csv[obj.email] || 'Missing';
      addr = coninfo.Address = {};
      addr.Street = csv[obj.street] || 'Missing';
      addr.City = csv[obj.city] || 'Missing';
      addr.State = csv[obj.state] || 'Missing';
      addr.Zip = csv[obj.zip] || 'Missing';
      results.push(addr.Zip);
    }
  }

  doc.Title = csv['title'] || 'Missing';
  doc.Description = csv['description'] || 'No Abstract Was Provided';
  doc.PublicationDate = csv['publication_date'] || 'Missing';
  doc.ResourceId = csv['resource_id'] || 'Missing';

  doc.Authors = [];
  obj = {
    person: 'originator_contact_person_name',
    position: 'originator_contact_position_name',
    organization: 'originator_contact_org_name',
    phone: 'originator_contact_phone',
    email: 'originator_contact_email',
    street: 'originator_contact_street_address',
    city: 'originator_contact_city',
    state: 'originator_contact_state',
    zip: 'originator_contact_zip'
  };

  setContacts(doc.Authors, obj);

  doc.Keywords = [];
  kws = csv['keywords_thematic'];
  if (kws) doc.Keywords = doc.Keywords.concat(kws.split('|'));
  kws = csv['keywords_spatial'];
  if (kws) doc.Keywords = doc.Keywords.concat(kws.split('|'));
  kws = csv['keywords_temporal'];
  if (kws) doc.Keywords = doc.Keywords.concat(kws.split('|'));

  doc.GeographicExtent = {
    NorthBound: (parseFloat(csv['north_bounding_latitude'])) || 'Missing',
    SouthBound: (parseFloat(csv['south_bounding_latitude'])) || 'Missing',
    EastBound: (parseFloat(csv['east_bounding_longitude'])) || 'Missing',
    WestBound: (parseFloat(csv['west_bounding_longitude'])) || 'Missing'
  };

  doc.Distributors = [];
  obj = {
    person: 'distributor_contact_person_name',
    position: 'distributor_contact_position_name',
    organization: 'distributor_contact_org_name',
    phone: 'distributor_contact_phone',
    email: 'distributor_contact_email',
    street: 'distributor_contact_street_address',
    city: 'distributor_contact_city',
    state: 'distributor_contact_state',
    zip: 'distributor_contact_zip'
  };

  setContacts(doc.Distributors, obj);

  doc.Links = [];
  links = csv['resource_url'];
  if (links) links = links.split('|');
  else links = [];

  for (i = 0; i < links.length; i++) {
    link = links[i];
    objLink = {
      URL: 'Missing',
      Name: 'Resource URL',
      Description: 'No Description Was Provided',
      Distributor: 'Missing'
    };
    urls = link.split(']');
    if (urls.length === 2) {
      objLink.URL = urls[1];
      objLink.Description = urls[0].replace(' [', '');
    } else {
      objLink.URL = link;
    }
    serviceType = guessServiceType(link);
    if (serviceType) {
      objLink.ServiceType = serviceType;
    }
    doc.Links.push(objLink);
  }

  doc.MetadataContact = {
    Name: csv['metadata_contact_person_name']
      || csv['metadata_contact_position_name']
      || 'Missing',
    OrganizationName: csv['metadata_contact_org_name'] || 'Missing',
    ContactInformation: {
      Phone: csv['metadata_contact_phone'] || 'Missing',
      email: csv['metadata_contact_email'] || 'Missing',
      Address: {
        Street: csv['metadata_contact_street_address'] || 'Missing',
        City: csv['metadata_contact_city'] || 'Missing',
        State: csv['metadata_contact_state'] || 'Missing',
        Zip: csv['metadata_contact_zip'] || 'Missing'
      }
    }
  };

  doc.HarvestInformation = {
    OriginalFileIdentifier: csv['resource_id'] || 'csv_metadata'
  };

  if (csv['metadata_uuid']) {
    doc._id = csv['metadata_uuid'];
  }

  doc.Published = false;

  emit(csv._id, doc);
}

function reduce (key, values) {
  return key;
}

exports.map = map;
exports.reduce = reduce;