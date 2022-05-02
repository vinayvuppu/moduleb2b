import * as numbers from './numbers';

describe('check if number is valid', () => {
  it('should pass positive number', () => {
    expect(numbers.isNumberish('2')).toBe(true);
  });

  it('should pass decimal number with point', () => {
    expect(numbers.isNumberish('2.2')).toBe(true);
  });

  it('should pass decimal number with comma', () => {
    expect(numbers.isNumberish('2,2')).toBe(true);
  });

  it('should pass negative number', () => {
    expect(numbers.isNumberish('-2')).toBe(true);
  });
});

describe('check if integer is valid', () => {
  it('should pass a positive number', () => {
    expect(numbers.isInteger('2')).toBe(true);
  });
  it('should pass a negative number', () => {
    expect(numbers.isInteger('-2')).toBe(true);
  });
  it('should fail a decimal number', () => {
    expect(numbers.isInteger('2.3')).toBe(false);
    expect(numbers.isInteger('2,3')).toBe(false);
  });
  it('should fail a string', () => {
    expect(numbers.isInteger('hello123')).toBe(false);
  });
  it('should fail null', () => {
    expect(numbers.isInteger(null)).toBe(false);
  });
  it('should fail undefined', () => {
    expect(numbers.isInteger(undefined)).toBe(false);
  });
});

describe('getSeparatorsForLocale', () => {
  it('should return separators for locale "en"', () => {
    expect(numbers.getSeparatorsForLocale('en')).toEqual({
      thoSeparator: ',',
      decSeparator: '.',
    });
  });
  // Fixes: https://sentry.io/commercetools/mcng/issues/469626988/
  it('should fall back to "en" format if locale is not supported', () => {
    expect(numbers.getSeparatorsForLocale('es')).toEqual({
      thoSeparator: ',',
      decSeparator: '.',
    });
  });
});
