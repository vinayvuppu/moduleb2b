import missingTransformer from './missing';

const filterKey = 'externalId';

describe('missing query builder', () => {
  it('should correctly build', () => {
    const queries = [{ type: 'missing', value: null }];
    const expected = `${filterKey}:missing`;

    const result = missingTransformer(filterKey, queries);
    expect(result).toEqual(expected);
  });

  it('return null for empty filters', () => {
    expect(missingTransformer(filterKey, [])).toBe(null);
  });
});
