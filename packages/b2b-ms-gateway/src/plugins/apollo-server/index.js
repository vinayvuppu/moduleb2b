const fastifyPlugin = require('fastify-plugin');
const { ApolloServer } = require('apollo-server-fastify');
const { ApolloGateway } = require('@apollo/gateway');

require('isomorphic-fetch');

module.exports = fastifyPlugin(async fastify => {
  const { EMPLOYEE_MS_URL, QUOTE_MS_URL } = fastify.config;

  const gateway = new ApolloGateway({
    serviceList: [
      { name: 'employees', url: EMPLOYEE_MS_URL },
      { name: 'quotes', url: QUOTE_MS_URL }
      // more services
    ]
  });

  const server = new ApolloServer({
    gateway,
    // Disable subscriptions (not currently supported with ApolloGateway)
    subscriptions: false,
    introspection: true,
    playground: true
  });
  const apolloServerFastify = await server.createHandler({});
  fastify.register(apolloServerFastify);
});
