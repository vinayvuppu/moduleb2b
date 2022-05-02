import React from 'react';
import { shallow } from 'enzyme';
import { createMountOptions, intlMock } from '../../../../../test-utils';
import { DateSingleFilterTag, DateRangeFilterTag } from './date-filter-tags';

const createTestProps = custom => ({
  intl: intlMock,
  fieldLabel: 'Date',
  filterTypeLabel: 'Equals to',
  value: '123',
  onRemove: jest.fn(),
  onClick: jest.fn(),
  ...custom,
});

describe('DateSingleFilterTag', () => {
  const props = createTestProps();
  const wrapper = shallow(
    <DateSingleFilterTag {...props} />,
    createMountOptions()
  );

  it('render correct tree', () => {
    expect(wrapper).toMatchSnapshot();
  });
});

describe('DateRangeFilterTag', () => {
  const props = createTestProps({ value: { from: '1', to: '2' } });
  const wrapper = shallow(
    <DateRangeFilterTag {...props} />,
    createMountOptions()
  );

  it('render correct tree', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
