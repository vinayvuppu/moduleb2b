import React from 'react';
import { FormattedMessage } from 'react-intl';
import { defaultMemoize } from 'reselect';
import messages from './messages';
import { ORDER_STATES_VISIBILITY } from '../../../../constants/misc';

// This does not used named arguments on purpose, because using them would
// require keeping the same reference to the config object in order to not break
// memoization. This would just make things more complicated.
// Instead we just use a boolean argument, knowing that we should feel bad ;)
export default defaultMemoize(
  ({
    includeStatesColumn,
    orderStatesVisibility,
    isDuplicateOrderFeatureEnabled,
    isNamesIncluded,
    areAddressesIncludedInEmail,
    areStoresIncluded,
    includeActionsColumn,
    restrictToState,
  }) =>
    [
      areStoresIncluded && {
        key: 'store',
        label: <FormattedMessage {...messages.columnStore} />,
        isSortable: false,
        flexGrow: 1,
      },
      {
        key: 'orderNumber',
        label: <FormattedMessage {...messages.columnOrderNumber} />,
        isSortable: true,
        flexGrow: 1,
      },
      isNamesIncluded && {
        key: 'firstNameBilling',
        label: <FormattedMessage {...messages.columnFirstNameBilling} />,
        flexGrow: 1,
      },
      isNamesIncluded && {
        key: 'lastNameBilling',
        label: <FormattedMessage {...messages.columnLastNameBilling} />,
        flexGrow: 1,
      },
      areAddressesIncludedInEmail && {
        key: 'emailBilling',
        label: <FormattedMessage {...messages.columnEmailBilling} />,
        isSortable: true,
        flexGrow: 1,
      },
      isNamesIncluded && {
        key: 'firstNameShipping',
        label: <FormattedMessage {...messages.columnFirstNameShipping} />,
        flexGrow: 1,
      },
      isNamesIncluded && {
        key: 'lastNameShipping',
        label: <FormattedMessage {...messages.columnLastNameShipping} />,
        flexGrow: 1,
      },
      areAddressesIncludedInEmail && {
        key: 'emailShipping',
        label: <FormattedMessage {...messages.columnEmailShipping} />,
        isSortable: true,
        flexGrow: 1,
      },
      {
        key: 'totalPrice',
        label: <FormattedMessage {...messages.columnOrderTotal} />,
        align: 'right',
        flexGrow: 1,
      },
      {
        key: 'totalLineItemCount',
        label: <FormattedMessage {...messages.columnTotalLineItemCount} />,
        align: 'right',
        flexGrow: 1,
      },
      // Excludes the states column in case the project has no states.
      // The `false` value returned in case it has none is filtered by
      // `.filter(Boolean)` at the end of this array.
      includeStatesColumn && {
        key: 'state',
        label: <FormattedMessage {...messages.columnState} />,
        flexGrow: 1,
      },
      // Exludes the states column depending on the order states visibility settings
      !orderStatesVisibility.includes(
        ORDER_STATES_VISIBILITY.HIDE_ORDER_STATE
      ) && {
        key: 'orderState',
        label: <FormattedMessage {...messages.columnOrderState} />,
        isSortable: true,
        flexGrow: 1,
      },
      !restrictToState &&
        !orderStatesVisibility.includes(
          ORDER_STATES_VISIBILITY.HIDE_PAYMENT_STATE
        ) && {
          key: 'paymentState',
          label: <FormattedMessage {...messages.columnPaymentState} />,
          isSortable: true,
          flexGrow: 1,
        },
      !restrictToState &&
        !orderStatesVisibility.includes(
          ORDER_STATES_VISIBILITY.HIDE_SHIPMENT_STATE
        ) && {
          key: 'shipmentState',
          label: <FormattedMessage {...messages.columnShipmentState} />,
          isSortable: true,
          flexGrow: 1,
        },
      {
        key: 'customerEmail',
        label: <FormattedMessage {...messages.columnEmailOrder} />,
        isSortable: true,
        flexGrow: 1,
      },
      !restrictToState && {
        key: 'createdAt',
        label: <FormattedMessage {...messages.columnCreatedAt} />,
        isSortable: true,
        flexGrow: 1,
      },
      !restrictToState && {
        key: 'lastModifiedAt',
        label: <FormattedMessage {...messages.columnLastModifiedAt} />,
        isSortable: true,
        flexGrow: 1,
      },
      isDuplicateOrderFeatureEnabled && {
        key: 'duplicate',
        label: <FormattedMessage {...messages.copyButtonColumn} />,
        align: 'center',
        onClick: () => {},
      },
      includeActionsColumn && {
        key: 'actions',
        label: <FormattedMessage {...messages.actions} />,
        flexGrow: 0,
      },
    ].filter(Boolean)
);
