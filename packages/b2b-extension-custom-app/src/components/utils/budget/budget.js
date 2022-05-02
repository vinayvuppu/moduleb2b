import {
  formatMoney,
  getFractionedAmount,
} from '@commercetools-local/utils/formats/money';

export const getBiggerRolAmount = (roles, rolAmount, intl) => {
  const maxRequiredApprovalRol = rolAmount
    .filter(({ rol }) => roles.includes(rol))
    .map(({ amount, ...rest }) => ({
      ...rest,
      amountCurrency: formatMoney(amount, intl),
      amountNumber: getFractionedAmount(amount, intl),
    }))
    .reduce(
      (max, current) =>
        max.amountNumber > current.amountNumber ? max : current,
      {}
    );
  return maxRequiredApprovalRol || {};
};

export const isTotalMoreThanRol = (
  roles,
  requiredApprovalRoles,
  totalPrice,
  intl
) => {
  const { amountNumber } = getBiggerRolAmount(
    roles,
    requiredApprovalRoles,
    intl
  );

  return amountNumber && getFractionedAmount(totalPrice, intl) > amountNumber;
};

export const getRemainingApprovalAmount = (
  employeeRoles,
  rolAmount,
  cartTotalPrice,
  intl
) => {
  const maxRequiredApprovalRol = rolAmount
    .filter(({ rol }) => employeeRoles.includes(rol))
    .reduce(
      (max, current) => (max.centAmount > current.centAmount ? max : current),
      {
        centAmount: 0,
      }
    );

  if (!maxRequiredApprovalRol || !maxRequiredApprovalRol.amount) {
    return {};
  }
  const remainingAmount = {
    ...maxRequiredApprovalRol.amount,
    centAmount:
      maxRequiredApprovalRol.amount.centAmount - cartTotalPrice?.centAmount,
  };

  return {
    amountCurrency: formatMoney(remainingAmount, intl),
    amountNumber: getFractionedAmount(remainingAmount, intl),
  };
};
