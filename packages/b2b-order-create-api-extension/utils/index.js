const getEmployeeRoles = employee =>
  employee !== null &&
  employee.custom &&
  employee.custom.fields &&
  employee.custom.fields.roles
    ? employee.custom.fields.roles
    : [];

const getEmployeeAmountExpended = employee =>
  employee !== null &&
  employee.custom &&
  employee.custom.fields &&
  employee.custom.fields.amountExpent
    ? employee.custom.fields.amountExpent
    : {
        centAmount: 0
      };
const getNumber = (centAmount, fractionDigits) =>
  centAmount / 10 ** fractionDigits;

const needsApproval = (employeeRoles, companyRoles) =>
  employeeRoles.some(employeeRole =>
    companyRoles.find(companyRol => companyRol === employeeRole)
  );

const checkIfOverBudget = ({ company, employee, order }) => {
  let isOver = false;

  const { budget } = company;
  if (budget && budget.length > 0) {
    const roles = getEmployeeRoles(employee);

    // get budgets of employee roles
    const matchingBudgets = budget.filter(budgetRol =>
      roles.find(rol => rol === budgetRol.rol)
    );

    if (matchingBudgets && matchingBudgets.length > 0) {
      const budgetRol = matchingBudgets.reduce((max, value) => {
        if (max && max.amount.centAmount > value.amount.centAmount) {
          return max;
        }
        return value;
      });

      const amountExpended = getEmployeeAmountExpended(employee);

      if (budgetRol) {
        isOver =
          order.totalPrice.centAmount + amountExpended.centAmount >
          budgetRol.amount.centAmount;
      }
    }
  }
  console.log('needsApprovalFromOverBudget', isOver);
  return isOver;
};

module.exports = {
  getEmployeeRoles,
  getNumber,
  needsApproval,
  checkIfOverBudget
};
