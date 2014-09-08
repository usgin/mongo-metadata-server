function map () {
  var doc
    , atom
    , author
    , theAuthors
    , i
    , j
    , thisPath
    , atomLink
    , atomLinks
    , ref
    , link
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

  atom = {
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
  };

  atom.setProperty("title.t", objGet(doc, "Title", "No title given"));
  atom.setProperty("id.t", doc._id);
  atom.setProperty("author", []);

  theAuthors = objGet(doc, 'Authors', []);
  for (i = 0; i < theAuthors.length; i++) {
    author = theAuthors[i];
    thisPath = "author." + i;
    atom.setProperty("" + thisPath + ".name.t", objGet(author, "Name", objGet(author, "OrganizationName", "")));
    atom.setProperty("" + thisPath + ".contactInformation.phone.t", objGet(author, "ContactInformation.Phone", ""));
    atom.setProperty("" + thisPath + ".contactInformation.email.t", objGet(author, "ContactInformation.Email", ""));
    atom.setProperty("" + thisPath + ".contactInformation.address.street.t", objGet(author, "ContactInformation.Address.Street", ""));
    atom.setProperty("" + thisPath + ".contactInformation.address.city.t", objGet(author, "ContactInformation.Address.City", ""));
    atom.setProperty("" + thisPath + ".contactInformation.address.state.t", objGet(author, "ContactInformation.Address.State", ""));
    atom.setProperty("" + thisPath + ".contactInformation.address.zip.t", objGet(author, "ContactInformation.Address.Zip", ""));
  }

  atomLinks = [
    {
      "href": "/metadata/record/" + doc._id + "/",
      "rel": "alternate"
    }
  ];

  ref = doc.Links || [];
  for (j = 0; j < ref.length; j++) {
    link = ref[j];
    atomLink = {
      "href": toXmlValidText(objGet(link, "URL", ""))
    };
    if (link.ServiceType) {
      atomLink.serviceType = link.ServiceType;
    }
    if (link.LayerId) {
      atomLink.layerId = link.LayerId;
    }
    atomLinks.push(atomLink);
  }

  atom.setProperty("link", atomLinks);
  atom.setProperty("updated.t", doc.ModifiedDate || "");
  atom.setProperty("summary.t", objGet(doc, "Description", ""));
  n = objGet(doc, "GeographicExtent.NorthBound", 89);
  s = objGet(doc, "GeographicExtent.SouthBound", -89);
  e = objGet(doc, "GeographicExtent.EastBound", 179);
  w = objGet(doc, "GeographicExtent.WestBound", -179);
  atom.setProperty("georss:box.t", [w, s, e, n].join(" "));

  emit(this._id, atom);
}

function reduce (data) {
  return data;
}