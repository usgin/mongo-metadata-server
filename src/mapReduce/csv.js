function map () {
  var doc
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

    persons = this[obj.person];
    if (persons) {
      persons = persons.split('|');
    } else {
      persons = this[obj.position];
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
    org = this[obj.organization] || 'Missing';
    for (i = 0; i < prop.length; i++) {
      a = prop[i];
      a.OrganizationName = org;
      coninfo = a.ContactInformation = {};
      coninfo.Phone = this[obj.phone] || 'Missing';
      coninfo.email = this[obj.email] || 'Missing';
      addr = coninfo.Address = {};
      addr.Street = this[obj.street] || 'Missing';
      addr.City = this[obj.city] || 'Missing';
      addr.State = this[obj.state] || 'Missing';
      addr.Zip = this[obj.zip] || 'Missing';
      results.push(addr.Zip);
    }
  }

  doc.Title = this['title'] || 'Missing';
  doc.Description = this['description'] || 'No Abstract Was Provided';
  doc.PublicationDate = this['publication_date'] || 'Missing';
  doc.ResourceId = this['resource_id'] || 'Missing';

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
  kws = this['keywords_thematic'];
  if (kws) doc.Keywords = doc.Keywords.concat(kws.split('|'));
  kws = this['keywords_spatial'];
  if (kws) doc.Keywords = doc.Keywords.concat(kws.split('|'));
  kws = this['keywords_temporal'];
  if (kws) doc.Keywords = doc.Keywords.concat(kws.split('|'));

  doc.GeographicExtent = {
    NorthBound: (parseFloat(this['north_bounding_latitude'])) || 'Missing',
    SouthBound: (parseFloat(this['south_bounding_latitude'])) || 'Missing',
    EastBound: (parseFloat(this['east_bounding_longitude'])) || 'Missing',
    WestBound: (parseFloat(this['west_bounding_longitude'])) || 'Missing'
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
  links = this['resource_url'];
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
    Name: this['metadata_contact_person_name']
      || this['metadata_contact_position_name']
      || 'Missing',
    OrganizationName: this['metadata_contact_org_name'] || 'Missing',
    ContactInformation: {
      Phone: this['metadata_contact_phone'] || 'Missing',
      email: this['metadata_contact_email'] || 'Missing',
      Address: {
        Street: this['metadata_contact_street_address'] || 'Missing',
        City: this['metadata_contact_city'] || 'Missing',
        State: this['metadata_contact_state'] || 'Missing',
        Zip: this['metadata_contact_zip'] || 'Missing'
      }
    }
  };

  doc.HarvestInformation = {
    OriginalFileIdentifier: this['resource_id'] || 'this_metadata'
  };

  doc.Published = false;

  emit(this._id, doc);
}

function reduce (key, values) {
  return key;
}

exports.map = map;
exports.reduce = reduce;