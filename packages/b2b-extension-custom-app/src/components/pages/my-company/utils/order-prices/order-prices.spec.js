import {
  getShippingPrices,
  getShippingDiscounts,
  getNetPriceWithoutShipping,
  getAllNonShippingTaxes,
  getTotalProductDiscount,
  getTotalCartDiscount,
  getTotalDiscountMoney,
  getTotalNetWithoutDiscounts,
  getTotalShippingDiscounts,
} from './order-prices';

const currencyCode = 'EUR';

const createShippingDiscount = (centAmount = 100) => ({
  discountedPrice: {
    value: { currencyCode, centAmount },
    includedDiscounts: [
      { discountedAmount: { currencyCode: 'EUR', centAmount: 50 } },
      { discountedAmount: { currencyCode: 'EUR', centAmount: 50 } },
    ],
  },
});

const createShippingTaxes = (netAmount = 100, netGross = 175) => ({
  taxedPrice: {
    totalNet: { currencyCode, centAmount: netAmount },
    totalGross: { currencyCode, centAmount: netGross },
  },
  taxRate: { amount: 0.75, name: 'some portion 1' },
});

const createOrderTaxes = (netAmount = 1000, grossAmount = 1325) => ({
  taxedPrice: {
    totalNet: { currencyCode, centAmount: netAmount },
    totalGross: { currencyCode, centAmount: grossAmount },
    taxPortions: [
      {
        rate: 0.75,
        amount: { currencyCode, centAmount: 75 },
        name: 'some portion 1',
      },
      {
        rate: 0.25,
        amount: { currencyCode, centAmount: 250 },
        name: 'some portion 2',
      },
    ],
  },
});

const createShippingInfo = props => ({
  price: { currencyCode, centAmount: 100 },
  shippingRate: {
    price: { currencyCode, centAmount: 100 },
  },
  ...props,
});

const createOrder = props => ({
  totalPrice: { currencyCode, centAmount: 1000 },
  ...props,
});

const orderWithDiscounts = {
  lineItems: [
    {
      price: {
        value: {
          currencyCode: 'EUR',
          centAmount: 3400,
        },
        discounted: {
          value: {
            currencyCode: 'EUR',
            centAmount: 2900,
          },
        },
      },
      quantity: 1,
      discountedPricePerQuantity: [
        {
          quantity: 1,
          discountedPrice: {
            value: {
              currencyCode: 'EUR',
              centAmount: 8640,
              fractionDigits: 2,
            },
            includedDiscounts: [
              {
                discountedAmount: {
                  currencyCode: 'EUR',
                  centAmount: 1000,
                },
              },
              {
                discountedAmount: {
                  currencyCode: 'EUR',
                  centAmount: 1000,
                },
              },
            ],
          },
        },
      ],
      totalPrice: {
        fractionDigits: 2,
      },
    },
    {
      price: {
        value: {
          currencyCode: 'EUR',
          centAmount: 8000,
        },
        discounted: {
          value: {
            currencyCode: 'EUR',
            centAmount: 4000,
          },
        },
      },
      quantity: 2,
      discountedPricePerQuantity: [
        {
          quantity: 2,
          discountedPrice: {
            value: {
              currencyCode: 'EUR',
              centAmount: 8640,
              fractionDigits: 2,
            },
            includedDiscounts: [
              {
                discountedAmount: {
                  currencyCode: 'EUR',
                  centAmount: 1200,
                },
              },
              {
                discountedAmount: {
                  currencyCode: 'EUR',
                  centAmount: 2160,
                },
              },
            ],
          },
        },
      ],
      totalPrice: {
        fractionDigits: 2,
      },
    },
    {
      price: {
        value: {
          currencyCode: 'EUR',
          centAmount: 3800,
        },
        discounted: {
          value: {
            currencyCode: 'EUR',
            centAmount: 3200,
          },
        },
      },
      quantity: 3,
      discountedPricePerQuantity: [],
      totalPrice: {
        fractionDigits: 2,
      },
    },
  ],
  customLineItems: [
    {
      discountedPricePerQuantity: [
        {
          quantity: 1,
          discountedPrice: {
            value: {
              currencyCode: 'EUR',
              centAmount: 7000,
              fractionDigits: 2,
            },
            includedDiscounts: [
              {
                discountedAmount: {
                  currencyCode: 'EUR',
                  centAmount: 1200,
                },
              },
            ],
          },
        },
      ],
      totalPrice: {
        fractionDigits: 2,
      },
    },
  ],
  totalPrice: {
    currencyCode: 'EUR',
    centAmount: 8910,
  },
};

const orderWithoutDiscounts = {
  lineItems: [
    {
      price: {
        value: {
          currencyCode: 'EUR',
          centAmount: 3400,
        },
      },
      quantity: 1,
      discountedPricePerQuantity: [],
      totalPrice: {
        fractionDigits: 2,
      },
    },
    {
      price: {
        value: {
          currencyCode: 'EUR',
          centAmount: 8000,
        },
      },
      quantity: 2,
      discountedPricePerQuantity: [],
      totalPrice: {
        fractionDigits: 2,
      },
    },
    {
      price: {
        value: {
          currencyCode: 'EUR',
          centAmount: 3800,
        },
      },
      quantity: 3,
      discountedPricePerQuantity: [],
      totalPrice: {
        fractionDigits: 2,
      },
    },
  ],
  customLineItems: [
    {
      discountedPricePerQuantity: [],
      totalPrice: {
        fractionDigits: 2,
      },
    },
  ],
  totalPrice: {
    currencyCode: 'EUR',
    centAmount: 8910,
  },
};

describe('getShippingPrices', () => {
  describe('without shippingInfo', () => {
    it('should return null', () => {
      expect(getShippingPrices({})).toBe(null);
    });
  });
  describe('with taxed shippingInfo', () => {
    it('should return discounted shippingInfo net and gross', () => {
      const shippingInfo = createShippingInfo(createShippingTaxes());
      const expected = {
        net: { ...shippingInfo.taxedPrice.totalNet },
        gross: { ...shippingInfo.taxedPrice.totalGross },
      };

      expect(getShippingPrices({ shippingInfo })).toEqual(expected);
    });
  });
  describe('without taxed shippingInfo', () => {
    describe('with discounted price on shippingInfo', () => {
      it('should return the discounted price if shipping has a discount', () => {
        const shippingInfo = createShippingInfo(createShippingDiscount());
        const expected = {
          net: { ...shippingInfo.discountedPrice.value },
          gross: { ...shippingInfo.discountedPrice.value },
        };
        expect(getShippingPrices({ shippingInfo })).toEqual(expected);
      });
    });
    describe('without discounted price on shippingInfo', () => {
      it('should return order.shippingInfo.price', () => {
        const shippingInfo = createShippingInfo();
        const expected = {
          net: { ...shippingInfo.price },
          gross: { ...shippingInfo.price },
        };
        expect(getShippingPrices({ shippingInfo })).toEqual(expected);
      });
    });
  });
  describe('without taxPrice or discountedPrice on shippingInfo', () => {
    it('should return order.shippingInfo.price', () => {
      const shippingInfo = createShippingInfo();
      const expected = {
        net: { ...shippingInfo.price },
        gross: { ...shippingInfo.price },
      };
      expect(getShippingPrices({ shippingInfo })).toEqual(expected);
    });
  });
});

describe('getShippingDiscounts', () => {
  it('should return null if no shipping information set', () => {
    expect(getShippingDiscounts({})).toBe(null);
  });

  it('should return null if shipping information set but no discounts', () => {
    const shippingInfo = createShippingInfo();
    expect(getShippingDiscounts({ shippingInfo })).toBe(null);
  });

  it('should return shipping discounts is set', () => {
    const shippingInfo = createShippingInfo(createShippingDiscount());
    const expected = [...shippingInfo.discountedPrice.includedDiscounts];
    expect(getShippingDiscounts({ shippingInfo })).toEqual(expected);
  });
});

describe('getTotalShippingDiscounts', () => {
  it('should return 0 when no shipping discounts passed', () => {
    expect(getTotalShippingDiscounts({})).toBe(0);
  });

  it('should return null if shipping information set but no discounts', () => {
    const shippingInfo = createShippingInfo();
    expect(getTotalShippingDiscounts({ shippingInfo })).toBe(0);
  });

  it('should return the total shipping discount value', () => {
    const shippingInfo = createShippingInfo(createShippingDiscount());
    expect(
      getTotalShippingDiscounts({
        shippingInfo,
        taxedPrice: orderWithDiscounts.totalPrice,
      })
    ).toBe(100);
  });
});

describe('getNetPriceWithoutShipping', () => {
  it('should return the total price if no shipping info present', () => {
    const order = createOrder();
    expect(getNetPriceWithoutShipping(order)).toEqual(order.totalPrice);
  });

  it('should return the total price minus shipping price', () => {
    const order = createOrder({ shippingInfo: createShippingInfo() });
    const expected = { currencyCode, centAmount: 900 };
    expect(getNetPriceWithoutShipping(order)).toEqual(expected);
  });
});

describe('getAllNonShippingTaxes', () => {
  it('should return empty array if order is not taxed', () => {
    expect(getAllNonShippingTaxes({})).toEqual([]);
  });

  it('should return all taxes if shipping is not taxed', () => {
    const order = createOrder(createOrderTaxes());
    expect(getAllNonShippingTaxes(order)).toBe(order.taxedPrice.taxPortions);
  });

  it('should return filtered taxes', () => {
    const order = createOrder({
      ...createOrderTaxes(),
      shippingInfo: createShippingInfo(createShippingTaxes()),
    });
    expect(getAllNonShippingTaxes(order)).toEqual([
      order.taxedPrice.taxPortions[1],
    ]);
  });
});

describe('getTotalCartDiscount', () => {
  it('should return the total cart discount', () => {
    expect(
      getTotalCartDiscount(
        orderWithDiscounts.lineItems.concat(orderWithDiscounts.customLineItems)
      )
    ).toBe(9920);
  });

  it('should return 0 when no cart discounts set', () => {
    expect(
      getTotalCartDiscount(
        orderWithoutDiscounts.lineItems.concat(
          orderWithoutDiscounts.customLineItems
        )
      )
    ).toBe(0);
  });
});

describe('getTotalProductDiscount', () => {
  describe('when there is a discount', () => {
    it('should get the total discount in money format', () => {
      const total =
        getTotalProductDiscount(orderWithDiscounts.lineItems) +
        getTotalCartDiscount(
          orderWithDiscounts.lineItems.concat(
            orderWithDiscounts.customLineItems
          )
        );
      orderWithDiscounts.currencyCode = 'EUR';
      expect(getTotalDiscountMoney(orderWithDiscounts)).toEqual({
        currencyCode: 'EUR',
        centAmount: total,
      });
    });

    it('should return the total product discount', () => {
      expect(getTotalProductDiscount(orderWithDiscounts.lineItems)).toBe(10300);
    });
  });

  describe('when there is no discount', () => {
    it('should return null value when no discounts set', () => {
      orderWithoutDiscounts.currencyCode = 'EUR';
      expect(getTotalDiscountMoney(orderWithoutDiscounts)).toBeNull();
    });

    it('should return 0', () => {
      expect(getTotalProductDiscount(orderWithoutDiscounts.lineItems)).toBe(0);
    });
  });
});

describe('getTotalNetWithoutDiscounts', () => {
  const subtotal = {
    currencyCode: 'EUR',
    centAmount: 3500,
  };
  const totalDiscount = {
    currencyCode: 'EUR',
    centAmount: 500,
  };
  it('should return the total net without the discount applied', () => {
    const totalNet = getTotalNetWithoutDiscounts(subtotal, totalDiscount);
    expect(totalNet).toEqual({
      ...subtotal,
      centAmount: subtotal.centAmount + totalDiscount.centAmount,
    });
  });
});
