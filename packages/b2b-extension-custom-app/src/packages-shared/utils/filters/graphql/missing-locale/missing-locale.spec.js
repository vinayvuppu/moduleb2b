import missingLocaleTransformer from './missing-locale';

const filterKey = 'name';

describe('missing locale query builder', () => {
  it('should correctly build for locale', () => {
    const queries = [{ type: 'missingIn', value: { value: 'en' } }];
    const expected = `${filterKey}.en:missing`;

    const result = missingLocaleTransformer(filterKey, queries);
    expect(result).toEqual(expected);
  });

  it('return null for empty filters', () => {
    expect(missingLocaleTransformer(filterKey, [])).toBe(null);
  });
});
