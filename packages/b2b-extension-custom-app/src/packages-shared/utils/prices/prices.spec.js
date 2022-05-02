import {
  getPriceChannelName,
  getDiscountValue,
  getSelectedPrice,
  getNetUnitPrice,
  getMinimumPricesByCurrencyCode,
} from './prices';

describe('getPriceChannelName', () => {
  const language = 'en';

  it('should return null', () => {
    const example1 = {};
    expect(getPriceChannelName(example1, language)).toBe(null);

    const example2 = {
      channel: {
        // a channel that may only be a reference that is not exapanded.
      },
    };
    expect(getPriceChannelName(example2, language)).toBe(null);
  });

  it('should return localized name', () => {
    const price = {
      channel: {
        obj: {
          name: {
            en: 'channel-1',
          },
        },
      },
    };
    expect(getPriceChannelName(price, language)).toBe('channel-1');
  });

  it('should return key', () => {
    const example1 = {
      channel: {
        obj: {
          key: 'channel-key-1',
          name: {
            de: 'channel-1',
          },
        },
      },
    };
    // should return key because the requested localized value
    // of `en` does not exist
    expect(getPriceChannelName(example1, language)).toBe('channel-key-1');

    const example2 = {
      channel: {
        obj: {
          key: 'channel-key-1',
        },
      },
    };
    expect(getPriceChannelName(example2, language)).toBe('channel-key-1');
  });
});

describe('getDiscountValue', () => {
  it('should return the discount value between price and discounted', () => {
    const price = {
      value: {
        currencyCode: 'EUR',
        centAmount: 1000,
      },
      discounted: {
        value: {
          currencyCode: 'EUR',
          centAmount: 900,
        },
      },
    };
    expect(getDiscountValue(price)).toEqual({
      currencyCode: 'EUR',
      centAmount: 100,
    });
  });

  it('should return 0 in money format when no discount is set', () => {
    const price = {
      value: {
        currencyCode: 'EUR',
        centAmount: 1000,
      },
    };
    expect(getDiscountValue(price)).toEqual({
      currencyCode: 'EUR',
      centAmount: 0,
    });
  });
});

describe('getSelectedPrice', () => {
  it('should return the discounted price', () => {
    const price = {
      value: {
        currencyCode: 'EUR',
        centAmount: 1000,
      },
      discounted: {
        value: {
          currencyCode: 'EUR',
          centAmount: 900,
        },
      },
    };
    expect(getSelectedPrice(price)).toEqual({
      value: {
        currencyCode: 'EUR',
        centAmount: 900,
      },
    });
  });

  it('should return the price in money format when no discount is set', () => {
    const price = {
      value: {
        currencyCode: 'EUR',
        centAmount: 1000,
      },
    };
    expect(getSelectedPrice(price)).toEqual({
      value: {
        currencyCode: 'EUR',
        centAmount: 1000,
      },
    });
  });
});

describe('getNetUnitPrice', () => {
  let price;
  describe('with taxRate', () => {
    describe('if taxRate is includedInPrice', () => {
      describe('if amount should be rounded', () => {
        beforeEach(() => {
          price = getNetUnitPrice({
            lineItem: {
              taxRate: {
                amount: 0.19,
                includedInPrice: true,
              },
              // See https://jira.commercetools.com/browse/MCD-742
              price: { value: { currencyCode: 'EUR', centAmount: 19499 } },
            },
            shouldRoundAmount: true,
          });
        });
        it('should return rounded price value', () => {
          expect(price).toEqual({ currencyCode: 'EUR', centAmount: 16386 });
        });
      });
      describe('if amount should not be rounded', () => {
        beforeEach(() => {
          price = getNetUnitPrice({
            lineItem: {
              taxRate: {
                amount: 0.19,
                includedInPrice: true,
              },
              // See https://jira.commercetools.com/browse/MCD-742
              price: { value: { currencyCode: 'EUR', centAmount: 19499 } },
            },
            shouldRoundAmount: false,
          });
        });
        it('should return raw price value', () => {
          expect(price).toEqual({
            currencyCode: 'EUR',
            centAmount: 16385.714285714286,
          });
        });
      });
    });
    describe('if taxRate is not includedInPrice', () => {
      beforeEach(() => {
        price = getNetUnitPrice({
          lineItem: {
            taxRate: { amount: 0.19, includedInPrice: false },
            price: { value: { currencyCode: 'EUR', centAmount: 1000 } },
          },
          shouldRoundAmount: true,
        });
      });
      it('should return price value', () => {
        expect(price).toEqual({ currencyCode: 'EUR', centAmount: 1000 });
      });
    });
  });
  describe('without taxRate', () => {
    beforeEach(() => {
      price = getNetUnitPrice({
        lineItem: {
          price: { value: { currencyCode: 'EUR', centAmount: 1000 } },
        },
        shouldRoundAmount: true,
      });
    });
    it('should return price value', () => {
      expect(price).toEqual({ currencyCode: 'EUR', centAmount: 1000 });
    });
  });
});

describe('getMinimumPricesByCurrencyCode', () => {
  let prices;
  describe('with empty prices', () => {
    beforeEach(() => {
      prices = [];
    });
    it('should return empty array', () => {
      expect(getMinimumPricesByCurrencyCode(prices)).toHaveLength(0);
    });
  });
  describe('with prices', () => {
    beforeEach(() => {
      prices = [
        {
          value: {
            currencyCode: 'EUR',
            centAmount: 1000,
          },
        },
        {
          value: {
            currencyCode: 'EUR',
            centAmount: 9000,
          },
        },
        {
          value: {
            currencyCode: 'EUR',
            centAmount: 10000,
          },
        },
        {
          value: {
            currencyCode: 'USD',
            centAmount: 1000,
          },
        },
        {
          value: {
            currencyCode: 'USD',
            centAmount: 9000,
          },
        },
        {
          value: {
            currencyCode: 'USD',
            centAmount: 10000,
          },
        },
      ];
    });
    it('should return only minimum prices for each currency', () => {
      expect(getMinimumPricesByCurrencyCode(prices)).toEqual([
        {
          currencyCode: 'EUR',
          centAmount: 1000,
        },
        {
          currencyCode: 'USD',
          centAmount: 1000,
        },
      ]);
    });
  });
});
