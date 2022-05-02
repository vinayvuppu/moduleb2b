import React from 'react';
import { shallow } from 'enzyme';
import ThrottledField from './throttled-field';

const createTestProps = props => ({
  onChange: jest.fn(),
  onBlurValue: jest.fn(),
  onEnter: jest.fn(),
  value: undefined,
  // Arbitrary time to delay network request in milliseconds.
  // Fast typists may not get UI feedback until they stop typing.
  throttleMS: 300,
  isValid: true,
  as: 'text',
  style: 'secondary',
  disabled: false,
  name: undefined,
  placeholder: undefined,
  autoSize: true,
  autoFocus: true,
  ...props,
});

const supportedInputTypes = ['text', 'number', 'password'];

describe('rendering', () => {
  supportedInputTypes.forEach(type => {
    it(`render component as ${type} type`, () => {
      const props = createTestProps({ as: type });
      const wrapper = shallow(<ThrottledField {...props} />);

      expect(wrapper.find('input').prop('type')).toBe(type);
    });
  });

  describe('rendering as textarea type', () => {
    const props = createTestProps({ as: 'textarea' });
    const wrapper = shallow(<ThrottledField {...props} />);
    it('renders component as textarea type', () => {
      expect(wrapper.find('TextareaAutosize')).toHaveLength(1);
      expect(wrapper.find('TextareaAutosize').prop('rows')).toBe(1);
    });

    it('render component as textarea type with autosize', () => {
      expect(wrapper.find('TextareaAutosize').prop('maxRows')).toBeUndefined();
    });

    it('render component as textarea type without autosize', () => {
      wrapper.setProps({
        autoSize: false,
      });
      expect(wrapper.find('TextareaAutosize').prop('maxRows')).toBe(1);
    });
  });

  describe('managing state', () => {
    const props = createTestProps({ value: undefined });
    const wrapper = shallow(<ThrottledField {...props} />);
    it('does not change the state when empty value', () => {
      wrapper.setProps({
        // no `value` property
      });
      expect(wrapper.state('draftValue')).toBe('');

      wrapper.setProps({
        value: 'foo',
      });
      expect(wrapper.state('draftValue')).toBe('foo');

      wrapper.setProps({
        value: undefined,
      });
      expect(wrapper.state('draftValue')).toBe('');
    });

    it('dchanges the state when value', () => {
      wrapper.setProps({
        value: 'foo',
      });
      expect(wrapper.state('draftValue')).toBe('foo');
    });
  });
});

describe('callbacks', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<ThrottledField {...props} />);
  });
  describe('onEnter', () => {
    beforeEach(() => {
      wrapper.setState({ draftValue: 'bar' });
      wrapper.instance().handleEnter({ keyCode: 13 });
    });
    describe('with changeTimeout', () => {
      const originalClearTimeout = window.clearTimeout;
      beforeEach(() => {
        wrapper.instance().changeTimeout = 'timeout-id-1';
        Object.defineProperty(window, 'clearTimeout', {
          value: jest.fn(),
          configurable: true,
        });
        wrapper.instance().handleEnter({ keyCode: 13 });
      });
      afterEach(() => {
        Object.defineProperty(window, 'clearTimeout', {
          value: originalClearTimeout,
          configurable: true,
        });
      });
      it('calls onChange', () => {
        expect(props.onChange).toHaveBeenLastCalledWith({
          target: { value: 'bar' },
        });
      });
      it('clears the timeout', () => {
        expect(window.clearTimeout).toHaveBeenLastCalledWith('timeout-id-1');
      });
    });
    it('calls onEnter callback with argument', () => {
      expect(props.onEnter).toHaveBeenLastCalledWith('bar');
    });
  });

  it('calls onChange callback with argument', () => {
    const mockEvent = {
      target: { value: 'bar' },
      persist: jest.fn(),
    };
    wrapper.simulate('change', mockEvent);

    expect(wrapper.state('draftValue')).toBe('bar');
    expect(mockEvent.persist).toHaveBeenCalled();

    setTimeout(() => {
      expect(props.onChange).toHaveBeenLastCalledWith(mockEvent);
    }, props.throttleMS);
  });

  describe('when there is a pending update', () => {
    beforeEach(() => {
      wrapper.instance().changeTimeout = setTimeout(() => {}, 1000);
      wrapper.instance().blurTimeout = setTimeout(() => {}, 1000);
    });
    describe('when the component receives new props', () => {
      beforeEach(() => {
        wrapper.instance().setState = jest.fn();
        wrapper
          .instance()
          .UNSAFE_componentWillReceiveProps({ value: 'next-foo' });
      });
      it('should ignore the pending update', () => {
        expect(wrapper.instance().setState).toHaveBeenCalledTimes(1);
        expect(wrapper.instance().blurTimeout).toBe(null);
        expect(wrapper.instance().changeTimeout).toBe(null);
      });
    });
  });
});
