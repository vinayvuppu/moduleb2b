import isEmpty from './range';

describe('range filter validator', () => {
  it('should return true for an "undefined" filter', () => {
    expect(isEmpty({})).toEqual(true);
  });
  it('should return true for an "null" filter', () => {
    expect(isEmpty({ value: null })).toEqual(true);
  });
  it('should return false when from === null', () => {
    const filter = { value: { from: null, to: 'nice' } };
    expect(isEmpty(filter)).toEqual(false);
  });
  it('should return false when to === null', () => {
    const filter = { value: { from: 'nice', to: null } };
    expect(isEmpty(filter)).toEqual(false);
  });
  it('should return false for a valid filter', () => {
    const filter = { value: { from: 'nice', to: 'nicer' } };
    expect(isEmpty(filter)).toEqual(false);
  });
});
