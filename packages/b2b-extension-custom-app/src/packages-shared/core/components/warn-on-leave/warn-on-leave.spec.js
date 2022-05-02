import React from 'react';
import { shallow } from 'enzyme';
import { intlMock } from '../../../test-utils';
import { WarnOnLeave } from './warn-on-leave';

const createTestProps = options => ({
  shouldWarn: true,
  messageOnUnload: 'Unloading',
  messageOnLeave: 'Leaving...',
  onConfirmLeave: jest.fn(),
  history: {
    listen: jest.fn(),
  },
  intl: intlMock,
  ...options,
});

describe('rendering', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<WarnOnLeave {...props} />);
  });
  it('should render <Prompt>', () => {
    expect(wrapper).toRender('Prompt');
  });
  describe('when shouldWarn is a function', () => {
    describe('when `message` prop is called', () => {
      beforeEach(() => {
        props = createTestProps({ shouldWarn: jest.fn() });
        wrapper = shallow(<WarnOnLeave {...props} />);
        wrapper.find('Prompt').prop('message')('foo', 'bar');
      });
      it('should propagate `message` args to `shouldWarn`', () => {
        expect(props.shouldWarn).toHaveBeenCalledTimes(1);
        expect(props.shouldWarn).toHaveBeenCalledWith('foo', 'bar');
      });
    });
    describe('when shouldWarn is true', () => {
      beforeEach(() => {
        props = createTestProps({ shouldWarn: () => true });
        wrapper = shallow(<WarnOnLeave {...props} />);
      });
      it('should return the default message from `message`', () => {
        expect(wrapper.find('Prompt').prop('message')()).toBe(
          'UnsavedChanges.version1'
        );
      });
    });
    describe('when shouldWarn is false', () => {
      beforeEach(() => {
        props = createTestProps({ shouldWarn: () => false });
        wrapper = shallow(<WarnOnLeave {...props} />);
      });
      it('should return undefined from `message`', () => {
        expect(wrapper.find('Prompt').prop('message')()).toBeUndefined();
      });
    });
  });
  describe('when shouldWarn is a boolean', () => {
    describe('when shouldWarn is true', () => {
      beforeEach(() => {
        props = createTestProps({ shouldWarn: true });
        wrapper = shallow(<WarnOnLeave {...props} />);
      });
      it('should return the default message from `message`', () => {
        expect(wrapper.find('Prompt').prop('message')()).toBe(
          'UnsavedChanges.version1'
        );
      });
    });
    describe('when shouldWarn is false', () => {
      beforeEach(() => {
        props = createTestProps({ shouldWarn: false });
        wrapper = shallow(<WarnOnLeave {...props} />);
      });
      it('should return undefined from `message`', () => {
        expect(wrapper.find('Prompt').prop('message')()).toBeUndefined();
      });
    });
  });
});

describe('lifecycle', () => {
  let props;
  let wrapper;
  describe('componentDidMount', () => {
    beforeEach(() => {
      props = createTestProps({
        history: { listen: () => jest.fn() },
      });
      window.addEventListener = jest.fn();
      wrapper = shallow(<WarnOnLeave {...props} />);
      wrapper.instance().componentDidMount();
    });
    it('should register beforeunload event listener', () => {
      expect(window.addEventListener).toHaveBeenCalledWith(
        'beforeunload',
        wrapper.instance().setWarningMessage
      );
    });
    it('should register unlistener', () => {
      expect(wrapper.instance().unlisten).toEqual(expect.any(Function));
    });
    describe('when listen is called', () => {
      describe('when it should warn', () => {
        describe('when it should confirm on leave', () => {
          beforeEach(() => {
            props = createTestProps({
              shouldWarn: true,
              onConfirmLeave: jest.fn(),
              history: { listen: cb => cb() },
            });
            wrapper = shallow(<WarnOnLeave {...props} />);
            wrapper.instance().componentDidMount();
          });
          it('should notify onConfirmLeave', () => {
            expect(props.onConfirmLeave).toHaveBeenCalled();
          });
        });
      });
      describe('when it should not warn', () => {
        beforeEach(() => {
          props = createTestProps({
            shouldWarn: false,
            history: { listen: cb => cb() },
          });
          wrapper = shallow(<WarnOnLeave {...props} />);
          wrapper.instance().componentDidMount();
        });
        it('should not notify onConfirmLeave', () => {
          expect(props.onConfirmLeave).not.toHaveBeenCalled();
        });
      });
    });
  });
  describe('componentWillUnmount', () => {
    beforeEach(() => {
      props = createTestProps();
      window.removeEventListener = jest.fn();
      wrapper = shallow(<WarnOnLeave {...props} />);
      wrapper.instance().unlisten = jest.fn();
      wrapper.instance().componentWillUnmount();
    });
    it('should unregister beforeunload event listener', () => {
      expect(window.removeEventListener).toHaveBeenCalledWith(
        'beforeunload',
        wrapper.instance().setWarningMessage
      );
    });
    it('should call unlistener', () => {
      expect(wrapper.instance().unlisten).toHaveBeenCalled();
    });
  });
});
