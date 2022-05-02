const fastifyPlugin = require('fastify-plugin');
const fastifyEnv = require('fastify-env');

module.exports = fastifyPlugin((fastify, opts, next) => {
  const configSchema = {
    type: 'object',
    properties: {
      NODE_ENV: {
        type: 'string',
        default: 'development'
      },
      HOST: {
        type: 'string',
        default: '127.0.0.1'
      },
      PORT: {
        type: 'integer',
        default: 4444
      },
      EMPLOYEE_MS_URL: {
        type: 'string',
        default: 'ms-employee-url'
      },
      QUOTE_MS_URL: {
        type: 'string',
        default: 'ms-quote-url'
      }
    }
  };

  fastify.register(fastifyEnv, { schema: configSchema, data: opts });

  next();
});
