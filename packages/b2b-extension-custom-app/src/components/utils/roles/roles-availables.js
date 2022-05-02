import messages from './messages';

export default formatMessage => [
  { value: 'b2b-company-admin', label: formatMessage(messages.admin) },
  {
    value: 'b2b-company-employee',
    label: formatMessage(messages.employee),
  },
];
