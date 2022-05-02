const fastifyPlugin = require('fastify-plugin');
const { ApolloServer } = require('apollo-server-fastify');
const { buildFederatedSchema } = require('@apollo/federation');
const { makeResolvers } = require('../../schema/resolvers');
const { typeDefs } = require('../../schema/types');
require('isomorphic-fetch');

module.exports = fastifyPlugin(async fastify => {
  const {
    CartRepository,
    TaxCategoryRepository,
    CustomObjectRepository
  } = fastify.commercetools.repositories;

  const server = new ApolloServer({
    schema: buildFederatedSchema([
      {
        typeDefs,
        resolvers: makeResolvers({
          CartRepository,
          TaxCategoryRepository,
          CustomObjectRepository
        })
      }
    ])
  });

  const apolloServerFastify = await server.createHandler({
    path: '/quotes'
  });
  fastify.register(apolloServerFastify);
});
