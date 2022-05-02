import validate from './validations';

describe('validate', () => {
  describe('with `page` exceeding `totalPages`', () => {
    it('should should have an `invalidPage` error', () => {
      expect(validate({ page: 10, totalPages: 2 })).toEqual(
        expect.objectContaining({
          invalidPage: true,
        })
      );
    });
  });

  describe('with negative `page`', () => {
    it('should should have an `invalidPage` error', () => {
      expect(validate({ page: -1 })).toEqual(
        expect.objectContaining({
          invalidPage: true,
        })
      );
    });
  });
});
