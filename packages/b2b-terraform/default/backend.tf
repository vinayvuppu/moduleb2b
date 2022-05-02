terraform {
  backend "gcs" {
    credentials = "../../../keys/terraform-sa-fluted-volt-346608.json"
    bucket      = "terraform-fluted-volt-346608"
    prefix      = "commercetools"
  }
}