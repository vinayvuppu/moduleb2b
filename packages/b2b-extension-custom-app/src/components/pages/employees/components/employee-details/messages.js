import { defineMessages } from 'react-intl';

export default defineMessages({
  backToList: {
    id: 'Employees.Update.backToList',
    description: 'The button label for going back to the list view',
    defaultMessage: 'To Employees List',
  },
  tabGeneral: {
    id: 'Employees.Update.tab.general',
    description: 'The tab label (general)',
    defaultMessage: 'General',
  },
  tabCustomFields: {
    id: 'Employees.Update.tab.customFields',
    description: 'The tab label (customFields)',
    defaultMessage: 'Custom Fields',
  },
  tabAddresses: {
    id: 'Employees.Update.tab.addresses',
    description: 'The tab label (addresses)',
    defaultMessage: 'Addresses',
  },
  tabOrders: {
    id: 'Employees.Update.tab.orders',
    description: 'The tab label (orders)',
    defaultMessage: 'Orders',
  },
  tabBudget: {
    id: 'Employees.Update.tab.budget',
    description: 'The tab label (budget)',
    defaultMessage: 'Budget',
  },
  employeeUpdated: {
    id: 'Employees.Update.employeeUpdated',
    description: 'Notify that employee has been updated.',
    defaultMessage: 'The employee, {name}, has been successfully updated.',
  },
  confirmDeleteTitle: {
    id: 'Employees.Update.confirmDeleteTitle',
    description: 'Title of the delete confirmation dialog',
    defaultMessage: 'Delete employee',
  },
  confirmDeleteMessage: {
    id: 'Employees.Update.confirmDeleteMessage',
    description: 'Message of the delete confirmation dialog',
    defaultMessage:
      'This permanently deletes the employee {name}.\n' +
      "This action cannot be undone. Click 'Delete employee' to proceed.",
  },
  confirmDeleteButton: {
    id: 'Employees.Update.confirmDeleteButton',
    description: 'Label of the delete confirmation button',
    defaultMessage: 'Delete employee',
  },
  employeeDeleted: {
    id: 'Employees.Update.employeeDeleted',
    description: 'Notify that employee has been deleted.',
    defaultMessage: 'The employee, {name}, has been successfully deleted.',
  },
});
