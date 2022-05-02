import moment from 'moment';
import oneLine from 'common-tags/lib/oneLine';
import dateTransformer, { defaultFilterValidator } from './date';

const dateFormatDayStart = 'YYYY-MM-DDT00:00:00.000Z';
const dateFormatDayEnd = 'YYYY-MM-DDT23:59:59.999Z';

const filterKey = 'createdAt';

describe('date query builder', () => {
  it('should correctly build a single, "equalTo" query', () => {
    const queries = [{ type: 'equalTo', value: '2016-05-06' }];
    const result = dateTransformer(filterKey, queries);

    const expected = `((${filterKey} >= "${moment('2016-05-06').format(
      dateFormatDayStart
    )}" and ${filterKey} <= "${moment('2016-05-06').format(
      dateFormatDayEnd
    )}"))`;
    expect(result).toEqual(expected);
  });

  it('should correctly build a single, "lessThan" query', () => {
    const queries = [{ type: 'lessThan', value: '2016-05-06' }];
    const result = dateTransformer(filterKey, queries);

    const expected = `(${filterKey} < "2016-05-06")`;
    expect(result).toEqual(expected);
  });

  it('should correctly build a single, "moreThan" query', () => {
    const queries = [{ type: 'moreThan', value: '2016-05-06' }];
    const result = dateTransformer(filterKey, queries);

    const expected = `(${filterKey} > "2016-05-06")`;
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

    const expected = `((${filterKey} >= "${moment('2016-05-06').format(
      dateFormatDayStart
    )}" and ${filterKey} <= "${moment('2016-05-08').format(
      dateFormatDayEnd
    )}"))`;
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
      ((${filterKey} >= "${moment('2016-05-06').format(
      dateFormatDayStart
    )}" and ${filterKey} <= "${moment('2016-05-06').format(
      dateFormatDayEnd
    )}") or
      ${filterKey} < "2016-05-06" or ${filterKey} > "2016-05-06" or (${filterKey} >= "${moment(
      '2016-05-06'
    ).format(dateFormatDayStart)}" and ${filterKey} <= "${moment(
      '2016-05-08'
    ).format(dateFormatDayEnd)}"))
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
    expect(defaultFilterValidator(filter)).toBe(false);
  });
  it('should detect an invalid range filter', () => {
    const filter = { type: 'range', value: '' };
    expect(defaultFilterValidator(filter)).toBe(false);
  });
  it('should allow a valid non-range filter', () => {
    const filter = { type: 'non-range', value: '2000-01-01' };
    expect(defaultFilterValidator(filter)).toBe(true);
  });
  it('should allow a valid range filter', () => {
    const filter = {
      type: 'non-range',
      value: {
        from: '2003-01-01',
        to: '2004-01-01',
      },
    };
    expect(defaultFilterValidator(filter)).toBe(true);
  });
});
