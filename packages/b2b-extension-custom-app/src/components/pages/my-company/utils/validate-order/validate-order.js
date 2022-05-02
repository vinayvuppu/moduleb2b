export function validateLineItems(cartDraft) {
  return cartDraft.lineItems.length > 0 || cartDraft.customLineItems.length > 0
    ? undefined
    : createError([
        {
          code: 'RequiredField',
          field: 'lineItems',
        },
      ]);
}

export function validateShippingMethod(cartDraft) {
  return cartDraft.shippingInfo
    ? undefined
    : createError([
        {
          code: 'RequiredField',
          field: 'shippingInfo',
        },
      ]);
}

export function validateCustomer(cartDraft) {
  return cartDraft.customerId &&
    cartDraft.billingAddress &&
    cartDraft.billingAddress.id &&
    cartDraft.shippingAddress &&
    cartDraft.shippingAddress.id
    ? undefined
    : createError([
        {
          code: 'RequiredField',
          field: 'customer',
        },
      ]);
}
export function validateCompany(cartDraft, company) {
  return company &&
    company.id &&
    cartDraft.billingAddress &&
    cartDraft.billingAddress.country &&
    cartDraft.shippingAddress &&
    cartDraft.shippingAddress.country
    ? undefined
    : createError([
        {
          code: 'RequiredField',
          field: 'company',
        },
      ]);
}

// This function creates an object that resembles what the CTP API
// responds with as an error.
function createError(errors) {
  return { body: { errors } };
}
