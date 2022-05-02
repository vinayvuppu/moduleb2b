resource "google_pubsub_topic_iam_binding" "publisher" {
  project    = var.gcp_project_id
  topic      = var.add_monthly_spent_topic
  role       = "roles/pubsub.publisher"
  members    = ["serviceAccount:subscriptions@commercetools-platform.iam.gserviceaccount.com"]
  depends_on = [google_pubsub_topic.topic]
}

resource "google_pubsub_topic" "topic" {
  name = var.add_monthly_spent_topic
}
