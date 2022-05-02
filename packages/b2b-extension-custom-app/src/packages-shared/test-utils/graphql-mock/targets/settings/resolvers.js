export default (_, resolvers = {}) => ({
  Query: () => ({
    projectExtension: () => null,
    ...resolvers.query,
  }),
});
