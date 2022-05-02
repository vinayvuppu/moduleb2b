const {
  convertGraphqlActionToRestAction,
  convertRestCustomerToEmployee,
  convertEmployeeDraftToCustomerDraft,
  getCustomField,
  createSetAmountExpentAction
} = require('../utils');

describe('convertRestCustomerToEmployee', () => {
  it('should return the employee', () => {
    expect(
      convertRestCustomerToEmployee({
        customerNumber: 'customer-number-1',
        customerGroup: { id: 'cg1', obj: { id: 'cg1', key: 'key1' } },
        id: 'customer-id',
        addresses: [{ id: 'ad1' }, { id: 'ad2' }],
        shippingAddressIds: ['ad1'],
        billingAddressIds: ['ad2'],
        defaultShippingAddressId: 'ad1',
        defaultBillingAddressId: 'ad2'
      })
    ).toEqual({
      addresses: [
        {
          id: 'ad1'
        },
        {
          id: 'ad2'
        }
      ],
      billingAddressIds: ['ad2'],
      billingAddresses: [
        {
          id: 'ad2'
        }
      ],
      customerGroup: { id: 'cg1', key: 'key1' },
      defaultBillingAddress: {
        id: 'ad2'
      },
      defaultBillingAddressId: 'ad2',
      defaultShippingAddress: {
        id: 'ad1'
      },
      defaultShippingAddressId: 'ad1',
      employeeNumber: 'customer-number-1',
      id: 'customer-id',
      shippingAddressIds: ['ad1'],
      shippingAddresses: [
        {
          id: 'ad1'
        }
      ]
    });
  });
});

describe('convertGraphqlActionToRestAction', () => {
  let graphqlAction;
  let response;
  let expectedResponse;

  describe('setFirstName', () => {
    beforeEach(() => {
      graphqlAction = { setFirstName: { firstName: 'first-name' } };
      response = convertGraphqlActionToRestAction(graphqlAction);
      expectedResponse = { action: 'setFirstName', firstName: 'first-name' };
    });

    it('should return the rest action', () => {
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('setLastName', () => {
    beforeEach(() => {
      graphqlAction = { setLastName: { lastName: 'last-name' } };
      response = convertGraphqlActionToRestAction(graphqlAction);
      expectedResponse = { action: 'setLastName', lastName: 'last-name' };
    });

    it('should return the rest action', () => {
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('setRoles', () => {
    beforeEach(() => {
      graphqlAction = { setRoles: { roles: ['rol1'] } };
      response = convertGraphqlActionToRestAction(graphqlAction);
      expectedResponse = {
        action: 'setCustomField',
        name: 'roles',
        value: ['rol1']
      };
    });

    it('should return the rest action', () => {
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('addAddress', () => {
    beforeEach(() => {
      graphqlAction = { addAddress: { address: { country: 'US' } } };
      response = convertGraphqlActionToRestAction(graphqlAction);
      expectedResponse = { action: 'addAddress', address: { country: 'US' } };
    });

    it('should return the rest action', () => {
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('changeAddress', () => {
    beforeEach(() => {
      graphqlAction = {
        changeAddress: { address: { country: 'US' }, addressId: 'ad1' }
      };
      response = convertGraphqlActionToRestAction(graphqlAction);
      expectedResponse = {
        action: 'changeAddress',
        addressId: 'ad1',
        address: { country: 'US' }
      };
    });

    it('should return the rest action', () => {
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('addStore', () => {
    beforeEach(() => {
      graphqlAction = { addStore: { store: { id: 'store-id' } } };
      response = convertGraphqlActionToRestAction(graphqlAction);
      expectedResponse = {
        action: 'addStore',
        store: { typeId: 'store', id: 'store-id' }
      };
    });

    it('should return the rest action', () => {
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('removeStore', () => {
    beforeEach(() => {
      graphqlAction = { removeStore: { store: { id: 'store-id' } } };
      response = convertGraphqlActionToRestAction(graphqlAction);
      expectedResponse = {
        action: 'removeStore',
        store: { typeId: 'store', id: 'store-id' }
      };
    });

    it('should return the rest action', () => {
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('setCustomerGroup', () => {
    beforeEach(() => {
      graphqlAction = { setCustomerGroup: { customerGroup: { id: 'cg-id' } } };
      response = convertGraphqlActionToRestAction(graphqlAction);
      expectedResponse = {
        action: 'setCustomerGroup',
        customerGroup: { typeId: 'customer-group', id: 'cg-id' }
      };
    });

    it('should return the rest action', () => {
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('changeEmail', () => {
    beforeEach(() => {
      graphqlAction = { changeEmail: { email: 'foo@bar.com' } };
      response = convertGraphqlActionToRestAction(graphqlAction);
      expectedResponse = { action: 'changeEmail', email: 'foo@bar.com' };
    });

    it('should return the rest action', () => {
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('addBillingAddressId', () => {
    beforeEach(() => {
      graphqlAction = { addBillingAddressId: { addressId: 'add-id1' } };
      response = convertGraphqlActionToRestAction(graphqlAction);
      expectedResponse = {
        action: 'addBillingAddressId',
        addressId: 'add-id1'
      };
    });

    it('should return the rest action', () => {
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('addShippingAddressId', () => {
    beforeEach(() => {
      graphqlAction = { addShippingAddressId: { addressId: 'add-id1' } };
      response = convertGraphqlActionToRestAction(graphqlAction);
      expectedResponse = {
        action: 'addShippingAddressId',
        addressId: 'add-id1'
      };
    });

    it('should return the rest action', () => {
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('removeAddress', () => {
    beforeEach(() => {
      graphqlAction = { removeAddress: { addressId: 'add-id1' } };
      response = convertGraphqlActionToRestAction(graphqlAction);
      expectedResponse = {
        action: 'removeAddress',
        addressId: 'add-id1'
      };
    });

    it('should return the rest action', () => {
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('setDefaultBillingAddress', () => {
    beforeEach(() => {
      graphqlAction = { setDefaultBillingAddress: { addressId: 'add-id1' } };
      response = convertGraphqlActionToRestAction(graphqlAction);
      expectedResponse = {
        action: 'setDefaultBillingAddress',
        addressId: 'add-id1'
      };
    });

    it('should return the rest action', () => {
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('setDefaultShippingAddress', () => {
    beforeEach(() => {
      graphqlAction = { setDefaultShippingAddress: { addressId: 'add-id1' } };
      response = convertGraphqlActionToRestAction(graphqlAction);
      expectedResponse = {
        action: 'setDefaultShippingAddress',
        addressId: 'add-id1'
      };
    });

    it('should return the rest action', () => {
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('removeBillingAddressId', () => {
    beforeEach(() => {
      graphqlAction = { removeBillingAddressId: { addressId: 'add-id1' } };
      response = convertGraphqlActionToRestAction(graphqlAction);
      expectedResponse = {
        action: 'removeBillingAddressId',
        addressId: 'add-id1'
      };
    });

    it('should return the rest action', () => {
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('removeShippingAddressId', () => {
    beforeEach(() => {
      graphqlAction = { removeShippingAddressId: { addressId: 'add-id1' } };
      response = convertGraphqlActionToRestAction(graphqlAction);
      expectedResponse = {
        action: 'removeShippingAddressId',
        addressId: 'add-id1'
      };
    });

    it('should return the rest action', () => {
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('setKey', () => {
    beforeEach(() => {
      graphqlAction = { setKey: { key: 'key-1' } };
      response = convertGraphqlActionToRestAction(graphqlAction);
      expectedResponse = {
        action: 'setKey',
        key: 'key-1'
      };
    });

    it('should return the rest action', () => {
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('setLocale', () => {
    beforeEach(() => {
      graphqlAction = { setLocale: { locale: 'locale-1' } };
      response = convertGraphqlActionToRestAction(graphqlAction);
      expectedResponse = {
        action: 'setLocale',
        locale: 'locale-1'
      };
    });

    it('should return the rest action', () => {
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('setDateOfBirth', () => {
    beforeEach(() => {
      graphqlAction = { setDateOfBirth: { dateOfBirth: '01-01-1980' } };
      response = convertGraphqlActionToRestAction(graphqlAction);
      expectedResponse = {
        action: 'setDateOfBirth',
        dateOfBirth: '01-01-1980'
      };
    });

    it('should return the rest action', () => {
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('setExternalId', () => {
    beforeEach(() => {
      graphqlAction = { setExternalId: { externalId: 'external-id' } };
      response = convertGraphqlActionToRestAction(graphqlAction);
      expectedResponse = {
        action: 'setExternalId',
        externalId: 'external-id'
      };
    });

    it('should return the rest action', () => {
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('setSalutation', () => {
    beforeEach(() => {
      graphqlAction = { setSalutation: { salutation: 'mr' } };
      response = convertGraphqlActionToRestAction(graphqlAction);
      expectedResponse = {
        action: 'setSalutation',
        salutation: 'mr'
      };
    });

    it('should return the rest action', () => {
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('setMiddleName', () => {
    beforeEach(() => {
      graphqlAction = { setMiddleName: { middleName: 'middle' } };
      response = convertGraphqlActionToRestAction(graphqlAction);
      expectedResponse = {
        action: 'setMiddleName',
        middleName: 'middle'
      };
    });

    it('should return the rest action', () => {
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('setTitle', () => {
    beforeEach(() => {
      graphqlAction = { setTitle: { title: 'title-1' } };
      response = convertGraphqlActionToRestAction(graphqlAction);
      expectedResponse = {
        action: 'setTitle',
        title: 'title-1'
      };
    });

    it('should return the rest action', () => {
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('setVatId', () => {
    beforeEach(() => {
      graphqlAction = { setVatId: { vatId: 'vatId-1' } };
      response = convertGraphqlActionToRestAction(graphqlAction);
      expectedResponse = {
        action: 'setVatId',
        vatId: 'vatId-1'
      };
    });

    it('should return the rest action', () => {
      expect(response).toEqual(expectedResponse);
    });
  });
  describe('setEmployeeNumber', () => {
    beforeEach(() => {
      graphqlAction = { setEmployeeNumber: { employeeNumber: '123' } };
      response = convertGraphqlActionToRestAction(graphqlAction);
      expectedResponse = {
        action: 'setCustomerNumber',
        customerNumber: '123'
      };
    });

    it('should return the rest action', () => {
      expect(response).toEqual(expectedResponse);
    });
  });
});

describe('convertEmployeeDraftToCustomerDraft', () => {
  it('should return the rest draft', () => {
    expect(
      convertEmployeeDraftToCustomerDraft({
        employeeNumber: '123',
        roles: ['rol1'],
        email: 'foo@bar.com'
      })
    ).toEqual({
      custom: {
        fields: { roles: ['rol1'] },
        type: { key: 'employee-type', typeId: 'type' }
      },
      customerNumber: '123',
      email: 'foo@bar.com'
    });
  });
});

describe('getCustomField', () => {
  describe('when employee does not exits', () => {
    it('should return default value', () => {
      expect(
        getCustomField({
          employee: undefined,
          fieldName: 'fieldOne',
          defaultValue: 'default'
        })
      ).toEqual('default');
    });
  });
  describe('when employee exits', () => {
    describe('when employee has not custom fields', () => {
      it('should return default value', () => {
        expect(
          getCustomField({
            employee: { id: 'employee-1' },
            fieldName: 'fieldOne',
            defaultValue: 'default'
          })
        ).toEqual('default');
      });
    });
    describe('when employee has custom fields', () => {
      let employee;
      let defaultValue = 'default';
      beforeEach(() => {
        employee = {
          id: 'employee-1',
          custom: { fields: { fieldOne: 'valueOne' } }
        };
      });
      describe('when employee has not the required custom field', () => {
        it('should return default value', () => {
          expect(
            getCustomField({
              employee,
              fieldName: 'fieldTwo',
              defaultValue
            })
          ).toEqual('default');
        });
      });
      describe('when employee has the required custom field', () => {
        it('should return field value', () => {
          expect(
            getCustomField({
              employee,
              fieldName: 'fieldOne',
              defaultValue
            })
          ).toEqual('valueOne');
        });
      });
    });
  });
});

describe('createSetAmountExpentAction', () => {
  describe('when the field does not exists', () => {
    it('should return default currencyCode', () => {
      expect(createSetAmountExpentAction({ custom: { fields: {} } })).toEqual({
        action: 'setCustomField',
        name: 'amountExpent',
        value: {
          currencyCode: 'USD',
          centAmount: 0
        }
      });
    });
  });
  describe('when the field exists', () => {
    it('should return field currencyCode', () => {
      expect(
        createSetAmountExpentAction({
          custom: { fields: { amountExpent: { currencyCode: 'EUR' } } }
        })
      ).toEqual({
        action: 'setCustomField',
        name: 'amountExpent',
        value: {
          currencyCode: 'EUR',
          centAmount: 0
        }
      });
    });
  });
});
