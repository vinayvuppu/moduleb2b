import executeRuleEngine from '.';

describe('executeRuleEngine', () => {
  let response;
  let cart;
  let employee;
  let conditions;

  describe('when multiple rules', () => {
    beforeAll(() => {
      conditions = [
        {
          name: 'rule total price',
          parsedValue: `{"any": [{"fact": "totalPrice","path": "$.centAmount","operator": "greaterThanInclusive","value": 100}]}`,
        },
        {
          name: 'rule rol',
          parsedValue: `{"any": [{"fact": "roles","operator": "contains","value": "b2b-company-employee"}]}`,
        },
        {
          name: 'rule shipping',
          parsedValue: `{"any": [{"fact": "shippingInfo","path": "$.price.centAmount","operator": "greaterThanInclusive","value": 1000}]}`,
        },
      ];
    });
    describe('when total amount is greater than rule', () => {
      beforeEach(async () => {
        employee = {
          roles: [],
          email: 'foo@bar.com',
        };
        cart = {
          shippingInfo: {
            price: {},
          },
          customerEmail: 'foo@bar.com',
          createdAt: '2020-02-10T00:00:00.000Z',
          totalPrice: {
            type: 'centPrecision',
            currencyCode: 'USD',
            centAmount: 101,
            fractionDigits: 2,
          },
        };
        response = await executeRuleEngine({
          conditions,
          cart,
          employee,
        });
      });

      it('should need approval', () => {
        expect(response.needsApproval).toBe(true);
      });

      it('should need approval for rule "rule total price"', () => {
        expect(response.ruleName).toBe('rule total price');
      });
    });

    describe('when total amount is not greater than rule', () => {
      beforeEach(async () => {
        employee = {
          roles: [],
          email: 'foo@bar.com',
        };
        cart = {
          shippingInfo: {
            price: {},
          },
          customerEmail: 'foo@bar.com',
          createdAt: '2020-02-10T00:00:00.000Z',
          totalPrice: {
            type: 'centPrecision',
            currencyCode: 'USD',
            centAmount: 99,
            fractionDigits: 2,
          },
        };
        response = await executeRuleEngine({
          conditions,
          cart,
          employee,
        });
      });
      it('should not need approval', () => {
        expect(response.needsApproval).toBe(false);
      });
    });

    describe('when the employee rol needs approval', () => {
      beforeEach(async () => {
        cart = {
          shippingInfo: {
            price: {},
          },
          customerEmail: 'foo@bar.com',
          createdAt: '2020-02-01:00:00.000Z',
          totalPrice: {},
        };
        employee = {
          email: 'foo@bar.com',
          roles: ['b2b-company-employee'],
        };
        response = await executeRuleEngine({
          conditions,
          cart,
          employee,
        });
      });

      it('should need approval', () => {
        expect(response.needsApproval).toBe(true);
      });

      it('should need approval for rule "rule rol"', () => {
        expect(response.ruleName).toBe('rule rol');
      });
    });

    describe('when the employee rol does not need approval', () => {
      beforeEach(async () => {
        cart = {
          shippingInfo: {
            price: {},
          },
          customerEmail: 'foo@bar.com',
          createdAt: '2020-02-01:00:00.000Z',
          totalPrice: {},
        };
        employee = {
          email: 'foo@bar.com',
          roles: ['b2b-company-admin'],
        };
        response = await executeRuleEngine({
          conditions,
          cart,
          employee,
        });
      });
      it('should not need approval', () => {
        expect(response.needsApproval).toBe(false);
      });
    });

    describe('when shipping price is greater than rule', () => {
      beforeEach(async () => {
        cart = {
          shippingInfo: {
            price: {
              centAmount: 1000,
            },
          },
          customerEmail: 'foo@bar.com',
          createdAt: '2020-02-01:00:00.000Z',
          totalPrice: {},
        };
        employee = {
          email: 'foo@bar.com',
          roles: ['b2b-company-admin'],
        };
        response = await executeRuleEngine({
          conditions,
          cart,
          employee,
        });
      });

      it('should need approval', () => {
        expect(response.needsApproval).toBe(true);
      });

      it('should need approval for rule "rule shipping"', () => {
        expect(response.ruleName).toBe('rule shipping');
      });
    });

    describe('when shipping price is not greater than rule', () => {
      beforeEach(async () => {
        cart = {
          shippingInfo: {
            price: {
              centAmount: 1,
            },
          },
          customerEmail: 'foo@bar.com',
          createdAt: '2020-02-01:00:00.000Z',
          totalPrice: {},
        };
        employee = {
          email: 'foo@bar.com',
          roles: ['b2b-company-admin'],
        };
        response = await executeRuleEngine({
          conditions,
          cart,
          employee,
        });
      });
      it('should not need approval', () => {
        expect(response.needsApproval).toBe(false);
      });
    });
  });

  describe('when single rule', () => {
    beforeAll(() => {
      conditions = [
        {
          name: 'rule rol',
          parsedValue: `{"all":[{"fact":"roles","operator":"contains","value":"b2b-company-admin"}]}`,
        },
      ];
    });

    describe('when the employee rol needs approval', () => {
      beforeEach(async () => {
        cart = {
          shippingInfo: {
            price: {},
          },
          customerEmail: 'foo@bar.com',
          createdAt: '2020-02-01:00:00.000Z',
          totalPrice: {},
        };
        employee = {
          email: 'foo@bar.com',
          roles: ['b2b-company-admin'],
        };
        response = await executeRuleEngine({
          conditions,
          cart,
          employee,
        });
      });
      it('should need approval', () => {
        expect(response.needsApproval).toBe(true);
      });

      it('should need approval for rule "rule rol"', () => {
        expect(response.ruleName).toBe('rule rol');
      });
    });

    describe('when the employee rol does not need approval', () => {
      beforeEach(async () => {
        cart = {
          shippingInfo: {
            price: {},
          },
          customerEmail: 'foo@bar.com',
          createdAt: '2020-02-01:00:00.000Z',
          totalPrice: {},
        };
        employee = {
          email: 'foo@bar.com',
          roles: ['b2b-company-employee'],
        };
        response = await executeRuleEngine({
          conditions,
          cart,
          employee,
        });
      });
      it('should not need approval', () => {
        expect(response.needsApproval).toBe(false);
      });
    });
  });
});
