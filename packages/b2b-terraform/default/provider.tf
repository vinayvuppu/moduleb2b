terraform {
  required_providers {
    commercetools = {
      source = "labd/commercetools"
    }
  }
}

provider "commercetools" {
  client_id     = "hRBAW3rJav6zYX0zIb77XS8S"
  client_secret = "pVwTtg8-bq4cVDbani-L_a20LQ06BIgv"
  project_key   = "b2b1"
  scopes        = "manage_project:b2b1 manage_api_clients:b2b1 view_api_clients:b2b1"
  api_url       = "https://api.us-central1.gcp.commercetools.com"
  token_url     = "https://auth.us-central1.gcp.commercetools.com"
}

provider "google" {
  project     = var.gcp_project_id
  region      = var.region
  credentials = "../../../keys/terraform-sa-fluted-volt-346608.json"
}
