import { defineMessages } from 'react-intl';

export default defineMessages({
  country: {
    id: 'Orders.Create.CartSummary.country',
    description: 'currency info text',
    defaultMessage: 'Country specific pricing set to',
  },
  changeCountryLabel: {
    id: 'Orders.Create.CartSummary.changeCountryLabel',
    description: 'label for change country specific pricing',
    defaultMessage: 'Change country specific pricing',
  },
  company: {
    id: 'Orders.Create.CartSummary.company',
    description: 'customer group info text',
    defaultMessage: 'Company {name}',
  },
  customer: {
    id: 'Orders.Create.CartSummary.customer',
    description: 'customer info text',
    defaultMessage: 'for {name} ({email})',
  },
  currency: {
    id: 'Orders.Create.CartSummary.currency',
    description: 'currency info text',
    defaultMessage: 'Currency set to',
  },
  store: {
    id: 'Orders.Create.CartSummary.store',
    description: 'Store info text',
    defaultMessage: 'Store set to',
  },
  cartUpdated: {
    id: 'Orders.Create.CartSummary.cartUpdated',
    description:
      'Label for the confirmation message when line item added to the cart',
    defaultMessage: 'The cart has been successfully updated',
  },
  missingDiscountCode: {
    id: 'Orders.Create.CartSummary.missingDiscountCode',
    description: 'Message when trying to apply an invalid discount code',
    defaultMessage:
      'The discount code that you want to apply to the cart does not exist',
  },
  outdatedDiscountCode: {
    id: 'Orders.Create.CartSummary.outdatedDiscountCode',
    description: 'Message when trying to apply an outdated discount code',
    defaultMessage: 'The discount code that you want to apply has expired',
  },
  budgetRemaining: {
    id: 'Orders.Create.CartSummary.budgetRemaining',
    defaultMessage: 'Budget Remaining',
  },
  quoteNumber: {
    id: 'Orders.Create.CartSummary.quoteNumber',
    defaultMessage: 'Quote number',
  },
});
