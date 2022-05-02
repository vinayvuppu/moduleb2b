import { defineMessages } from 'react-intl';

export default defineMessages({
  quoteSummaryTitle: {
    id: 'Quote.Create.quoteSummaryTitle',
    description: 'The title for quote summary section',
    defaultMessage: 'Quote summary',
  },
  quoteRequestedSuccess: {
    id: 'Quote.Create.quoteRequestedSuccess',
    defaultMessage: 'The quote has been created',
  },
  quoteRequestedError: {
    id: 'Quote.Create.quoteRequestedError',
    defaultMessage: 'An error has occurred',
  },
  removeVariantSuccess: {
    id: 'Quote.Create.Step.LineItems.search.removeVariantSuccess',
    defaultMessage: 'Variant has been removed successfully from the quote',
  },
  changeQuantityFailure: {
    id: 'Quote.Create.Step.LineItems.search.changeQuantityFailure',
    defaultMessage: 'An error has occurred',
  },
  changeQuantitySuccess: {
    id: 'Quote.Create.Step.LineItems.search.changeQuantitySuccess',
    defaultMessage: 'Quantity has been updated',
  },
  removeVariantFailure: {
    id: 'Quote.Create.Step.LineItems.search.removeVariantFailure',
    defaultMessage: 'An error has occurred',
  },
});
