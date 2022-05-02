import React from 'react';
import { shallow } from 'enzyme';
import ButtonGroup from './button-group';

const TestComponent = () => <div>{'some test'}</div>;

const getButtonClass = (isDisabled, propsValue, optionValue) => do {
  if (isDisabled) {
    ('disabled');
  } else if (propsValue === optionValue) {
    ('active');
  } else {
    ('');
  }
};

const createTestProps = props => ({
  options: [
    {
      label: 'AND',
      value: 'and',
      className: '',
    },
    {
      label: 'OR',
      value: 'or',
      className: '',
    },
  ],
  value: '',
  onClick: jest.fn(),
  ...props,
});

describe('rendering', () => {
  describe('with icons', () => {
    let props;
    let wrapper;
    beforeEach(() => {
      props = createTestProps({
        options: [
          {
            icon: <TestComponent />,
            value: 'and',
            className: '',
          },
          {
            icon: <TestComponent />,
            value: 'or',
            className: '',
          },
        ],
      });
      wrapper = shallow(<ButtonGroup {...props} />);
    });

    it('should render the icons', () => {
      expect(wrapper).toRenderElementTimes('TestComponent', 2);
    });
  });
  describe('non forced disabled buttons', () => {
    let props;
    let wrapper;
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<ButtonGroup {...props} />);
    });
    it('should contain the number of toggle buttons defined (in props', () => {
      expect(wrapper).toRenderElementTimes('Button', props.options.length);
    });
    it('should contain a list of Button with props', () => {
      const button = wrapper.find('Button');
      props.options.forEach((option, index) => {
        expect(button.at(index).prop('isDisabled')).toBe(
          option.disabled || props.value === option.value
        );
        expect(button.at(index).prop('className')).toBe(
          !option.disabled && props.value === option.value ? 'active' : ''
        );
      });
    });
  });
  describe('forced disable buttons', () => {
    let props;
    let wrapper;
    beforeEach(() => {
      props = createTestProps({
        options: [
          {
            label: 'AND',
            value: 'and',
            className: '',
            disabled: true,
          },
          {
            label: 'OR',
            value: 'or',
            className: '',
            disabled: false,
          },
        ],
      });
      wrapper = shallow(<ButtonGroup {...props} />);
    });
    it('should contain the number of toggle buttons defined (in props', () => {
      expect(wrapper).toRenderElementTimes('Button', props.options.length);
    });
    it('should contain a list of Button with props', () => {
      const button = wrapper.find('Button');
      props.options.forEach((option, index) => {
        expect(button.at(index).prop('isDisabled')).toBe(
          option.disabled || props.value === option.value
        );
        expect(button.at(index).prop('className')).toBe(
          getButtonClass(option.disabled, props.value, option.value)
        );
      });
    });
  });
});

describe('callbacks', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps({ onClick: jest.fn() });
    wrapper = shallow(<ButtonGroup {...props} />);
    wrapper
      .find('Button')
      .at(0)
      .simulate('click', { index: 0 });
  });

  it('should call onClick method when clicking button', () => {
    expect(props.onClick).toHaveBeenCalledTimes(1);
  });

  it('should call the onClick method with the proper value', () => {
    expect(props.onClick).toHaveBeenCalledWith(props.options[0].value);
  });
});
