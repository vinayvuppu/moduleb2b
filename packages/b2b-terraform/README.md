
  
# B2B TERRAFORM
## Overview

Terraform code to create Google Cloud elements and commercetools types to run b2b module:

### GOOGLE CLOUD

 - AddMonthlySpentTopic: Topic for order confirmation subscription

### COMMERCE TOOLS

 - Custom order states (workflow):
	 - **open**
	 - **pendingApproval**
	 - **confirmed**
	 - **complete**
	 - **canceled**
 - Types:
	 - **employee-type**: Type to extend *Customer* entity
	 - **quote-type**: Type to extend *Cart* entity
	 - **line-item-quote-type**: Type to extend *Line Item* entity
 - Tax Category:
	 - Crate a tax category with not tax
 - Subscriptions:
	 - **b2b-subscription-add-monthly-spent**: Subscription to listen *OrderCreated*  and *OrderStateChanged* events
 - Api extensions:
	 - **b2b-order-create-extension**: Api Extension over *Order* entity and *Create* event

  

### Create Google Storage Bucket to Store Terraform State
```bash
export PROJECT_ID=
```
In the `backend.tf` specification we define that bucket that will be used to store the Terraform state. This bucket needs to exist and can be created using [gsutil (https://cloud.google.com/storage/docs/gsutil). Each environment will declare a different `prefix` in the configuration.

We need to create a SA and the bucket first:

#### Create Terraform SA
Create a service account to perform the terraform operations
```bash
export TF_VAR_project_id=
export TF_VAR_sa_credentials=./keys/terraform-sa-${TF_VAR_project_id}.json
export TF_VAR_region=us-west2
export GOOGLE_APPLICATION_CREDENTIALS=${TF_VAR_sa_credentials}
export GOOGLE_PROJECT=${TF_VAR_project_id}
  
gcloud iam service-accounts create terraform --display-name "Terraform Service Account"

gcloud iam service-accounts keys create ${TF_VAR_sa_credentials} --iam-account terraform@${TF_VAR_project_id}.iam.gserviceaccount.com
```

  

#### Add roles to Terraform SA
```bash
gcloud projects add-iam-policy-binding ${TF_VAR_project_id} --member serviceAccount:terraform@${TF_VAR_project_id}.iam.gserviceaccount.com  --role roles/cloudkms.admin

gcloud projects add-iam-policy-binding ${TF_VAR_project_id} --member serviceAccount:terraform@${TF_VAR_project_id}.iam.gserviceaccount.com  --role roles/pubsub.admin

gcloud projects add-iam-policy-binding ${TF_VAR_project_id} --member serviceAccount:terraform@${TF_VAR_project_id}.iam.gserviceaccount.com --role roles/compute.admin

gcloud projects add-iam-policy-binding ${TF_VAR_project_id} --member serviceAccount:terraform@${TF_VAR_project_id}.iam.gserviceaccount.com --role roles/compute.storageAdmin

gcloud projects add-iam-policy-binding ${TF_VAR_project_id} --member serviceAccount:terraform@${TF_VAR_project_id}.iam.gserviceaccount.com --role roles/container.admin

gcloud projects add-iam-policy-binding ${TF_VAR_project_id} --member serviceAccount:terraform@${TF_VAR_project_id}.iam.gserviceaccount.com --role roles/iam.serviceAccountAdmin

gcloud projects add-iam-policy-binding ${TF_VAR_project_id} --member serviceAccount:terraform@${TF_VAR_project_id}.iam.gserviceaccount.com --role roles/storage.admin

gcloud projects add-iam-policy-binding ${TF_VAR_project_id} --member serviceAccount:terraform@${TF_VAR_project_id}.iam.gserviceaccount.com --role roles/run.admin

gcloud projects add-iam-policy-binding ${TF_VAR_project_id} --member serviceAccount:terraform@${TF_VAR_project_id}.iam.gserviceaccount.com --role roles/cloudscheduler.admin

gcloud projects add-iam-policy-binding ${TF_VAR_project_id} --member serviceAccount:terraform@${TF_VAR_project_id}.iam.gserviceaccount.com --role roles/iam.serviceAccountUser

```
#### Create Google Storage Bucket to Store Terraform State
[Bucket Naming Convention](https://cloud.google.com/storage/docs/naming?_ga=2.244857926.-257079089.1557751559)

In the `backend.tf` specification we define the bucket that will be used to store the Terraform state. This bucket

needs to exist and can be created using [gsutil](https://cloud.google.com/storage/docs/gsutil). Each environment can

declare a different `prefix` in the configuration
```bash

gsutil mb -p ${TF_VAR_project_id} -c regional -l ${TF_VAR_region} gs://terraform-${TF_VAR_project_id}/

gsutil versioning set on gs://terraform-${TF_VAR_project_id}/

```
Check the bucket created

```bash
gsutil ls -L
```

### Get it work

In order to get running this Terraform project we need:

  

- Download and install the custom provider from this [link](https://github.com/labd/terraform-provider-commercetools/releases), in this project we used version 0.19.0 of this plugin.

  

- Set the variable that is detailed [here](https://commercetools-terraform-provider.readthedocs.io/en/latest/#using-the-provider).

  

- Set the GOOGLE_APPLICATION_CREDENTIALS var with the location of the json according to the environment in order to access to the right tfstate stored in the bucket.

  

### Provider Documentation

  

The provider documentation regarding each resource is available in [this link](https://commercetools-terraform-provider.readthedocs.io/en/latest/)


### CI APP Deploy Service Account
```shell script
gcloud iam service-accounts create ci-app-deploy --display-name "Service Account to deploy"
gcloud iam service-accounts keys create ci-sa-deploy.json --iam-account ci-app-deploy@${TF_VAR_project_id}.iam.gserviceaccount.com

gcloud projects add-iam-policy-binding ${TF_VAR_project_id} --member serviceAccount:ci-app-deploy@${TF_VAR_project_id}.iam.gserviceaccount.com  --role roles/cloudkms.admin

gcloud projects add-iam-policy-binding ${TF_VAR_project_id} --member serviceAccount:ci-app-deploy@${TF_VAR_project_id}.iam.gserviceaccount.com  --role roles/pubsub.admin

gcloud projects add-iam-policy-binding ${TF_VAR_project_id} --member serviceAccount:ci-app-deploy@${TF_VAR_project_id}.iam.gserviceaccount.com --role roles/compute.admin

gcloud projects add-iam-policy-binding ${TF_VAR_project_id} --member serviceAccount:ci-app-deploy@${TF_VAR_project_id}.iam.gserviceaccount.com --role roles/compute.storageAdmin

gcloud projects add-iam-policy-binding ${TF_VAR_project_id} --member serviceAccount:ci-app-deploy@${TF_VAR_project_id}.iam.gserviceaccount.com --role roles/container.admin

gcloud projects add-iam-policy-binding ${TF_VAR_project_id} --member serviceAccount:ci-app-deploy@${TF_VAR_project_id}.iam.gserviceaccount.com --role roles/iam.serviceAccountAdmin

gcloud projects add-iam-policy-binding ${TF_VAR_project_id} --member serviceAccount:ci-app-deploy@${TF_VAR_project_id}.iam.gserviceaccount.com --role roles/storage.admin

gcloud projects add-iam-policy-binding ${TF_VAR_project_id} --member serviceAccount:ci-app-deploy@${TF_VAR_project_id}.iam.gserviceaccount.com --role roles/run.admin

gcloud projects add-iam-policy-binding ${TF_VAR_project_id} --member serviceAccount:ci-app-deploy@${TF_VAR_project_id}.iam.gserviceaccount.com --role roles/cloudscheduler.admin

gcloud projects add-iam-policy-binding ${TF_VAR_project_id} --member serviceAccount:ci-app-deploy@${TF_VAR_project_id}.iam.gserviceaccount.com --role roles/iam.serviceAccountUser

```