import React from 'react';
import { shallow } from 'enzyme';
import { createMountOptions } from '../../../../../test-utils';
import {
  NumberSingleFilterTag,
  NumberRangeFilterTag,
} from './number-filter-tags';

const createTestProps = custom => ({
  intl: { formatNumber: number => number },
  fieldLabel: 'Number',
  filterTypeLabel: 'Equals to',
  value: 123,
  onRemove: jest.fn(),
  onClick: jest.fn(),
  ...custom,
});

describe('NumberSingleFilterTag', () => {
  const props = createTestProps();
  const wrapper = shallow(
    <NumberSingleFilterTag {...props} />,
    createMountOptions()
  );

  it('render correct tree', () => {
    expect(wrapper).toMatchSnapshot();
  });
});

describe('NumberRangeFilterTag', () => {
  const props = createTestProps({ value: { from: 1, to: 2 } });
  const wrapper = shallow(
    <NumberRangeFilterTag {...props} />,
    createMountOptions()
  );

  it('render correct tree', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
