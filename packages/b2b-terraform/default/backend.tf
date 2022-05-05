terraform {
  backend "gcs" {
    credentials = "../../../keys/terraform-sa-ct-b2b-349312.json"
    bucket      = "terraform-ct-b2b-349312"
    prefix      = "commercetools"
  }
}