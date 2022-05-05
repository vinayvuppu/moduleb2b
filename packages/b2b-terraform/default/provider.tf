terraform {
  required_providers {
    commercetools = {
      source = "labd/commercetools"
    }
  }
}

provider "commercetools" {
  client_id     = "EEqccJYardZozl4XSFd_t-pl"
  client_secret = "SR52ZNtwrRHfcc66OI-09WvQFZ8S2iBg"
  project_key   = "ct-b2b"
  scopes        = "manage_project:ct-b2b manage_api_clients:ct-b2b view_api_clients:ct-b2b view_audit_log:ct-b2b"
  api_url       = "https://api.europe-west1.gcp.commercetools.com"
  token_url     = "https://auth.europe-west1.gcp.commercetools.com"
}

provider "google" {
  project     = var.gcp_project_id
  region      = var.region
  credentials = "../../../keys/terraform-sa-ct-b2b-348510.json"
}
