import graphqlQueryBuilder from './graphql';

describe('graphQl Query Builder', () => {
  let filterTypeConfig;
  let filtersDefintion;

  describe('with one filter definition', () => {
    describe('when transformer returns no filter (`null`)', () => {
      beforeEach(() => {
        filtersDefintion = {
          createdOn: [{ type: 'equalTo', value: '' }],
        };
        filterTypeConfig = {
          createdOn: {
            key: 'createdOn',
            transform: () => null,
          },
        };
      });

      it('should build an empty query', () => {
        const expected = [];
        const actual = graphqlQueryBuilder({
          config: filterTypeConfig,
          filters: filtersDefintion,
        });

        expect(actual).toEqual(expected);
      });
    });

    describe('when transformers returns multiple filters (`array`)', () => {
      beforeEach(() => {
        filtersDefintion = {
          level: [
            { type: 'equalTo', value: 'something' },
            { type: 'levelDepth', value: null },
          ],
        };
        filterTypeConfig = {
          level: {
            key: 'level',
            transform: key => [
              `${key}: range: (1 to *)`,
              'levelDepth: randomValue',
            ],
          },
        };
      });
      it('should build a query as array containing each transformation', () => {
        const actual = graphqlQueryBuilder({
          config: filterTypeConfig,
          filters: filtersDefintion,
        });
        const expected = ['level: range: (1 to *)', 'levelDepth: randomValue'];

        expect(actual).toEqual(expected);
      });
    });
  });

  describe('with multiple filter defintions', () => {
    describe('when transformers each return a single filter (`string`)', () => {
      beforeEach(() => {
        filtersDefintion = {
          level: [{ type: 'equalTo', value: 'something' }],
          missingName: [{ type: 'missing', value: { value: 'en' } }],
        };
        filterTypeConfig = {
          level: {
            key: 'level',
            transform: (key /* , value */) => `${key}: range(1 to *),(* to 5)`,
          },
          missingName: {
            key: 'name',
            transform: (key, values) =>
              `${key}.${values[0].value.value}:missing`,
          },
        };
      });

      it('should build a query as array containing each transformation', () => {
        const expected = ['level: range(1 to *),(* to 5)', 'name.en:missing'];
        const actual = graphqlQueryBuilder({
          config: filterTypeConfig,
          filters: filtersDefintion,
        });

        expect(actual).toEqual(expected);
      });
    });

    describe('when transformers returns mixed filters multiple (`array`) and single (`string`)', () => {
      beforeEach(() => {
        filtersDefintion = {
          level: [
            { type: 'equalTo', value: 'something' },
            { type: 'levelDepth', value: null },
          ],
          missingName: [{ type: 'missing', value: { value: 'en' } }],
        };
        filterTypeConfig = {
          level: {
            key: 'level',
            transform: key => [`${key}: range: (1 to *)`, 'levelDepth: 0'],
          },
          missingName: {
            key: 'name',
            transform: (key, values) =>
              `${key}.${values[0].value.value}:missing`,
          },
        };
      });

      it('should build a query as array containing each transformation', () => {
        const actual = graphqlQueryBuilder({
          config: filterTypeConfig,
          filters: filtersDefintion,
        });
        const expected = [
          'level: range: (1 to *)',
          'levelDepth: 0',
          'name.en:missing',
        ];

        expect(actual).toEqual(expected);
      });
    });
  });
});
