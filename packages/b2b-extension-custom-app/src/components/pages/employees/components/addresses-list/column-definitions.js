import React from 'react';
import { FormattedMessage } from 'react-intl';
import memoize from 'memoize-one';
import messages from './messages';
import styles from './addresses-list.mod.css';

export default memoize(
  (addresses, defaultShippingAddressId, defaultBillingAddressId) => [
    {
      key: 'addressTypes',
      label: '',
      flexGrow: 0,
      classNameGetter: ({ rowIndex }) => {
        const address = addresses[rowIndex];
        return address.id === defaultShippingAddressId ||
          address.id === defaultBillingAddressId
          ? styles['cell-special']
          : null;
      },
    },
    {
      key: 'contactName',
      label: <FormattedMessage {...messages.columnContactName} />,
      flexGrow: 1,
    },
    {
      key: 'companyName',
      label: <FormattedMessage {...messages.columnCompanyName} />,
      flexGrow: 1,
    },
    {
      key: 'address',
      label: <FormattedMessage {...messages.columnAddress} />,
      flexGrow: 1,
    },
    {
      key: 'city',
      label: <FormattedMessage {...messages.columnCity} />,
      flexGrow: 1,
    },
    {
      key: 'postalCode',
      label: <FormattedMessage {...messages.columnPostalCode} />,
      flexGrow: 1,
    },
    {
      key: 'state',
      label: <FormattedMessage {...messages.columnState} />,
      flexGrow: 1,
    },
    {
      key: 'region',
      label: <FormattedMessage {...messages.columnRegion} />,
      flexGrow: 1,
    },
    {
      key: 'country',
      label: <FormattedMessage {...messages.columnCountry} />,
      flexGrow: 1,
    },
  ]
);
