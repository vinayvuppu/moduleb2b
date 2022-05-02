import validateSingleFilter from './single';

describe('single filter validator', () => {
  it('should return true for an "undefined" filter', () => {
    expect(validateSingleFilter({})).toBe(true);
  });
  it('should return true for a "null" filter', () => {
    expect(validateSingleFilter({ value: null })).toBe(true);
  });
  it('should return true for an empty string', () => {
    expect(validateSingleFilter({ value: '' })).toBe(true);
  });
  it('should return false for a valid filter', () => {
    const filter = { value: 'nice' };
    expect(validateSingleFilter(filter)).toBe(false);
  });
});
