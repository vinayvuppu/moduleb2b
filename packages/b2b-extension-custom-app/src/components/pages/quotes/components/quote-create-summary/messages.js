import { defineMessages } from 'react-intl';

export default defineMessages({
  itemsLabel: {
    id: 'QuoteSummary.itemsLabel',
    description: 'items label when items are selected',
    defaultMessage: '{items} items',
  },
  quoteSummaryTittle: {
    id: 'QuoteSummary.quoteSummaryTittle',
    description: 'title for the cart summary panel',
    defaultMessage: 'in your quote',
  },
  quantityLabel: {
    id: 'QuoteSummary.quantityLabel',
    description: 'label for the line item quantity',
    defaultMessage: 'Qty: {quantity}',
  },
  subtotalLabel: {
    id: 'QuoteSummary.subtotalLabel',
    description: 'label for the cart subtotal',
    defaultMessage: 'Subtotal',
  },
  totalLabel: {
    id: 'QuoteSummary.totalLabel',
    description: 'label for the cart total',
    defaultMessage: 'Total (gross)',
  },
  emptyQuoteLabel: {
    id: 'QuoteSummary.emptyQuoteLabel',
    description: 'label for the empty shopping cart message',
    defaultMessage: 'Your quote is empty',
  },
  removeLineItem: {
    id: 'QuoteSummary.removeLineItem',
    defaultMessage: 'Remove item',
  },
  changeQuantity: {
    id: 'QuoteSummary.changeQuantity',
    defaultMessage: 'Change quantity',
  },
});
