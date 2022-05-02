const { executeRuleEngine } = require('./index');

describe('executeRuleEngine', () => {
  let needsApproval;
  let order;
  let employee;
  let conditions;

  describe('when multiple rules', () => {
    beforeAll(() => {
      conditions = [
        `{"any": [{"fact": "totalPrice","path": "$.centAmount","operator": "greaterThanInclusive","value": 100}]}`,
        `{"any": [{"fact": "roles","operator": "contains","value": "b2b-company-employee"}]}`,
        `{"any": [{"fact": "createdAt","operator": "greaterThan","value": "2020-02-20T00:00:00.000Z"}]}`,
        `{"any": [{"fact": "shippingInfo","path": "$.price.centAmount","operator": "greaterThanInclusive","value": 1000}]}`
      ];
    });
    describe('when total amount is greater than rule', () => {
      beforeEach(async () => {
        employee = {
          roles: [],
          email: 'foo@bar.com'
        };
        order = {
          shippingInfo: {
            price: {}
          },
          customerEmail: 'foo@bar.com',
          createdAt: '2020-02-10T00:00:00.000Z',
          totalPrice: {
            type: 'centPrecision',
            currencyCode: 'USD',
            centAmount: 101,
            fractionDigits: 2
          }
        };
        needsApproval = await executeRuleEngine({
          conditions,
          order,
          employee
        });
      });
      it('should need approval', () => {
        expect(needsApproval).toBe(true);
      });
    });

    describe('when total amount is not greater than rule', () => {
      beforeEach(async () => {
        employee = {
          roles: [],
          email: 'foo@bar.com'
        };
        order = {
          shippingInfo: {
            price: {}
          },
          customerEmail: 'foo@bar.com',
          createdAt: '2020-02-10T00:00:00.000Z',
          totalPrice: {
            type: 'centPrecision',
            currencyCode: 'USD',
            centAmount: 99,
            fractionDigits: 2
          }
        };
        needsApproval = await executeRuleEngine({
          conditions,
          order,
          employee
        });
      });
      it('should not need approval', () => {
        expect(needsApproval).toBe(false);
      });
    });

    describe('when date is greater than rule', () => {
      beforeEach(async () => {
        employee = {
          roles: [],
          email: 'foo@bar.com'
        };
        order = {
          shippingInfo: {
            price: {}
          },
          customerEmail: 'foo@bar.com',
          createdAt: '2020-02-21T00:00:00.000Z',
          totalPrice: {
            type: 'centPrecision',
            currencyCode: 'USD',
            centAmount: 1,
            fractionDigits: 2
          }
        };
        needsApproval = await executeRuleEngine({
          conditions,
          order,
          employee
        });
      });
      it('should need approval', () => {
        expect(needsApproval).toBe(true);
      });
    });

    describe('when date is not greater than rule', () => {
      beforeEach(async () => {
        employee = {
          roles: [],
          email: 'foo@bar.com'
        };
        order = {
          shippingInfo: {
            price: {}
          },
          customerEmail: 'foo@bar.com',
          createdAt: '2020-02-19T00:00:00.000Z',
          totalPrice: {
            type: 'centPrecision',
            currencyCode: 'USD',
            centAmount: 1,
            fractionDigits: 2
          }
        };
        needsApproval = await executeRuleEngine({
          conditions,
          order,
          employee
        });
      });
      it('should not need approval', () => {
        expect(needsApproval).toBe(false);
      });
    });

    describe('when the employee rol needs approval', () => {
      beforeEach(async () => {
        order = {
          shippingInfo: {
            price: {}
          },
          customerEmail: 'foo@bar.com',
          createdAt: '2020-02-01:00:00.000Z',
          totalPrice: {}
        };
        employee = {
          email: 'foo@bar.com',
          roles: ['b2b-company-employee']
        };
        needsApproval = await executeRuleEngine({
          conditions,
          order,
          employee
        });
      });
      it('should need approval', () => {
        expect(needsApproval).toBe(true);
      });
    });

    describe('when the employee rol does not need approval', () => {
      beforeEach(async () => {
        order = {
          shippingInfo: {
            price: {}
          },
          customerEmail: 'foo@bar.com',
          createdAt: '2020-02-01:00:00.000Z',
          totalPrice: {}
        };
        employee = {
          email: 'foo@bar.com',
          roles: ['b2b-company-admin']
        };
        needsApproval = await executeRuleEngine({
          conditions,
          order,
          employee
        });
      });
      it('should not need approval', () => {
        expect(needsApproval).toBe(false);
      });
    });

    describe('when shipping price is greater than rule', () => {
      beforeEach(async () => {
        order = {
          shippingInfo: {
            price: {
              centAmount: 1000
            }
          },
          customerEmail: 'foo@bar.com',
          createdAt: '2020-02-01:00:00.000Z',
          totalPrice: {}
        };
        employee = {
          email: 'foo@bar.com',
          roles: ['b2b-company-admin']
        };
        needsApproval = await executeRuleEngine({
          conditions,
          order,
          employee
        });
      });
      it('should need approval', () => {
        expect(needsApproval).toBe(true);
      });
    });

    describe('when shipping price is not greater than rule', () => {
      beforeEach(async () => {
        order = {
          shippingInfo: {
            price: {
              centAmount: 1
            }
          },
          customerEmail: 'foo@bar.com',
          createdAt: '2020-02-01:00:00.000Z',
          totalPrice: {}
        };
        employee = {
          email: 'foo@bar.com',
          roles: ['b2b-company-admin']
        };
        needsApproval = await executeRuleEngine({
          conditions,
          order,
          employee
        });
      });
      it('should not need approval', () => {
        expect(needsApproval).toBe(false);
      });
    });
  });

  describe('when single rule', () => {
    beforeAll(() => {
      conditions = [
        `{"all":[{"fact":"roles","operator":"contains","value":"b2b-company-admin"}]}`
      ];
    });

    describe('when the employee rol needs approval', () => {
      beforeEach(async () => {
        order = {
          shippingInfo: {
            price: {}
          },
          customerEmail: 'foo@bar.com',
          createdAt: '2020-02-01:00:00.000Z',
          totalPrice: {}
        };
        employee = {
          email: 'foo@bar.com',
          roles: ['b2b-company-admin']
        };
        needsApproval = await executeRuleEngine({
          conditions,
          order,
          employee
        });
      });
      it('should need approval', () => {
        expect(needsApproval).toBe(true);
      });
    });

    describe('when the employee rol does not need approval', () => {
      beforeEach(async () => {
        order = {
          shippingInfo: {
            price: {}
          },
          customerEmail: 'foo@bar.com',
          createdAt: '2020-02-01:00:00.000Z',
          totalPrice: {}
        };
        employee = {
          email: 'foo@bar.com',
          roles: ['b2b-company-employee']
        };
        needsApproval = await executeRuleEngine({
          conditions,
          order,
          employee
        });
      });
      it('should not need approval', () => {
        expect(needsApproval).toBe(false);
      });
    });
  });
});
