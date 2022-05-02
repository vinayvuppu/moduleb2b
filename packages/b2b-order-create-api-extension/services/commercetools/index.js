/* eslint-disable no-console */

const functions = require('firebase-functions');
const { createClient } = require('@commercetools/sdk-client');
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

const getEmployeeById = async id => {
  const requestBuilder = createRequestBuilder({
    projectKey: projectkey
  });

  try {
    const response = await client.execute({
      uri: requestBuilder.customers.parse({ id }).build(),
      method: 'GET'
    });

    return response.body;
  } catch (ex) {
    console.error('getEmployeeById error', ex);
    throw ex;
  }
};

module.exports = {
  getEmployeeById
};
