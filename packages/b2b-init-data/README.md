  
# B2B module init data script

## Overview
NPM scripts for initialize B2B module data. Create companies and employees

## NPM Scripts
-  **init-data**: Create new companies and employees for B2B module
-  **clean-data**: Remove B2B module data (carts, orders, employees and companies)
- **assign-products**: Assign products to the companies created

## Environment variables
The following variables must be defined/overwritten so that the service can work properly
| VARIABLE | DESCRIPTION | DEFAULT |
|-|-|-|
| CT_API_URL | commercetools API URL | [https://api.us-central1.gcp.commercetools.com](https://api.us-central1.gcp.commercetools.com) |
| CT_AUTH_URL | commercetools auth URL | [https://auth.us-central1.gcp.commercetools.com](https://auth.us-central1.gcp.commercetools.com) |
| CT_PROJECT_KEY | commercetools project key | - |
| CT_CLIENT_ID | commercetools client id | - |
| CT_CLIENT_SECRET | commercetools client secret | - |
| COMPANY_MS_URL | company ms url | - |

## Execution
 1. Install dependencies
 `npm install`
 2. Execute script
 `npm run [init-data|clean-data|assign-products]`
