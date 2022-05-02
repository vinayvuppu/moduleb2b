import { unique, uniqueObjects } from './validation';

describe('unique', () => {
  let data;
  describe('when there are duplicated values', () => {
    beforeEach(() => {
      data = [
        { id: 1, value: 'value1' },
        { id: 2, value: 'value2' },
        { id: 3, value: 'value3' },
        { id: 4, value: 'value2' },
        { id: 3, value: 'value5' },
        { id: 1, value: 'value1' },
      ];
    });
    it('should find the duplicate values in an array by id', () => {
      const duplicatedValues = unique(data, ['id']);
      expect(duplicatedValues).toEqual([{ id: '1' }, { id: '3' }]);
    });
    it('should find the duplicate values in an array by value', () => {
      const duplicatedValues = unique(data, ['value']);
      expect(duplicatedValues).toEqual([
        { value: 'value1' },
        { value: 'value2' },
      ]);
    });

    it('should find the duplicate values in an array by id and value', () => {
      const duplicatedValues = unique(data, ['id', 'value']);
      expect(duplicatedValues).toEqual([{ id: '1', value: 'value1' }]);
    });
  });
});

describe('uniqueObjects', () => {
  let testArray;
  describe('when there are duplicated values', () => {
    beforeEach(() => {
      testArray = [
        { en: 'hi' },
        { en: 'hi', de: 'hallo' },
        { de: 'hallo' },
        { es: 'hola' },
        { en: 'hi', de: 'hallo' },
      ];
    });
    it('should return one duplicate value', () => {
      expect(uniqueObjects(testArray)).toEqual([{ en: 'hi', de: 'hallo' }]);
    });
  });
  describe('when there are multiple duplicated values', () => {
    beforeEach(() => {
      testArray = [
        { en: 'hi', de: 'hallo' },
        { en: 'hi' },
        { en: 'hi', de: 'hallo' },
        { de: 'hallo' },
        { es: 'hola' },
        { en: 'hi', de: 'hallo' },
        { de: 'hallo' },
      ];
    });
    it('should return multiple duplicate values', () => {
      expect(uniqueObjects(testArray)).toEqual([
        { en: 'hi', de: 'hallo' },
        { de: 'hallo' },
      ]);
    });
  });
  describe('when there are no duplicates', () => {
    beforeEach(() => {
      testArray = [
        { en: 'hi' },
        { en: 'hi', de: 'hallo' },
        { de: 'hallo' },
        { es: 'hola' },
      ];
    });
    it('should return an empty list', () => {
      expect(uniqueObjects(testArray)).toEqual([]);
    });
  });
  describe('when `items` is `undefined`', () => {
    beforeEach(() => {
      testArray = undefined;
    });
    it('should return an empty list', () => {
      expect(uniqueObjects(testArray)).toEqual([]);
    });
  });
  describe('when `items` is `null`', () => {
    beforeEach(() => {
      testArray = undefined;
    });
    it('should return an empty list', () => {
      expect(uniqueObjects(testArray)).toEqual([]);
    });
  });
});
