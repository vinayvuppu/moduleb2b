import {
  selectAllLineItems,
  selectTotalGrossPrice,
  selectDiscountCodes,
  selectDiscountsWithDiscountCodes,
  selectDiscounts,
  selectShippingDiscountedPrice,
  selectShippingPrice,
  selectShippingDiscounts,
} from './cart-selectors';

describe('selectAllLineItems', () => {
  it('should return all line items', () => {
    expect(
      selectAllLineItems({
        lineItems: [{ id: 'line-item-id' }],
      })
    ).toEqual([{ id: 'line-item-id' }]);
  });
});

describe('selectTotalGrossPrice', () => {
  let cartDraft;
  describe('when is taxed price', () => {
    beforeEach(() => {
      cartDraft = {
        taxedPrice: {
          totalGross: { centAmount: 1000, currencyCode: 'EUR' },
        },
      };
    });
    it('should return the total gross price', () => {
      expect(selectTotalGrossPrice(cartDraft)).toEqual({
        centAmount: 1000,
        currencyCode: 'EUR',
      });
    });
  });
  describe('when is not taxed price', () => {
    beforeEach(() => {
      cartDraft = { totalPrice: { centAmount: 1000, currencyCode: 'EUR' } };
    });
    it('should return the total price', () => {
      expect(selectTotalGrossPrice(cartDraft)).toEqual({
        centAmount: 1000,
        currencyCode: 'EUR',
      });
    });
  });
});

describe('selectDiscountCodes', () => {
  let cartDraft;
  beforeEach(() => {
    cartDraft = {
      discountCodes: [
        {
          discountCode: {
            id: 'discount-code-id',
          },
        },
        {
          discountCode: {
            id: 'discount-code-id-2',
          },
        },
      ],
    };
  });
  it('should return the discount code list', () => {
    expect(selectDiscountCodes(cartDraft)).toEqual([
      expect.objectContaining({ id: 'discount-code-id' }),
      expect.objectContaining({ id: 'discount-code-id-2' }),
    ]);
  });
});

describe('selectDiscountsWithDiscountCodes', () => {
  let cartDraft;
  beforeEach(() => {
    cartDraft = {
      discountCodes: [
        {
          discountCode: {
            id: 'discount-code-id',
            obj: {
              cartDiscounts: [{ id: 'discount-id-1' }],
              code: 'CODE',
            },
          },
        },
        {
          discountCode: {
            id: 'discount-code-id-2',
            obj: {
              cartDiscounts: [{ id: 'discount-id-2' }],
              code: 'OTHER-CODE',
            },
          },
        },
      ],
    };
  });
  it('should return the discount codes', () => {
    expect(selectDiscountsWithDiscountCodes(cartDraft)).toEqual({
      'discount-id-1': ['CODE'],
      'discount-id-2': ['OTHER-CODE'],
    });
  });
});

describe('selectDiscounts', () => {
  let lineItems;
  let discountsWithDiscountCodes;
  beforeEach(() => {
    lineItems = [
      {
        discountedPricePerQuantity: [
          {
            discountedPrice: {
              includedDiscounts: [
                {
                  discountedAmount: {
                    centAmount: 100,
                    currencyCode: 'EUR',
                  },
                  discount: {
                    id: 'discount-id-1',
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
              value: {
                fractionDigits: 2,
              },
            },
            quantity: 2,
          },
        ],
      },
    ];
    discountsWithDiscountCodes = {
      'discount-id-1': ['CODE'],
      'discount-id-2': ['OTHER-CODE'],
    };
  });
  it('should return the discount codes', () => {
    expect(
      selectDiscounts.resultFunc(lineItems, discountsWithDiscountCodes)
    ).toEqual([
      {
        amount: { centAmount: 200, currencyCode: 'EUR', preciseAmount: 200 },
        discountCodes: ['CODE'],
        id: 'discount-id-1',
        name: 'discount-id-1',
      },
      {
        amount: { centAmount: 400, currencyCode: 'EUR', preciseAmount: 400 },
        discountCodes: ['OTHER-CODE'],
        id: 'discount-id-2',
        name: { en: 'discount name' },
      },
    ]);
  });
});

describe('selectShippingDiscountedPrice', () => {
  let cartDraft;
  describe('when shippingInfo is not set in the cart', () => {
    beforeEach(() => {
      cartDraft = { id: 'id-1' };
    });
    it('should return undefined', () => {
      expect(selectShippingDiscountedPrice(cartDraft)).toBe(undefined);
    });
  });
  describe('when shippingInfo is set in the cart', () => {
    beforeEach(() => {
      cartDraft = {
        id: 'id-1',
        shippingInfo: { discountedPrice: { amount: 100 } },
      };
    });
    it('should return the discounted price info', () => {
      expect(selectShippingDiscountedPrice(cartDraft)).toEqual({ amount: 100 });
    });
  });
});

describe('selectShippingPrice', () => {
  let cartDraft;
  describe('when shippingInfo is not set in the cart', () => {
    beforeEach(() => {
      cartDraft = { id: 'id-1' };
    });
    it('should return undefined', () => {
      expect(selectShippingPrice(cartDraft)).toBe(undefined);
    });
  });
  describe('when shippingInfo is set in the cart', () => {
    describe('when no taxed price is set', () => {
      beforeEach(() => {
        cartDraft = {
          id: 'id-1',
          shippingInfo: { price: { centAmount: 100, currencyCode: 'EUR' } },
        };
      });
      it('should return the price', () => {
        expect(selectShippingPrice(cartDraft)).toEqual({
          centAmount: 100,
          currencyCode: 'EUR',
        });
      });
    });
    describe('when taxed price is set', () => {
      beforeEach(() => {
        cartDraft = {
          id: 'id-1',
          shippingInfo: {
            taxedPrice: {
              totalGross: { centAmount: 100, currencyCode: 'EUR' },
              totalNet: { centAmount: 90, currencyCode: 'EUR' },
            },
          },
        };
      });
      it('should return the total gross price', () => {
        expect(selectShippingPrice(cartDraft)).toEqual({
          centAmount: 100,
          currencyCode: 'EUR',
        });
      });
    });
  });
});

describe('selectShippingDiscounts', () => {
  let shippingDiscountedPrice;
  let discountsWithDiscountCodes;
  beforeEach(() => {
    discountsWithDiscountCodes = {
      'discount-id-1': ['CODE'],
      'discount-id-2': ['OTHER-CODE'],
    };
    shippingDiscountedPrice = {
      value: {
        fractionDigits: 2,
      },
      includedDiscounts: [
        {
          discount: {
            id: 'discount-id-1',
          },
          discountedAmount: {
            centAmount: 100,
            currencyCode: 'EUR',
          },
        },
        {
          discount: {
            id: 'discount-id-2',
            obj: {
              name: {
                en: 'discount name',
              },
            },
          },
          discountedAmount: {
            centAmount: 50,
            currencyCode: 'EUR',
          },
        },
      ],
    };
  });
  it('should return the discount codes', () => {
    expect(
      selectShippingDiscounts.resultFunc(
        discountsWithDiscountCodes,
        shippingDiscountedPrice
      )
    ).toEqual([
      {
        amount: { centAmount: 100, currencyCode: 'EUR', preciseAmount: 100 },
        discountCodes: ['CODE'],
        id: 'discount-id-1',
        name: 'discount-id-1',
      },
      {
        amount: { centAmount: 50, currencyCode: 'EUR', preciseAmount: 50 },
        discountCodes: ['OTHER-CODE'],
        id: 'discount-id-2',
        name: { en: 'discount name' },
      },
    ]);
  });
});
