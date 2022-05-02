<h2  align="center">commercetools B2B module</h2>
<p  align="center">
<i>Monorepository with functions, microservices, scripts and merchant center custom app for starting B2B experience in commercetools 🛠🚀</i>
</p>

## Motivation
This module can be used as the **starting point** to **build and develop** a B2B experience in commercetools.

## Getting started
This repository contains all packages to deploy B2B starter pack solution for commercetools. It includes things like initial scripts, API extensions, microservices, custom app, etc.

## Packages included

 - Merchant Center B2B custom application [b2b-extension-custom-app](./packages/b2b-extension-custom-app): Custom app for handle companies, employees, budgets, quotes ...
 - Company MS [b2b-ms-company](./packages/b2b-ms-company): REST microservice to handle the company entity.
 - Employee MS [b2b-ms-employee](./packages/b2b-ms-employee): GRAPHQL microservice to handle the employee entity.
 - Quote MS [b2b-ms-quote](./packages/b2b-ms-quote): GRAPHQL microservice to handle the quote entity.
 - Gateway MS [b2b-ms-gateway](./packages/b2b-ms-gateway): GRAPHQL gateway for quote and employee ms
 - Order Creation Api Extension [b2b-order-create-api-extension](./packages/b2b-order-create-api-extension): Firebase function to decide the initial state of the order depending on the company rules
 - Order confirmation subscription [b2b-subscription-add-monthly-spent](./packages/b2b-subscription-add-monthly-spent): Firebase function listening to order state change event, to increase the employee's budget spent if necessary when change to confirmed state
 - Infrastructure creation: [b2b-terraform](./packages/b2b-terraform): Terraform scripts to create GC elements and commercetools types
 - Data creation: [b2b-init-data](./packages/b2b-init-data): NPM script to init company and employees data.

## Set up teams and security

We need to create two teams, B2B Admin and B2B Company teams to do it, we must go to [Organizations and teams](https://mc.us-central1.gcp.commercetools.com/account/organizations), select our project, press the Add team button, put the name ( B2B Admin / B2B Company), enter the team and finally in the permissions tab set the following permissions for our current project.

### B2B Administrator
Enable all permissions except the permissions that are in the Developer Settings tab.

### B2B Company
In the Orders tab enables all permissions and the rest sets everything as a viewer (See all) except the permissions that are in the Developer Settings tab.

On hide menu items, we have to check all checkbox except Hide custom applications

## Deployment

### Requirements

- Google Cloud project
- Firebase project
- Commercetools project

### Environment variables

The following environment variables must be set for the correct module b2b deployment.
[Set environment variables in github secrets](https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets).

|VARIABLE|DESCRIPTION|DEFAULT
|-|-|-|
| CT_API_URL | commercetools API URL | [https://api.us-central1.gcp.commercetools.com](https://api.us-central1.gcp.commercetools.com) |
| CT_AUTH_URL | commercetools auth URL | [https://auth.us-central1.gcp.commercetools.com](https://auth.us-central1.gcp.commercetools.com) |
| CT_PROJECT_KEY | commercetools project key | - |
| CT_CLIENT_ID | commercetools client id | - |
| CT_CLIENT_SECRET | commercetools client secret | - |
| CTP_SCOPES | commercetools api scope | - |
| CTP_COUNTRIES | commercetools project countries. Used for create tax rates | ["US"] |
| LOCALE | commercetools project locale | EN|
| GC_PROJECT_ID | The Google Cloud project id | - |
| GC_PROJECT_REGION|The Google Cloud project region|us-central1
| GOOGLE_CLIENT_SECRET_base64|Google Cloud service account in base 64 for terraform provider|-
| GCP_SA_EMAIL| Google Cloud service account email|-|
| GCP_SA_KEY| Google Cloud service account key in base 64 for google cloud deployments|-|
| FIREBASE_PROJECT_ID| Firebase project id|-
| FIREBASE_TOKEN| Firebase project token|-
| ADD_MONTHLY_SPENT_TOPIC| Name of the topic to publish CT subscription data|-
| MS_DOMAIN | The domain provided by GC when deploy microservices in cloud run. Necessary make a deployment to obtain it|-

For modules deployment see *Manual deployment*

In case extra development is needed, the repo is prepared with a IC/CD flow. See *CI/CD Deployment*

### CI/CD Deployment

The b2b module uses [GitHub actions]([https://github.com/features/actions](https://github.com/features/actions) as CI/CD.

The repo contains the workflow descriptor files in the [github/workflows](./github/workflows) folder:

-  *feature/*** branches: Will execute the **-ci-feature.yaml* files and run lint, build and test steps
-  *master* branch: Will execute the **-ci-master.yaml* and run lint, build, test and deploy steps

### Manual deployment

The first deployment needs to be done following an order, due to the dependence between B2B module packages. 

Follow these steps

- To run the github workflows, we need to make a  request to each package repository. To do this we are goint to use [github api](https://developer.github.com/v3/repos/#create-a-repository-dispatch-event).
First we need to [generate github personal access tokens](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line).

- Set environment variables under github secrets [https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets](https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets). *There are some variables that we need to set after execute next steps.

- Create Infrastructure with terraform
	- See [b2b-terraform](./packages/b2b-terraform) readme
	- Execute *terraform* workflow:

	```bash
	curl --location --request POST 'https://api.github.com/repos/[:repo_name]/dispatches' --header 'Accept: application/vnd.github everest-preview+json' --header 'Content-Type: application/json' --header 'Authorization: Bearer [:personal_access_token]' --data-raw '{"event_type":"terraform"}'
	```

- Deploy Company MS
	- Execute *company ms* workflow

	```bash
  curl --location --request POST 'https://api.github.com/repos/[:repo_name]/dispatches' --header 'Accept: application/vnd.github.everest-preview+json' --header 'Content-Type: application/json' --header 'Authorization: Bearer [:personal_access_token]' --data-raw '{"event_type":"ms-company"}'
  ```

	- Set env variable *MS_DOMAIN*

		- Go to google cloud console: https://console.cloud.google.com/run/detail/[:REGION]/ms-company/metrics?project=[:GC_PROJECT_ID]
		- Identify ms-company url. Should be something like https://ms-company-[random_string]-ue.a.run.app
		- Set the env variable *MS-DOMAIN* with *[random_string]-ue.a.run.app*

- Deploy Functions:
	- Execute *order create api extension* workflow
	```bash
	curl --location --request POST 'https://api.github.com/repos/[:repo_name]/dispatches' --header 'Accept: application/vnd.github everest-preview+json' --header 'Content-Type: application/json' --header 'Authorization: Bearer [:personal_access_token]' --data-raw '{"event_type":"order-craeate-api-extension"}'
	```

	- Execute *subscription* workflow
	```bash
	curl --location --request POST 'https://api.github.com/repos/[:repo_name]/dispatches' --header 'Accept: application/vnd.github.everest-preview+json' --header 'Content-Type: application/json' --header 'Authorization: Bearer [:personal_access_token]' --data-raw '{"event_type":"subscription-add-monthly-spent"}'
	```

- Deploy Employee MS

```bash
curl --location --request POST 'https://api.github.com/repos/[:repo_name]/dispatches' --header 'Accept: application/vnd.github.everest-preview+json' --header 'Content-Type: application/json' --header 'Authorization: Bearer [:personal_access_token]' --data-raw '{"event_type":"ms-employee"}'
```

- Deploy Quote MS

```bash
curl --location --request POST 'https://api.github.com/repos/[:repo_name]/dispatches' --header 'Accept: application/vnd.github.everest-preview+json' --header 'Content-Type: application/json' --header 'Authorization: Bearer [:personal_access_token]' --data-raw '{"event_type":"ms-quote"}'
  ```

- Deploy Gateway MS

```bash
 curl --location --request POST 'https://api.github.com/repos/[:repo_name]/dispatches' --header 'Accept: application/vnd.github.everest-preview+json' --header 'Content-Type: application/json' --header 'Authorization: Bearer [:personal_access_token]' --data-raw '{"event_type":"ms-gateway"}'
```

- Deploy Custom App

```bash
 curl --location --request POST 'https://api.github.com/repos/[:repo_name]/dispatches' --header 'Accept: application/vnd.github.everest-preview+json' --header 'Content-Type: application/json' --header 'Authorization: Bearer [:personal_access_token]' --data-raw '{"event_type":"custom-app"}'
```

- [Optional for demo purpose ] Load Sunrise Sample Data
In order to have a good data set, we can load Sunrise data project
https://github.com/commercetools/commercetools-sunrise-data

```bash
npm run import:data
```

- [Optional for demo purpose ] Init data project
To prepare companies and test customer for the B2B project, we have to run the scripts available in packages/b2b-init-data

```bash
cd packages/b2b-init-data
npm install
npm run init-data
npm run assign-products
```

## Documentation

Please look at the single packages in [packages folder](./packages) for documentation specific of each package.