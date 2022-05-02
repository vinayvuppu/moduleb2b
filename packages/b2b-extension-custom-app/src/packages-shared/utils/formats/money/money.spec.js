import { PRECISION_TYPES } from '../../constants';
import {
  formatMoneyValue,
  formatMoneyRangeValue,
  getFractionedAmount,
} from './money';

const intl = {
  formatNumber: (amount, currency) => `${currency.currency} ${amount}`,
};

describe('formatting', () => {
  it('formats a money value', () => {
    const actual = formatMoneyValue(10000, 'EUR', intl);
    expect(actual).toBe('EUR 100');
  });

  it('formats a range money value with to value set to null', () => {
    const money = {
      from: 10000,
      to: null,
      currency: 'EUR',
    };
    const actual = formatMoneyRangeValue(money, intl);
    expect(actual).toBe('from EUR 100');
  });

  it('formats a range money value with from value set to null', () => {
    const money = {
      from: null,
      to: 10000,
      currency: 'EUR',
    };
    const actual = formatMoneyRangeValue(money, intl);
    expect(actual).toBe('to EUR 100');
  });

  it('formats a range money value with equal from/to values', () => {
    const money = {
      from: 10000,
      to: 10000,
      currency: 'EUR',
    };
    const actual = formatMoneyRangeValue(money, intl);
    expect(actual).toBe('EUR 100');
  });

  it('formats a range money value with no from/to values', () => {
    const money = {
      from: null,
      to: null,
      currency: 'EUR',
    };
    const actual = formatMoneyRangeValue(money, intl);
    expect(actual).toBe('EUR 0');
  });

  it('formats a range money value with different from/to values', () => {
    const money = {
      from: 10000,
      to: 15000,
      currency: 'EUR',
    };
    const actual = formatMoneyRangeValue(money, intl).split('-');

    expect(actual[0].trim()).toBe('EUR 100');
    expect(actual[1].trim()).toBe('EUR 150');
  });
  describe('getFractionedAmount', () => {
    describe('with `highPrecision` value', () => {
      it('should normalize based on `preciseAmount` for `highPrecision`', () => {
        expect(
          getFractionedAmount({
            type: PRECISION_TYPES.highPrecision,
            fractionDigits: 5,
            preciseAmount: 123456789,
          })
        ).toBe(1234.56789);
      });
      it('should normalize based on `centAmount` for `centAmount`', () => {
        expect(
          getFractionedAmount({
            type: PRECISION_TYPES.centPrecision,
            fractionDigits: 2,
            centAmount: 123456789,
          })
        ).toBe(1234567.89);
      });
    });
    describe('with `centPrecision` value', () => {});
  });
});
