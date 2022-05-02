resource "commercetools_api_extension" "b2b-order-create-extension" {
  key = "b2b-order-create-extension"

  destination = {
    type = "HTTP"
    url  = "https://${var.region_functions}-${var.gcp_project_id}.cloudfunctions.net/b2bOrderCreate"
  }

  trigger {
    resource_type_id = "order"
    actions          = ["Create"]
  }

  timeout_in_ms = 2000
}