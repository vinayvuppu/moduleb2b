const fastifyPlugin = require('fastify-plugin');
const { ApolloServer } = require('apollo-server-fastify');
const { buildFederatedSchema } = require('@apollo/federation');
const { makeResolvers } = require('../../schema/resolvers');
const { typeDefs } = require('../../schema/types');
const { Company } = require('../../datasources/company');
require('isomorphic-fetch');

module.exports = fastifyPlugin(async fastify => {
  const { COMPANY_MS_URL: companyMsUrl } = fastify.ctconfig;

  const { CustomerRepository } = fastify.commercetools.repositories;

  const server = new ApolloServer({
    schema: buildFederatedSchema([
      { typeDefs, resolvers: makeResolvers({ CustomerRepository }) }
    ]),
    dataSources: () => ({ CompanyApi: new Company({ url: companyMsUrl }) })
  });

  const apolloServerFastify = await server.createHandler({
    path: '/employees'
  });
  fastify.register(apolloServerFastify);
});
