terraform {
  backend "gcs" {
    credentials = "../../../keys/terraform-sa-ct-b2b-348510.json"
    bucket      = "terraform-ct-b2b-348510"
    prefix      = "commercetools"
  }
}