import { defineMessages } from 'react-intl';

export default defineMessages({
  labelRequiredApprovalRolesField: {
    id: 'Company.Rules.labelRequiredApprovalRolesField',
    description: 'Label for `required approval roles` form field',
    defaultMessage: 'Requires approval',
  },
  labelRequiredApprovalAmount: {
    id: 'Company.Rules.labelRequiredApprovalAmount',
    description: 'Label for `required approval amount` form field',
    defaultMessage: 'Amount',
  },
  unsupportedHighPrecision: {
    id: 'Company.Rules.errors.unsupportedHighPrecision',
    defaultMessage: 'No high precision prices are allowed here.',
  },
  unsupportedHighPrecisionAmount: {
    id: 'Company.Rules.errors.unsupportedHighPrecisionAmount',
    defaultMessage: 'No high precision amount is allowed here.',
  },
  labelRequiredInfoTitle: {
    id: 'Company.Rules.labelRequiredInfoTitle',
    description: 'Label for General Information title',
    defaultMessage: 'Order approval information',
  },
  labelCompanyBudgets: {
    id: 'Company.Rules.labelCompanyBudgets',
    defaultMessage: 'Company budgets',
  },
  addBuget: {
    id: 'Company.Rules.addBuget',
    defaultMessage: 'Add budget',
  },
  resetEmployeesBudget: {
    id: 'Company.Rules.resetEmployeesBudget',
    defaultMessage: 'Reset all employees budget',
  },
  confirmResetBudget: {
    id: 'Company.Rules.confirmResetBudget',
    defaultMessage: 'Are you sure?',
  },
  confirmResetBudgetDescription: {
    id: 'Company.Rules.confirmResetBudgetDescription',
    defaultMessage:
      'This action will reset the budget for all company employees',
  },
  resetSuccess: {
    id: 'Company.Rules.resetSuccess',
    defaultMessage: 'All budgets have been reset',
  },
  resetError: {
    id: 'Company.Rules.resetError',
    defaultMessage: 'An error has occurred',
  },
  fieldRequired: {
    id: 'Company.Rules.fieldRequired',
    description: 'Error text when the field is required and dont set',
    defaultMessage: 'Field is required',
  },
  rolLabel: {
    id: 'Company.Rules.rolLabel',
    description: 'Rol label',
    defaultMessage: 'Role',
  },
  confirm: {
    id: 'Company.Rules.confirm',
    defaultMessage: 'Save',
  },
  cancel: {
    id: 'Company.Rules.cancel',
    defaultMessage: 'Cancel',
  },
  removeBudget: {
    id: 'Company.Rules.removeBudget',
    defaultMessage: 'Remove budget',
  },
  rolInUse: {
    id: 'Company.Rules.rolInUse',
    defaultMessage: 'Rol in used',
  },
  labelApproverRolesField: {
    id: 'Company.Rules.labelApproverRolesField',
    defaultMessage: 'Approver roles',
  },
  rolCantHaveBudget: {
    id: 'Company.Rules.conflictRol',
    defaultMessage: "{rol} is approver, can't have a budget",
  },
  requiredApporvalRolesLabel: {
    id: 'companyRulesForm.requiredApporvalRolesLabel',
    defaultMessage: 'Requires approval',
  },
  addRequiredApprovalRol: {
    id: 'companyRulesForm.addRequiredApprovalRol',
    defaultMessage: 'Add required approval role',
  },
});
