import React from 'react';
import { shallow } from 'enzyme';
import { SaveToolbarSteps } from './save-toolbar-steps';

const createTestProps = props => ({
  currentStep: 1,
  totalSteps: 1,
  onSave: jest.fn(),
  onNext: jest.fn(),
  onCancel: jest.fn(),
  onBack: jest.fn(),
  isVisible: true,
  ...props,
});

const steps = [1, 2, 3];

describe('rendering', () => {
  describe('rendering one step save toolbar', () => {
    const props = createTestProps();
    const wrapper = shallow(<SaveToolbarSteps {...props} />);
    it('contains two save toolbar buttons', () => {
      expect(wrapper.find('SaveToolbarButton')).toHaveLength(2);
    });

    it('contains a cancel button', () => {
      expect(wrapper.find({ type: 'cancel' })).toHaveLength(1);
    });

    it('contains a save button', () => {
      expect(wrapper.find({ type: 'save' })).toHaveLength(1);
    });

    it('does not contain a next button', () => {
      expect(wrapper.find({ type: 'next' })).toHaveLength(0);
    });

    it('does not contain a back button', () => {
      expect(wrapper.find({ type: 'back' })).toHaveLength(0);
    });
  });

  describe('rendering a multiple step save toolbar', () => {
    steps.forEach(step => {
      const props = createTestProps({ totalSteps: 3 });
      const wrapper = shallow(<SaveToolbarSteps {...props} />);
      describe(`step: ${step}`, () => {
        const nextRendered = step < props.totalSteps ? 1 : 0;
        const saveRendered = step === props.totalSteps ? 1 : 0;
        const backRendered = step > 1 ? 1 : 0;
        wrapper.setProps({ currentStep: step });
        it('checks if contains a next button', () => {
          expect(wrapper.find({ type: 'next' })).toHaveLength(nextRendered);
        });

        it('checks if contains a cancel button', () => {
          expect(wrapper.find({ type: 'cancel' })).toHaveLength(1);
        });

        it('checks if contains a back button', () => {
          expect(wrapper.find({ type: 'back' })).toHaveLength(backRendered);
        });

        it('checks if contains a save button', () => {
          expect(wrapper.find({ type: 'save' })).toHaveLength(saveRendered);
        });
      });
    });
  });

  describe('passing custom button props', () => {
    const buttonProps = {
      cancel: {
        foo: 'cancel',
      },
      back: {
        foo: 'back',
      },
      next: {
        foo: 'next',
      },
      save: {
        foo: 'save',
      },
    };
    const props = createTestProps({
      totalSteps: 3,
      currentStep: 2,
      buttonProps,
    });
    const wrapper = shallow(<SaveToolbarSteps {...props} />);
    it('passes the custom props to the cancel button', () => {
      const cancelButton = wrapper.find({ type: 'cancel' });
      expect(cancelButton.prop('buttonProps')).toBe(buttonProps.cancel);
    });

    it('passes the custom props to the back button', () => {
      const backButton = wrapper.find({ type: 'back' });
      expect(backButton.prop('buttonProps')).toBe(buttonProps.back);
    });

    it('passes the custom props to the next button', () => {
      const nextButton = wrapper.find({ type: 'next' });
      expect(nextButton.prop('buttonProps')).toBe(buttonProps.next);
    });

    it('passes the custom props to the save button', () => {
      wrapper.setProps({ currentStep: props.totalSteps });
      const saveButton = wrapper.find({ type: 'save' });
      expect(saveButton.prop('buttonProps')).toBe(buttonProps.save);
    });
  });
});

describe('callbacks', () => {
  const onCancel = jest.fn();
  const onNext = jest.fn();
  const onBack = jest.fn();
  const onSave = jest.fn();
  const props = createTestProps({
    totalSteps: 3,
    currentStep: 2,
    onCancel,
    onNext,
    onBack,
    onSave,
  });
  const wrapper = shallow(<SaveToolbarSteps {...props} />);

  it('calls the onCancel method when clicking on the cancel button', () => {
    wrapper
      .find('SaveToolbarButton')
      .at(0)
      .simulate('click');
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls the onBack method when clicking on the back button', () => {
    wrapper
      .find('SaveToolbarButton')
      .at(1)
      .simulate('click');
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('calls the onNext method when clicking on the next button', () => {
    wrapper
      .find('SaveToolbarButton')
      .at(2)
      .simulate('click');
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('calls the onSave method when clicking on the save button', () => {
    wrapper.setProps({ currentStep: props.totalSteps });
    wrapper
      .find('SaveToolbarButton')
      .at(2)
      .simulate('click');
    expect(onSave).toHaveBeenCalledTimes(1);
  });
});
