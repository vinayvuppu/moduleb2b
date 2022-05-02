import referenceTransformer from './reference';

const filterKey = 'parent';

describe('reference query builder', () => {
  it('should correctly build a single, "equalTo" query', () => {
    const queries = [{ type: 'equalTo', value: 'something' }];
    const result = referenceTransformer(filterKey, queries);

    const expected = `${filterKey}.id: "something"`;
    expect(result).toEqual(expected);
  });

  it('should return null for invalid filters', () => {
    const queries = [{ type: 'equalTo', value: 'something invalid' }];
    const result = referenceTransformer(filterKey, queries, () => false);

    expect(result).toBe(null);
  });
});
