import validate from './validations';

describe('validate', () => {
  describe('when no email provided', () => {
    it('should show the error for the email', () => {
      expect(
        validate({ email: '', company: 'company1', roles: ['rol1'] })
      ).toEqual({
        email: expect.objectContaining({ missing: true }),
      });
    });
  });
  describe('when the email has wrong format', () => {
    it('should show the error for the email', () => {
      expect(
        validate({
          email: 'wrong-email',
          company: 'company1',
          roles: ['rol1'],
        })
      ).toEqual({
        email: { format: true },
      });
    });
  });

  describe('when no company provided', () => {
    it('should show the error for the email', () => {
      expect(
        validate({ email: 'email@aaa.com', company: '', roles: ['rol1'] })
      ).toEqual({
        company: expect.objectContaining({ missing: true }),
      });
    });
  });
  describe('when no roles provided', () => {
    it('should show the error for the email', () => {
      expect(
        validate({ email: 'email@aaa.com', company: 'company1', roles: [] })
      ).toEqual({
        roles: expect.objectContaining({ missing: true }),
      });
    });
  });
});
