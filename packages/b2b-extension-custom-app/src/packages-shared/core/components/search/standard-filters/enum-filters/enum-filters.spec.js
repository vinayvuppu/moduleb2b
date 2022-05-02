import React from 'react';
import { shallow } from 'enzyme';
import { SelectInput } from '@commercetools-frontend/ui-kit';
import {
  createEnumSingleFilter,
  createEnumRangeFilter,
  renderInput,
} from './enum-filters';

const createTestProps = custom => ({
  value: '2',
  onUpdateFilter: jest.fn(),
  valueRenderer: jest.fn(() => 'Rendered Value'),
  ...custom,
});

const enumOptions = {
  options: [
    { value: 'a', label: 'A' },
    { value: 'b', label: 'B' },
  ],
};

const EnumSingleFilter = createEnumSingleFilter(enumOptions);
const EnumRangeFilter = createEnumRangeFilter(enumOptions);

describe('createEnumSingleFilter', () => {
  it('should return a component', () => {
    expect(createEnumSingleFilter(enumOptions)).toBeComponentWithName(
      'EnumSingleFilter'
    );
  });
});
describe('createEnumRangeFilter', () => {
  it('should return a component', () => {
    expect(createEnumRangeFilter(enumOptions)).toBeComponentWithName(
      'EnumRangeFilter'
    );
  });
});

describe('EnumSingleFilter', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps({
      placeholder: 'Some placeholder',
      className: 'customClass',
      error: 'Something is wrong',
      disabled: true,
    });
    wrapper = shallow(<EnumSingleFilter {...props} />);
  });

  it('should accept `optionsOverride`', () => {
    const optionsOverrides = [
      {
        label: 'label-1',
        value: 'value-1',
      },
    ];
    props = createTestProps({
      placeholder: 'Some placeholder',
      className: 'customClass',
      options: optionsOverrides,
    });
    wrapper = shallow(<EnumSingleFilter {...props} />);

    const params = {
      value: 1,
      onUpdateValue: jest.fn(),
    };
    const inputWrapper = shallow(
      <div>{wrapper.find('SingleFilter').prop('renderInput')(params)}</div>
    );

    expect(inputWrapper.find(SelectInput).prop('options')).toBe(
      optionsOverrides
    );
  });
  it('should render a single filter', () => {
    expect(wrapper).toRenderElementTimes('SingleFilter', 1);
  });

  it('should create EnumSingleFilter with disabled set to `false` by default', () => {
    expect(EnumSingleFilter.defaultProps.disabled).toBe(false);
  });

  it('should render a single filter with the passed props', () => {
    expect(wrapper.find('SingleFilter').props()).toEqual(
      expect.objectContaining({
        renderInput: expect.any(Function),
        value: '2',
        onUpdateValue: props.onUpdateFilter,
        error: 'Something is wrong',
      })
    );
  });

  describe('propagating to renderInput', () => {
    let params;
    let inputWrapper;
    beforeEach(() => {
      params = {
        value: 1,
        onUpdateValue: jest.fn(),
      };
      inputWrapper = shallow(
        <div>{wrapper.find('SingleFilter').prop('renderInput')(params)}</div>
      );
    });
    it('should propagate the value to renderInput', () => {
      expect(inputWrapper.find(SelectInput).prop('value')).toBe('1');
    });

    it('should propagate the placeholder prop to renderInput', () => {
      expect(inputWrapper.find(SelectInput).prop('placeholder')).toBe(
        'Some placeholder'
      );
    });

    it('should propagate the disable prop to renderInput', () => {
      expect(inputWrapper.find(SelectInput)).toHaveProp('isDisabled', true);
    });
  });
});

describe('EnumRangeFilter', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps({ value: { from: 0, to: 10 } });
    wrapper = shallow(<EnumRangeFilter {...props} />);
  });

  it('should render a range filter', () => {
    expect(wrapper).toRenderElementTimes('RangeFilter', 1);
  });

  it('should render a range filter with passed props', () => {
    expect(wrapper.find('RangeFilter').props()).toEqual(
      expect.objectContaining({
        renderInput: expect.any(Function),
        value: { from: 0, to: 10 },
        onUpdateValue: props.onUpdateFilter,
      })
    );
  });

  describe('propagating to renderInput', () => {
    let params;
    let inputWrapper;
    beforeEach(() => {
      params = {
        value: 2,
        onUpdateValue: jest.fn(),
      };
      inputWrapper = shallow(
        <div>{wrapper.find('RangeFilter').prop('renderInput')(params)}</div>
      );
    });

    it('should propagate the value to renderInput', () => {
      expect(inputWrapper.find(SelectInput).prop('value')).toBe('2');
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
          value: 3,
          onUpdateValue,
          ...enumOptions,
        })}
      </div>
    );
  });

  it('should render a SelectInput component', () => {
    expect(wrapper).toRenderElementTimes(SelectInput, 1);
  });

  it('should contain the passed value as prop', () => {
    expect(wrapper.find(SelectInput).prop('value')).toBe('3');
  });

  describe('callback', () => {
    beforeEach(() => {
      wrapper.find(SelectInput).prop('onChange')({ target: 20 });
    });

    it('should trigger the onChange callback', () => {
      expect(onUpdateValue).toHaveBeenCalledTimes(1);
    });

    it('should trigger the onChange callback passing the selected value', () => {
      expect(onUpdateValue).toHaveBeenCalledWith(20);
    });
  });

  describe('when is multi selection', () => {
    describe('when the value is null', () => {
      beforeEach(() => {
        onUpdateValue = jest.fn();
        wrapper = shallow(
          <div>
            {renderInput({
              value: null,
              onUpdateValue,
              isMulti: true,
              ...enumOptions,
            })}
          </div>
        );
      });
      it('should contain an empty array as value', () => {
        expect(wrapper.find(SelectInput).prop('value')).toEqual([]);
      });
    });
    describe('when the value is defined', () => {
      beforeEach(() => {
        onUpdateValue = jest.fn();
        wrapper = shallow(
          <div>
            {renderInput({
              value: { value: ['Test'] },
              onUpdateValue,
              isMulti: true,
              ...enumOptions,
            })}
          </div>
        );
      });
      it('should contain an empty array as value', () => {
        expect(wrapper.find(SelectInput).prop('value')).toEqual(['Test']);
      });
    });
  });
});
