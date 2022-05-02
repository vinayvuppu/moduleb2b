import { validateSingleOptionEnum, validateMultiOptionEnum } from './enum';

const intlMock = {
  formatMessage: m => m.id,
};

describe('validateSingleOptionEnum', () => {
  describe('when valid option selected', () => {
    it('should return `null`', () => {
      expect(validateSingleOptionEnum({ value: 'some value' }, intlMock)).toBe(
        null
      );
    });
  });
  describe('when no option selected', () => {
    it('should return a `required` validation message', () => {
      expect(validateSingleOptionEnum({ value: null }, intlMock)).toBe(
        'Validation.required'
      );
    });
  });
});

describe('validateMultiOptionEnum', () => {
  describe('when valid option selected', () => {
    it('should return `null`', () => {
      expect(validateMultiOptionEnum({ value: ['test'] }, intlMock)).toBe(null);
    });
  });
  describe('when no option set with `null` value', () => {
    it('should return a `required` validation message', () => {
      expect(validateMultiOptionEnum({ value: null }, intlMock)).toBe(
        'Validation.required'
      );
    });
  });
  describe('when no option set with empty array as value', () => {
    it('should return a `required` validation message', () => {
      expect(validateMultiOptionEnum({ value: [] }, intlMock)).toBe(
        'Validation.required'
      );
    });
  });
});
