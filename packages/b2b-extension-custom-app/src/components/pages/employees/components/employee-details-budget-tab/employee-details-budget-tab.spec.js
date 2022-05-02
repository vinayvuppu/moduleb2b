import React from 'react';
import { shallow } from 'enzyme';

import EmployeeDetailsBudgetTab from './employee-details-budget-tab';

jest.mock('react-intl', () => {
  const actual = jest.requireActual('react-intl');
  return {
    ...actual,
    useIntl: jest.fn(() => ({
      formatNumber: jest.fn(),
      formatMessage: jest.fn(() => 'formatted message'),
    })),
  };
});

const createTestProps = props => ({
  employeeFetcher: {
    isLoading: false,
    employee: {
      amountExpended: {
        currencyCode: 'USD',
        fractionDigits: 2,
        centAmount: 1000,
      },
      amountRemaining: {
        currencyCode: 'USD',
        fractionDigits: 2,
        centAmount: 1000,
      },
    },
  },
  ...props,
});

describe('rendering', () => {
  let props;
  let wrapper;

  describe('when is loading', () => {
    beforeEach(() => {
      props = createTestProps({ employeeFetcher: { isLoading: true } });
      wrapper = shallow(<EmployeeDetailsBudgetTab {...props} />);
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
  describe('when is loaded', () => {
    describe('when amountRemaining is not present', () => {
      beforeEach(() => {
        props = createTestProps({
          employeeFetcher: {
            isLoading: false,
            employee: {
              amountExpended: {
                currencyCode: 'USD',
                fractionDigits: 2,
                centAmount: 1000,
              },
              amountRemaining: null,
            },
          },
        });
        wrapper = shallow(<EmployeeDetailsBudgetTab {...props} />);
      });

      it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
      });
    });
    describe('when amountRemaining is negative', () => {
      beforeEach(() => {
        props = createTestProps({
          employeeFetcher: {
            isLoading: false,
            employee: {
              amountExpended: {
                currencyCode: 'USD',
                fractionDigits: 2,
                centAmount: 1000,
              },
              amountRemaining: {
                currencyCode: 'USD',
                fractionDigits: 2,
                centAmount: -1000,
              },
            },
          },
        });
        wrapper = shallow(<EmployeeDetailsBudgetTab {...props} />);
      });

      it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
      });
    });
    describe('when amountRemaining is positive', () => {
      beforeEach(() => {
        props = createTestProps();
        wrapper = shallow(<EmployeeDetailsBudgetTab {...props} />);
      });

      it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
      });
    });
  });
});
