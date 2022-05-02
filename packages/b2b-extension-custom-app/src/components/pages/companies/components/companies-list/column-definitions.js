import memoize from 'memoize-one';
import messages from './messages';

export default memoize(formatMessage => [
  {
    key: 'logo',
    label: formatMessage(messages.columnCompanyLogo),
  },
  {
    key: 'name',
    label: formatMessage(messages.columnCompanyName),
    flexGrow: 1,
  },
  {
    key: 'addresses',
    label: formatMessage(messages.columntAddress),
    flexGrow: 1,
  },
  {
    key: 'createdAt',
    label: formatMessage(messages.columntCreatedAt),
    flexGrow: 1,
    isSortable: true,
  },
  {
    key: 'lastModifiedAt',
    label: formatMessage(messages.columntLastModifiedAt),
    flexGrow: 1,
    isSortable: true,
  },
]);
