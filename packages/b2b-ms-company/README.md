
<!--lint disable list-item-indent-->
# COMPANY MICROSERVICE
## Overview

This package includes the company microservice.
The microservice exposes a series of REST endpoints for the management of the company entity
  
## Swagger documentation
[Doc](./docs/swagger.yml)

## TECHNOLOGIES

-  [**NodeJS v10**](https://nodejs.org/docs/latest-v10.x/api/index.html)

-  **[Fastify](https://www.fastify.io/):** As server
-  **[JestJS](https://jestjs.io/):** For testing
-  **[Eslint](https://eslint.org/):** For linting
-  **[Google Cloud](https://cloud.google.com/)**: As cloud provider
-  **[Docker](https://www.docker.com/)**: For container generation

 
## PLUGINS
### CommerceTools
Includes the [fastify-commercetools]([https://github.com/Devgurusio/fastify-commercetools](https://github.com/Devgurusio/fastify-commercetools)) plugin that decorates fastify with repositories for handle CT entities

### Health
Includes the [fastify-healthcheck](https://github.com/smartiniOnGitHub/fastify-healthcheck#readme) plugin and creates two health endpoints:
- GET */live*
- GET */ready*

### Metrics
Includes the [fastify-metrics](https://github.com/SkeLLLa/fastify-metrics) plugin and expose the `/metrics` endpoint for export Prometheus metrics

### Swagger
Plugin for generate swagger documentation based on OpenApi v3
 
### Error Handler
#### Error Response
The error response object is based on [JSON API specification](https://jsonapi.org/format/1.1/#errors) and has the following structure:

Error objects must be returned as an array keyed by `errors`
-  **id**: unique identifier for this particular occurrence of the problem.

-  **status**: the HTTP status code applicable to this problem

-  **code**: an internal specific error code

-  **title**: a short, human-readable summary of the problem

-  **detail**: a human-readable explanation

-  **meta**: a meta object containing non-standard meta-information

Example:
```javascript
{
	errors: [
				{
					status:  "422",
					title:  "Invalid Attribute",
					code:  "INVALID_ATTRIBUTE",
					detail:  "The attribute 'foo' is not valid"
				}
			]
}
```
## NPM Scripts
-  **lint**: runs linting using eslint/prettier
-  **format**: runs linting and fix the errors
-  **start**: runs the server in port 4444 by default
-  **start-dev**: runs the server with nodemon with hot reloading
-  **test**: runs the project tests and shows coverage
-  **swagger**: generates the swagger documentation in the folder */docs*

## Environment variables

The following variables must be defined/overwritten so that the service can work properly
|VARIABLE|DESCRIPTION|DEFAULT
|--|--|--
| NODE_ENV | Environment | development
| HOST | Server address | localhost |
| PORT | Server port | 8080 |
| CT_API_URL | commercetools API URL | [https://api.us-central1.gcp.commercetools.com](https://api.us-central1.gcp.commercetools.com) |
| CT_AUTH_URL | commercetools auth URL | [https://auth.us-central1.gcp.commercetools.com](https://auth.us-central1.gcp.commercetools.com) |
| CT_PROJECT_KEY | commercetools project key | - |
| CT_CLIENT_ID | commercetools client id | - |
| CT_CLIENT_SECRET | commercetools client secret | - |
| CT_SCOPE | commercetools scope | - |
| GC_PROJECT_ID | The Google Cloud project id | - |
| GCLOUD_SERVICE_KEY | Service Account key | - |
| LOCALE | Primary locale for name | en |
  
## Deployment

### Google Cloud Run

We can use [Google cloud run](https://cloud.google.com/run) to deploy the microservice if we serve just HTTP request and we don't need Kubernetes (Helm, custom certificates, Gateways, Istio...)

For that we have the  [ms-company-ci-master.yaml](../../.github/workflows/ms-company-ci-master.yaml) file, where we define the deployment setup
