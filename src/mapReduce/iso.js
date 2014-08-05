function map () {
  var doc
    , serviceTypes
    , debug
    , capServiceTypes;

  if (!debug) debug = false;

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

  var doc = {
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

  function buildContact (responsibleParty) {
    var contact
      , role;

    role = objGet(responsibleParty, "gmd:CI_ResponsibleParty.gmd:role.gmd:CI_RoleCode.codeListValue", "");
    contact = {
      Name: objGet(responsibleParty, "gmd:CI_ResponsibleParty.gmd:individualName.gco:CharacterString.$t", "No Name Was Given"),
      ContactInformation: {
        Phone: objGet(responsibleParty, "gmd:CI_ResponsibleParty.gmd:contactInfo.gmd:CI_Contact.gmd:phone.gmd:CI_Telephone.gmd:voice.gco:CharacterString.$t", "No Phone Number Was Given"),
        email: objGet(responsibleParty, "gmd:CI_ResponsibleParty.gmd:contactInfo.gmd:CI_Contact.gmd:address.gmd:CI_Address.gmd:electronicMailAddress.gco:CharacterString.$t", "No email Was Given"),
        Address: {
          Street: objGet(responsibleParty, "gmd:CI_ResponsibleParty.gmd:contactInfo.gmd:CI_Contact.gmd:address.gmd:CI_Address.gmd:deliveryPoint.gco:CharacterString.$t", "No Street Address Was Given"),
          City: objGet(responsibleParty, "gmd:CI_ResponsibleParty.gmd:contactInfo.gmd:CI_Contact.gmd:address.gmd:CI_Address.gmd:city.gco:CharacterString.$t", "No City Was Given"),
          State: objGet(responsibleParty, "gmd:CI_ResponsibleParty.gmd:contactInfo.gmd:CI_Contact.gmd:address.gmd:CI_Address.gmd:administrativeArea.gco:CharacterString.$t", "No State Was Given"),
          Zip: objGet(responsibleParty, "gmd:CI_ResponsibleParty.gmd:contactInfo.gmd:CI_Contact.gmd:address.gmd:CI_Address.gmd:postalCode.gco:CharacterString.$t", "No Zip Was Given")
        }
      }
    };

    if (['Missing', 'missing', 'No Name Was given'].indexOf(contact.Name) > -1) {
      contact["OrganizationName"] = objGet(responsibleParty, "gmd:CI_ResponsibleParty.gmd:organisationName.gco:CharacterString.$t", "No Organization Name Was Given");
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

    url = objGet(onlineResource, "gmd:linkage.gmd:URL.$t", "No URL Was Given");
    protocol = objGet(onlineResource, "gmd:protocol.gco:CharacterString.$t", "No Protocol Was Given");
    protocol = protocol.toUpperCase();

    if (capServiceTypes.indexOf(protocol) >= 0) {
      serviceType = protocol;
    } else {
      guess = guessServiceType(url);
      if (guess) serviceType = guess;
    }

    name = null;
    if (responsibleParty) {
      name = objGet(responsibleParty, "gmd:CI_ResponsibleParty.gmd:individualName.gco:CharacterString.$t", "No Name Was Given");
      if (['Missing', 'missing', 'No Name Was Given'].indexOf(name) > -1) {
        name = objGet(responsibleParty, "gmd:CI_ResponsibleParty.gmd:organisationName.gco:CharacterString.$t", "No Organization Name Was Given");
      }
    }

    link = {
      URL: url,
      Description: objGet(onlineResource, "gmd:description.gco:CharacterString.$t", "No Description Was Given")
    };

    if (serviceType) {
      link.serviceType = serviceType;
    }

    if (name) {
      link.Distributor = name;
    }

    return link;
  }

}

function reduce () {

}

exports.map = map;
exports.reduce = reduce;