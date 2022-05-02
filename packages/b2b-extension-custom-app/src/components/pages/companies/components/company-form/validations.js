import { withoutEmptyErrorsByField } from '@commercetools-local/utils/validation';
import messages from './messages';
import { getRolByValue } from '../../../../utils/roles';

export const validate = (values, formatMessage) => {
  const errorsByField = {
    name: {},
    approverRoles: [],
    rules: {},
  };

  if (!values.name) errorsByField.name.missing = true;

  if (values.approverRoles?.length) {
    if (values.requiredApprovalRoles?.length) {
      values.approverRoles
        .filter(rol =>
          values.requiredApprovalRoles.find(rAR => rol === rAR.rol)
        )
        .forEach(rol =>
          errorsByField.approverRoles.push(
            formatMessage(messages.requieredApprovalIsApprover, {
              rol: getRolByValue(rol, formatMessage).label,
            })
          )
        );
    }
    if (values.budget?.length) {
      values.approverRoles
        .filter(rol => values.budget.find(rAR => rol === rAR.rol))
        .forEach(rol =>
          errorsByField.approverRoles.push(
            formatMessage(messages.requieredApprovalHaveBudget, {
              rol: getRolByValue(rol, formatMessage).label,
            })
          )
        );
    }
  }

  return withoutEmptyErrorsByField(errorsByField);
};

export default validate;
