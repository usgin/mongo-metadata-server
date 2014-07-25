var _ = require('underscore');

var schemas = {
  link: {
    id: 'http://resources.usgin.org/uri-gin/usgin/schema/json-link/',
    type: 'object',
    properties: {
      URL: {
        type: 'string',
        format: 'uri',
        required: true
      },
      Name: {
        type: 'string',
        required: false
      },
      Description: {
        type: 'string',
        required: false
      },
      Distributor: {
        type: 'string',
        required: false
      }
    }
  },
  serviceLink: {
    id: 'http://resources.usgin.org/uri-gin/usgin/schema/json-service-link/',
    type: 'object',
    properties: {
      ServiceType: {
        type: 'string',
        required: true,
        enum: ['OGC:WMS', 'OGC:WFS', 'OGC:WCS', 'OPeNDAP', 'ESRI']
      },
      LayerId: {
        type: 'string',
        required: false
      }
    },
    extends: 'http://resources.usgin.org/uri-gin/usgin/schema/json-link/'
  },
  address: {
    id: 'http://resources.usgin.org/uri-gin/usgin/schema/json-address/',
    type: 'object',
    properties: {
      Street: {
        type: 'string',
        required: true
      },
      City: {
        type: 'string',
        required: true
      },
      State: {
        type: 'string',
        required: true
      },
      Zip: {
        type: 'string',
        required: true
      }
    }
  },
  contactInformation: {
    id: 'http://resources.usgin.org/uri-gin/usgin/schema/json-contact-information/',
    type: 'object',
    properties: {
      Phone: {
        type: 'string',
        format: 'phone',
        required: false
      },
      email: {
        type: 'string',
        format: 'email',
        required: true
      },
      Address: {
        required: false,
        $ref: 'http://resources.usgin.org/uri-gin/usgin/schema/json-address/'
      }
    }
  },
  contact: {
    id: 'http://resources.usgin.org/uri-gin/usgin/schema/json-metadata-contact/',
    type: 'object',
    properties: {
      Name: {
        type: 'string',
        required: false
      },
      OrganizationName: {
        type: 'string',
        required: false
      },
      ContactInformation: {
        required: true
        $ref: 'http://resources.usgin.org/uri-gin/usgin/schema/json-contact-information/'
      }
    }
  },
  geographicExtent: {
    id: 'http://resources.usgin.org/uri-gin/usgin/schema/json-geographic-extent/',
    type: 'object',
    properties: {
      NorthBound: {
        type: 'number',
        minimum: -90,
        maximum: 90,
        required: true
      },
      SouthBound: {
        type: 'number',
        minimum: -90,
        maximum: 90,
        required: true
      },
      EastBound: {
        type: 'number',
        minimum: -180,
        maximum: 180,
        required: true
      },
      WestBound: {
        type: 'number',
        minimum: -180,
        maximum: 180,
        required: true
      }
    }
  },
  harvestInfo: {
    id: 'http://resources.usgin.org/uri-gin/usgin/schema/json-harvest-information/',
    type: 'object',
    properties: {
      OriginalFileIdentifier: {
        type: 'string',
        required: false
      },
      OriginalFormat: {
        type: 'string',
        required: false
      },
      HarvestRecordId: {
        type: 'string',
        required: true
      },
      HarvestURL: {
        type: 'string',
        required: true
      },
      HarvestDate: {
        type: 'string',
        format: 'date-time',
        required: true
      }
    }
  },
  metadata: {
    id: 'http://resources.usgin.org/uri-gin/usgin/schema/json-metadata/',
    type: 'object',
    properties: {
      Title: {
        type: 'string',
        required: true
      },
      Description: {
        type: 'string',
        required: true,
        minLength: 50
      },
      PublicationDate: {
        type: 'string',
        format: 'date-time',
        required: true
      },
      ResourceId: {
        type: 'string',
        required: false
      },
      Authors: {
        type: 'array',
        required: true,
        minItems: 1,
        items: {
          $ref: 'http://resources.usgin.org/uri-gin/usgin/schema/json-metadata-contact/'
        }
      },
      Keywords: {
        type: 'array',
        required: true,
        minItems: 1,
        items: {
          type: 'string'
        }
      },
      GeographicExtent: {
        required: true,
        $ref: 'http://resources.usgin.org/uri-gin/usgin/schema/json-geographic-extent/'
      },
      Distributors: {
        type: 'array',
        required: true,
        minItems: 1,
        items: {
          $ref: 'http://resources.usgin.org/uri-gin/usgin/schema/json-metadata-contact/'
        }
      },
      Links: {
        type: 'array',
        required: true,
        minItems: 0,
        items: {
          $ref: 'http://resources.usgin.org/uri-gin/usgin/schema/json-link/'
        }
      },
      MetadataContact: {
        required: true,
        $ref: 'http://resources.usgin.org/uri-gin/usgin/schema/json-metadata-contact/'
      },
      HarvestInformation: {
        required: false,
        $ref: 'http://resources.usgin.org/uri-gin/usgin/schema/json-harvest-information/'
      },
      Collections: {
        type: 'array',
        required: true,
        minItems: 0,
        items: {
          type: 'string'
        }
      },
      Published: {
        type: 'boolean',
        required: true
      }
    }
  },
  collection: {
    id: 'http://resources.usgin.org/uri-gin/usgin/schema/json-metadata-collection/',
    type: 'object',
    properties: {
      Title: {
        type: 'string',
        required: true
      },
      Description: {
        type: 'string',
        required: false
      },
      ParentCollections: {
        type: 'array',
        required: false,
        items: {
          type: 'string'
        }
      }
    }
  }
};