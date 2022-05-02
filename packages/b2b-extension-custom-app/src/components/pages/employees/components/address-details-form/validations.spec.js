import validate from './validations';

describe('validate', () => {
  describe('when no country provided', () => {
    it('should show the error for the country', () => {
      expect(validate({ country: '' })).toEqual({
        country: { missing: true },
      });
    });
  });
  describe('when no email has wrong format', () => {
    it('should show the error for the email', () => {
      expect(validate({ country: 'DE', email: 'wrong-email' })).toEqual({
        email: { format: true },
      });
    });
  });
});
