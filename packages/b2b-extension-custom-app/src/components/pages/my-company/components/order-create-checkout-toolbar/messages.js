import { defineMessages } from 'react-intl';

export default defineMessages({
  placeOrderLabel: {
    id: 'OrdersCreateCheckoutToolbar.placeOrderLabel',
    description: 'The label for the place order button',
    defaultMessage: 'Place order',
  },
  outOfBudget: {
    id: 'OrdersCreateCheckoutToolbar.outOfBudget',
    defaultMessage: 'You are over budget',
  },
  orderLimitPass: {
    id: 'OrdersCreateCheckoutToolbar.orderLimitPass',
    defaultMessage:
      'The order has passed the limit for required approval amount',
  },
  rulesMatch: {
    id: 'OrdersCreateCheckoutToolbar.rulesMatch',
    defaultMessage: 'The order does not satisfy the company rules: "{name}"',
  },
  orderNeedApprovalDescription: {
    id: 'OrdersCreateCheckoutToolbar.orderNeedApprovalDescription',
    defaultMessage: 'This order will need approval for the following reasons:',
  },
  orderNeedApprovalTitle: {
    id: 'OrdersCreateCheckoutToolbar.orderNeedApprovalTitle',
    defaultMessage: 'This order will need approval',
  },
  continueButton: {
    id: 'OrdersCreateCheckoutToolbar.continueButton',
    defaultMessage: 'Continue',
  },
});
