const createSetAmountExpentAction = ({ custom }) => ({
  action: 'setCustomField',
  name: 'amountExpent',
  value: {
    currencyCode: custom.fields.amountExpent
      ? custom.fields.amountExpent.currencyCode
      : 'USD',
    centAmount: 0
  }
});

const getCustomField = ({ employee, fieldName, defaultValue }) => {
  if (employee && employee.custom && employee.custom.fields) {
    const value = employee.custom.fields[fieldName];
    return value ? value : defaultValue;
  }
  return defaultValue;
};

const convertRestCustomerToEmployee = customer => {
  const {
    customerNumber: employeeNumber,
    customerGroup,
    addresses,
    defaultShippingAddressId,
    defaultBillingAddressId,
    shippingAddressIds,
    billingAddressIds,
    ...rest
  } = customer;

  return {
    ...rest,
    customerGroup: { ...customerGroup.obj },
    employeeNumber,
    addresses,
    defaultShippingAddressId,
    defaultShippingAddress: addresses.find(
      address => address.id === defaultShippingAddressId
    ),
    defaultBillingAddressId,
    defaultBillingAddress: addresses.find(
      address => address.id === defaultBillingAddressId
    ),
    shippingAddressIds,
    shippingAddresses: addresses.filter(address =>
      shippingAddressIds.find(sAddresses => address.id === sAddresses)
    ),
    billingAddressIds,
    billingAddresses: addresses.filter(address =>
      billingAddressIds.find(sAddresses => address.id === sAddresses)
    )
  };
};
const convertGraphqlActionToRestAction = graphqlAction => {
  const key = Object.keys(graphqlAction)[0];
  const value = graphqlAction[key];
  let action = {};
  switch (key) {
    case 'setFirstName':
      action = {
        action: key,
        firstName: value.firstName
      };
      break;
    case 'setLastName':
      action = {
        action: key,
        lastName: value.lastName
      };
      break;
    case 'setRoles':
      action = {
        action: 'setCustomField',
        name: 'roles',
        value: value.roles
      };
      break;
    case 'addAddress': {
      action = {
        action: 'addAddress',
        address: value.address
      };
      break;
    }
    case 'removeStore':
    case 'addStore':
      action = {
        action: key,
        store: {
          typeId: 'store',
          id: value.store.id,
          key: value.store.key
        }
      };
      break;
    case 'setCustomerGroup': {
      action = {
        action: 'setCustomerGroup',
        customerGroup: {
          typeId: 'customer-group',
          id: value.customerGroup.id,
          key: value.customerGroup.key
        }
      };
      break;
    }
    case 'changeAddress': {
      action = {
        action: 'changeAddress',
        addressId: value.addressId,
        address: value.address
      };
      break;
    }
    case 'changeEmail': {
      action = {
        action: 'changeEmail',
        email: value.email
      };
      break;
    }
    case 'addBillingAddressId':
    case 'addShippingAddressId':
    case 'removeAddress':
    case 'setDefaultBillingAddress':
    case 'setDefaultShippingAddress':
    case 'removeBillingAddressId':
    case 'removeShippingAddressId': {
      action = {
        action: key,
        addressId: value.addressId
      };
      break;
    }
    case 'setKey': {
      action = {
        action: 'setKey',
        key: value.key
      };
      break;
    }
    case 'setLocale': {
      action = {
        action: 'setLocale',
        locale: value.locale
      };
      break;
    }
    case 'setDateOfBirth': {
      action = {
        action: key,
        dateOfBirth: value.dateOfBirth
      };
      break;
    }
    case 'setExternalId': {
      action = {
        action: key,
        externalId: value.externalId
      };
      break;
    }
    case 'setSalutation': {
      action = {
        action: key,
        salutation: value.salutation
      };
      break;
    }
    case 'setMiddleName': {
      action = {
        action: key,
        middleName: value.middleName
      };
      break;
    }
    case 'setTitle': {
      action = {
        action: key,
        title: value.title
      };
      break;
    }
    case 'setVatId': {
      action = {
        action: key,
        vatId: value.vatId
      };
      break;
    }
    case 'setEmployeeNumber': {
      action = {
        action: 'setCustomerNumber',
        customerNumber: value.employeeNumber
      };
      break;
    }
  }
  return action;
};

const convertEmployeeDraftToCustomerDraft = graphqlDraft => {
  let draft;

  const { employeeNumber: customerNumber, roles, ...rest } = graphqlDraft;

  draft = {
    ...rest,
    customerNumber,
    custom: {
      type: {
        typeId: 'type',
        key: 'employee-type'
      },
      fields: {
        roles
      }
    }
  };

  return draft;
};

module.exports = {
  convertGraphqlActionToRestAction,
  convertRestCustomerToEmployee,
  convertEmployeeDraftToCustomerDraft,
  createSetAmountExpentAction,
  getCustomField
};
