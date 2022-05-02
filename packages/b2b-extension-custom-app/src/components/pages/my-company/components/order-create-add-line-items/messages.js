import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'Orders.Create.Step.LineItems.title',
    description: 'Title',
    defaultMessage: 'Add item',
  },
  shoppingCartLabel: {
    id: 'Orders.Create.Step.LineItems.shoppingCartLabel',
    description: 'Shopping cart label',
    defaultMessage: 'Shopping cart',
  },
  emptyShoppingCartLabel: {
    id: 'Orders.Create.Step.LineItems.emptyShoppingCartLabel',
    description: 'Empty shopping cart label',
    defaultMessage: 'Shopping cart (is empty)',
  },
  addCustomLineItemLabel: {
    id: 'Orders.Create.Step.LineItems.addCustomLineItemLabel',
    description: 'Add custom line item label',
    defaultMessage: 'Add custom line item',
  },
  cartUpdated: {
    id: 'Orders.Create.Step.LineItems.cartUpdated',
    description:
      'Label for the confirmation message when line item added to the cart',
    defaultMessage: 'The cart has been successfully updated',
  },
  emptyCart: {
    id: 'Orders.Create.Step.LineItems.emptyCart',
    description: 'Message when the cart is empty',
    defaultMessage: 'No items were added to the cart yet.',
  },
  missingDiscountCode: {
    id: 'Orders.Create.Step.LineItems.missingDiscountCode',
    description: 'Message when trying to apply an invalid discount code',
    defaultMessage:
      'The discount code that you want to apply to the cart does not exist',
  },
  outdatedDiscountCode: {
    id: 'Orders.Create.Step.LineItems.outdatedDiscountCode',
    description: 'Message when trying to apply an outdated discount code',
    defaultMessage: 'The discount code that you want to apply has expired',
  },
  addVariantSuccess: {
    id: 'Orders.Create.Step.LineItems.search.addVariantSuccess',
    description: 'Message when the variant has been added to the cart',
    defaultMessage: 'Variant {sku} has been added successfully to the cart',
  },
  addVariantFailure: {
    id: 'Orders.Create.Step.LineItems.search.addVariantFailure',
    description:
      'Message when the variant has not been added to the cart due to an error',
    defaultMessage:
      'The variant that you are trying to add is invalid. Price format does not match the selected currency',
  },
  addVariantFailureTaxRate: {
    id: 'Orders.Create.Step.LineItems.search.addVariantFailureTaxRate',
    description:
      'Message when the variant has not been added to the cart due to an error with the tax rate',
    defaultMessage:
      'The variant that you are trying to add is invalid because its tax category does not have a rate defined for the shipping country of the cart',
  },
  searchPlaceHolder: {
    id: 'Orders.Create.Step.LineItems.customsearch.placeHolder',
    description: 'Placeholder for the search input',
    defaultMessage: 'Search by term',
  },
});
