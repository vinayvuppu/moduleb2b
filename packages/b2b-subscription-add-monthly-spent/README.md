
  
# ORDER CONFIRMATION SUBSCRIPTION
## Overview

This is a firebase function listening order state change event. When the order changes to Confirmed state, the function will add the order total price  to the account of the employee who generated the order
  
## Deployment

### Firebase
For the deployment we have [subscription-add-monthly-spent-ci-master.yaml](../../.github/workflows/subscription-add-monthly-spent-ci-master.yaml) file, where we define the deployment setup
