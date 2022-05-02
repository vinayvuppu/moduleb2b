import messages from './messages';
import { QUOTE_TYPES } from '../../constants';

export default (
  intl,
  currencySymbol,
  isTaxIncludedInPrice,
  quoteState,
  showActionsColumn
) => {
  const columns = [
    {
      key: 'name',
      label: intl.formatMessage(messages.columnProduct),
      flexGrow: 1,
    },
    {
      key: 'originalPrice',
      label: intl.formatMessage(messages.originalPrice, {
        currencySymbol,
      }),
      align: 'right',
    },
    isTaxIncludedInPrice && {
      key: 'grossPrice',
      label: intl.formatMessage(messages.columnGrossUnitPrice, {
        currencySymbol,
      }),
      align: 'right',
    },
    isTaxIncludedInPrice && {
      key: 'netPrice',
      label: intl.formatMessage(messages.columnNetUnitPrice, {
        currencySymbol,
      }),
      align: 'right',
    },
    !isTaxIncludedInPrice && {
      key: 'price',
      label: intl.formatMessage(messages.columnNetUnitPrice, {
        currencySymbol,
      }),
      align: 'right',
      flexGrow: 1,
    },
    {
      key: 'quantity',
      label: intl.formatMessage(messages.columnQuantity),
      align: 'right',
    },

    {
      key: 'subtotalPrice',
      label: intl.formatMessage(messages.columnSubtotalPrice, {
        currencySymbol,
      }),
      align: 'right',
    },
    {
      key: 'taxRate',
      label: intl.formatMessage(messages.columnTax),
      align: 'right',
    },
    {
      key: 'totalPrice',
      label: intl.formatMessage(messages.columnTotalPrice, {
        currencySymbol,
      }),
      align: 'right',
    },
    quoteState === QUOTE_TYPES.SUBMITTED &&
      showActionsColumn && {
        key: 'actions',
        label: intl.formatMessage(messages.actions),
        align: 'right',
      },
  ];

  return columns.filter(Boolean);
};
