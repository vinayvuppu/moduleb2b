import {
  validateLineItems,
  validateShippingMethod,
  validateCustomer,
} from './validate-order';

const createCartDraft = custom => ({
  shippingInfo: {
    shippingMethodName: 'test',
  },
  lineItems: [
    {
      id: '1',
    },
  ],
  customLineItems: [],
  ...custom,
});

describe('validateLineItems', () => {
  describe('when the cart draft does not have items', () => {
    it('should return an error', () => {
      expect(validateLineItems(createCartDraft({ lineItems: [] }))).toEqual({
        body: {
          errors: [
            {
              code: 'RequiredField',
              field: 'lineItems',
            },
          ],
        },
      });
    });
  });
  describe('when the cart draft have line items and no custom line items', () => {
    it('should return `undefined`', () => {
      expect(validateLineItems(createCartDraft())).toBeUndefined();
    });
  });
  describe('when the cart draft have custom line items and no line items', () => {
    it('should return `undefined`', () => {
      expect(
        validateLineItems(
          createCartDraft({
            customLineItems: [{ id: 'custom-line-item' }],
            lineItems: [],
          })
        )
      ).toBeUndefined();
    });
  });
});

describe('validateShippingMethod', () => {
  describe('when the cart draft does not have shipping information', () => {
    it('should return an error', () => {
      expect(
        validateShippingMethod(createCartDraft({ shippingInfo: undefined }))
      ).toEqual({
        body: {
          errors: [
            {
              code: 'RequiredField',
              field: 'shippingInfo',
            },
          ],
        },
      });
    });
  });
  describe('when the cart draft have shipping information', () => {
    it('should return `undefined`', () => {
      expect(validateShippingMethod(createCartDraft())).toBeUndefined();
    });
  });
});

describe('validateCustomer', () => {
  describe('when the cart draft does not have customer information', () => {
    it('should return an error', () => {
      expect(
        validateCustomer(createCartDraft({ shippingInfo: undefined }))
      ).toEqual({
        body: {
          errors: [
            {
              code: 'RequiredField',
              field: 'customer',
            },
          ],
        },
      });
    });
  });
  describe('when the cart draft has customer information', () => {
    it('should return `undefined`', () => {
      expect(
        validateCustomer(
          createCartDraft({
            customerId: 'some-id',
            billingAddress: { id: '1' },
            shippingAddress: { id: '2' },
          })
        )
      ).toBeUndefined();
    });
  });
});
