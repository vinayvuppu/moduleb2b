const {
  addressIdInAddressesValidator,
  budgetValidator,
  approverRolesBudgetValidator,
  rolesConflict
} = require('../validator');
const { ApiError } = require('../../../errors');

describe('validator', () => {
  describe('addressIdInAddressesValidator', () => {
    describe('when success', () => {
      let response;
      beforeEach(() => {
        response = addressIdInAddressesValidator([{ id: 'foo' }], 'foo');
      });
      it('should return undefined', () => {
        expect(response).toBeUndefined();
      });
    });
    describe('when fail', () => {
      let error, addressId;
      beforeEach(() => {
        try {
          addressId = 'not found';
          addressIdInAddressesValidator([{ id: 'foo' }], addressId);
        } catch (e) {
          error = e;
        }
      });
      it('should throw an error', () => {
        expect(error).toEqual(
          new ApiError({
            title: `Address with id ${addressId}, doesn't exist in addresses.`
          })
        );
      });
    });
  });

  describe('budgetValidator', () => {
    describe('when the budget array is empty', () => {
      it('shoud return true', () => {
        expect(budgetValidator([])).toEqual(true);
      });
    });

    describe('when there is not roles repeated', () => {
      it('shoud return true', () => {
        expect(
          budgetValidator([
            { rol: 'a', amount: { currency: 'USD', centAmount: 1 } },
            { rol: 'b', amount: { currency: 'USD', centAmount: 1 } }
          ])
        ).toEqual(true);
      });
    });

    describe('when there is roles repeated', () => {
      it('shoud return true', () => {
        expect(() => {
          budgetValidator([
            { rol: 'a', amount: { currency: 'USD', centAmount: 1 } },
            { rol: 'a', amount: { currency: 'USD', centAmount: 1 } }
          ]);
        }).toThrow(
          new ApiError({
            title: `Only one budget is allowed per role`,
            status: 400
          })
        );
      });
    });
  });

  describe('approverRolesBudgetValidator', () => {
    let error;
    beforeEach(() => {
      error = undefined;
    });
    describe('approverRoles not have budget', () => {
      beforeEach(() => {
        try {
          approverRolesBudgetValidator(['admin'], [{ rol: 'employee' }]);
        } catch (e) {
          error = e;
        }
      });
      it('should not throw an error', () => {
        expect(error).toBeUndefined();
      });
    });
    describe('approverRoles have a budget', () => {
      beforeEach(() => {
        try {
          approverRolesBudgetValidator(['admin'], [{ rol: 'admin' }]);
        } catch (e) {
          error = e;
        }
      });
      it('should throw an error', () => {
        expect(error).toEqual(
          new ApiError({
            title: "Approver roles can't have a budget",
            code: 400
          })
        );
      });
    });
  });
  describe('rolesConflict', () => {
    let error;
    beforeEach(() => {
      error = undefined;
    });
    describe('approverRoles is not in requiredApprovalRoles', () => {
      beforeEach(() => {
        try {
          rolesConflict(['admin'], [{ rol: 'employee' }]);
        } catch (e) {
          error = e;
        }
      });
      it('should not throw an error', () => {
        expect(error).toBeUndefined();
      });
    });
    describe('approverRoles is in requiredApprovalRoles', () => {
      beforeEach(() => {
        try {
          rolesConflict(['admin'], [{ rol: 'admin' }]);
        } catch (e) {
          error = e;
        }
      });
      it('should throw an error', () => {
        expect(error).toEqual(
          new ApiError({
            title:
              'The role admin cannot be both: approver and required approval',
            code: 400
          })
        );
      });
    });
  });
});
