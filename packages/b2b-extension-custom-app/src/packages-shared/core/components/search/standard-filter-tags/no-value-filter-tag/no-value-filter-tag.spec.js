import React from 'react';
import { shallow } from 'enzyme';
import { createMountOptions } from '../../../../../test-utils';
import NoValueFilterTag from './no-value-filter-tag';

const createTestProps = custom => ({
  fieldLabel: 'Name',
  filterTypeLabel: 'Missing',
  onRemove: jest.fn(),
  onClick: jest.fn(),
  ...custom,
});

describe('NoValueFilterTag', () => {
  const props = createTestProps();
  const wrapper = shallow(
    <NoValueFilterTag {...props} />,
    createMountOptions()
  );

  it('render correct tree', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
