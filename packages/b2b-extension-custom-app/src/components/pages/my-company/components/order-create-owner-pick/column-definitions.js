import { defaultMemoize } from 'reselect';
import messages from './messages';

export default defaultMemoize(intl => [
  {
    key: 'employeeNumber',
    label: intl.formatMessage(messages.columnCustomerNumber),
    flexGrow: 1,
  },
  {
    key: 'firstName',
    label: intl.formatMessage(messages.columnFirstName),
    flexGrow: 1,
  },
  {
    key: 'lastName',
    label: intl.formatMessage(messages.columnLastName),
    flexGrow: 1,
  },
  {
    key: 'email',
    label: intl.formatMessage(messages.columnEmail),
    flexGrow: 1,
  },
]);
