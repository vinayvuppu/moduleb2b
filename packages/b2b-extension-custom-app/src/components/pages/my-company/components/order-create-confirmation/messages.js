import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'Orders.Create.Step.Confirmation.title',
    description: 'The label for the title',
    defaultMessage: 'Confirmation',
  },
  confirmationPanelTitle: {
    id: 'Orders.Create.Step.Confirmation.confirmationPanelTitle',
    description: 'The label for the shipping and billing panel title',
    defaultMessage: 'Customer Shipping & Billing Address',
  },
  itemsPanelTitle: {
    id: 'Orders.Create.Step.Confirmation.itemsPanelTitle',
    description: 'The label for the products panel title',
    defaultMessage: 'Products',
  },
  checkDetailsLabel: {
    id: 'Orders.Create.Step.Confirmation.checkDetailsLabel',
    description: 'The label for the check details text',
    defaultMessage: 'Please check the details below before creating the order.',
  },
  editLabel: {
    id: 'Orders.Create.Step.Confirmation.editLabel',
    description: 'The label for the edit text',
    defaultMessage:
      'To Edit order details select any of the above steps and continue with each step',
  },
  shippingToLabel: {
    id: 'Orders.Create.Step.Confirmation.shippingToLabel',
    description: 'The label for the title',
    defaultMessage: 'Shipping to',
  },
  billingToLabel: {
    id: 'Orders.Create.Step.Confirmation.billingToLabel',
    description: 'The label for the title',
    defaultMessage: 'Billing to',
  },
  shippingMethodTitle: {
    id: 'Orders.Create.Step.Confirmation.shippingMethodTitle',
    description: 'The label for the shipping method section title',
    defaultMessage: 'Shipping Method',
  },
  noShippingMethod: {
    id: 'Orders.Duplicate.Step.Confirmation.noShippingMethod',
    description: 'The label when there is not shipping method selected',
    defaultMessage:
      'You have no shipping method selected yet. Please go shipping step and select one,',
  },
  noShippingAddress: {
    id: 'Orders.Duplicate.Step.Confirmation.noShippingAddress',
    description: 'The label when there is not shipping address selected',
    defaultMessage:
      'You have not yet selected a shipping address. Please return to the customer step and select one.',
  },
  noBillingAddress: {
    id: 'Orders.Duplicate.Step.Confirmation.noBillingAddress',
    description: 'The label when there is not billing address selected',
    defaultMessage:
      'You have not yet selected a billing address. Please return to the customer step and select one.',
  },
  noItems: {
    id: 'Orders.Duplicate.Step.Confirmation.noItems',
    description: 'The label when there is no items in the cart',
    defaultMessage:
      'You have no items in the cart. Please return to items step and add at least one.',
  },
});
