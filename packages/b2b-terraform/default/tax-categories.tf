resource "commercetools_tax_category" "no_tax" {
  name = "No Tax Category"
  key  = "no-tax"
}

resource "commercetools_tax_category_rate" "standard-tax-category" {
  for_each = toset(var.ct_countries)

  tax_category_id   = commercetools_tax_category.no_tax.id
  name              = "No tax rate"
  amount            = 0
  included_in_price = true
  country           = each.key
}