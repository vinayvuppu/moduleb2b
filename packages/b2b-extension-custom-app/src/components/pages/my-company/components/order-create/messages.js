import { defineMessages } from 'react-intl';

export default defineMessages({
  stepCustomer: {
    id: 'Orders.Create.Step.Customer',
    description: 'The title for set customer step',
    defaultMessage: 'Employee',
  },
  stepOwner: {
    id: 'Orders.Create.Step.Owner',
    description: 'The title for set owner step',
    defaultMessage: 'Owner',
  },
  stepLineItems: {
    id: 'Orders.Create.Step.LineItems',
    description: 'The title for add lineitems step',
    defaultMessage: 'Items',
  },
  stepShippingMethod: {
    id: 'Orders.Create.Step.ShippingMethod',
    description: 'The title for set shipping method step',
    defaultMessage: 'Shipping',
  },
  stepConfirmation: {
    id: 'Orders.Create.Step.Confirmation',
    description: 'The label for confirming the order',
    defaultMessage: 'Confirmation',
  },
  createOrder: {
    id: 'Orders.Create.title',
    description: 'The title for create order form',
    defaultMessage: 'Create order',
  },
  orderSummaryTitle: {
    id: 'Orders.Create.orderSummaryTitle',
    description: 'The title for order summary section',
    defaultMessage: 'Order summary',
  },
  orderCreated: {
    id: 'Orders.Create.orderCreated',
    description:
      'The notification message when the order is successfully created',
    defaultMessage: 'The order has been successfully created',
  },
  validateLineItems: {
    id: 'Orders.Create.validateLineItems',
    description: 'Message when the validation fails in line items step',
    defaultMessage:
      'The cart cannot be empty. You should add at least one item to continue.',
  },
  validateShippingMethod: {
    id: 'Orders.Create.validateShippingMethod',
    description: 'Message when the validation fails in shipping method step',
    defaultMessage: 'You must select a shipping method in order to continue.',
  },
  validateCustomer: {
    id: 'Orders.Create.validateCustomer',
    description: 'Message when the validation fails in set customer step',
    defaultMessage:
      'You must select the customer and its addresses if you want to continue.',
  },
  validateCompany: {
    id: 'Orders.Create.validateCompany',
    description: 'Message when the validation fails in set customer step',
    defaultMessage:
      'You must select the company and its addresses if you want to continue.',
  },
  creatingOrder: {
    id: 'Orders.Create.creatingOrder',
    description: 'Message when is submitting the cart creation',
    defaultMessage: 'Wait while we set up the cart',
  },
  extensionError: {
    id: 'Orders.Create.extensionError',
    description: 'Message when there is an error with api extensions',
    defaultMessage:
      'Sorry, we could not perform the requested action due to failed processing of an API extension response.',
  },
  taxCategoryError: {
    id: 'Orders.Create.taxCategoryError',
    description:
      "Message when there is an error when don't have the specific tax category",
    defaultMessage:
      'It is not possible to add the variant to the order because its tax category does not have a tax rate defined for the shipping address country of the order',
  },
  blockedOrderLabel: {
    id: 'Orders.Create.blockedOrderLabel',
    description: 'Message when is submitting the cart creation',
    defaultMessage: 'The budget is over',
  },
  orderErrorBudgetOver: {
    id: 'Orders.Create.orderErrorBudgetOver',
    defaultMessage:
      'The order can be created because the budget is over. Refresh the page to see the actual budget remaining',
  },
});
