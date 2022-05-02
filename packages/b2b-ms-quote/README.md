<!--lint disable list-item-indent-->

# QUOTE MICROSERVICE
## Overview

This is a MS that provides a graphql endpoint to manage the CT B2B entity quote.
The employee entity is inherit from the customer entity
This microservice use [Fastify](https://github.com/fastify/fastify) framework.
  
## GRAPHQL documentation
La documentación del microservicio está disponible una vez desplegado el gateway, accediendo al playground por el navegador
:gateway-url/graphql

[PLAYGROUND](https://ms-gateway-q7ymaj4lwa-ue.a.run.app/graphql)
## TECHNOLOGIES

-  [**NodeJS v10**](https://nodejs.org/docs/latest-v10.x/api/index.html)

-  **[Fastify](https://www.fastify.io/):** As server
- **[Apollo Server](https://www.apollographql.com/docs/apollo-server/):** Graphql server
-  **[JestJS](https://jestjs.io/):** For testing
-  **[Eslint](https://eslint.org/):** For linting
-  **[Google Cloud](https://cloud.google.com/)**: As cloud provider
-  **[Docker](https://www.docker.com/)**: For container generation

 
## PLUGINS
### Apollo Server Fastify
Includes the [apollo-server-fastify](https://github.com/apollographql/apollo-server/tree/master/packages/apollo-server-fastify) plugins to start a graphql server

### CommerceTools
Includes the [fastify-commercetools]([https://github.com/Devgurusio/fastify-commercetools](https://github.com/Devgurusio/fastify-commercetools)) plugin that decorates fastify with repositories for handle CT entities

### Health
Includes the [fastify-healthcheck](https://github.com/smartiniOnGitHub/fastify-healthcheck#readme) plugin and creates two health endpoints:
- GET */live*
- GET */ready*

### Metrics
Includes the [fastify-metrics](https://github.com/SkeLLLa/fastify-metrics) plugin and expose the `/metrics` endpoint for export Prometheus metrics

## NPM Scripts
-  **lint**: runs linting using eslint/prettier
-  **start**: runs the server in port 4444 by default
-  **start-dev**: runs the server with nodemon with hot reloading
-  **test**: runs the project tests and shows coverage

## Environment variables

The following variables must be defined/overwritten so that the service can work properly
|VARIABLE|DESCRIPTION|DEFAULT
|--|--|--
| NODE_ENV | Environment | development
| HOST | Server address | localhost |
| PORT | Server port | 4444 |
| CT_API_URL | commercetools API URL | [https://api.us-central1.gcp.commercetools.com](https://api.us-central1.gcp.commercetools.com) |
| CT_AUTH_URL | commercetools auth URL | [https://auth.us-central1.gcp.commercetools.com](https://auth.us-central1.gcp.commercetools.com) |
| CT_PROJECT_KEY | commercetools project key | - |
| CT_CLIENT_ID | commercetools client id | - |
| CT_CLIENT_SECRET | commercetools client secret | - |
| CT_SCOPE | commercetools scope | - |
| GC_PROJECT_ID | The Google Cloud project id | - |
  
## Deployment

### Google Cloud Run

We can use [Google cloud run](https://cloud.google.com/run) to deploy the microservice if we serve just HTTP request and we don't need Kubernetes (Helm, custom certificates, Gateways, Istio...)

For that we have the  [ms-quote-ci-master.yaml](../../.github/workflows/ms-quote-ci-master.yaml) file, where we define the deployment setup
