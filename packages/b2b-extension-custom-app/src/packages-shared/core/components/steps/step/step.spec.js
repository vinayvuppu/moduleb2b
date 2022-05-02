import React from 'react';
import { shallow } from 'enzyme';
import { AccessibleButton } from '@commercetools-frontend/ui-kit';
import { Step } from './step';

function createTestProps(props) {
  return {
    index: 0,
    label: 'Label',
    isActive: false,
    isDone: false,
    ...props,
  };
}

describe('rendering', () => {
  describe('default step', () => {
    const props = createTestProps();
    const wrapper = shallow(<Step {...props} />);

    it('should render the button', () => {
      expect(wrapper).toRender(AccessibleButton);
    });

    it('button should be disabled by default', () => {
      expect(wrapper.find(AccessibleButton).prop('isDisabled')).toBe(true);
    });

    it('should render the label', () => {
      expect(wrapper.find({ className: 'tab-text-grey' }).text()).toBe('Label');
    });

    it('should render the index + 1 in the bullet', () => {
      expect(wrapper.find({ className: 'bullet' }).text()).toBe('1');
    });

    it('should not render CheckThinIcon', () => {
      expect(wrapper).not.toRender('CheckThinIcon');
    });

    it('should not have the active or done class', () => {
      expect(
        wrapper.find({
          className: 'header-list-item header-list-item--active',
        })
      ).toHaveLength(0);
      expect(
        wrapper.find({
          className: 'header-list-item header-list-item--done',
        })
      ).toHaveLength(0);
    });
  });

  describe('active step', () => {
    const props = createTestProps({ isActive: true });
    const wrapper = shallow(<Step {...props} />);

    it('should have the header-list-item--active class', () => {
      expect(
        wrapper.find({
          className: 'header-list-item header-list-item--active',
        })
      ).toHaveLength(1);
    });

    it('button should be disabled', () => {
      expect(wrapper.find(AccessibleButton).prop('isDisabled')).toBe(true);
    });
  });

  describe('done step', () => {
    let props;
    let wrapper;

    beforeEach(() => {
      props = createTestProps({ isDone: true, clickable: false });
      wrapper = shallow(<Step {...props} />);
    });

    it('should have the header-list-item--done class', () => {
      expect(wrapper).toRender({
        className: 'header-list-item header-list-item--done',
      });
    });
    it('should not render the index + 1 in the bullet', () => {
      expect(wrapper.find({ className: 'bullet' }).text()).not.toBe('1');
    });

    it('should render CheckThinIcon', () => {
      expect(wrapper).toRender('CheckThinIcon');
    });

    it('button should be disabled', () => {
      expect(wrapper.find(AccessibleButton).prop('isDisabled')).toBe(true);
    });

    describe('when button is clickable', () => {
      beforeEach(() => {
        props = createTestProps({ isDone: true, isClickable: true });
        wrapper = shallow(<Step {...props} />);
      });
      it('button should not be disabled', () => {
        expect(wrapper.find(AccessibleButton).prop('isDisabled')).toBe(false);
      });
    });
  });
});
