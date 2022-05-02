import validate from './validations';

describe('validate', () => {
  describe('when no name provided', () => {
    it('should show the error for the name', () => {
      expect(validate({ name: '' })).toEqual({
        name: { missing: true },
      });
    });
  });
});
