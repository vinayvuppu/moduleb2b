import {
  getDiscountsWithDiscountCodes,
  getDiscountWithDiscountNameAndTotalDiscounted,
} from './order-discounts';

const discountCodes = [
  {
    discountCode: {
      id: 'discount-code-id-1',
      obj: {
        code: 'MY-CODE',
        cartDiscounts: [{ id: 'discount-id-1' }, { id: 'discount-id-2' }],
      },
    },
  },
  {
    discountCode: {
      id: 'discount-code-id-2',
      obj: {
        code: 'MY-OTHER-CODE',
        cartDiscounts: [{ id: 'discount-id-3' }],
      },
    },
  },
];

const lineItems = [
  {
    discountedPricePerQuantity: [
      {
        discountedPrice: {
          value: {
            fractionDigits: 2,
          },
          includedDiscounts: [
            {
              discountedAmount: {
                centAmount: 100,
                currencyCode: 'EUR',
              },
              discount: {
                id: 'discount-id',
              },
            },
            {
              discountedAmount: {
                centAmount: 200,
                currencyCode: 'EUR',
              },
              discount: {
                id: 'discount-id-2',
                obj: {
                  name: {
                    en: 'discount name',
                  },
                },
              },
            },
          ],
        },
        quantity: 2,
      },
    ],
  },
  {
    discountedPricePerQuantity: [
      {
        discountedPrice: {
          value: {
            fractionDigits: 2,
          },
          includedDiscounts: [
            {
              discountedAmount: {
                centAmount: 50,
                currencyCode: 'EUR',
              },
              discount: {
                id: 'discount-id',
              },
            },
          ],
        },
        quantity: 5,
      },
    ],
  },
];

describe('getDiscountsWithDiscountCodes', () => {
  describe('when no discount codes provided', () => {
    it('should return empty object when no discount codes', () => {
      expect(getDiscountsWithDiscountCodes([])).toEqual({});
    });
  });
  describe('when discount codes provided', () => {
    it('should return the discounts with the corresponding discount codes', () => {
      expect(getDiscountsWithDiscountCodes(discountCodes)).toEqual({
        'discount-id-1': ['MY-CODE'],
        'discount-id-2': ['MY-CODE'],
        'discount-id-3': ['MY-OTHER-CODE'],
      });
    });
  });
});

describe('getOrderDiscountsWithDiscountCodes', () => {
  it('should return the discount data', () => {
    expect(getDiscountWithDiscountNameAndTotalDiscounted(lineItems)).toEqual({
      'discount-id': {
        amount: { centAmount: 450, currencyCode: 'EUR', preciseAmount: 450 },
        name: 'discount-id',
      },
      'discount-id-2': {
        amount: { centAmount: 400, currencyCode: 'EUR', preciseAmount: 400 },
        name: { en: 'discount name' },
      },
    });
  });
});
