import React from 'react';
import { shallow } from 'enzyme';
import { MoneyInput } from '@commercetools-frontend/ui-kit';
import SingleFilter from '../single-filter';
import RangeFilter from '../range-filter';
import {
  createMoneySingleFilter,
  createMoneyRangeFilter,
  renderInput,
} from './money-filters';

const createTestProps = custom => ({
  onUpdateFilter: jest.fn(),
  onBlur: jest.fn(),
  value: {
    currencyCode: 'EUR',
    amount: '1000',
  },
  ...custom,
});

const MoneySingleFilter = createMoneySingleFilter();
const MoneyRangeFilter = createMoneyRangeFilter();

describe('createMoneySingleFilter', () => {
  it('should return a component', () => {
    expect(createMoneySingleFilter()).toBeComponentWithName(
      'MoneySingleFilter'
    );
  });
});
describe('createEnumRangeFilter', () => {
  it('should return a component', () => {
    expect(createMoneyRangeFilter()).toBeComponentWithName('MoneyRangeFilter');
  });
});

describe('MoneySingleFilter', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps({
      disabled: true,
      placeholder: 'Some placeholder',
      error: 'Something is wrong',
    });
    wrapper = shallow(<MoneySingleFilter {...props} />);
  });

  it('should render a single filter', () => {
    expect(wrapper).toRender(SingleFilter);
  });

  it('should create MoneySingleFilter with disabled set to `false` by default', () => {
    expect(MoneySingleFilter.defaultProps.disabled).toBe(false);
  });

  it('should render a single filter with a `renderInput` function', () => {
    expect(wrapper).toHaveProp('renderInput', expect.any(Function));
  });

  it('should render a single filter with the given `value`', () => {
    expect(wrapper).toHaveProp('value', props.value);
  });

  it('should render a single filter with the given `error`', () => {
    expect(wrapper).toHaveProp('value', props.value);
  });

  it('should render a single filter with the given `onUpdateValue`', () => {
    expect(wrapper).toHaveProp('onUpdateValue', props.onUpdateFilter);
  });

  describe('propagating to renderInput', () => {
    let params;
    let inputWrapper;
    beforeEach(() => {
      params = {
        value: {
          currencyCode: 'EUR',
          amount: '1000',
        },
        onUpdateValue: jest.fn(),
        hasError: true,
      };
      inputWrapper = wrapper.find(SingleFilter).renderProp('renderInput')(
        params
      );
    });
    it('should propagate the value to renderInput', () => {
      expect(inputWrapper.find(MoneyInput)).toHaveProp('value', {
        currencyCode: 'EUR',
        amount: '1000',
      });
    });

    it('should propagate the placeholder prop to renderInput', () => {
      expect(inputWrapper.find(MoneyInput)).toHaveProp(
        'placeholder',
        'Some placeholder'
      );
    });

    it('should propagate the disable prop to renderInput', () => {
      expect(inputWrapper.find(MoneyInput)).toHaveProp('isDisabled', true);
    });
  });
});

describe('MoneyRangeFilter', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps({
      disabled: true,
      placeholder: 'Some placeholder',
      error: { from: 'Something is wrong' },
      value: {
        from: {
          currencyCode: 'EUR',
          amount: '100',
        },
        to: {
          currencyCode: 'EUR',
          amount: '500',
        },
      },
    });
    wrapper = shallow(<MoneyRangeFilter {...props} />);
  });

  it('should render a range filter', () => {
    expect(wrapper).toRender(RangeFilter);
  });

  it('should create MoneyRangeFilter with disabled set to `false` by default', () => {
    expect(MoneyRangeFilter.defaultProps.disabled).toBe(false);
  });

  it('should render a range filter with a `renderInput` function', () => {
    expect(wrapper).toHaveProp('renderInput', expect.any(Function));
  });

  it('should render a range filter with the given `value`', () => {
    expect(wrapper).toHaveProp('value', props.value);
  });

  it('should render a range filter with the given `error`', () => {
    expect(wrapper).toHaveProp('value', props.value);
  });

  it('should render a range filter with the given `onUpdateValue`', () => {
    expect(wrapper).toHaveProp('onUpdateValue', props.onUpdateFilter);
  });

  describe('propagating to renderInput', () => {
    let params;
    let inputWrapper;
    beforeEach(() => {
      params = {
        value: {
          currencyCode: 'EUR',
          amount: '1000',
        },
        onUpdateValue: jest.fn(),
        hasError: true,
      };
      inputWrapper = wrapper.find(RangeFilter).renderProp('renderInput')(
        params
      );
    });
    it('should propagate the value to renderInput', () => {
      expect(inputWrapper.find(MoneyInput)).toHaveProp('value', {
        currencyCode: 'EUR',
        amount: '1000',
      });
    });

    it('should propagate the placeholder prop to renderInput', () => {
      expect(inputWrapper.find(MoneyInput)).toHaveProp(
        'placeholder',
        'Some placeholder'
      );
    });

    it('should propagate the disable prop to renderInput', () => {
      expect(inputWrapper.find(MoneyInput)).toHaveProp('isDisabled', true);
    });
  });
});

describe('renderInput', () => {
  let wrapper;
  let onUpdateValue;
  beforeEach(() => {
    onUpdateValue = jest.fn();
    wrapper = shallow(
      <div>
        {renderInput({
          value: {
            currencyCode: 'EUR',
            amount: '1000',
            currencies: ['EUR', 'USD'],
          },
          name: 'test',
          hasError: true,
          onUpdateValue,
        })}
      </div>
    );
  });

  it('should render a MoneyInput component', () => {
    expect(wrapper).toRender(MoneyInput);
  });

  it('should contain the passed value as prop', () => {
    expect(wrapper.find(MoneyInput)).toHaveProp('value', {
      currencyCode: 'EUR',
      amount: '1000',
    });
  });

  describe('callback', () => {
    describe('when currency changes', () => {
      beforeEach(() => {
        wrapper.find(MoneyInput).prop('onChange')({
          target: { name: 'test.currencyCode', value: 'USD' },
        });
      });

      it('should trigger the onChange callback', () => {
        expect(onUpdateValue).toHaveBeenCalledTimes(1);
      });

      it('should trigger the onChange callback passing the selected value', () => {
        expect(onUpdateValue).toHaveBeenCalledWith({
          currencyCode: 'USD',
          amount: '1000',
          currencies: ['EUR', 'USD'],
        });
      });
    });
    describe('when amount changes', () => {
      beforeEach(() => {
        wrapper.find(MoneyInput).prop('onChange')({
          target: { name: 'test.amount', value: '2000' },
        });
      });

      it('should trigger the onChange callback', () => {
        expect(onUpdateValue).toHaveBeenCalledTimes(1);
      });

      it('should trigger the onChange callback passing the selected value', () => {
        expect(onUpdateValue).toHaveBeenCalledWith({
          currencyCode: 'EUR',
          amount: '2000',
          currencies: ['EUR', 'USD'],
        });
      });
    });
  });
});
