import merge from 'lodash.merge';

export default (fixtures, customResolvers = {}) => {
  const pimFixture = merge(
    {
      products: 'indexed',
      productTypes: 'indexed',
    },
    fixtures
  );

  return {
    GraphQLQuery: () =>
      merge(
        {
          indicesExist: () => ({
            products: {
              searchableIndexExists: pimFixture.products === 'indexed',
              newInProgress: pimFixture.products === 'indexing',
            },
            productTypes: {
              searchableIndexExists: pimFixture.productTypes === 'indexed',
              newInProgress: pimFixture.productTypes === 'indexing',
            },
          }),
        },
        customResolvers.query
      ),
    GraphQLMutation: () => merge({}, customResolvers.mutation),
    Long: () => 100,
  };
};
