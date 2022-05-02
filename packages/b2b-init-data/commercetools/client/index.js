require('isomorphic-fetch');
const { createClient } = require('@commercetools/sdk-client');
const {
  createAuthMiddlewareForClientCredentialsFlow
} = require('@commercetools/sdk-middleware-auth');
const { createHttpMiddleware } = require('@commercetools/sdk-middleware-http');

const clientId = process.env.CT_CLIENT_ID;
const clientSecret = process.env.CT_CLIENT_SECRET;
const projectKey = process.env.CT_PROJECT_KEY;
const authUrl = 'https://auth.us-central1.gcp.commercetools.com';
const apiUrl = 'https://api.us-central1.gcp.commercetools.com';
const buildClient = () => {
  const authMiddleware = createAuthMiddlewareForClientCredentialsFlow({
    host: authUrl,
    projectKey,
    credentials: {
      clientId,
      clientSecret
    }
  });

  const httpMiddleware = createHttpMiddleware({
    host: apiUrl
  });

  return createClient({
    middlewares: [authMiddleware, httpMiddleware]
  });
};

const client = buildClient();

module.exports = client;
