jest.mock('./services/employees');
jest.mock('./services/orders');
const employees = require('./services/employees');
const orders = require('./services/orders');
const { addMonthlySpent } = require('.');

const order = {
  store: { key: 'storeKey' },
  customerId: 'employeeId',
  totalPrice: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 10175,
    fractionDigits: 2
  },
  orderState: 'Confirmed'
};

const getMessageBase64 = props =>
  Buffer.from(
    JSON.stringify({
      order,
      ...props
    })
  ).toString('base64');

const employee = {
  id: 'employeeId',
  version: 1,
  custom: {
    fields: {
      amountExpent: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 123,
        fractionDigits: 2
      }
    }
  }
};

describe('root functions', () => {
  describe('addMonthlySpent', () => {
    let message;
    describe('order with Confirmed status', () => {
      beforeEach(async () => {
        message = { data: getMessageBase64() };
        jest.spyOn(employees, 'getEmployee').mockResolvedValueOnce(employee);
        jest.spyOn(employees, 'updateEmployee').mockResolvedValueOnce(employee);
        await addMonthlySpent(message);
      });
      it('should call employees.getEmployee with correct values', () => {
        expect(employees.getEmployee).toHaveBeenCalledWith(order.customerId);
      });
      it('should call employees.updateEmployee with correct values', () => {
        expect(employees.updateEmployee).toHaveBeenCalledWith(
          employee.id,
          [
            {
              action: 'setCustomField',
              name: 'amountExpent',
              value: {
                centAmount: 10298,
                currencyCode: 'USD',
                fractionDigits: 2,
                type: 'centPrecision'
              }
            }
          ],
          1
        );
      });
    });
    describe('order with Pending status', () => {
      beforeEach(async () => {
        message = {
          data: getMessageBase64({ order: { ...order, orderState: 'Pending' } })
        };
        await addMonthlySpent(message);
      });
      it('should not call employees.updateEmployee', () => {
        expect(employees.updateEmployee).not.toHaveBeenCalled();
      });
    });
    describe('order transition to Cancelled', () => {
      beforeEach(async () => {
        message = {
          data: getMessageBase64({ orderId: 'orderId', order: undefined })
        };
        jest
          .spyOn(orders, 'getOrder')
          .mockResolvedValueOnce({ orderState: 'Cancelled' });
        await addMonthlySpent(message);
      });
      it('should call orders.getOrder with correct values', () => {
        expect(orders.getOrder).toHaveBeenCalledWith('orderId');
      });
    });
  });
});
