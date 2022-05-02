import React from 'react';
import { shallow } from 'enzyme';
import { LocalizedTextInput } from '@commercetools-frontend/ui-kit';
import SingleFilter from '../single-filter';
import {
  LocalizedTextSingleFilter,
  renderInput,
} from './localized-text-filter';

const createTestProps = custom => ({
  value: { en: 'test' },
  onUpdateFilter: jest.fn(),
  selectedLanguage: 'en',
  ...custom,
});

describe('LocalizedTextSingleFilter', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps({
      placeholder: 'Some placeholder',
      error: 'Something is wrong',
      disabled: true,
    });
    wrapper = shallow(<LocalizedTextSingleFilter {...props} />);
  });

  it('should render a single filter', () => {
    expect(wrapper).toRender(SingleFilter);
  });

  it('should create EnumSingleFilter with disabled set to `false` by default', () => {
    expect(LocalizedTextSingleFilter.defaultProps.disabled).toBe(false);
  });

  it('should render a single filter with the given `value`', () => {
    expect(wrapper).toHaveProp('value', props.value);
  });

  it('should render a single filter with the given `error`', () => {
    expect(wrapper).toHaveProp('error', props.error);
  });

  it('should render a single filter with the given `onUpdateValue`', () => {
    expect(wrapper).toHaveProp('onUpdateValue', props.onUpdateFilter);
  });

  describe('propagating to renderInput', () => {
    let params;
    let inputWrapper;
    beforeEach(() => {
      params = {
        value: { en: 'test' },
        onUpdateValue: jest.fn(),
      };
      inputWrapper = wrapper.find(SingleFilter).renderProp('renderInput')(
        params
      );
    });
    it('should propagate the value to renderInput', () => {
      expect(inputWrapper.find(LocalizedTextInput)).toHaveProp('value', {
        en: 'test',
      });
    });

    it('should propagate the placeholder prop to renderInput', () => {
      expect(inputWrapper.find(LocalizedTextInput)).toHaveProp('placeholder', {
        en: 'Some placeholder',
      });
    });

    it('should propagate the disable prop to renderInput', () => {
      expect(inputWrapper.find(LocalizedTextInput)).toHaveProp(
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
          value: { en: 'test' },
          selectedLanguage: 'en',
          onUpdateValue,
        })}
      </div>
    );
  });

  it('should render a LocalizedTextInput component', () => {
    expect(wrapper).toRender(LocalizedTextInput);
  });

  it('should contain the passed value as prop', () => {
    expect(wrapper.find(LocalizedTextInput)).toHaveProp('value', {
      en: 'test',
    });
  });

  describe('callback', () => {
    beforeEach(() => {
      wrapper.find(LocalizedTextInput).prop('onChange')({ en: 'test2' });
    });

    it('should trigger the onChange callback', () => {
      expect(onUpdateValue).toHaveBeenCalledTimes(1);
    });

    it('should trigger the onChange callback passing the selected value', () => {
      expect(onUpdateValue).toHaveBeenCalledWith({ en: 'test2' });
    });
  });
});
