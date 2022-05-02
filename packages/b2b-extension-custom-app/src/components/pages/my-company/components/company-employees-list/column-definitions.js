import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

export default [
  {
    key: 'email',
    label: <FormattedMessage {...messages.columnEmail} />,
    isSortable: true,
    flexGrow: 1,
  },
  {
    key: 'firstName',
    label: <FormattedMessage {...messages.columnFirstName} />,
    isSortable: true,
    flexGrow: 1,
  },
  {
    key: 'lastName',
    label: <FormattedMessage {...messages.columnLastName} />,
    isSortable: true,
    flexGrow: 1,
  },
  {
    key: 'roles',
    label: <FormattedMessage {...messages.roles} />,
    flexGrow: 1,
  },
  {
    key: 'amountExpended',
    label: <FormattedMessage {...messages.budgetConsumed} />,
    flexGrow: 1,
  },
  // {
  //   key: 'customerNumber',
  //   label: <FormattedMessage {...messages.columnEmployeeNumber} />,
  //   isSortable: true,
  //   flexGrow: 1,
  // },
  // {
  //   key: 'externalId',
  //   label: <FormattedMessage {...messages.columnExternalId} />,
  //   isSortable: true,
  //   flexGrow: 1,
  // },
];
