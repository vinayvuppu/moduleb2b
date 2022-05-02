resource "commercetools_state" "order_open" {
  key  = "open"
  type = "OrderState"
  name = {
    en = "Open"
  }
  description = {
    en = "Order open"
  }
  initial     = true
  transitions = ["${commercetools_state.order_canceled.key}", "${commercetools_state.order_pending_approval.key}", "${commercetools_state.order_confirmed.key}"]
}

resource "commercetools_state" "order_pending_approval" {
  key  = "pendingApproval"
  type = "OrderState"
  name = {
    en = "Pending approval"
  }
  description = {
    en = "Order pending approval"
  }
  initial     = true
  transitions = ["${commercetools_state.order_canceled.key}", "${commercetools_state.order_confirmed.key}"]
}

resource "commercetools_state" "order_confirmed" {
  key  = "confirmed"
  type = "OrderState"
  name = {
    en = "Confirmed"
  }
  description = {
    en = "Order confirmed"
  }
  initial     = true
  transitions = ["${commercetools_state.order_complete.key}"]
}

resource "commercetools_state" "order_complete" {
  key  = "complete"
  type = "OrderState"
  name = {
    en = "Complete"
  }
  description = {
    en = "Order complete"
  }
}

resource "commercetools_state" "order_canceled" {
  key  = "canceled"
  type = "OrderState"
  name = {
    en = "Cancelled"
  }
  description = {
    en = "Order cancelled"
  }
}