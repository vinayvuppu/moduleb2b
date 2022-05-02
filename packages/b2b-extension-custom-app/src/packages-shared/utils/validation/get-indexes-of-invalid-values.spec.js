import getIndexesOfInvalidValues from './get-indexes-of-invalid-values';

describe('getIndexesOfInvalidValues', () => {
  let values = ['a', 'b', ' c'];
  let invalidValues;
  describe('when there are invalid values', () => {
    beforeEach(() => {
      invalidValues = ['a'];
    });
    it('should return a list of invalid indexes', () => {
      expect(getIndexesOfInvalidValues(values, invalidValues)).toEqual([0]);
    });
  });
  describe('when there are duplicate invalid values', () => {
    beforeEach(() => {
      invalidValues = ['a', 'a'];
    });
    it('should return a list of single invalid indexes', () => {
      expect(getIndexesOfInvalidValues(values, invalidValues)).toEqual([0]);
    });
  });
  describe('when there are duplicate values', () => {
    beforeEach(() => {
      values = ['a', 'a'];
      invalidValues = ['a'];
    });
    it('should return a list of single multiple indexes', () => {
      expect(getIndexesOfInvalidValues(values, invalidValues)).toEqual([0, 1]);
    });
  });
});
