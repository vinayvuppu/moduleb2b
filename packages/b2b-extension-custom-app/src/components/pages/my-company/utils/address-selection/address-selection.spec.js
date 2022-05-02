import {
  selectAddress,
  selectSameAddress,
  formatTitleAddress,
  selectDefaultAddress,
} from './address-selection';

const createTestCartDraft = cartDraft => ({
  shippingAddress: {
    id: 'address-1',
    firstName: 'Jon',
  },
  billingAddress: {
    id: 'address-2',
    firstName: 'Daenerys',
  },
  ...cartDraft,
});

const createTestCustomer = customer => ({
  addresses: [
    {
      id: 'address-1',
      firstName: 'Jon',
    },
    {
      id: 'address-2',
      firstName: 'Daenerys',
    },
    {
      id: 'address-3',
      firstName: 'Tyrion',
    },
  ],
  ...customer,
});

describe('selectAddress', () => {
  let result;
  describe('for shipping addresses', () => {
    beforeEach(() => {
      result = selectAddress('shipping', 'address-2', createTestCustomer());
    });
    it('should return selected shippingAddress', () => {
      expect(result).toEqual({
        shippingAddress: { id: 'address-2', firstName: 'Daenerys' },
      });
    });
  });
  describe('for billing addresses', () => {
    beforeEach(() => {
      result = selectAddress('billing', 'address-3', createTestCustomer());
    });
    it('should return selected billingAddress', () => {
      expect(result).toEqual({
        billingAddress: { id: 'address-3', firstName: 'Tyrion' },
      });
    });
  });
});

describe('selectSameAddress', () => {
  let result;
  describe('when the user checks same address option', () => {
    beforeEach(() => {
      result = selectSameAddress(
        true,
        createTestCartDraft(),
        createTestCustomer()
      );
    });
    it('should return same address for billing and shipping', () => {
      expect(result).toEqual({
        shippingAddress: { id: 'address-1', firstName: 'Jon' },
        billingAddress: { id: 'address-1', firstName: 'Jon' },
      });
    });
  });
  describe('when the user unchecks same address option', () => {
    describe('when customer has default billing address', () => {
      beforeEach(() => {
        result = selectSameAddress(
          false,
          createTestCartDraft(),
          createTestCustomer({ defaultBillingAddressId: 'address-3' })
        );
      });
      it('should return the default billing address as selected billing address', () => {
        expect(result).toEqual({
          shippingAddress: { id: 'address-1', firstName: 'Jon' },
          billingAddress: { id: 'address-3', firstName: 'Tyrion' },
        });
      });
    });
    describe('when customer has not default billing address', () => {
      beforeEach(() => {
        result = selectSameAddress(
          false,
          createTestCartDraft(),
          createTestCustomer()
        );
      });
      it('should return the first address as selected billing address', () => {
        expect(result).toEqual({
          shippingAddress: { id: 'address-1', firstName: 'Jon' },
          billingAddress: { id: 'address-1', firstName: 'Jon' },
        });
      });
    });
  });
});

describe('formatTitleAddress', () => {
  let result;
  beforeEach(() => {
    result = formatTitleAddress({
      firstName: 'Arya',
      lastName: 'Stark',
      streetName: 'Castle',
      city: 'Winterfell',
      region: 'North',
      postalCode: 46111,
      country: 'Westeros',
    });
  });
  it('should return formatted title', () => {
    expect(result).toBe('Castle, Winterfell, North, 46111, Westeros');
  });
});

describe('selectDefaultAddress', () => {
  let result;
  describe('when the user has defaultBillingAddressId and defaultShippingAddressId', () => {
    beforeEach(() => {
      result = selectDefaultAddress({
        defaultBillingAddress: 'ad1',
        defaultShippingAddress: 'ad2',
        addresses: [
          {
            id: 'ad1',
            firstName: 'Arya',
          },
          {
            id: 'ad2',
            firstName: 'Sansa',
          },
        ],
      });
    });
    it('should return correct addresses for billing and shipping', () => {
      expect(result).toEqual({
        billingAddress: { id: 'ad1', firstName: 'Arya' },
        shippingAddress: { id: 'ad2', firstName: 'Sansa' },
      });
    });
  });

  describe('when the user has no defaultBillingAddressId and defaultShippingAddressId', () => {
    beforeEach(() => {
      result = selectDefaultAddress({
        addresses: [
          {
            id: 'ad1',
            firstName: 'Arya',
          },
          {
            id: 'ad2',
            firstName: 'Sansa',
          },
        ],
      });
    });
    it('should return the first address for shipping and billing', () => {
      expect(result).toEqual({
        billingAddress: { id: 'ad1', firstName: 'Arya' },
        shippingAddress: { id: 'ad1', firstName: 'Arya' },
      });
    });
  });

  describe('when the user has no addresses', () => {
    beforeEach(() => {
      result = selectDefaultAddress({
        addresses: [],
      });
    });
    it('should return empty addresses for shipping and billing', () => {
      expect(result).toEqual({
        billingAddress: {},
        shippingAddress: {},
      });
    });
  });
});
