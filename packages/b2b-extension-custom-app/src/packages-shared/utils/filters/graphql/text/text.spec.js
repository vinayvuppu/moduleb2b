import textTransformer from './text';

const filterKey = 'productTypeNames';

describe('text query builder', () => {
  describe('with `queries`', () => {
    let queries;
    let expected;

    beforeEach(() => {
      queries = [{ type: 'text', value: 'foo' }];
      expected = `${filterKey}:"${queries[0].value}"`;
    });

    it('should build with `key` and `value`', () => {
      expect(textTransformer(filterKey, queries)).toEqual(expected);
    });

    describe('without `value`', () => {
      beforeEach(() => {
        queries = [{ type: 'text', value: null }];
      });

      it('return `null`', () => {
        expect(textTransformer(filterKey, [])).toBe(null);
      });
    });
  });

  describe('without `queries`', () => {
    it('return `null`', () => {
      expect(textTransformer(filterKey, [])).toBe(null);
    });
  });
});
