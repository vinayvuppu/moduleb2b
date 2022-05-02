const { ApiError } = require('../../errors');

module.exports.validateFields = ({
  defaultBillingAddress,
  addresses,
  defaultShippingAddress,
  budget = [],
  approverRoles = [],
  requiredApprovalRoles = []
}) => {
  if (defaultBillingAddress) {
    this.addressIdInAddressesValidator(addresses, defaultBillingAddress);
  }
  if (defaultShippingAddress) {
    this.addressIdInAddressesValidator(addresses, defaultShippingAddress);
  }
  if (budget.length > 0) {
    this.budgetValidator(budget);
    if (approverRoles.length) {
      this.approverRolesBudgetValidator(approverRoles, budget);
    }
  }
  if (approverRoles.length && requiredApprovalRoles.length) {
    this.rolesConflict(approverRoles, requiredApprovalRoles);
  }
};

module.exports.addressIdInAddressesValidator = (addresses = [], addressId) => {
  if (!addresses.find(({ id }) => id === addressId)) {
    throw new ApiError({
      title: `Address with id ${addressId}, doesn't exist in addresses.`,
      status: 400
    });
  }
};

module.exports.approverRolesBudgetValidator = (approverRoles, budgets) => {
  const approverHaveBudget = approverRoles.find(rol =>
    budgets.find(budget => budget.rol === rol)
  );

  if (approverHaveBudget) {
    throw new ApiError({
      title: "Approver roles can't have a budget",
      status: 400
    });
  }
};

module.exports.rolesConflict = (approverRoles, requiredApprovalRoles) => {
  const conflictRol = approverRoles.find(rol =>
    requiredApprovalRoles.find(
      requiredApprovalRol => rol === requiredApprovalRol.rol
    )
  );

  if (conflictRol) {
    throw new ApiError({
      title: `The role ${conflictRol} cannot be both: approver and required approval`
    });
  }
};

module.exports.budgetValidator = (budget = []) => {
  const budgets = budget.map(budgetRol => budgetRol.rol);
  if (new Set(budgets).size !== budgets.length) {
    throw new ApiError({
      title: `Only one budget is allowed per role`,
      status: 400
    });
  }
  return true;
};
