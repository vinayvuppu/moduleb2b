import React from 'react';
import { shallow } from 'enzyme';
import { PlusBoldIcon } from '@commercetools-frontend/ui-kit';
import Button from './button';

const createTestProps = props => ({
  className: '',
  onClick: jest.fn(),
  isDisabled: false,
  ...props,
});

describe('rendering', () => {
  describe('basic component', () => {
    const withLabelWrapper = shallow(
      <Button {...createTestProps()}>
        <span>{'test label'}</span>
      </Button>
    );
    const withIconWrapper = shallow(
      <Button {...createTestProps()}>
        <PlusBoldIcon />
      </Button>
    );

    it('renders label button', () => {
      expect(withLabelWrapper).toRender('button');
    });

    it('has a label', () => {
      expect(withLabelWrapper).toRender('span');
    });

    it('renders icon button', () => {
      expect(withLabelWrapper).toRender('button');
    });

    it('has a icon', () => {
      expect(withIconWrapper).toRender('PlusBoldIcon');
    });
  });

  describe('multiple children', () => {
    const wrapper = shallow(
      <Button {...createTestProps()}>
        <PlusBoldIcon />
        <span>{'test label'}</span>
      </Button>
    );

    it('is only one button', () => {
      expect(wrapper).toRenderElementTimes('button', 1);
    });

    it('has a label', () => {
      expect(wrapper).toRenderElementTimes('span', 1);
    });

    it('has a icon', () => {
      expect(wrapper).toRenderElementTimes('PlusBoldIcon', 1);
    });
  });
});

describe('callbacks', () => {
  describe('should trigger onClick callback', () => {
    const props = createTestProps();
    const wrapper = shallow(<Button {...props}>{'test label'}</Button>);

    it('onClick callback called', () => {
      wrapper.simulate('click');
      expect(props.onClick).toBeCalled();
    });
  });

  describe('should not trigger onClick callback when disabled', () => {
    const props = createTestProps({ isDisabled: true });
    const wrapper = shallow(<Button {...props}>{'test label'}</Button>);

    it('onClick callback called', () => {
      wrapper.simulate('click');
      expect(props.onClick).toHaveBeenCalledTimes(0);
    });
  });
});
