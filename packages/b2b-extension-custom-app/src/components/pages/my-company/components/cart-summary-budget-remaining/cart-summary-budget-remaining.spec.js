import React from 'react';
import { shallow } from 'enzyme';
import { CartSummaryBudgetRemaining } from './cart-summary-budget-remaining';

jest.mock('react-intl', () => {
  const actual = jest.requireActual('react-intl');
  return {
    ...actual,
    useIntl: jest.fn(() => ({
      formatMessage: jest.fn(data => data.id),
      formatNumber: jest.fn(),
    })),
  };
});

const createTestProps = customProps => ({
  cartTotalPrice: {
    fractionDigits: 2,
    currencyCode: 'USD',
    centAmount: 100000,
  },
  employeeAmountRemaining: {
    fractionDigits: 2,
    currencyCode: 'USD',
    centAmount: 200000,
  },
  ...customProps,
});

describe('render', () => {
  let props;
  let wrapper;
  describe('when the employee has not budget defined', () => {
    beforeEach(() => {
      props = createTestProps({ employeeAmountRemaining: null });
      wrapper = shallow(<CartSummaryBudgetRemaining {...props} />);
    });

    it('outputs correct tree', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should render withoutBudget message', () => {
      expect(wrapper.find('div').text()).toEqual(
        'Orders.Create.CartSummaryBudget.withoutBudget'
      );
    });
  });

  describe('when the budget is over', () => {
    beforeEach(() => {
      props = createTestProps({
        employeeAmountRemaining: {
          fractionDigits: 2,
          currencyCode: 'USD',
          centAmount: 20,
        },
      });
      wrapper = shallow(<CartSummaryBudgetRemaining {...props} />);
    });

    it('outputs correct tree', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should render budget over message', () => {
      expect(
        wrapper
          .find('div')
          .at(0)
          .text()
      ).toEqual('Orders.Create.CartSummaryBudget.isOver');
    });
  });

  describe('when the budget is not over', () => {
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<CartSummaryBudgetRemaining {...props} />);
    });

    it('outputs correct tree', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should render budgetRemaining message', () => {
      expect(
        wrapper
          .find('div')
          .at(0)
          .text()
      ).toEqual('Orders.Create.CartSummaryBudget.remainingBudget');
    });
  });
});
