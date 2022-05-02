const fastifyPlugin = require('fastify-plugin');
const fastifyOas = require('fastify-oas');

module.exports = fastifyPlugin((fastify, opts, next) => {
  const swaggerConfig = {
    exposeRoute: true,
    routePrefix: '/docs',
    swagger: {
      info: {
        title: 'Company Microservice',
        description: 'Commercetools B2B extension to manage companies',
        version: '1.0.0'
      },
      schemes: ['https'],
      consumes: ['application/json'],
      produces: ['application/json'],

      servers: [
        {
          url: fastify.config['COMPANY_MS_URL'] || 'http://localhost:4444',
          description: 'Server'
        }
      ],
      ...opts
    }
  };

  fastify.register(fastifyOas, swaggerConfig);

  next();
});
