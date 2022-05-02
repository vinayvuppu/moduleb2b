import merge from 'lodash.merge';

export default fixtures => {
  const mcFixture = merge(
    {
      settings: {
        id: 'project-settings-id-1',
        productSettings: ['product-settings-id-1', 'product-settings-id-2'],
        currentProductSettings: 'product-settings-id-1',
      },
    },
    fixtures
  );

  return {
    Query: () => ({
      project: () => ({
        settings: mcFixture.settings,
      }),
    }),
  };
};
