const fastifyPlugin = require('fastify-plugin');
const fastifyEnv = require('fastify-env');
const fastifyCommercetools = require('fastify-commercetools');

module.exports = fastifyPlugin((fastify, opts, next) => {
  fastify.register(fastifyEnv, {
    schema: {
      type: 'object',
      properties: {
        CT_API_URL: {
          type: 'string',
          default: 'https://api.europe-west1.gcp.commercetools.com'
        },
        CT_AUTH_URL: {
          type: 'string',
          default: 'https://auth.europe-west1.gcp.commercetools.com'
        },
        CT_PROJECT_KEY: {
          type: 'string',
          default: 'project-key'
        },
        CT_CLIENT_ID: {
          type: 'string',
          default: 'client-id'
        },
        CT_CLIENT_SECRET: {
          type: 'string',
          default: 'client-secret'
        },
        LOGGING_CONFIG_ENABLE: {
          type: 'boolean',
          default: true
        },
        LOGGING_CONFIG_USE_FASTIFY_LOGGER: {
          type: 'boolean',
          default: true
        },
        LOGGING_CONFIG_REQUEST: {
          type: 'boolean',
          default: true
        },
        LOGGING_CONFIG_BODY: {
          type: 'boolean',
          default: false
        },
        LOGGING_CONFIG_ERROR: {
          type: 'boolean',
          default: true
        }
      }
    },
    confKey: 'ctconfig'
  });

  fastify.register(
    fastifyPlugin((fastify, opts, done) => {
      const {
        CT_API_URL: host,
        CT_AUTH_URL: oauthHost,
        CT_PROJECT_KEY: projectKey,
        CT_CLIENT_ID: clientId,
        CT_CLIENT_SECRET: clientSecret,
        CT_CONCURRENCY: concurrency,
        LOGGING_CONFIG_ENABLE: enable,
        LOGGING_CONFIG_USE_FASTIFY_LOGGER: useFastifyLogger,
        LOGGING_CONFIG_REQUEST: request,
        LOGGING_CONFIG_BODY: body,
        LOGGING_CONFIG_ERROR: error
      } = fastify.ctconfig;
      const commercetoolsConfig = {
        commercetools: {
          host,
          oauthHost,
          projectKey,
          clientId,
          clientSecret,
          concurrency,
          loggingConfig: {
            enable,
            useFastifyLogger,
            request,
            body,
            error
          }
        }
      };

      fastify.register(fastifyCommercetools, commercetoolsConfig);
      done();
    })
  );

  next();
});
