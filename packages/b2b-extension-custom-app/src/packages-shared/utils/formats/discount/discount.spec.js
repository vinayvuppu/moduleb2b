import formatDiscount from './discount';

const intl = {
  formatNumber: (amount, currency) => `${currency.currency} ${amount}`,
};

const createAbsoluteDiscount = custom => ({
  type: 'absolute',
  money: [
    { centAmount: 1000, currencyCode: 'EUR' },
    { centAmount: 850, currencyCode: 'USD' },
  ],

  ...custom,
});

const createRelativeDiscount = custom => ({
  type: 'relative',
  permyriad: 3000,

  ...custom,
});

describe('when absolute discount', () => {
  let discount;

  beforeEach(() => {
    discount = createAbsoluteDiscount();
  });

  describe('when `money` for `currencyCode` exists', () => {
    it('should format a discount value with currency `EUR`', () => {
      const actual = formatDiscount(discount, 'EUR', intl);
      expect(actual).toBe('EUR 10');
    });

    it('should format a discount value with currency `USD`', () => {
      const actual = formatDiscount(discount, 'USD', intl);
      expect(actual).toBe('USD 8.5');
    });
  });

  describe('when `money` for `currencyCode` does not exist', () => {
    it('should return `null`', () => {
      const actual = formatDiscount(discount, 'PLN', intl);
      expect(actual).toBeNull();
    });
  });

  describe('without `money`', () => {
    beforeEach(() => {
      discount = createAbsoluteDiscount({
        money: null,
      });
    });

    it('should return `null`', () => {
      const actual = formatDiscount(discount, 'PLN', intl);
      expect(actual).toBeNull();
    });
  });
});

describe('when relative discount', () => {
  let discount;

  beforeEach(() => {
    discount = createRelativeDiscount();
  });

  it('should format a relative discount with value of 30%', () => {
    const actual = formatDiscount(discount, null, intl);
    expect(actual).toBe('30%');
  });
});
