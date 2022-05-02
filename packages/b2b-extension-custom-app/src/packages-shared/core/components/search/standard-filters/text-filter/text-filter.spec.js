import React from 'react';
import { shallow } from 'enzyme';
import { TextInput } from '@commercetools-frontend/ui-kit';
import { TextSingleFilter, renderInput } from './text-filter';

const createTestProps = custom => ({
  value: 'some text',
  error: 'something',
  placeholder: 'some placeholder',
  onUpdateFilter: jest.fn(),
  ...custom,
});

describe('TextSingleFilter', () => {
  let wrapper;
  let props;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<TextSingleFilter {...props} />);
  });

  it('should render a single filter', () => {
    expect(wrapper).toRenderElementTimes('SingleFilter', 1);
  });

  it('should create TextSingleFilter with disabled set to `false` by default', () => {
    expect(TextSingleFilter.defaultProps.disabled).toBe(false);
  });

  it('should contain the passed props', () => {
    expect(wrapper.find('SingleFilter').props()).toEqual(
      expect.objectContaining({
        renderInput: expect.any(Function),
        value: 'some text',
        error: 'something',
        onUpdateValue: props.onUpdateFilter,
      })
    );
  });
  it('should propagate to renderInput', () => {
    const params = {
      value: 'text',
      onUpdateValue: jest.fn(),
    };
    const inputWrapper = shallow(
      <div>{wrapper.find('SingleFilter').prop('renderInput')(params)}</div>
    );
    const input = inputWrapper.find(TextInput);
    expect(input.prop('value')).toBe('text');
  });
});

describe('renderInput', () => {
  let wrapper;
  let input;
  let onUpdateValue;
  beforeEach(() => {
    onUpdateValue = jest.fn();
    wrapper = shallow(
      <div>
        {renderInput({
          value: 'text',
          onUpdateValue,
        })}
      </div>
    );
    input = wrapper.find(TextInput);
  });

  it('should render an input', () => {
    expect(wrapper).toRenderElementTimes(TextInput, 1);
  });

  it('should not have the error class', () => {
    expect(input).not.toContainClass('input-error');
  });

  it('should trigger the onChange callback', () => {
    input.prop('onChange')('other text');
    expect(onUpdateValue).toHaveBeenCalledTimes(1);
    expect(onUpdateValue).toHaveBeenCalledWith('other text');
  });

  describe('with value', () => {
    it('should contain the value passed as prop', () => {
      expect(input.prop('value')).toBe('text');
    });
  });

  describe('without value (`null`)', () => {
    beforeEach(() => {
      onUpdateValue = jest.fn();
      wrapper = shallow(
        <div>
          {renderInput({
            value: null,
            onUpdateValue: jest.fn(),
          })}
        </div>
      );
      input = wrapper.find(TextInput);
    });

    it('should falback to an empty value', () => {
      expect(input.prop('value')).toBe('');
    });
  });
});

describe('renderInput with error', () => {
  let wrapper;
  let input;
  let onUpdateValue;
  beforeEach(() => {
    onUpdateValue = jest.fn();
    wrapper = shallow(
      <div>
        {renderInput({
          value: 'text with error',
          onUpdateValue,
          hasError: true,
        })}
      </div>
    );
    input = wrapper.find(TextInput);
  });

  it('should render an input', () => {
    expect(wrapper).toRenderElementTimes(TextInput, 1);
  });

  it('should contain the proper value passed as prop', () => {
    expect(input.prop('value')).toBe('text with error');
  });

  it('should have the error class', () => {
    expect(input).toHaveProp('hasError', true);
  });

  it('should trigger the onChange callback', () => {
    input.prop('onChange')('other text');
    expect(onUpdateValue).toHaveBeenCalledTimes(1);
    expect(onUpdateValue).toHaveBeenCalledWith('other text');
  });
});
