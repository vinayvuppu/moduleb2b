import React from 'react';
import { shallow } from 'enzyme';
import SingleFilterTag from './single-filter-tag';

const createTestProps = custom => ({
  fieldLabel: 'Date',
  filterTypeLabel: 'Equals to',
  value: '123',
  renderValue: jest.fn(x => x),
  onRemove: jest.fn(),
  onClick: jest.fn(),
  ...custom,
});

describe('rendering', () => {
  it('outputs correct tree', () => {
    const props = createTestProps();
    const wrapper = shallow(<SingleFilterTag {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});

describe('callbacks', () => {
  it('renderValue', () => {
    const props = createTestProps();
    shallow(<SingleFilterTag {...props} />);
    expect(props.renderValue).toHaveBeenCalledTimes(1);
    expect(props.renderValue).toHaveBeenLastCalledWith(props.value);
  });
});
