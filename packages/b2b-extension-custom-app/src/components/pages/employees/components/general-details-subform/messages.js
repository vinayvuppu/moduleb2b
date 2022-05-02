import { defineMessages } from 'react-intl';

export default defineMessages({
  panelTitle: {
    id: 'Employees.Details.General.panelTitle',
    description: 'Header text for the panel label (details).',
    defaultMessage: 'Employee Details',
  },
  labelTitleName: {
    id: 'Employees.Details.General.labelTitleName',
    description: 'The label for the input field (title name)',
    defaultMessage: 'Title',
  },
  labelSalutation: {
    id: 'Employees.Details.General.labelSalutation',
    description: 'The label for the input field (salutation)',
    defaultMessage: 'Salutation',
  },
  labelFirstName: {
    id: 'Employees.Details.General.labelFirstName',
    description: 'The label for the input field (first name)',
    defaultMessage: 'First name',
  },
  labelMiddleName: {
    id: 'Employees.Details.General.labelMiddleName',
    description: 'The label for the input field (middle name)',
    defaultMessage: 'Middle name',
  },
  labelLastName: {
    id: 'Employees.Details.General.labelLastName',
    description: 'The label for the input field (last name)',
    defaultMessage: 'Last name',
  },
  labelEmail: {
    id: 'Employees.Details.General.labelEmail',
    description: 'The label for the input field (email)',
    defaultMessage: 'Email',
  },
  labelEmailVerified: {
    id: 'Employees.Details.General.labelEmailVerified',
    description: 'The label for the input field (email verified)',
    defaultMessage: 'Verified',
  },
  labelEmailNotVerified: {
    id: 'Employees.Details.General.labelEmailNotVerified',
    description: 'The label for the input field (email not verified)',
    defaultMessage: 'Not verified',
  },
  labelDateOfBirth: {
    id: 'Employees.Details.General.labelDateOfBirth',
    description: 'The label for the input field (date of birth)',
    defaultMessage: 'Date of birth',
  },
  labelYear: {
    id: 'Employees.Details.General.labelYear',
    description: 'The label for the date of birth field (year)',
    defaultMessage: 'Year',
  },
  labelMonth: {
    id: 'Employees.Details.General.labelMonth',
    description: 'The label for the date of birth field (month)',
    defaultMessage: 'Month',
  },
  labelDay: {
    id: 'Employees.Details.General.labelDay',
    description: 'The label for the date of birth field (day)',
    defaultMessage: 'Day',
  },
  clearDate: {
    id: 'Employees.Details.General.clearDate',
    description: 'The label clear date button',
    defaultMessage: 'Clear date',
  },
  labelCustomerNumber: {
    id: 'Employees.Details.General.labelCustomerNumber',
    description: 'The label for the input field (customer number)',
    defaultMessage: 'Employe number',
  },
  labelExternalId: {
    id: 'Employees.Details.General.labelExternalId',
    description: 'The label for the input field (external ID)',
    defaultMessage: 'External ID',
  },
  labelCustomerGroup: {
    id: 'Employees.Details.General.labelCustomerGroup',
    description: 'The label for the input field (customer group)',
    defaultMessage: 'Customer group',
  },
  labelCompany: {
    id: 'Employees.Details.General.labelCompany',
    description: 'The label for the input field (company)',
    defaultMessage: 'Company',
  },
  labelStore: {
    id: 'Employees.Details.General.labelStore',
    description: 'The label for the input field (store)',
    defaultMessage: 'Account restricted to these stores',
  },
  hintNotEditableStore: {
    id: 'Employees.Details.General.hintNotEditableStore',
    description: 'The hint for not editable input field (store)',
    defaultMessage:
      'In the Merchant Center, you can only set the initial stores this account is restricted to. ' +
      'Use the API to modify these at any time.',
  },
  placeholderStore: {
    id: 'Employees.Details.General.placeholderStore',
    description: 'The placeholder for the input field (store)',
    defaultMessage: 'Not restricted to any store',
  },
  customerGroupNoResults: {
    id: 'Employees.Details.General.customerGroupNoResults',
    description: 'Label for no results when searching for customer groups',
    defaultMessage:
      'Sorry, but there are no customer groups that match your search.',
  },
  customerNumberWarning: {
    id: 'Employees.Details.General.customerNumberWarning',
    description:
      'The label indicating that the employee number can only be set once',
    defaultMessage:
      'The employee number can only be set once and cannot be updated.',
  },
  employeeWithExistingEmail: {
    id: 'Employees.Details.General.employeeWithExistingEmail',
    description: 'When there trying to use an existing email for the employee',
    defaultMessage: 'There is already an existing employee with this email.',
  },
  employeeWithExistingNumber: {
    id: 'Employees.Details.General.employeeWithExistingNumber',
    description: 'When there trying to use an existing employee number',
    defaultMessage:
      'There is already an existing employee with this employee number.',
  },
});
