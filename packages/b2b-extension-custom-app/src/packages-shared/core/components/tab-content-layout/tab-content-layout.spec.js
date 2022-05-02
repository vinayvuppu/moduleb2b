import React from 'react';
import { shallow } from 'enzyme';
import TabContentLayout from './tab-content-layout';

const createTestProps = props => ({
  header: [],
  description: '',
  children: [],
  ...props,
});

describe('modal-content-layout component', () => {
  const props = createTestProps({
    header: 'foo',
    description: 'bar',
    'data-track-component': 'track-foo',
  });

  describe('rendering', () => {
    describe('render tab with description', () => {
      const wrapper = shallow(
        <TabContentLayout {...props}>
          <div>{'foo-bar'}</div>
        </TabContentLayout>
      );
      it('has tracking component attribute on container', () => {
        expect(
          wrapper
            .find({
              className: 'container',
            })
            .prop('data-track-component')
        ).toBe('track-foo');
      });
      describe('render header', () => {
        it('should render header container', () => {
          expect(wrapper).toRender({ className: 'header' });
        });
        it('should render header content', () => {
          expect(
            wrapper
              .find({
                className: 'header',
              })
              .childAt(0)
              .text()
          ).toBe('foo');
        });
        it('should render description', () => {
          expect(wrapper.find({ className: 'description' }).text()).toBe('bar');
        });
      });
      describe('render body', () => {
        it('should render content', () => {
          expect(wrapper.find({ className: 'content' }).text()).toBe('foo-bar');
        });
      });
    });

    describe('render tab without description', () => {
      const wrapper = shallow(
        <TabContentLayout {...props}>
          <div>{'foo-bar'}</div>
        </TabContentLayout>
      );

      wrapper.setProps({
        description: null,
      });
    });
  });
});
