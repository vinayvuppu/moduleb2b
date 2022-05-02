import { defineMessages } from 'react-intl';

export default defineMessages({
  panelTitle: {
    id: 'Employee.Details.AccountResetPassword.panelTitle',
    description: 'Header text for the panel label (account details).',
    defaultMessage: 'Account Details',
  },
  labelPassword: {
    id: 'Employee.Details.AccountResetPassword.labelPassword',
    description: 'The label for the input field (password)',
    defaultMessage: 'New Password',
  },
  labelResetPasswordButton: {
    id: 'Employee.Details.AccountResetPassword.labelResetPasswordButton',
    description: 'The label for the reset password button',
    defaultMessage: 'Set password',
  },
  labelGenerateRandomPassword: {
    id: 'Employee.Details.AccountResetPassword.labelGenerateRandomPassword',
    description: 'The label for the checkbox field (generate random password)',
    defaultMessage: 'Generate a random password',
  },
  modalTitle: {
    id: 'Employee.Details.AccountResetPassword.modalTitle',
    description: 'The title of the confirmation dialog',
    defaultMessage: 'Set new password',
  },
  modalMessage: {
    id: 'Employee.Details.AccountResetPassword.modalMessage',
    description: 'The message of the confirmation dialog',
    defaultMessage:
      "This will overwrite {name}'s current password with:\n\n" +
      '{password}\n\nPlease ensure that the new password reaches the ' +
      'employee. Once this action is completed, the password will no ' +
      'longer be visible.\n\nThis action cannot be undone. ' +
      "Click 'Set password' to proceed.",
  },
  confirmResetButton: {
    id: 'Employee.Details.AccountResetPassword.confirmResetButton',
    description: 'The label for the confirm button',
    defaultMessage: 'Set new password',
  },
  passwordResetNotification: {
    id: 'Employee.Details.AccountResetPassword.passwordResetNotification',
    description: 'The success notification message for resetting password',
    defaultMessage: "{name}'s password has been successfully updated.",
  },
});
