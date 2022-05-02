const {
  baseTypes,
  channel,
  store,
  customerGroup,
  httpApi
} = require('commercetools-entities-schemas');
const {
  money,
  address,
  addressDraft,
  resourceIdentifier,
  dateTime
} = baseTypes;
const { searchParams, pagedQueryResult } = httpApi;

const errorResponse = {
  type: 'object',
  properties: {
    errors: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description:
              'unique identifier for this particular occurrence of the problem'
          },
          code: {
            type: 'string',
            enum: ['001', '002'],
            description: `> an internal specific error code:
             - 001: Request schema validation error
             - 002: Can not remove a Company with Employees, Carts or Orders
             
             `
          },
          status: {
            type: 'string',
            description: 'the HTTP status code applicable to this problem'
          },
          title: {
            type: 'string',
            description: 'a short, human-readable summary of the problem'
          },
          detail: {
            type: 'string',
            description: 'a human-readable explanation'
          },
          meta: {
            type: 'object',
            description:
              'a meta object containing non-standard meta-information',
            additionalProperties: true
          }
        },
        required: ['status']
      }
    }
  },
  required: ['errors']
};

const rolesEnum = ['b2b-company-admin', 'b2b-company-employee'];

const companyDraft = {
  type: 'object',
  description: 'Company draft object',
  properties: {
    name: { type: 'string', description: 'Company name' },
    logo: { type: 'string' },
    channels: {
      type: 'array',
      items: channel.channel
    },
    addresses: {
      type: 'array',
      description: 'The list of addresses where this company is located',
      items: addressDraft
    },
    budget: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          rol: {
            type: 'string',
            enum: rolesEnum
          },
          amount: money
        },
        required: ['rol', 'amount']
      }
    },
    requiredApprovalRoles: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          rol: {
            type: 'string',
            enum: rolesEnum,
            description:
              'Indicates which employee rol need approval of their created orders (Cannot be in approverRoles enum)'
          },
          amount: money
        }
      }
    },
    approverRoles: {
      type: 'array',
      items: {
        type: 'string',
        enum: rolesEnum,
        description:
          'Indicates which employee roles approval their created orders (Cannot be in requiredApporvalRoles enum)'
      }
    },
    rules: {
      type: 'array',
      items: {
        type: 'object',
        description: '',
        properties: {
          name: {
            type: 'string',
            description: 'Rule name'
          },
          value: {
            type: 'string',
            description: 'Rule value'
          },
          parsedValue: {
            type: 'string',
            description: 'Rule parsed value'
          }
        },
        required: ['value', 'parsedValue']
      },
      description: 'Custom rules for require approval in this company'
    },
    defaultShippingAddress: {
      type: 'string',
      description: 'Id for default shipping address available in addresses'
    },
    defaultBillingAddress: {
      type: 'string',
      description: 'Id for default billing address available in addresses'
    }
  },
  required: ['name']
};

const company = {
  ...companyDraft,
  description: 'Company entity',
  properties: {
    ...companyDraft.properties,
    id: { type: 'string' },
    addresses: {
      ...companyDraft.properties.addresses,
      items: address
    },
    customerGroup: customerGroup.customerGroup,
    store: store.store,
    createdAt: dateTime,
    lastModifiedAt: dateTime
  },
  required: [...companyDraft.required, 'id', 'createdAt', 'lastModifiedAt']
};

const companyPagedQueryResult = {
  ...pagedQueryResult,
  properties: {
    ...pagedQueryResult.properties,
    results: {
      ...pagedQueryResult.properties.results,
      items: {
        ...company,
        properties: {
          ...company.properties,
          customerGroup: resourceIdentifier,
          store: resourceIdentifier
        }
      }
    }
  }
};

const find = {
  title: 'Find Companies',
  description: 'Returns a page with the companies that matches the filter',
  querystring: {
    ...searchParams,
    properties: {
      ...searchParams.properties,
      all: {
        type: 'boolean',
        description: 'Set to true to get all companies'
      }
    }
  },
  response: {
    200: companyPagedQueryResult,
    '4xx': errorResponse,
    '5xx': errorResponse
  }
};

const get = {
  title: 'Get Company',
  description: 'Get company by id',
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' }
    },
    required: ['id']
  },
  response: {
    200: company,
    '4xx': errorResponse,
    '5xx': errorResponse
  }
};

const create = {
  title: 'Create Company',
  description: 'Create company entity',
  body: companyDraft,
  response: {
    201: company,
    '4xx': errorResponse,
    '5xx': errorResponse
  }
};

const update = {
  title: 'Update Company',
  description: 'Update company entity',
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' }
    },
    required: ['id']
  },
  body: companyDraft,
  response: {
    201: company,
    '4xx': errorResponse,
    '5xx': errorResponse
  }
};

const remove = {
  title: 'Remove Company',
  description: 'Remove entity company',
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' }
    },
    required: ['id']
  },
  response: {
    200: company,
    '4xx': errorResponse,
    '5xx': errorResponse
  }
};

const setDefaultBillingAddress = {
  title: 'Set default billing address',
  description: 'Set default billing address for a company',
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' }
    },
    required: ['id']
  },
  body: {
    type: 'object',
    properties: {
      addressId: {
        type: 'string'
      }
    },
    required: ['addressId']
  },
  response: {
    200: company,
    '4xx': errorResponse,
    '5xx': errorResponse
  }
};

const setDefaultShippingAddress = {
  title: 'Set default shipping address',
  description: 'Set default shipping address for a company',
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' }
    },
    required: ['id']
  },
  body: {
    type: 'object',
    properties: {
      addressId: {
        type: 'string'
      }
    },
    required: ['addressId']
  },
  response: {
    200: company,
    '4xx': errorResponse,
    '5xx': errorResponse
  }
};

module.exports = {
  find,
  get,
  create,
  update,
  remove,
  setDefaultBillingAddress,
  setDefaultShippingAddress
};
