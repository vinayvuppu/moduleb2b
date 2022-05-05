terraform {
  backend "gcs" {
    credentials = "../../../keys/terraform-sa-ct-b2b-348510.json"
    bucket      = "terraform-fluted-volt-346608"
    prefix      = "commercetools"
  }
}