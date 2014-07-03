var mongoose = require('mongoose');

var recordsSchema = new mongoose.Schema({
  link: {
    URL: {
      type: String,
      required: true
    },
    Name: {
      type: String,
      required: false
    },
    Description: {
      type: String,
      required: false
    },
    Distributor: {
      type: String,
      required: false
    }
  },
  serviceLink: {
    ServiceType: {
      type: String,
      required: true,
      enum: ['OGC:WMS', 'OGC:WFS', 'OGC:WCS', 'OPeNDAP', 'ESRI']
    },
    LayerId: {
      type: String,
      required: false
    }
  },
  address: {
    Street: {
      type: String,
      required: true
    },
    City: {
      type: String,
      required: true
    },
    State: {
      type: String,
      required: true
    },
    Zip: {
      type: String,
      required: true
    }
  },
  contactInformation: {
    Phone: {
      type: String,
      required: false
    },
    Email: {
      type: String,
      required: true
    },
    Address: {
      type: String,
      required: false
    }
  },
  contact: {
    Name: {
      type: String,
      required: false
    },
    OrganizationName: {
      type: String,
      required: false
    },
    ContactInformation: {
      type: String,
      required: true
    }
  },
  geographicExtent: {
    NorthBound: {
      type: Number,
      minimum: -90,
      maximum: 90,
      required: true
    },
    SouthBound: {
      type: Number,
      minimum: -90,
      maximum: 90,
      required: true
    },
    EastBound: {
      type: Number,
      minimum: -180,
      maximum: 180,
      required: true
    },
    WestBound: {
      type: Number,
      minimum: -180,
      maximum: 180,
      required: true
    }
  },
  harvestInfo: {
    OriginalFileIdentifier: {
      type: String,
      required: false
    },
    OriginalFormat: {
      type: String,
      required: false
    },
    HarvestRecordId: {
      type: String,
      required: true
    },
    HarvestURL: {
      type: String,
      required: true
    },
    HarvestDate: {
      type: String,
      required: true
    }
  },
  metadata: {
    Ti
  },
  collection: {}
});

var Records = mongoose.model('Records', recordsSchema);

exports.Records = Records;
