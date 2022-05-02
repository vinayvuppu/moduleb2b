
  

# ORDER CREATION API EXTENSION
## Overview

This is a firebase function to decide the initial state of the order depending on the company rules.
When the order is created, commercetools call to the function, and it evaluates the company rules and decide the initial order state: Confirmed or Pending Approval
  
## Deployment

### Firebase
For the deployment we have [order-crate-api-extension-ci-master.yaml](../../.github/workflows/order-crate-api-extension-ci-master.yaml) file, where we define the deployment setup
