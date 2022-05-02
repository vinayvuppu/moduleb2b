import { FILTER_TYPES } from '../../constants';
import moneyTransformer from './money';

const simpleFilterValue = {
  currencyCode: 'EUR',
  amount: '200,00',
};

const rangeFilterValue = {
  from: {
    currencyCode: 'EUR',
    amount: '200,00',
  },
  to: {
    currencyCode: 'EUR',
    amount: '400,00',
  },
};

describe('money query builder', () => {
  let option;
  let result;
  let expected;
  it('should correctly build a single, "lessThan" query', () => {
    option = FILTER_TYPES.lessThan;
    result = moneyTransformer(simpleFilterValue, option);

    expected = `currencyCode = "EUR" and centAmount < 20000`;
    expect(result).toEqual(expected);
  });

  it('should correctly build a single, "moreThan" query', () => {
    option = FILTER_TYPES.moreThan;
    result = moneyTransformer(simpleFilterValue, option);

    expected = `currencyCode = "EUR" and centAmount > 20000`;
    expect(result).toEqual(expected);
  });

  it('should correctly build a single, "equalTo" query', () => {
    option = FILTER_TYPES.equalTo;
    result = moneyTransformer(simpleFilterValue, option);

    expected = `currencyCode = "EUR" and centAmount = 20000`;
    expect(result).toEqual(expected);
  });

  it('should correctly build a single, "range" query', () => {
    option = FILTER_TYPES.range;
    result = moneyTransformer(rangeFilterValue, option);

    expected = `currencyCode = "EUR" and centAmount >= 20000 and centAmount <= 40000`;
    expect(result).toEqual(expected);
  });
});
