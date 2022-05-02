import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'Quote.Create.Step.LineItems.title',
    defaultMessage: 'Add item',
  },
  searchPlaceHolder: {
    id: 'Quote.Create.Step.LineItems.customsearch.placeHolder',
    defaultMessage: 'Search by term.',
  },
  addVariantSuccess: {
    id: 'Quote.Create.Step.LineItems.search.addVariantSuccess',
    defaultMessage: 'Variant {sku} has been added successfully to the quote',
  },
  addVariantFailure: {
    id: 'Quote.Create.Step.LineItems.search.addVariantFailure',
    description:
      'Message when the variant has not been added to the cart due to an error',
    defaultMessage:
      'The variant that you are trying to add is invalid. Price format does not match the selected currency',
  },
  addVariantFailureTaxRate: {
    id: 'Quote.Create.Step.LineItems.search.addVariantFailureTaxRate',
    description:
      'Message when the variant has not been added to the cart due to an error with the tax rate',
    defaultMessage:
      'The variant that you are trying to add is invalid because its tax category does not have a rate defined for the shipping country of the quote',
  },
});
