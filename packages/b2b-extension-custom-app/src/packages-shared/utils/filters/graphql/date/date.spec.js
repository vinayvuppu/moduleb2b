import moment from 'moment';
import oneLine from 'common-tags/lib/oneLine';
import dateTransformer, { isFilterValid } from './date';

const dateFormatDayStart = 'YYYY-MM-DDT00:00:00.000Z';
const dateFormatDayEnd = 'YYYY-MM-DDT23:59:59.999Z';

const filterKey = 'createdAt';

describe('date query builder', () => {
  /**
   * These date tests make me a sad panda
   * we SHOULDNT be formatting our expectations with moment. Unfortunately,
   * thanks to daylight savings, there is no other reliable way to format
   * the date we expect into the correct timezone for a given locale.
   *
   * :'(
   */

  it('should correctly build a single, "equalTo" query', () => {
    const queries = [{ type: 'equalTo', value: '2016-05-06' }];
    const result = dateTransformer(filterKey, queries);

    const expected = `${filterKey}: range("${moment('2016-05-06').format(
      dateFormatDayStart
    )}" to "${moment('2016-05-06').format(dateFormatDayEnd)}")`;
    expect(result).toEqual(expected);
  });

  it('should correctly build a single, "lessThan" query', () => {
    const queries = [{ type: 'lessThan', value: '2016-05-06' }];
    const result = dateTransformer(filterKey, queries);

    const expected = `${filterKey}: range(* to "${moment('2016-05-06').format(
      dateFormatDayStart
    )}")`;
    expect(result).toEqual(expected);
  });

  it('should correctly build a single, "moreThan" query', () => {
    const queries = [{ type: 'moreThan', value: '2016-05-06' }];
    const result = dateTransformer(filterKey, queries);

    const expected = `${filterKey}: range("${moment('2016-05-06').format(
      dateFormatDayEnd
    )}" to *)`;
    expect(result).toEqual(expected);
  });

  it('should correctly build a single, "range" query', () => {
    const queries = [
      {
        type: 'range',
        value: { from: '2016-05-06', to: '2016-05-08' },
      },
    ];
    const result = dateTransformer(filterKey, queries);

    const expected = `${filterKey}: range("${moment('2016-05-06').format(
      dateFormatDayStart
    )}" to "${moment('2016-05-08').format(dateFormatDayEnd)}")`;
    expect(result).toEqual(expected);
  });

  it('should correctly build a mix of queries', () => {
    const queries = [
      { type: 'equalTo', value: '2016-05-06' },
      { type: 'lessThan', value: '2016-05-06' },
      { type: 'moreThan', value: '2016-05-06' },
      {
        type: 'range',
        value: { from: '2016-05-06', to: '2016-05-08' },
      },
    ];
    const result = dateTransformer(filterKey, queries);

    const expected = oneLine`
      ${filterKey}: range("${moment('2016-05-06').format(
      dateFormatDayStart
    )}" to "${moment('2016-05-06').format(dateFormatDayEnd)}"),
      (* to "${moment('2016-05-06').format(dateFormatDayStart)}"),
      ("${moment('2016-05-06').format(dateFormatDayEnd)}" to *),
      ("${moment('2016-05-06').format(dateFormatDayStart)}" to "${moment(
      '2016-05-08'
    ).format(dateFormatDayEnd)}")
      `;

    expect(result).toEqual(expected);
  });

  it('should return null for invalid filters', () => {
    const queries = [{ type: 'equalTo', value: 'something invalid' }];
    const result = dateTransformer(filterKey, queries, () => false);

    expect(result).toBe(null);
  });
});

describe('isFilterValid', () => {
  it('should detect an invalid non-range filter', () => {
    const filter = { type: 'non-range', value: '' };
    expect(isFilterValid(filter)).toBe(false);
  });
  it('should detect an invalid range filter', () => {
    const filter = { type: 'range', value: '' };
    expect(isFilterValid(filter)).toBe(false);
  });
  it('should allow a valid non-range filter', () => {
    const filter = { type: 'non-range', value: '2000-01-01' };
    expect(isFilterValid(filter)).toBe(true);
  });
  it('should allow a valid range filter', () => {
    const filter = {
      type: 'non-range',
      value: {
        from: '2003-01-01',
        to: '2004-01-01',
      },
    };
    expect(isFilterValid(filter)).toBe(true);
  });
});
