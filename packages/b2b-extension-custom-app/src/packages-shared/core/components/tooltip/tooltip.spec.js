import React from 'react';
import { shallow } from 'enzyme';
import { promisedTimeout } from '../../../test-utils';
import { Tooltip } from './tooltip';

jest.useFakeTimers();
jest.mock('is-touch-device', () => jest.fn().mockReturnValue(false));

const createTestProps = props => ({
  trigger: 'force',
  display: false,
  position: 'top',
  message: "I'm a tooltip",
  autohide: {
    enabled: true,
    timeout: 5000,
    onHide: jest.fn(),
  },
  children: 'tooltip element',
  ...props,
});

describe('rendering', () => {
  describe('rendering tooltip content', () => {
    const props = createTestProps();
    const wrapper = shallow(<Tooltip {...props} />);
    it('contains the message passed in props', () => {
      expect(wrapper.find({ className: 'body' }).text()).toBe(props.message);
    });
  });

  describe('rendering different tooltip types', () => {
    const props = createTestProps();
    const wrapper = shallow(<Tooltip {...props} />);
    it('renders a warning tooltip', () => {
      wrapper.setProps({ type: 'warning' });
      expect(wrapper.find('.warning')).toHaveLength(1);
    });

    it('renders an info tooltip', () => {
      wrapper.setProps({ type: 'info' });
      expect(wrapper.find('.info')).toHaveLength(1);
    });

    it('renders an error tooltip', () => {
      wrapper.setProps({ type: 'error' });
      expect(wrapper.find('.error')).toHaveLength(1);
    });
  });

  describe('tooltip visibility', () => {
    const props = createTestProps();
    const wrapper = shallow(<Tooltip {...props} />);
    it('renders a tooltip not visible by default', () => {
      expect(wrapper.state('visible')).toBe(false);
    });

    it('renders a visible tooltip when forcing it', () => {
      wrapper.setProps({ display: true, trigger: 'force' });
      expect(wrapper.state('visible')).toBe(true);
    });
  });

  describe('rendering hover events', () => {
    const props = createTestProps({
      trigger: 'hover',
      display: true,
    });

    const wrapper = shallow(<Tooltip {...props} />);

    it('simulates HOVER events showing the component', () => {
      promisedTimeout(() => {
        wrapper.simulate('mouseenter');
      })
        // wait for the next tick
        .then(
          promisedTimeout(() => {
            expect(wrapper.state('visible')).toBe(true);
          })
        );
      jest.runAllTimers();
    });

    it('simulates HOVER events hiding the component', () => {
      promisedTimeout(() => {
        wrapper.simulate('mouseleave');
      })
        // wait for the next tick
        .then(
          promisedTimeout(() => {
            expect(wrapper.state('visible')).toBe(false);
          })
        );
      jest.runAllTimers();
    });
  });
});

describe('callbacks', () => {
  let props;
  let wrapper;
  describe('onHide event', () => {
    beforeAll(() => {
      props = createTestProps({
        autohide: {
          enabled: true,
          timeout: 0,
          onHide: jest.fn(),
        },
      });
      wrapper = shallow(<Tooltip {...props} />);
      wrapper.instance().setupTimeout(); // simulate componentDidMount
    });
    it('sets the lifetimeTimeout property', () => {
      expect(wrapper.instance().lifetimeTimeout).toBeDefined();
    });

    it('calls the onHide method after timeout occurs', () => {
      promisedTimeout(() => {
        expect(props.autohide.onHide).toHaveBeenCalledTimes(1);
      });
      jest.runAllTimers();
    });
  });

  describe.skip('onClick event', () => {
    beforeAll(() => {
      props = createTestProps({
        autohide: {
          enabled: true,
          timeout: 30,
          onHide: jest.fn(),
        },
        trigger: 'click',
      });
      wrapper = shallow(<Tooltip {...props} />);
      wrapper.simulate('click');
    });
    it('calls onClick method showing the component and hiding it after timeout', () => {
      expect(wrapper.state('visible')).toBe(true);
      // wait 29 seconds before checking the tooltip is hidden (it is not yet)
      promisedTimeout(() => {
        expect(wrapper.state('visible')).toBe(true);
      }, props.autohide.timeout - 1);
      // wait 31 seconds before checking the tooltip is hidden (it is)
      promisedTimeout(() => {
        expect(wrapper.state('visible')).toBe(false);
      }, props.autohide.timeout + 1);

      jest.runAllTimers();
    });
  });
});
