import { defineMessages } from 'react-intl';

export default defineMessages({
  labelDelete: {
    id: 'Company.Details.labelDelete',
    description: 'Label for delete button a11y',
    defaultMessage: 'Delete',
  },
  backToList: {
    id: 'Company.Details.backToList',
    description: 'The button label for going back to the list view',
    defaultMessage: 'To company list',
  },
  companyDeleted: {
    id: 'Company.Details.companyDeleted',
    description: 'Success notification after deleting the company',
    defaultMessage: '{name} has been deleted.',
  },
  confirmDeleteTitle: {
    id: 'Company.Details.confirmDeleteTitle',
    description: 'Title of the confirmation dialog for deleting company',
    defaultMessage: 'Delete company',
  },
  confirmDeleteMessage: {
    id: 'Company.Details.confirmDeleteMessage',
    description: 'Message of the confirmation dialog for deleting company',
    defaultMessage: 'Are you sure you want to delete this company?',
  },
  confirmDeleteButton: {
    id: 'Company.Details.confirmDeleteButton',
    description: 'Label for button in confirmation dialog',
    defaultMessage: 'Delete company',
  },
  tabGeneral: {
    id: 'Company.Update.tab.general',
    description: 'The tab label (general)',
    defaultMessage: 'General',
  },
  tabRules: {
    id: 'Company.Update.tab.rules',
    description: 'The tab label (rules)',
    defaultMessage: 'Rules',
  },
  tabEmployees: {
    id: 'Company.Update.tab.employees',
    description: 'The tab label (employees)',
    defaultMessage: 'Employees',
  },
  addEmployee: {
    id: 'Company.Details.addEmployee',
    defaultMessage: 'Add Employee',
  },
  companyWithEntitiesFailure: {
    id: 'Company.Details.companyWithEntitiesFailure',
    defaultMessage: 'Can not remove a Company with Employees, Carts or Orders',
  },
  companyDeletedFailure: {
    id: 'Company.Details.companyDeletedFailure',
    defaultMessage: 'Error removing the company',
  },
});
