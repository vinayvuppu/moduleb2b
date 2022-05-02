import React from 'react';
import { shallow } from 'enzyme';
import { NumericFormatInput, withPropsForMoney } from './numeric-format-input';

const createTestProps = props => ({
  value: 0.01,
  formatNumber: jest.fn(),
  onChangeValue: jest.fn(),
  onFocus: jest.fn(),
  onBlurValue: jest.fn(),
  onInvalidValue: jest.fn(),
  numberFormatType: 'number',
  numberFormat: 'en',
  placeholder: 'Custom Placeholder',
  name: 'custom-name',
  className: 'custom-class',
  'data-testid': 'testable-input',
  ...props,
});

describe('rendering', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<NumericFormatInput {...props} />);
  });
  it('should render a Cleave component', () => {
    expect(wrapper).toRender('Cleave');
  });
  describe('props', () => {
    let cleave;
    beforeEach(() => {
      cleave = wrapper.find('Cleave');
    });
    it('should pass placeholder', () => {
      expect(cleave).toHaveProp('placeholder', 'Custom Placeholder');
    });
    it('should pass htmlRef', () => {
      expect(cleave).toHaveProp('htmlRef', wrapper.instance().registerInputRef);
    });
    it('should pass options', () => {
      expect(cleave.prop('options')).toEqual({
        numeral: true,
        numeralThousandsGroupStyle: 'thousand',
        numeralDecimalMark: '.',
        delimiter: ',',
        numeralDecimalScale: 20,
        numeralIntegerScale: 0,
      });
    });
    it('should pass name', () => {
      expect(cleave).toHaveProp('name', 'custom-name');
    });
    it('should pass className', () => {
      expect(cleave).toHaveProp('className', 'custom-class');
    });
    it('should pass onChange', () => {
      expect(cleave).toHaveProp('onChange', wrapper.instance().handleChange);
    });
    it('should pass onInit', () => {
      expect(cleave).toHaveProp('onInit', wrapper.instance().handleInit);
    });
    it('should pass onBlur', () => {
      expect(cleave).toHaveProp('onBlur', wrapper.instance().handleBlur);
    });
    it('should pass onFocus', () => {
      expect(cleave).toHaveProp('onFocus', props.onFocus);
    });
    it('should pass data-* props', () => {
      expect(cleave).toHaveProp('data-testid', 'testable-input');
    });
  });
});

describe('lifecycle', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps({ value: 100 });
    wrapper = shallow(<NumericFormatInput {...props} />);
  });
  describe('componentWillReceiveProps', () => {
    beforeEach(() => {
      wrapper.instance().setValue = jest.fn();
    });
    it("should not update the value if it hasn't changed", () => {
      wrapper.instance().UNSAFE_componentWillReceiveProps({ value: 100 });
      expect(wrapper.instance().setValue).toHaveBeenCalledTimes(0);
    });
    it('should update the value if it has changed', () => {
      wrapper.instance().UNSAFE_componentWillReceiveProps({ value: 99 });
      expect(wrapper.instance().setValue).toHaveBeenCalledTimes(1);
      expect(wrapper.instance().setValue).toHaveBeenCalledWith(99);
    });
  });
  describe('setValue', () => {
    beforeEach(() => {
      wrapper.instance().owner = { setRawValue: jest.fn() };
    });
    it('should not update if the value is NaN', () => {
      wrapper.instance().UNSAFE_componentWillReceiveProps({ value: NaN });
      expect(wrapper.instance().owner.setRawValue).toHaveBeenCalledTimes(0);
    });
    it('should update if the value is undefined', () => {
      wrapper.instance().UNSAFE_componentWillReceiveProps({ value: undefined });
      expect(wrapper.instance().owner.setRawValue).toHaveBeenCalledTimes(1);
    });
    it('should update if the value is null', () => {
      wrapper.instance().UNSAFE_componentWillReceiveProps({ value: null });
      expect(wrapper.instance().owner.setRawValue).toHaveBeenCalledTimes(1);
    });
    it('should not update if the value is a string', () => {
      wrapper.instance().UNSAFE_componentWillReceiveProps({ value: 'foo' });
      expect(wrapper.instance().owner.setRawValue).toHaveBeenCalledTimes(0);
    });
  });
});

describe('interaction', () => {
  let props;
  let wrapper;
  let owner;
  beforeEach(() => {
    owner = {
      setRawValue: jest.fn(),
    };
    props = createTestProps({
      formatNumber: () => 'formatted number',
    });
    wrapper = shallow(<NumericFormatInput {...props} />);
    wrapper.instance().owner = owner;
  });
  describe('handleBlur', () => {
    beforeEach(() => {
      wrapper.instance().handleBlur();
    });
    it('should set the raw value to the formatted number', () => {
      expect(owner.setRawValue).toHaveBeenLastCalledWith('formatted number');
    });
    it('should call onBlurValue', () => {
      expect(props.onBlurValue).toHaveBeenCalledTimes(1);
    });
  });
  describe('handleInit', () => {
    beforeEach(() => {
      wrapper.instance().handleInit(owner);
    });
    it('should set the raw value to the formatted number', () => {
      expect(owner.setRawValue).toHaveBeenLastCalledWith('formatted number');
    });
  });
  describe('handleChange', () => {
    describe('new value', () => {
      beforeEach(() => {
        wrapper.instance().handleChange({ target: { rawValue: 11000.01 } });
      });
      it('should call onChangeValue', () => {
        expect(props.onChangeValue).toHaveBeenLastCalledWith(11000.01);
        expect(wrapper.instance().parsedValue).toBe(11000.01);
      });
    });
    describe('same value', () => {
      beforeEach(() => {
        wrapper.instance().parsedValue = 11000.01;
        wrapper.instance().handleChange({ target: { rawValue: 11000.01 } });
      });
      it("should not call onChangeValue if the value hasn't changed", () => {
        expect(props.onChangeValue).toHaveBeenCalledTimes(0);
      });
    });
  });
});

describe('withPropsForMoney', () => {
  describe('money type', () => {
    const onChangeValue = jest.fn();
    const withProps = withPropsForMoney({
      numberFormatType: 'money',
      value: 100,
      onChangeValue,
    });
    it('should divide the value by 100', () => {
      expect(withProps).toEqual({
        value: 1,
        formatNumber: expect.any(Function),
        onChangeValue: expect.any(Function),
        numeralDecimalScale: 2,
      });
    });
    describe('formatNumber', () => {
      it('should fix the number to two decimals', () => {
        expect(withProps.formatNumber(0)).toEqual('0.00');
      });
    });
    describe('onChangeValue', () => {
      it('should multiply the money by 100 to be cent', () => {
        withProps.onChangeValue(0.1);
        expect(onChangeValue).toHaveBeenLastCalledWith(10);
      });
      describe('when the value is 2.49', () => {
        it('should cast the cent amount to int', () => {
          withProps.onChangeValue(2.49);
          expect(onChangeValue).toHaveBeenLastCalledWith(249);
        });
      });
      describe('when the value is 2399.99', () => {
        beforeEach(() => {
          withProps.onChangeValue(2399.99);
        });
        it('should cast the cent amount to int', () => {
          expect(onChangeValue).toHaveBeenLastCalledWith(239999);
        });
        // This test is added as a reference that this bug has re-occured
        // We want to make sure that the centAmount value is rounded to the closest
        // decimal value during conversion
        // ref: https://sphere.atlassian.net/browse/MC-1595
        // ref: https://github.com/commercetools/merchant-center-frontend/pull/770
        it('should not floor the cent amount', () => {
          expect(onChangeValue).not.toHaveBeenLastCalledWith(239998);
        });
      });
    });
  });
  describe('number type', () => {
    it('should not change any props', () => {
      const withProps = withPropsForMoney({ numberFormatType: 'number' });
      expect(withProps).toEqual({});
    });
  });
});

describe('onChangeValue', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<NumericFormatInput {...props} />);
  });
  describe('with invalid values', () => {
    describe('with an empty value', () => {
      beforeEach(() => {
        const event = {
          target: {
            rawValue: '',
          },
        };
        wrapper.instance().handleChange(event);
      });
      it('should call `onChangeValue`', () => {
        expect(props.onChangeValue).toHaveBeenCalledTimes(1);
      });
      it('should call `onChangeValue` with `undefined`', () => {
        expect(props.onChangeValue).toHaveBeenLastCalledWith(undefined);
      });
    });
    describe('with a minus', () => {
      beforeEach(() => {
        const event = {
          target: {
            rawValue: '-',
          },
        };
        wrapper.instance().handleChange(event);
      });
      it('should call `onChangeValue`', () => {
        expect(props.onChangeValue).toHaveBeenCalledTimes(1);
      });
      it('should call `onChangeValue` with `undefined`', () => {
        expect(props.onChangeValue).toHaveBeenLastCalledWith(undefined);
      });
    });
    describe('with alphabetic characters', () => {
      beforeEach(() => {
        const event = {
          target: {
            rawValue: 'abcdefg',
          },
        };
        wrapper.instance().handleChange(event);
      });
      it('should call `onChangeValue`', () => {
        expect(props.onChangeValue).toHaveBeenCalledTimes(1);
      });
      it('should call `onChangeValue` with `undefined`', () => {
        expect(props.onChangeValue).toHaveBeenLastCalledWith(undefined);
      });
    });
  });
  describe('with valid values', () => {
    describe('with a number-ish value', () => {
      beforeEach(() => {
        const event = {
          target: {
            rawValue: '1450,30',
          },
        };
        wrapper.instance().handleChange(event);
      });
      it('should call `onChangeValue`', () => {
        expect(props.onChangeValue).toHaveBeenCalledTimes(1);
      });
      it('should call `onChangeValue` with `-1450`', () => {
        expect(props.onChangeValue).toHaveBeenLastCalledWith(1450);
      });
    });
    describe('with a negative value', () => {
      beforeEach(() => {
        const event = {
          target: {
            rawValue: '-999',
          },
        };
        wrapper.instance().handleChange(event);
      });
      it('should call `onChangeValue`', () => {
        expect(props.onChangeValue).toHaveBeenCalledTimes(1);
      });
      it('should call `onChangeValue` with `-999  `', () => {
        expect(props.onChangeValue).toHaveBeenLastCalledWith(-999);
      });
    });
  });
});
