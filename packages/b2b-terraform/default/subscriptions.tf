resource "commercetools_subscription" "add-monthly-spent" {
  key        = "b2b-subscription-add-monthly-spent"
  depends_on = [google_pubsub_topic.topic]

  destination = {
    type       = "google_pubsub"
    project_id = var.gcp_project_id
    topic      = var.add_monthly_spent_topic
  }

  message {
    resource_type_id = "order"
    types            = ["OrderCreated", "OrderStateChanged"]
  }
}
