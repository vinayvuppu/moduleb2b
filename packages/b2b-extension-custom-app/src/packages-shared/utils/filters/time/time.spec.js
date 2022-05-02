import oneLine from 'common-tags/lib/oneLine';
import timeTransformer, { defaultFilterValidator } from './time';

const filterKey = 'pickUpTime';

describe('date query builder', () => {
  it('should correctly build a single, "equalTo" query', () => {
    const queries = [{ type: 'equalTo', value: '12:00:00.000' }];
    const result = timeTransformer(filterKey, queries);

    const expected = `((${filterKey} >= "12:00:00.000" and ${filterKey} <= "12:00:59.999"))`;
    expect(result).toEqual(expected);
  });

  it('should correctly build a single, "lessThan" query', () => {
    const queries = [{ type: 'lessThan', value: '12:00:00.000' }];
    const result = timeTransformer(filterKey, queries);

    const expected = `(${filterKey} < "12:00:00.000")`;
    expect(result).toEqual(expected);
  });

  it('should correctly build a single, "moreThan" query', () => {
    const queries = [{ type: 'moreThan', value: '12:00:00.000' }];
    const result = timeTransformer(filterKey, queries);

    const expected = `(${filterKey} > "12:00:00.000")`;
    expect(result).toEqual(expected);
  });

  it('should correctly build a single, "range" query', () => {
    const queries = [
      {
        type: 'range',
        value: { from: '12:00:00.000', to: '13:00:00.000' },
      },
    ];
    const result = timeTransformer(filterKey, queries);

    const expected = `((${filterKey} >= "12:00:00.000" and ${filterKey} <= "13:00:59.999"))`;
    expect(result).toEqual(expected);
  });

  it('should correctly build a mix of queries', () => {
    const queries = [
      { type: 'equalTo', value: '12:00:00.000' },
      { type: 'lessThan', value: '12:00:00.000' },
      { type: 'moreThan', value: '12:00:00.000' },
      {
        type: 'range',
        value: { from: '12:00:00.000', to: '13:00:00.000' },
      },
    ];
    const result = timeTransformer(filterKey, queries);

    const expected = oneLine`
      ((${filterKey} >= "12:00:00.000" and ${filterKey} <= "12:00:59.999") or
      ${filterKey} < "12:00:00.000" or ${filterKey} > "12:00:00.000" or
      (${filterKey} >= "12:00:00.000" and ${filterKey} <= "13:00:59.999"))
    `;

    expect(result).toEqual(expected);
  });

  it('should return null for invalid filters', () => {
    const queries = [{ type: 'equalTo', value: 'something invalid' }];
    const result = timeTransformer(filterKey, queries, () => false);

    expect(result).toBe(null);
  });
});

describe('defaultFilterValidator', () => {
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
