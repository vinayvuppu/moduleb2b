import React from 'react';
import { shallow } from 'enzyme';
import { intlMock } from '../../../../../test-utils';
import { RangeFilterTag } from './range-filter-tag';

const createTestProps = custom => ({
  intl: intlMock,
  fieldLabel: 'Date',
  value: { from: '5', to: '10' },
  renderValue: jest.fn(x => x),
  onRemove: jest.fn(),
  onClick: jest.fn(),
  ...custom,
});

describe('rendering', () => {
  it('outputs correct tree when value set', () => {
    const props = createTestProps();
    const wrapper = shallow(<RangeFilterTag {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});

describe('callbacks', () => {
  it('renderValue', () => {
    const props = createTestProps();
    shallow(<RangeFilterTag {...props} />);
    expect(props.renderValue).toHaveBeenCalledTimes(2);
    expect(props.renderValue).toHaveBeenCalledWith(props.value.from);
    expect(props.renderValue).toHaveBeenCalledWith(props.value.to);
  });
});
