import transformGraphQLErrors from './transform-graphql-errors';

const createTestErrors = () => [
  {
    code: 'DuplicateField',
    field: 'name',
  },
];

describe('transformGraphQLErrors', () => {
  let errors;
  let transformedErrors;
  describe('when there are errors', () => {
    beforeEach(() => {
      errors = createTestErrors();
      transformedErrors = transformGraphQLErrors(errors);
    });

    it('should return an object with transformed errors', () => {
      expect(transformedErrors).toEqual({
        name: { duplicated: true },
      });
    });
  });
  describe('when there are no errors', () => {
    beforeEach(() => {
      transformedErrors = transformGraphQLErrors([]);
    });

    it('should return an empty object ', () => {
      expect(transformedErrors).toEqual({});
    });
  });
});
