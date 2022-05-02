import React from 'react';
import { shallow } from 'enzyme';
import { intlMock } from '@commercetools-local/test-utils';
import {
  OrderItemTableTaxRateCell,
  getNumberOfDecimals,
  displayPercentage,
} from './order-item-table-tax-rate-cell';

const createTestProps = props => ({
  taxRate: {
    amount: 0.15,
  },
  intl: intlMock,
  ...props,
});

describe('rendering', () => {
  describe('when tax rate is set', () => {
    let props;
    let wrapper;
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<OrderItemTableTaxRateCell {...props} />);
    });

    it('should render the percentage for the tax rate', () => {
      expect(wrapper).toHaveText('15%');
    });
  });

  describe('when no tax rate is set', () => {
    let props;
    let wrapper;
    beforeEach(() => {
      props = createTestProps({
        taxRate: undefined,
      });
      wrapper = shallow(<OrderItemTableTaxRateCell {...props} />);
    });

    it('should render no value fallback', () => {
      expect(wrapper).toHaveText('');
    });
  });
});

describe('getNumberOfDecimals', () => {
  let numberOfDecimals;
  describe('when has two decimals', () => {
    beforeEach(() => {
      numberOfDecimals = getNumberOfDecimals(0.16);
    });
    it('should return 2 as result', () => {
      expect(numberOfDecimals).toEqual(2);
    });
  });
  describe('when has seven decimals', () => {
    beforeEach(() => {
      numberOfDecimals = getNumberOfDecimals(0.1612323);
    });
    it('should return 7 as result', () => {
      expect(numberOfDecimals).toEqual(7);
    });
  });
});

describe('displayPercentage', () => {
  let percentage;
  describe('when the percentage value is an integer', () => {
    beforeEach(() => {
      percentage = displayPercentage(16);
    });
    it('should return the formatted string with the percentage value', () => {
      expect(percentage).toEqual('16%');
    });
  });
  describe('when the percentage value has less than 3 decimals', () => {
    beforeEach(() => {
      percentage = displayPercentage(16.11);
    });
    it('should return the formatted string with the percentage value', () => {
      expect(percentage).toEqual('16.11%');
    });
  });
  describe('when the percentage value has more than 3 decimals', () => {
    beforeEach(() => {
      percentage = displayPercentage(16.1111);
    });
    it('should return the percentage value truncated', () => {
      expect(percentage).toEqual('16.11...%');
    });
  });
});
