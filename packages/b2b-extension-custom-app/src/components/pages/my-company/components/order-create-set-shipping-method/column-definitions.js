import { defaultMemoize } from 'reselect';
import messages from './messages';

export default defaultMemoize(intl => [
  {
    key: 'check',
    /**
     * NOTE:
     *  This noop is passed so that a click on the cell
     *  does not trigger a `onRowClick` and hence a redirect.
     *  It has to be passed here as the `onRowClick` does not
     *  receive information about the clicked column for an early return.
     */
    onClick: () => {},
  },
  {
    key: 'name',
    label: intl.formatMessage(messages.shippingMethodNameColumn),
    flexGrow: 1,
  },
  {
    key: 'description',
    label: intl.formatMessage(messages.shippingMethodDescriptionColumn),
    flexGrow: 1,
  },
  {
    key: 'shippingRate',
    label: intl.formatMessage(messages.shippingMethodRateColumn),
    align: 'right',
  },
  {
    key: 'taxCategory',
    label: intl.formatMessage(messages.shippingMethodTaxCategoryColumn),
    flexGrow: 1,
  },
  {
    key: 'freeAbove',
    label: intl.formatMessage(messages.shippingMethodFreeAboveColumn),
    align: 'right',
  },
  {
    key: 'isDefault',
    label: intl.formatMessage(messages.shippingMethodIsDefaultColumn),
  },
]);
