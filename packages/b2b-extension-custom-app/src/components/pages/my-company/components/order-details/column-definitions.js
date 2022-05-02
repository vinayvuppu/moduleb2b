import messages from './messages';

export default formatMessage => [
  {
    key: 'product',
    label: formatMessage(messages.productColumn),
    flexGrow: 1,
  },
  {
    key: 'unitPrice',
    label: formatMessage(messages.unitPriceColumn),
  },
  {
    key: 'quantity',
    label: formatMessage(messages.quantityColumn),
  },
  {
    key: 'subtotal',
    label: formatMessage(messages.subtotalColumn),
  },
  {
    key: 'taxRate',
    label: formatMessage(messages.taxColumn),
  },
  {
    key: 'total',
    label: formatMessage(messages.totalColumn),
  },
];
