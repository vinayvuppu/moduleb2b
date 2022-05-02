import validate from './validations';

describe('validate', () => {
  describe('when no email provided', () => {
    it('should show the error for the email', () => {
      expect(
        validate({
          email: '',
          password: 'stark',
          confirmedPassword: 'stark',
          company: 'company-key-1',
          roles: ['rol1'],
        })
      ).toEqual({
        email: expect.objectContaining({ missing: true }),
      });
    });
  });
  describe('when invalid email provided', () => {
    it('should show the error for the email', () => {
      expect(
        validate({
          email: 'invalid_email',
          password: 'stark',
          confirmedPassword: 'stark',
          company: 'company-key-1',
          roles: ['rol1'],
        })
      ).toEqual({
        email: { format: true },
      });
    });
  });
  describe('when no password provided', () => {
    it('should show the error for the password', () => {
      expect(
        validate({
          email: 'foo@bar.com',
          password: '',
          confirmedPassword: '',
          company: 'company-key-1',
          roles: ['rol1'],
        })
      ).toEqual({
        password: { missing: true },
        confirmedPassword: { missing: true },
      });
    });
  });
  describe('when passwords do not match', () => {
    it('should show the error for the password', () => {
      expect(
        validate({
          email: 'foo@bar.com',
          password: '123',
          confirmedPassword: '111',
          company: 'company-key-1',
          roles: ['rol1'],
        })
      ).toEqual({
        password: { notMatch: true },
        confirmedPassword: { notMatch: true },
      });
    });
  });

  describe('when no company provided', () => {
    it('should show the error for the company', () => {
      expect(
        validate({
          email: 'email@foo.com',
          password: 'stark',
          confirmedPassword: 'stark',
          company: '',
          roles: ['rol1'],
        })
      ).toEqual({
        company: expect.objectContaining({ missing: true }),
      });
    });
  });
  describe('when no roles provided', () => {
    it('should show the error for the roles', () => {
      expect(
        validate({
          email: 'email@foo.com',
          password: 'stark',
          confirmedPassword: 'stark',
          company: 'company-key-1',
          roles: [],
        })
      ).toEqual({
        roles: expect.objectContaining({ missing: true }),
      });
    });
  });
});
