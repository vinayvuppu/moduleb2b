import React from 'react';
import { shallow } from 'enzyme';
import SelectablePanel from './selectable-panel';
import styles from './selectable-panel.mod.css';

const createTestProps = custom => ({
  header: <div id="header">HEADER</div>,
  controls: <div id="controls">CONTROLS</div>,
  children: <div id="children">CONTENT</div>,
  isOpen: true,

  ...custom,
});

describe('rendering', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<SelectablePanel {...props} />);
  });

  it('should render a div with "editable-form-box" class', () => {
    expect(wrapper).toRender({
      className: styles['editable-form-box'],
    });
  });

  it('should render header', () => {
    expect(wrapper).toRender({ id: 'header' });
  });

  it('should render controls', () => {
    expect(wrapper).toRender({ id: 'controls' });
  });

  it('should render children', () => {
    expect(wrapper).toRender({ id: 'children' });
  });

  describe('when closed', () => {
    beforeEach(() => {
      props = createTestProps({ isOpen: false });
      wrapper = shallow(<SelectablePanel {...props} />);
    });

    it('should not render children', () => {
      expect(wrapper).not.toRender({ id: 'children' });
    });
  });
});
