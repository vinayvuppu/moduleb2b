import validateFilter from './number';

const intlMock = {
  formatMessage: m => m.id,
};

describe('validateFilter', () => {
  describe('any non-range filter', () => {
    it('should return nothing', () => {
      expect(validateFilter({ type: 'any' }, intlMock)).toBe(null);
    });
  });
  describe('range filter', () => {
    it('should return an error if "from" value is not set', () => {
      const filter = { type: 'range', value: { from: null, to: '4' } };

      expect(validateFilter(filter, intlMock)).toEqual({
        from: expect.any(String),
      });
    });
    it('should return an error if "to" value is not set', () => {
      const filter = { type: 'range', value: { from: '5', to: null } };

      expect(validateFilter(filter, intlMock)).toEqual({
        to: expect.any(String),
      });
    });
    it('should return an error if "to" is less than "from"', () => {
      const filter = {
        type: 'range',
        value: { from: '6', to: '3' },
      };

      expect(validateFilter(filter, intlMock)).toEqual({
        from: expect.any(String),
      });
    });
  });
});
