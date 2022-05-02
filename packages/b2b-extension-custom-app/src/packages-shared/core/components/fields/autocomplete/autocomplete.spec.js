import React from 'react';
import { shallow } from 'enzyme';
import { AsyncSelectInput } from '@commercetools-frontend/ui-kit';
import Autocomplete from './autocomplete';

const createTestProps = custom => ({
  mapItemToOption: jest.fn(item => ({ value: item, label: `item:${item}` })),
  mapValueToItem: jest.fn(value => ({ value, field: 'anotherField' })),
  onChange: jest.fn(),
  loadItems: jest.fn(() => Promise.resolve([4, 5, 6])),
  onFocus: jest.fn(),
  renderItem: jest.fn(item => <span>{item}</span>),
  value: 'something',
  noResultsLabel: 'no results',
  placeholderLabel: 'search your category ...',
  searchPromptLabel: 'Type something ...',
  name: 'name',
  ...custom,
});
describe('rendering with single selection', () => {
  const props = createTestProps();
  const wrapper = shallow(<Autocomplete {...props} />);
  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});

describe('rendering with multi selection', () => {
  const props = createTestProps({
    isMulti: true,
    value: ['something'],
  });
  const wrapper = shallow(<Autocomplete {...props} />);

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});

describe('callbacks', () => {
  const props = createTestProps();
  const wrapper = shallow(<Autocomplete {...props} />);

  beforeEach(() => {
    props.loadItems.mockClear();
    props.onChange.mockClear();
  });

  it('should trigger onChange callbacks when value changes', () => {
    wrapper.find(AsyncSelectInput).prop('onChange')({
      target: {
        value: {
          label: 'new value',
          value: 'some_value',
        },
      },
    });

    expect(props.onChange).toHaveBeenCalledTimes(1);
    expect(props.onChange).toHaveBeenCalledWith('some_value');
  });

  it('should load new items when loadItems is triggered (returning Promise)', () =>
    wrapper
      .instance()
      .handleLoadItems('new value')
      .then(newItems => {
        expect(newItems).toEqual([
          { value: 4, label: 'item:4' },
          { value: 5, label: 'item:5' },
          { value: 6, label: 'item:6' },
        ]);
      }));

  it('should load new items when loadItems is triggered (returning array)', () => {
    wrapper.setProps({ loadItems: jest.fn(() => [7, 8, 9]) });
    return wrapper
      .instance()
      .handleLoadItems('new value')
      .then(newItems => {
        expect(newItems).toEqual([
          { value: 7, label: 'item:7' },
          { value: 8, label: 'item:8' },
          { value: 9, label: 'item:9' },
        ]);
      });
  });
});
