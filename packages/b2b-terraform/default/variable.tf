variable "gcp_project_id" {
  type        = string
  description = "The Google Cloud project identifier"
  default     = "fluted-volt-346608"
}

variable "ct_project_key" {
  type        = string
  description = "The Commerce Tools project key"
  default     = "b2b1"
}

variable "region" {
  type        = string
  description = "region for the gcp resources"
  default     = "us-central1"
}

variable "region_functions" {
  type        = string
  description = "region for fireBase functions"
  default     = "us-central1"
}

variable "add_monthly_spent_topic" {
  type    = string
  default = "AddMonthlySpentTopic"
}

variable "ct_countries" {
  type    = list(string)
  default = ["US"]
}