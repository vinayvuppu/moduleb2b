import React from 'react';
import { shallow } from 'enzyme';
import { getIsEvent, simpleInput } from './validated-input';

const Child = () => <div>Child</div>;
Child.displayName = 'Child';

jest.mock('warning', () => jest.fn());

describe('getIsEvent', () => {
  let event;
  describe('when is event', () => {
    beforeEach(() => {
      event = {
        target: { value: '1' },
      };
    });
    it('should return `true`', () => {
      expect(getIsEvent(event)).toBe(true);
    });
  });
  describe('when is an object', () => {
    beforeEach(() => {
      event = {
        name: { en: '1' },
      };
    });
    it('should return `false`', () => {
      expect(getIsEvent(event)).toBe(false);
    });
  });
  describe('when is a string', () => {
    beforeEach(() => {
      event = 'string';
    });
    it('should return `false`', () => {
      expect(getIsEvent(event)).toBe(false);
    });
  });
  describe('when is a number', () => {
    beforeEach(() => {
      event = 99;
    });
    it('should return `false`', () => {
      expect(getIsEvent(event)).toBe(false);
    });
  });
  describe('when is number 0', () => {
    beforeEach(() => {
      event = 0;
    });
    it('should return `false`', () => {
      expect(getIsEvent(event)).toBe(false);
    });
  });
});

describe('simpleInput', () => {
  const createTestProps = (...custom) => ({
    className: '',
    disabled: false,
    isValid: true,
    name: 'simple-input',
    getInputRef: jest.fn(),
    onBlurValue: jest.fn(),
    onChange: jest.fn(),
    value: 'simple-input-value',
    ...custom,
  });
  const TextInput = simpleInput('text');
  let props;
  let wrapper;

  describe('rendering', () => {
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<TextInput {...props} />);
    });
    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
    it('should render `input`', () => {
      expect(wrapper).toRender('input');
    });
    it('should propagate `onChange`', () => {
      expect(wrapper.find('input')).toHaveProp('onChange', props.onChange);
    });
    it('should propagate `value`', () => {
      expect(wrapper.find('input')).toHaveProp('value', props.value);
    });
  });
});
