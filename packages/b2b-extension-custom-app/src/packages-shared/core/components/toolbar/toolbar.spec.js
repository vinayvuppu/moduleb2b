import React from 'react';
import { shallow } from 'enzyme';
import { Text } from '@commercetools-frontend/ui-kit';
import Toolbar from './toolbar';

const createTestProps = custom => ({
  title: 'My title',
  subtitle: 'My subtitle',
  controls: <span className="foo">{'foo'}</span>,
  ...custom,
});

describe('rendering', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<Toolbar {...props} />);
  });

  describe('`<Text.Headline />`', () => {
    it('should render `Text.Headline`', () => {
      expect(wrapper).toRender(Text.Headline);
    });

    it('should render passed `title` prop', () => {
      expect(
        wrapper
          .find(Text.Headline)
          .children()
          .first()
          .text()
      ).toMatch('My title');
    });
  });

  describe('`<Text.Subheadline />`', () => {
    it('should render `Text.Subheadline`', () => {
      expect(wrapper).toRender(Text.Subheadline);
    });

    it('should render passed `title` prop', () => {
      expect(
        wrapper
          .find(Text.Subheadline)
          .children()
          .first()
          .text()
      ).toMatch('My subtitle');
    });
  });

  describe('without controls', () => {
    beforeEach(() => {
      props = createTestProps({
        controls: null,
        controlsClassName: 'controls',
      });
      wrapper = shallow(<Toolbar {...props} />);
    });

    it('should not render `controls`', () => {
      expect(wrapper).not.toRender({ className: 'controls' });
    });
  });
});
