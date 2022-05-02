import messages from './messages';

export default formatMessage => [
  { key: 'rol', flexGrow: 1, label: formatMessage(messages.rolLabel) },
  {
    key: 'amount',
    flexGrow: 1,
    label: formatMessage(messages.amountLabel),
  },
];
