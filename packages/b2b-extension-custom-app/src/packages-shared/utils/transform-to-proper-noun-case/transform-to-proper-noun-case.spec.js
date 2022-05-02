import {
  transformToProperNounCase,
  transformAllToProperNounCase,
} from './transform-to-proper-noun-case';

describe('utility functions', () => {
  describe('transformToProperNounCase', () => {
    it('should capitalize first char', () => {
      expect(transformToProperNounCase('foo')).toBe('Foo');
    });
    it('should lower case from second char', () => {
      expect(transformToProperNounCase('FOO')).toBe('Foo');
    });
  });
  describe('transformAllToProperNounCase', () => {
    it('should capitalize first char of every word', () => {
      expect(transformAllToProperNounCase('foo test')).toBe('Foo Test');
    });
    it('should lower case from second char every word', () => {
      expect(transformAllToProperNounCase('FOO TEST')).toBe('Foo Test');
    });
  });
});
