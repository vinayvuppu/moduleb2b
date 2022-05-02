const { getNumber, needsApproval, checkIfOverBudget } = require('.');

describe('getNumber', () => {
  it('should return the amount', () => {
    expect(getNumber(12345, 2)).toEqual(123.45);
  });
});

describe('needsApproval', () => {
  let employeeRoles = [];
  let companyRoles = [];
  describe('when the employee needs the approval', () => {
    beforeEach(() => {
      employeeRoles = ['b2b-company-employee'];
      companyRoles = ['b2b-company-employee', 'b2b-company-admin'];
    });

    it('should return true', () => {
      expect(needsApproval(employeeRoles, companyRoles)).toBe(true);
    });
  });
  describe('when the employee does not needs the approval', () => {
    describe('when no roles defined in the company', () => {
      beforeEach(() => {
        employeeRoles = ['b2b-company-employee'];
        companyRoles = [];
      });

      it('should return false', () => {
        expect(needsApproval(employeeRoles, companyRoles)).toBe(false);
      });
    });
    describe('when roles defined in the company', () => {
      beforeEach(() => {
        employeeRoles = ['b2b-company-admin'];
        companyRoles = ['b2b-company-employee'];
      });

      it('should return false', () => {
        expect(needsApproval(employeeRoles, companyRoles)).toBe(false);
      });
    });
  });
});

const createMoneyField = centAmount => ({
  centAmount,
  fractionDigits: 2,
  currencyCode: 'USD'
});

describe('checkIfOverBudget', () => {
  let employee;
  let company;
  let order;
  describe('when the budget is over with the order total price', () => {
    beforeEach(() => {
      employee = {
        custom: {
          fields: {
            roles: ['rol1'],
            amountExpent: createMoneyField(1000)
          }
        }
      };
      company = {
        budget: [
          {
            rol: 'rol1',
            amount: createMoneyField(2000)
          }
        ]
      };
      order = {
        totalPrice: createMoneyField(1001)
      };
    });
    it('should return true', () => {
      expect(checkIfOverBudget({ company, employee, order })).toEqual(true);
    });
  });

  describe('when the budget is not over with the order total price', () => {
    beforeEach(() => {
      employee = {
        custom: {
          fields: {
            roles: ['rol1'],
            amountExpent: createMoneyField(1000)
          }
        }
      };
      company = {
        budget: [
          {
            rol: 'rol1',
            amount: createMoneyField(2000)
          }
        ]
      };
      order = {
        totalPrice: createMoneyField(1000)
      };
    });
    it('should return false', () => {
      expect(checkIfOverBudget({ company, employee, order })).toEqual(false);
    });
  });

  describe('when the amountExpent is not defined in the employee', () => {
    beforeEach(() => {
      employee = {
        custom: {
          fields: {
            roles: ['rol1'],
            amountExpent: null
          }
        }
      };
      company = {
        budget: [
          {
            rol: 'rol1',
            amount: createMoneyField(2000)
          }
        ]
      };
    });
    describe('when the budget is over with the order total price', () => {
      beforeEach(() => {
        order = {
          totalPrice: createMoneyField(2001)
        };
      });
      it('should return true', () => {
        expect(checkIfOverBudget({ company, employee, order })).toEqual(true);
      });
    });
    describe('when the budget is not over with the order total price', () => {
      beforeEach(() => {
        order = {
          totalPrice: createMoneyField(1999)
        };
      });
      it('should return false', () => {
        expect(checkIfOverBudget({ company, employee, order })).toEqual(false);
      });
    });
  });

  describe('when the company has not defined budgets', () => {
    beforeEach(() => {
      employee = {
        custom: {
          fields: {
            roles: ['rol1'],
            amountExpent: createMoneyField(1000)
          }
        }
      };
      company = {
        budget: []
      };
      beforeEach(() => {
        order = {
          totalPrice: createMoneyField(2001)
        };
      });
    });
    it('should return false', () => {
      expect(checkIfOverBudget({ company, employee, order })).toEqual(false);
    });
  });

  describe('when the company has not defined budgets for the employee rol', () => {
    beforeEach(() => {
      employee = {
        custom: {
          fields: {
            roles: ['rol1'],
            amountExpent: createMoneyField(1000)
          }
        }
      };
      company = {
        budget: [
          {
            rol: 'rol2',
            amount: createMoneyField(2000)
          }
        ]
      };
      beforeEach(() => {
        order = {
          totalPrice: createMoneyField(2001)
        };
      });
    });
    it('should return false', () => {
      expect(checkIfOverBudget({ company, employee, order })).toEqual(false);
    });
  });
});
