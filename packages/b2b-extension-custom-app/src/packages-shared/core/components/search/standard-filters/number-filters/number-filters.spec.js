import React from 'react';
import { shallow } from 'enzyme';
import SingleFilter from '../single-filter';
import RangeFilter from '../range-filter';
import {
  createNumberSingleFilter,
  createNumberRangeFilter,
  renderInput,
} from './number-filters';

const getInputComponent = () => {
  const component = jest.fn();
  component.displayName = 'InputComponent';

  return component;
};

const createTestProps = custom => ({
  value: '2',
  error: 'something',
  onUpdateFilter: jest.fn(),
  ...custom,
});

const NumberSingleFilter = createNumberSingleFilter({ numberFormat: 'en' });
const NumberRangeFilter = createNumberRangeFilter({ numberFormat: 'en' });

describe('createNumberSingleFilter', () => {
  it('should return a component', () => {
    expect(
      createNumberSingleFilter({ numberFormat: 'en' })
    ).toBeComponentWithName('NumberSingleFilter');
  });
});
describe('createNumberRangeFilter', () => {
  it('should return a component', () => {
    expect(
      createNumberRangeFilter({ numberFormat: 'en' })
    ).toBeComponentWithName('NumberRangeFilter');
  });
});

describe('NumberSingleFilter', () => {
  const props = createTestProps();
  const wrapper = shallow(<NumberSingleFilter {...props} />);

  it('should create NumberSingleFilter with disabled set to `false` by default', () => {
    expect(NumberSingleFilter.defaultProps.disabled).toBe(false);
  });

  it('should render a single filter', () => {
    expect(wrapper.find(SingleFilter)).toHaveLength(1);
    expect(wrapper.find(SingleFilter).props()).toEqual(
      expect.objectContaining({
        renderInput: expect.any(Function),
        value: '2',
        error: 'something',
        onUpdateValue: props.onUpdateFilter,
      })
    );
  });
  it('should propagate to renderInput', () => {
    const params = {
      value: '1',
      onUpdateValue: jest.fn(),
    };
    const inputWrapper = shallow(
      <div>{wrapper.find(SingleFilter).prop('renderInput')(params)}</div>
    );
    const input = inputWrapper.find({ name: 'number-filter' });
    expect(input.prop('value')).toBe('1');
  });
});

describe('NumberRangeFilter', () => {
  const props = createTestProps({
    value: { from: '0', to: '10' },
    error: { from: 'something' },
  });
  const wrapper = shallow(<NumberRangeFilter {...props} />);

  it('should render a range filter', () => {
    expect(wrapper.find(RangeFilter)).toHaveLength(1);
    expect(wrapper.find(RangeFilter).props()).toEqual(
      expect.objectContaining({
        renderInput: expect.any(Function),
        value: { from: '0', to: '10' },
        error: { from: 'something' },
        onUpdateValue: props.onUpdateFilter,
      })
    );
  });
  it('should propagate to renderInput', () => {
    const params = {
      value: '2',
      onUpdateValue: jest.fn(),
    };
    const inputWrapper = shallow(
      <div>{wrapper.find(RangeFilter).prop('renderInput')(params)}</div>
    );
    const input = inputWrapper.find({ name: 'number-filter' });

    expect(input.prop('value')).toBe('2');
  });
});

describe('renderInput', () => {
  const onUpdateValue = jest.fn();
  const wrapper = shallow(
    <div>
      {renderInput({
        value: '3',
        onUpdateValue,
        InputComponent: getInputComponent(),
      })}
    </div>
  );

  const input = wrapper.find('InputComponent');

  it('should render an input', () => {
    expect(input).toHaveLength(1);
    expect(input.prop('value')).toBe('3');
  });

  it('should trigger the onChange callback', () => {
    input.prop('onChange')(20);

    expect(onUpdateValue).toHaveBeenCalledTimes(1);
    expect(onUpdateValue).toHaveBeenCalledWith(20);
  });
});

describe('renderInput with error', () => {
  const onUpdateValue = jest.fn();
  const wrapper = shallow(
    <div>
      {renderInput({
        value: 3,
        onUpdateValue,
        numberFormat: 'en',
        hasError: true,
        InputComponent: getInputComponent(),
      })}
    </div>
  );
  const input = wrapper.find('InputComponent');

  it('should render an input', () => {
    expect(input).toHaveLength(1);
    expect(input.prop('value')).toBe(3);
  });

  it('should trigger the onChange callback', () => {
    input.prop('onChange')(20);

    expect(onUpdateValue).toHaveBeenCalledTimes(1);
    expect(onUpdateValue).toHaveBeenCalledWith(20);
  });
});
