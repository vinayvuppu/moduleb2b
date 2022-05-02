import { defaultMemoize } from 'reselect';
import messages from './messages';

export default defaultMemoize((formatMessage, columnsToExclude = []) => {
  const columns = [
    {
      key: 'quoteNumber',
      label: formatMessage(messages.quoteNumber),
      flexGrow: 1,
    },
    {
      key: 'quoteState',
      label: formatMessage(messages.quoteState),
      flexGrow: 1,
    },
    {
      key: 'originalTotalPrice',
      label: formatMessage(messages.originalTotalPrice),
      flexGrow: 1,
    },
    {
      key: 'discount',
      label: formatMessage(messages.quoteDiscount),
    },
    {
      key: 'totalPrice',
      label: formatMessage(messages.totalFinalPrice),
      flexGrow: 1,
    },
    {
      key: 'totalLineItemCount',
      label: formatMessage(messages.totalLineItemCount),
      align: 'right',
      flexGrow: 1,
    },
    {
      key: 'company',
      label: formatMessage(messages.company),
      flexGrow: 1,
    },
    {
      key: 'employeeEmail',
      label: formatMessage(messages.employeeEmail),
      flexGrow: 1,
    },
    {
      key: 'actions',
      label: formatMessage(messages.actions),
    },
  ];

  return columns.filter(
    column =>
      !columnsToExclude.find(columnToExclude => column.key === columnToExclude)
  );
});
