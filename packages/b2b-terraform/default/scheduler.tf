resource "google_cloud_scheduler_job" "order_create_api_extension_keep_alive" {
  name        = "order_create_api_extension_keep_alive"
  description = "The job that keeps alive the order create api extension function"
  schedule    = "0 */1 * * *"
  time_zone   = "America/Los_Angeles"
  region      = "us-central1"

  http_target {
    http_method = "GET"
    uri         = "https://${var.region_functions}-${var.gcp_project_id}.cloudfunctions.net/b2bOrderCreate"
  }
}