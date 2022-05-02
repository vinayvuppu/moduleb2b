import { cleanDefaultShippingAndBilling } from './converter';

describe('converter', () => {
  describe('cleanDefaultShippingAndBilling', () => {
    it('should return the correct response if billing and address exist on addresses', () => {
      const company = {
        addresses: [{ id: 'test' }, { id: 'foo' }],
        defaultBillingAddress: 'test',
        defaultShippingAddress: 'foo',
      };
      expect(cleanDefaultShippingAndBilling(company)).toEqual(company);
    });
    it('should return the correct response if none of billing and address exist on addresses', () => {
      const company = {
        addresses: [],
        defaultBillingAddress: 'test',
        defaultShippingAddress: 'foo',
      };
      expect(cleanDefaultShippingAndBilling(company)).toEqual({});
    });
  });
});
