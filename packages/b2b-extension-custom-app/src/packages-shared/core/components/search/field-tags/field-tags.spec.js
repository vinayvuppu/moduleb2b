import React from 'react';
import { shallow } from 'enzyme';
import FieldTags from './field-tags';

const Tag = jest.fn();
Tag.displayName = 'Tag';

const createTestProps = props => ({
  label: 'label',
  filterOptions: {
    someFilter: {
      tagComponent: Tag,
      label: 'Some Filter',
    },
    someOtherFilter: {
      tagComponent: Tag,
      label: 'Some Other Filter',
    },
  },
  filters: [
    { type: 'someFilter', value: 5 },
    { type: 'someOtherFilter', value: 10 },
  ],
  onRemoveFilter: jest.fn(),
  ...props,
});

describe('rendering', () => {
  const props = createTestProps();
  const wrapper = shallow(<FieldTags {...props} />);

  it('should correctly render tags', () => {
    expect(
      wrapper
        .find('Tag')
        .at(0)
        .props()
    ).toEqual({
      fieldLabel: 'label',
      filterTypeLabel: 'Some Filter',
      value: 5,
      onRemove: expect.any(Function),
    });
  });

  it('should render as many tags as there are filters', () => {
    expect(wrapper.find('Tag')).toHaveLength(2);
  });
});

describe('callbacks', () => {
  const props = createTestProps();
  const wrapper = shallow(<FieldTags {...props} />);

  it('should trigger onRemove callback', () => {
    wrapper
      .find('Tag')
      .at(0)
      .simulate('remove');

    expect(props.onRemoveFilter).toHaveBeenCalledTimes(1);
    expect(props.onRemoveFilter).toHaveBeenCalledWith({ index: 0 });
  });
});
