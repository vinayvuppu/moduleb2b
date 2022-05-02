import { defineMessages } from 'react-intl';

export default defineMessages({
  panelTitle: {
    id: 'Employees.Details.AccountChangePassword.panelTitle',
    description: 'Header text for the panel label (account details).',
    defaultMessage: 'Account Details',
  },
  labelPassword: {
    id: 'Employees.Details.AccountChangePassword.labelPassword',
    description: 'The label for the input field (password)',
    defaultMessage: "Employee's password",
  },
  labelConfirmPassword: {
    id: 'Employees.Details.AccountChangePassword.labelConfirmPassword',
    description: 'The label for the input field (confirm password)',
    defaultMessage: 'Confirm password',
  },
  passwordMismatch: {
    id: 'Employees.Create.passwordMismatch',
    description: 'Error message that passwords do not match',
    defaultMessage: 'The passwords you have entered do not match.',
  },
});
