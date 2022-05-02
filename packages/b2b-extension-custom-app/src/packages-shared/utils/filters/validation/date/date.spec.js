import validateFilter from './date';

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
      const filter = { type: 'range', value: { from: null, to: '2017-01-01' } };

      expect(validateFilter(filter, intlMock)).toEqual({
        from: expect.any(String),
      });
    });
    it('should return an error if "to" value is not set', () => {
      const filter = { type: 'range', value: { from: '2017-01-01', to: null } };

      expect(validateFilter(filter, intlMock)).toEqual({
        to: expect.any(String),
      });
    });
    it('should return an error if "to" is less than "from"', () => {
      const filter = {
        type: 'range',
        value: { from: '2017-01-01', to: '2016-01-01' },
      };

      expect(validateFilter(filter, intlMock)).toEqual({
        from: expect.any(String),
      });
    });
  });
});
