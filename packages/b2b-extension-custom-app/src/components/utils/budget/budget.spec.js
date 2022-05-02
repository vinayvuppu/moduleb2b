import { intlMock } from '@commercetools-local/test-utils';

import { getRemainingApprovalAmount } from './budget';

describe('getRemainingApprovalAmount', () => {
  let employeeRoles;
  let rolAmount;
  let cartTotalPrice;
  let intl;
  let response;
  describe("when the user doesn't have the rol", () => {
    beforeEach(() => {
      intl = intlMock;
      employeeRoles = ['rol1'];
      rolAmount = [
        {
          rol: 'rol2',
          amount: {
            currencyCode: 'USD',
            centAmount: 10000,
            fractionDigits: 2,
          },
        },
      ];
      cartTotalPrice = {
        currencyCode: 'USD',
        centAmount: 100,
        fractionDigits: 2,
      };

      response = getRemainingApprovalAmount(
        employeeRoles,
        rolAmount,
        cartTotalPrice,
        intl
      );
    });

    it('should return the remaing approval amount', () => {
      expect(response).toEqual({});
    });
  });
  describe('when the user has the rol', () => {
    beforeEach(() => {
      intl = intlMock;
      employeeRoles = ['rol1'];
      rolAmount = [
        {
          rol: 'rol1',
          amount: {
            currencyCode: 'USD',
            centAmount: 10000,
            fractionDigits: 2,
          },
        },
      ];
      cartTotalPrice = {
        currencyCode: 'USD',
        centAmount: 100,
        fractionDigits: 2,
      };

      response = getRemainingApprovalAmount(
        employeeRoles,
        rolAmount,
        cartTotalPrice,
        intl
      );
    });

    it('should return the remaing approval amount', () => {
      expect(response).toEqual({ amountCurrency: 'USD 99', amountNumber: 99 });
    });
  });
});
