import React from 'react';
import { shallow } from 'enzyme';
import { FlagFilledIcon } from '@commercetools-frontend/ui-kit';
import styles from '../button/button.mod.css';
import { ButtonToggleValue } from './button-toggle-value';

const createTestProps = props => ({
  isActive: true,
  isDisabled: false,
  onClick: jest.fn(),
  label: 'label',
  icon: <FlagFilledIcon />,
  ...props,
});

describe('render', () => {
  describe('basic component', () => {
    const props = createTestProps();
    const wrapper = shallow(<ButtonToggleValue {...props} />);

    it('is only one button', () => {
      expect(wrapper).toRenderElementTimes('Button', 1);
    });

    it('has a icon', () => {
      expect(wrapper).toRender(FlagFilledIcon);
    });

    it('has a span', () => {
      expect(wrapper).toRenderElementTimes('span', 1);
    });

    it('has a label', () => {
      expect(wrapper.find('span').text()).toBe(props.label);
    });
  });

  describe('check props', () => {
    const props = createTestProps({ isActive: false });
    const wrapper = shallow(<ButtonToggleValue {...props} />);

    it('is not disabled', () => {
      expect(wrapper.find('Button').prop('isDisabled')).toBeFalsy();
    });

    it('is disabled', () => {
      wrapper.setProps({ isDisabled: true });
      expect(wrapper.find('Button').prop('isDisabled')).toBeTruthy();
    });

    it('is not active', () => {
      expect(wrapper.find('Button')).toHaveClassName(styles['switch-squared']);
    });

    it('is active', () => {
      wrapper.setProps({ isActive: true });
      expect(wrapper.find('Button')).toHaveClassName(
        styles['switch-squared--active']
      );
    });
  });
});

describe('callbacks', () => {
  const props = createTestProps();
  const wrapper = shallow(<ButtonToggleValue {...props} />);

  it('should trigger onClick callback', () => {
    wrapper.simulate('click');
    expect(props.onClick).toBeCalled();
  });
});
