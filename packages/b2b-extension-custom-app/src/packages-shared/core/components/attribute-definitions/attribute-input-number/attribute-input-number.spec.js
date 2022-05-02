import { shallow } from 'enzyme';
import React from 'react';
import AttributeInputNumber from './attribute-input-number';

function createTestProps(value) {
  return {
    numberFormat: 'en',
    attribute: {
      name: 'foo',
      value,
    },
    onChangeValue: jest.fn(),
  };
}

describe('rendering', () => {
  it('should render element with no value', () => {
    const props = createTestProps();
    const wrapper = shallow(<AttributeInputNumber {...props} />);

    expect(wrapper.props().value).toBe(undefined);
  });

  it('should render element with initial value', () => {
    const props = createTestProps(10);
    const wrapper = shallow(<AttributeInputNumber {...props} />);

    expect(wrapper.props().value).toBe(10);
  });

  it('should handle change', () => {
    const props = createTestProps(25);
    const wrapper = shallow(<AttributeInputNumber {...props} />);

    wrapper.getElement().props.onChangeValue(111222.333444);

    expect(props.onChangeValue).toHaveBeenCalledTimes(1);
    expect(props.onChangeValue).toHaveBeenCalledWith({
      name: props.attribute.name,
      value: 111222.333444,
    });
  });
});
