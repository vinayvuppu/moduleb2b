const { createClient } = require('@commercetools/sdk-client');
const functions = require('firebase-functions');
const {
  createAuthMiddlewareForClientCredentialsFlow
} = require('@commercetools/sdk-middleware-auth');
const { createHttpMiddleware } = require('@commercetools/sdk-middleware-http');
const { createRequestBuilder } = require('@commercetools/api-request-builder');
const fetch = require('node-fetch');
const {
  ct: { authurl, projectkey, clientid, clientsecret, scope, apiurl }
} = functions.config();

const client = createClient({
  middlewares: [
    createAuthMiddlewareForClientCredentialsFlow({
      fetch,
      host: authurl,
      projectKey: projectkey,
      credentials: {
        clientId: clientid,
        clientSecret: clientsecret
      },
      scopes: [scope]
    }),
    createHttpMiddleware({
      host: apiurl,
      fetch
    })
  ]
});

const requestBuilder = createRequestBuilder({
  projectKey: projectkey
});

module.exports = {
  client,
  requestBuilder
};
