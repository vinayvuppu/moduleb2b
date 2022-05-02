resource "commercetools_type" "employee_type" {
  key = "employee-type"
  name = {
    en = "Employee custom type"
  }
  description = {
    en = "Custom type for employees"
  }

  resource_type_ids = ["customer"]

  field {
    name = "roles"

    label = {
      en = "Roles"
    }

    type {
      name = "Set"
      element_type {
        name = "Enum"

        values = {
          b2b-company-admin    = "B2B Company Admin"
          b2b-company-employee = "B2B Company Employee"
        }
      }
    }
  }

  field {
    name     = "amountExpent"
    required = false
    label = {
      en = "Total Amount expent in the actual month"
    }
    type {
      name = "Money"
    }
  }
}

resource "commercetools_type" "cart_quote_type" {
  key = "quote-type"
  name = {
    en = "Quote custom type"
  }
  description = {
    en = "Custom type for quotes"
  }

  resource_type_ids = ["order"]

  field {
    name     = "quoteState"
    required = false

    label = {
      en = "Quote state"
    }

    type {
      name = "Enum"
      values = {
        initial   = "The buyer is in the process of create the quote"
        submitted = "The buyer has submitted a request for a quote"
        approved  = "The seller has completed the quote and sent a response to the buyer"
        closed    = "The buyer has canceled the quote request"
        declined  = "The seller has declined the request for a quote"
        expired   = "The buyer didn’t respond to the seller’s reply within the designated time period, and the quote is no longer valid"
        placed    = "The buyer has converted the quote into an order and proceeded with the checkout"
      }
    }
  }

  field {
    name     = "isQuote"
    required = false
    label = {
      en = "Flat to mark the cart as a quote"
    }
    type {
      name = "Boolean"
    }
  }

  field {
    name     = "quoteNumber"
    required = false
    label = {
      en = "String that uniquely identifies a quote"
    }
    type {
      name = "String"
    }
  }

  field {
    name     = "percentageDiscountApplied"
    required = false
    label = {
      en = "Percentage discount applied to the quote"
    }
    type {
      name = "Number"
    }
  }
}

resource "commercetools_type" "line_item_quote_type" {
  key = "line-item-quote-type"
  name = {
    en = "Quote line items custom type"
  }
  description = {
    en = "Custom type for quotes line item"
  }

  resource_type_ids = ["line-item"]

  field {
    name     = "originalPrice"
    required = false
    label = {
      en = "Price of the line item before it is changed"
    }
    type {
      name = "Money"
    }
  }

  field {
    name     = "percentageDiscountApplied"
    required = false
    label = {
      en = "Flat to mark if a percentage discount is applied to the line item"
    }
    type {
      name = "Boolean"
    }
  }
}