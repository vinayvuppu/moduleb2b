import React from 'react';
import { shallow } from 'enzyme';
import { createMountOptions } from '../../../../test-utils';
import CheckboxField from './checkbox-field';

const createTestProps = props => ({
  name: 'foo',
  checked: false,
  label: undefined,
  onChange: jest.fn(),

  ...props,
});

describe('rendering', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = createTestProps({ label: 'Foo' });
    wrapper = shallow(<CheckboxField {...props} />, createMountOptions());
  });

  it('should render one `label`', () => {
    expect(wrapper).toRenderElementTimes('label', 1);
  });

  it('should render one `input`', () => {
    expect(wrapper).toRenderElementTimes('input', 1);
  });

  it('should render and `input` of `checkbox` type', () => {
    expect(wrapper.find('input')).toHaveProp('type', 'checkbox');
  });

  it('should render two `spans` (one for text other for the element)', () => {
    expect(wrapper).toRenderElementTimes('span', 2);
  });

  it('contains text of `props` label', () => {
    expect(wrapper).toHaveText(props.label);
  });
});

describe('callbacks', () => {
  describe('`onChange`', () => {
    let props;
    let wrapper;
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<CheckboxField {...props} />, createMountOptions());
    });

    describe('when clicking', () => {
      beforeEach(() => {
        wrapper.find('input').simulate('change');
      });

      it('invokes `onChange`', () => {
        expect(props.onChange).toHaveBeenCalledTimes(1);
      });

      it('should set the checked property to `false`', () => {
        expect(wrapper.find('input')).toHaveProp('checked', false);
      });
    });
  });
});
