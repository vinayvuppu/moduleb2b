import React from 'react';
import { shallow } from 'enzyme';
import ReferenceFilterFallback from './reference-filter-fallback';

const createTestProps = custom => ({
  value: ['1', '2'],
  placeholder: 'Hello',
  onUpdateFilter: jest.fn(),
  error: 'oops',
  disabled: false,
  ...custom,
});

describe('rendering', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<ReferenceFilterFallback {...props} />);
  });
  it('should proxy value prop', () => {
    expect(wrapper).toHaveProp('value', props.value);
  });
  it('should proxy error prop', () => {
    expect(wrapper).toHaveProp('error', props.error);
  });
  it('should proxy onUpdateValue prop', () => {
    expect(wrapper).toHaveProp('onUpdateValue', expect.any(Function));
  });
  describe('renderInput', () => {
    let inputWrapper;
    beforeEach(() => {
      inputWrapper = shallow(
        wrapper.prop('renderInput')({
          value: props.value,
          onUpdateValue: props.onUpdateFilter,
        })
      );
    });
    it('should pass value prop', () => {
      expect(inputWrapper).toHaveProp('value', [
        { label: '1', value: '1' },
        { label: '2', value: '2' },
      ]);
    });
    it('should pass placeholder prop', () => {
      expect(inputWrapper).toHaveProp('placeholder', props.placeholder);
    });
    it('should pass disabled prop', () => {
      expect(inputWrapper).toHaveProp('isDisabled', props.disabled);
    });
    describe('onChange', () => {
      beforeEach(() => {
        inputWrapper.prop('onChange')({
          target: {
            value: [
              {
                label:
                  'something different from value, for testing that the value is correctly used',
                value: '1',
              },
              {
                label:
                  'something different from value, for testing that the value is correctly used',
                value: '2',
              },
            ],
          },
        });
      });
      it('should pass onChange prop', () => {
        expect(props.onUpdateFilter).toHaveBeenCalledWith(['1', '2']);
      });
    });
  });
});
