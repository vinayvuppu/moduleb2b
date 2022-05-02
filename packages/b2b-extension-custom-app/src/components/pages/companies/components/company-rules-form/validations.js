import { withoutEmptyErrorsByField } from '@commercetools-local/utils/validation';
import { MoneyInput } from '@commercetools-frontend/ui-kit';
import { getRolByValue } from '../../../../utils/roles';
import messages from './messages';

export const requiredApprovalRolesValidator = (
  values,
  formatMessage,
  company
) => {
  const errors = {};

  if (
    !MoneyInput.isEmpty(values.amount) &&
    MoneyInput.isHighPrecision(values.amount)
  )
    errors.amount = formatMessage(messages.unsupportedHighPrecisionAmount);

  if (!values.rol) errors.rol = formatMessage(messages.fieldRequired);

  if (company.requiredApprovalRoles.find(({ rol }) => rol === values.rol)) {
    if (
      typeof values.index === 'number' &&
      company.requiredApprovalRoles[values.index].rol !== values.rol
    ) {
      errors.rol = formatMessage(messages.rolInUse);
    } else if (typeof values.index !== 'number') {
      errors.rol = formatMessage(messages.rolInUse);
    }
  }

  return withoutEmptyErrorsByField(errors);
};

export const budgetValidator = (values, formatMessage, company) => {
  const errorsByField = {};

  if (
    !MoneyInput.isEmpty(values.amount) &&
    MoneyInput.isHighPrecision(values.amount)
  )
    errorsByField.amount = formatMessage(
      messages.unsupportedHighPrecisionAmount
    );

  if (!values.rol) errorsByField.rol = formatMessage(messages.fieldRequired);

  if (company.budget.find(({ rol }) => rol === values.rol)) {
    if (
      typeof values.index === 'number' &&
      company.budget[values.index].rol !== values.rol
    ) {
      errorsByField.rol = formatMessage(messages.rolInUse);
    } else if (typeof values.index !== 'number') {
      errorsByField.rol = formatMessage(messages.rolInUse);
    }
  }
  const rolApproved = company.approverRoles.find(rol => values.rol === rol);
  if (rolApproved)
    errorsByField.rol = formatMessage(messages.rolCantHaveBudget, {
      rol: getRolByValue(rolApproved, formatMessage).label,
    });
  return withoutEmptyErrorsByField(errorsByField);
};
