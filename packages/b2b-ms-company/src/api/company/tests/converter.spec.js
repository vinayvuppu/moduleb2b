const {
  addressesDraftToAddresses,
  containerToCompany
} = require('../converter');
jest.mock('uuid/v1', () => () => 'addressId');

describe('converter', () => {
  describe('addressesDraftToAddresses', () => {
    it('should convert correctly when have id', () => {
      const address = { title: 'address' };
      expect(addressesDraftToAddresses([address])).toEqual([
        {
          ...address,
          id: 'addressId'
        }
      ]);
    });
    it("should convert correctly when doesn't have id", () => {
      const addresses = [{ title: 'address', id: 'address' }];
      expect(addressesDraftToAddresses(addresses)).toEqual(addresses);
    });
    it('should return undefined when send undefined', () => {
      expect(addressesDraftToAddresses()).toBeUndefined();
    });
  });
  describe('containerToCompany', () => {
    it('should convert with all values', () => {
      const container = {
        key: 'companyId',
        value: {
          name: 'name',
          addresses: [{ title: 'address', id: 'address' }],
          logo: 'logo',
          budget: [
            {
              rol: 'b2b-company-admin',
              amount: { currency: 'USD', centAmount: 201 }
            }
          ],
          approverRoles: [],
          requiredApprovalRoles: ['b2b-company-admin'],
          defaultShippingAddress: 'address',
          defaultBillingAddress: 'address',
          channels: [{ id: 'channel' }],
          store: 'store',
          customerGroup: 'customerGroup',
          rules: [
            {
              name: 'rule1',
              value: 'value1',
              parsedValue: 'value-parsed'
            }
          ]
        },
        createdAt: 'createdAt',
        lastModifiedAt: 'lastModifiedAt'
      };
      const company = {
        id: container.key,
        createdAt: container.createdAt,
        lastModifiedAt: container.lastModifiedAt,
        ...container.value
      };
      expect(containerToCompany(container)).toEqual(company);
    });
    it('should convert with only required values', () => {
      const container = {
        key: 'companyId',
        value: {
          name: 'name',
          store: 'store',
          customerGroup: 'customerGroup',
          addresses: [],
          channels: [],
          budget: [],
          approverRoles: [],
          requiredApprovalRoles: []
        },
        createdAt: 'createdAt',
        lastModifiedAt: 'lastModifiedAt'
      };
      const company = {
        id: container.key,
        createdAt: container.createdAt,
        lastModifiedAt: container.lastModifiedAt,
        rules: [],
        ...container.value
      };
      expect(containerToCompany(container)).toEqual(company);
    });
  });
});
