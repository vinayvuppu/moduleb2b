import numberTransformer from './number';

const filterKey = 'level';

describe('number query builder', () => {
  it('should correctly build a single, "equalTo" query', () => {
    const queries = [{ type: 'equalTo', value: 6 }];
    const result = numberTransformer(filterKey, queries);

    const expected = `${filterKey}: range(6 to 6)`;
    expect(result).toEqual(expected);
  });

  it('should correctly build a single, "lessThan" query', () => {
    const queries = [{ type: 'lessThan', value: 6 }];
    const result = numberTransformer(filterKey, queries);

    const expected = `${filterKey}: range(* to 5)`;
    expect(result).toEqual(expected);
  });

  it('should correctly build a single, "moreThan" query', () => {
    const queries = [{ type: 'moreThan', value: 6 }];
    const result = numberTransformer(filterKey, queries);

    const expected = `${filterKey}: range(7 to *)`;
    expect(result).toEqual(expected);
  });

  it('should correctly build a single, "range" query', () => {
    const queries = [
      {
        type: 'range',
        value: { from: 2, to: 4 },
      },
    ];
    const result = numberTransformer(filterKey, queries);

    const expected = `${filterKey}: range(2 to 4)`;
    expect(result).toEqual(expected);
  });

  it('should correctly build a mix of queries', () => {
    const queries = [
      { type: 'equalTo', value: 1 },
      { type: 'lessThan', value: 2 },
      { type: 'moreThan', value: 3 },
      {
        type: 'range',
        value: { from: 6, to: 7 },
      },
    ];
    const result = numberTransformer(filterKey, queries);

    const expected = `${filterKey}: range(1 to 1), (* to 1), (4 to *), (6 to 7)`;
    expect(result).toEqual(expected);
  });

  it('should return null for invalid filters', () => {
    const queries = [{ type: 'equalTo', value: 'something invalid' }];
    const result = numberTransformer(filterKey, queries, () => false);

    expect(result).toBe(null);
  });
});
