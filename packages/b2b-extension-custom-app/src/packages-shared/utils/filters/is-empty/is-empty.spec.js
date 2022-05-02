import isEmptyFilter from './is-empty';

jest.mock('./single', () => jest.fn(() => '__single_return_value__'));
jest.mock('./range', () => jest.fn(() => '__range_return_value__'));

describe('isEmptyFilter', () => {
  describe('without `type`', () => {
    describe('with `value`', () => {
      it('should invoke single validator (as standard validator)', () => {
        expect(isEmptyFilter({ value: 1 })).toBe('__single_return_value__');
      });
    });
  });

  describe('with `range` type', () => {
    it('should invoke range validator', () => {
      expect(isEmptyFilter({ type: 'range' })).toBe('__range_return_value__');
    });
  });
});
