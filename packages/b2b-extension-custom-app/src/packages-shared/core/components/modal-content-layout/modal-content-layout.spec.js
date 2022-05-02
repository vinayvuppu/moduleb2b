import React from 'react';
import { shallow } from 'enzyme';
import { Text } from '@commercetools-frontend/ui-kit';
import ModalContentLayout from './modal-content-layout';

const createTestProps = props => ({
  title: '',
  subtitle: '',
  children: [],
  footer: '',
  controls: '',
  onClose: jest.fn(),
  ...props,
});

describe('modal-content-layout component', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = createTestProps({
      title: 'foo',
      subtitle: 'bar',
    });

    wrapper = shallow(
      <ModalContentLayout {...props}>
        <div>{'foo-bar'}</div>
      </ModalContentLayout>
    );
  });

  describe('tracking', () => {
    let container;
    const tracking = {
      component: 'track-foo-component',
      event: 'track-foo-event',
      strict: 'track-foo-strictness',
      label: 'track-foo-label',
    };

    beforeEach(() => {
      wrapper = shallow(
        <ModalContentLayout
          {...props}
          data-track-component={tracking.component}
          data-track-event={tracking.event}
          data-track-strict={tracking.strict}
          data-track-label={tracking.label}
        />
      );

      container = wrapper.find({ className: 'container' });
    });

    it('should add a track component on the `container`', () => {
      expect(container.prop('data-track-component')).toBe(tracking.component);
    });

    it('should add a track event on the `container`', () => {
      expect(container.prop('data-track-event')).toBe(tracking.event);
    });

    it('should add a track label on the `container`', () => {
      expect(container.prop('data-track-label')).toBe(tracking.label);
    });

    it('should add a track strict on the `container`', () => {
      expect(container.prop('data-track-strict')).toBe(tracking.strict);
    });
  });

  describe('rendering', () => {
    describe('header', () => {
      it('should render container', () => {
        expect(wrapper).toRender({ className: 'header' });
      });
      it('should render title', () => {
        expect(wrapper.find(Text.Headline).contains('foo')).toBeTruthy();
      });

      it('should render subtitle', () => {
        expect(wrapper.find({ className: 'subtitle' }).text()).toBe('bar');
      });
      it('should render subheader', () => {
        expect(wrapper).toRender({ className: 'subheader' });
      });
    });

    describe('body', () => {
      it('should render content', () => {
        expect(wrapper.find({ className: 'content' }).text()).toBe('foo-bar');
      });
    });
  });

  describe('callbacks', () => {
    describe('when closing', () => {
      let closeButton;
      beforeEach(() => {
        closeButton = wrapper.find('ButtonClose');
        closeButton.simulate('click');
      });

      it('should invoke `onClose`', () => {
        expect(props.onClose).toHaveBeenCalled();
      });
    });
  });
});
