import React from 'react';
import { shallow } from 'enzyme';
import { createMountOptions } from '../../../../../test-utils';
import {
  EnumSingleFilterTag,
  EnumRangeFilterTag,
  EnumSingleOptionFilterTag,
} from './enum-filter-tags';

const createTestProps = custom => ({
  fieldLabel: 'Name',
  filterTypeLabel: 'Missing',
  value: { label: 'en', value: 'en' },
  onRemove: jest.fn(),
  onClick: jest.fn(),
  ...custom,
});

describe('EnumSingleFilterTag', () => {
  const props = createTestProps();
  const wrapper = shallow(
    <EnumSingleFilterTag {...props} />,
    createMountOptions()
  );

  it('render correct tree', () => {
    expect(wrapper).toMatchSnapshot();
  });
});

describe('EnumRangeFilterTag', () => {
  const props = createTestProps({
    value: {
      from: { label: 'Foo', value: 'foo' },
      to: { label: 'Bar', value: 'bar' },
    },
  });
  const wrapper = shallow(
    <EnumRangeFilterTag {...props} />,
    createMountOptions()
  );

  it('render correct tree', () => {
    expect(wrapper).toMatchSnapshot();
  });
});

describe('EnumSingleOptionFilterTag', () => {
  const props = createTestProps({
    value: {
      key: 'option-key',
      label: 'option-label',
    },
  });
  const wrapper = shallow(
    <EnumSingleOptionFilterTag {...props} />,
    createMountOptions()
  );

  it('render correct tree', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
