import React from 'react';
import { shallow } from 'enzyme';
import MissingValueField from './missing-value-field';

const createTestProps = props => ({
  isChecked: false,
  onChange: jest.fn(),

  ...props,
});

describe('rendering', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<MissingValueField {...props} />);
  });

  it('should output correct tree`', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render a `CheckboxField`', () => {
    expect(wrapper).toRender('CheckboxField');
  });
});

describe('statics', () => {
  describe('defaultProps', () => {
    it('should default `isChecked`', () => {
      expect(MissingValueField.defaultProps.isChecked).toBe(false);
    });
  });
});
