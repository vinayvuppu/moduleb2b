import { MoneyInput } from '@commercetools-frontend/ui-kit';
/* eslint-disable import/prefer-default-export */
export const formValuesToDoc = ({ requiredApprovalRoles, ...rest }) => {
  const requiredApprovalRolesConverter = requiredApprovalRoles.map(
    ({ amount, ...requiredApprovalRolRest }) => ({
      ...requiredApprovalRolRest,
      amount: MoneyInput.convertToMoneyValue(amount),
    })
  );
  if (requiredApprovalRolesConverter) {
    return {
      ...rest,
      requiredApprovalRoles: requiredApprovalRolesConverter,
    };
  }
  return rest;
};
