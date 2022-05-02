const {
  convertGraphqlActionToRestAction,
  convertRestCustomerToEmployee,
  convertEmployeeDraftToCustomerDraft,
  createSetAmountExpentAction,
  getCustomField
} = require('./utils');

const rolesResolver = employee =>
  getCustomField({
    employee,
    fieldName: 'roles',
    defaultValue: []
  });

const amountExpendedResolver = employee =>
  getCustomField({
    employee,
    fieldName: 'amountExpent',
    defaultValue: {
      currencyCode: 'USD',
      centAmount: 0,
      type: 'centPrecision',
      fractionDigits: 2
    }
  });

const amountRemainingResolver = async (employee, args, { dataSources }) => {
  const company = await dataSources.CompanyApi.getCompany(
    employee.customerGroup.key
  );

  if (!company) {
    return null;
  }

  const { budget } = company;
  if (!budget || budget.length === 0) {
    return null;
  }

  const roles = getCustomField({
    employee,
    fieldName: 'roles',
    defaultValue: []
  });

  const amountExpended = getCustomField({
    employee,
    fieldName: 'amountExpent',
    defaultValue: {
      currencyCode: 'USD',
      centAmount: 0,
      type: 'centPrecision',
      fractionDigits: 2
    }
  });

  // get budgets of employee roles
  const matchingBudgets = budget.filter(budgetRol =>
    roles.find(rol => rol === budgetRol.rol)
  );

  if (!matchingBudgets || matchingBudgets.length === 0) {
    return null;
  }

  // get the max value in case multiple roles
  const budgetRol = matchingBudgets.reduce((max, value) => {
    if (max && max.amount.centAmount > value.amount.centAmount) {
      return max;
    }
    return value;
  });

  if (!budgetRol) {
    return null;
  }

  return {
    ...budgetRol.amount,
    currencyCode: budgetRol.amount.currencyCode,
    centAmount: budgetRol.amount.centAmount - amountExpended.centAmount
  };
};

const expand = ['customerGroup', 'stores[*]'];

const makeResolvers = ({ CustomerRepository }) => {
  const resolvers = {
    Query: {
      employee: async (_, { id }) => {
        try {
          const customer = await CustomerRepository.get(id, {
            expand
          });

          if (customer) {
            return convertRestCustomerToEmployee(customer);
          }
        } catch (error) {
          console.error(error);
          throw error;
        }
      },
      employees: async (_, { where, sort, limit = 20, offset = 0 }) => {
        try {
          const params = {
            perPage: limit,
            page: Math.floor(offset / limit) + 1
          };
          if (where) {
            params.where = [where];
          }
          if (sort && sort.length) {
            const sortParams = sort[0].split(' ');
            params.sortBy = sortParams[0];
            params.sortDirection = sortParams[1];
          }
          params.expand = expand;
          const response = await CustomerRepository.find(params);
          return {
            ...response,
            results: response.results.map(convertRestCustomerToEmployee)
          };
        } catch (error) {
          console.error(error);
          throw error;
        }
      }
    },
    Employee: {
      roles: rolesResolver,
      amountExpended: amountExpendedResolver,
      amountRemaining: amountRemainingResolver
    },
    EmployeeItem: {
      roles: rolesResolver,
      amountExpended: amountExpendedResolver
    },
    Mutation: {
      updateEmployee: async (root, { id, version, actions }) => {
        try {
          const customer = await CustomerRepository.update(
            id,
            version,
            actions.map(convertGraphqlActionToRestAction),
            { expand }
          );
          if (customer) {
            return convertRestCustomerToEmployee(customer);
          }
        } catch (error) {
          console.error(error);
          throw error;
        }
      },
      employeeResetPassword: async (
        root,
        { version, tokenValue, newPassword }
      ) => {
        try {
          let customer = await CustomerRepository.passwordReset({
            tokenValue,
            version,
            newPassword
          });
          if (customer) {
            customer = await CustomerRepository.get(customer.id, { expand });
            return convertRestCustomerToEmployee(customer);
          }
        } catch (error) {
          console.error(error);
          throw error;
        }
      },
      deleteEmployee: async (
        root,
        { id, version, personalDataErasure, key }
      ) => {
        try {
          const customer = await CustomerRepository.delete(
            id || `key=${key}`,
            version,
            { expand, personalDataErasure }
          );
          if (customer) {
            return convertRestCustomerToEmployee(customer);
          }
        } catch (error) {
          console.error(error);
          throw error;
        }
      },
      employeeSignUp: async (root, { draft }) => {
        try {
          const response = await CustomerRepository.create(
            convertEmployeeDraftToCustomerDraft(draft),
            { expand: ['customer.customerGroup'] }
          );
          if (response && response.customer) {
            return {
              employee: convertRestCustomerToEmployee(response.customer)
            };
          }
        } catch (error) {
          console.error(error);
          throw error;
        }
      },
      employeeResetAmountExpent: async (root, { id }) => {
        try {
          let customer = await CustomerRepository.get(id, {
            expand
          });

          if (customer) {
            customer = await CustomerRepository.update(
              id,
              customer.version,
              [createSetAmountExpentAction(customer)],
              { expand }
            );
            return convertRestCustomerToEmployee(customer);
          }
        } catch (error) {
          console.error(error);
          throw error;
        }
      },
      employeesResetAmountExpent: async (
        root,
        { companyId },
        { dataSources }
      ) => {
        try {
          const company = await dataSources.CompanyApi.getCompany(companyId);

          if (!company) {
            return null;
          }

          const response = await CustomerRepository.find({
            where: [`customerGroup(id="${company.customerGroup.id}")`],
            perPage: 500
          });
          const promises = response.results.map(({ id, version, custom }) =>
            CustomerRepository.update(
              id,
              version,
              [createSetAmountExpentAction({ custom })],
              { expand }
            )
          );
          const result = await Promise.all(promises);
          return result.map(convertRestCustomerToEmployee);
        } catch (error) {
          console.error(error);
          throw error;
        }
      }
    }
  };
  return resolvers;
};

module.exports = {
  makeResolvers,
  rolesResolver,
  amountExpendedResolver,
  amountRemainingResolver,
  getCustomField
};
