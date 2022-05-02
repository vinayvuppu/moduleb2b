import React from 'react';
import { shallow } from 'enzyme';
import { CreatableSelectInput } from '@commercetools-frontend/ui-kit';
import {
  createCreatableEnumSingleFilter,
  renderInput,
} from './creatable-enum-filters';

const createTestProps = custom => ({
  value: [{ label: '2', value: '2' }],
  onUpdateFilter: jest.fn(),
  valueRenderer: jest.fn(() => 'Rendered Value'),
  ...custom,
});

const CreatableEnumSingleFilter = createCreatableEnumSingleFilter({});

describe('createCreatableEnumSingleFilter', () => {
  it('should return a component', () => {
    expect(createCreatableEnumSingleFilter({})).toBeComponentWithName(
      'CreatableEnumSingleFilter'
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
    wrapper = shallow(<CreatableEnumSingleFilter {...props} />);
  });

  it('should render a single filter', () => {
    expect(wrapper).toRenderElementTimes('SingleFilter', 1);
  });

  it('should create EnumSingleFilter with disabled set to `false` by default', () => {
    expect(CreatableEnumSingleFilter.defaultProps.disabled).toBe(false);
  });

  it('should render a single filter with the passed props', () => {
    expect(wrapper.find('SingleFilter').props()).toEqual(
      expect.objectContaining({
        renderInput: expect.any(Function),
        value: [{ label: '2', value: '2' }],
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
        value: [{ label: '1', value: '1' }],
        onUpdateValue: jest.fn(),
      };
      inputWrapper = shallow(
        <div>{wrapper.find('SingleFilter').prop('renderInput')(params)}</div>
      );
    });
    it('should propagate the value to renderInput', () => {
      expect(inputWrapper.find(CreatableSelectInput).prop('value')).toEqual([
        { label: '1', value: '1' },
      ]);
    });

    it('should propagate the placeholder prop to renderInput', () => {
      expect(inputWrapper.find(CreatableSelectInput).prop('placeholder')).toBe(
        'Some placeholder'
      );
    });

    it('should propagate the disable prop to renderInput', () => {
      expect(inputWrapper.find(CreatableSelectInput)).toHaveProp(
        'isDisabled',
        true
      );
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
          value: [{ label: '3', value: '3' }],
          onUpdateValue,
        })}
      </div>
    );
  });

  it('should render a CreatableSelectInput component', () => {
    expect(wrapper).toRenderElementTimes(CreatableSelectInput, 1);
  });

  it('should contain the passed value as prop', () => {
    expect(wrapper.find(CreatableSelectInput).prop('value')).toEqual([
      { label: '3', value: '3' },
    ]);
  });

  describe('callback', () => {
    beforeEach(() => {
      wrapper.find(CreatableSelectInput).prop('onChange')({
        target: { value: [{ label: '3', value: '3' }] },
      });
    });

    it('should trigger the onChange callback', () => {
      expect(onUpdateValue).toHaveBeenCalledTimes(1);
    });
  });
});
