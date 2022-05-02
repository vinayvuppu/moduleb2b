import React from 'react';
import { shallow } from 'enzyme';
import oneLine from 'common-tags/lib/oneLine';
import { IconButton, SelectInput } from '@commercetools-frontend/ui-kit';
import { intlMock } from '../../../../test-utils';
import { FieldFilters, extractValueFromEvent } from './field-filters';

const Filter = jest.fn();
Filter.displayName = 'Filter';

const createTestProps = props => ({
  label: 'label',
  filterOptions: {
    someFilter: {
      filterComponent: Filter,
      label: 'Some Filter',
    },
    someOtherFilter: {
      filterComponent: Filter,
      label: 'Some Other Filter',
    },
  },
  filters: [{ type: 'someFilter', value: 5, error: 'something' }],

  onUpdateFilter: jest.fn(),
  onAddFilter: jest.fn(),
  onRemoveFilter: jest.fn(),
  width: 0,
  intl: intlMock,
  ...props,
});

describe('rendering', () => {
  const props = createTestProps();
  const wrapper = shallow(<FieldFilters {...props} />);

  it('should render a label', () => {
    const label = wrapper.find({ className: 'label' });

    expect(label).toHaveLength(1);
    expect(label.text()).toBe(props.label);
  });

  it('should render an ItemList', () => {
    const itemList = wrapper.find('ItemList');

    expect(itemList).toHaveLength(1);
    expect(itemList.props()).toEqual(
      expect.objectContaining({
        itemCount: props.filters.length,
        renderItem: wrapper.instance().renderFilter,
        getKey: expect.any(Function),
        onAddItem: wrapper.instance().handleAddFilter,
        onRemoveItem: props.onRemoveFilter,
        canBeEmpty: true,
        shouldGrowItems: false,
        shouldRenderButtons: false,
      })
    );
  });

  describe('rendering of filter items', () => {
    const renderFilterWrapper = args =>
      shallow(
        <div>{wrapper.instance().renderFilter({ index: 0, ...args })}</div>
      );

    describe('rendering of add button', () => {
      it('should not render a add button by default', () => {
        const filterWrapper = renderFilterWrapper();
        expect(filterWrapper).not.toRender(IconButton.displayName);
      });
      it('should render a add button if the onAddItem callback is given', () => {
        const onAddItem = jest.fn();
        const filterWrapper = renderFilterWrapper({ onAddItem });
        expect(filterWrapper).toRender(IconButton.displayName);
      });
      it('should call the onAddItem callback when clicked', () => {
        const onAddItem = jest.fn();
        const filterWrapper = renderFilterWrapper({ onAddItem });
        filterWrapper.find(IconButton.displayName).prop('onClick')();
        expect(onAddItem).toHaveBeenCalledTimes(1);
        expect(onAddItem).toHaveBeenCalledWith({ index: 0 });
      });
    });

    describe('not rendering of add button', () => {
      wrapper.setProps({
        filterOptions: {
          ...props.filterOptions,
          someFilter: {
            filterComponent: Filter,
            label: 'Some Filter',
            canBeAppliedMultipleTimes: false,
          },
        },
      });
      const filterWrapper = renderFilterWrapper({ onAddItem: jest.fn() });
      it('should not render a add button if explicitly configured', () => {
        expect(filterWrapper).not.toRender(IconButton.displayName);
      });
    });

    describe('rendering of a remove button', () => {
      it('should not render a remove button by default', () => {
        const filterWrapper = renderFilterWrapper();
        expect(filterWrapper).not.toRender(IconButton.displayName);
      });
      it('should render a remove button if the onRemoveItem callback is given', () => {
        const onRemoveItem = jest.fn();
        const filterWrapper = renderFilterWrapper({ onRemoveItem });
        expect(filterWrapper).toRender(IconButton.displayName);
      });
      it('should call the onRemoveItem callback when clicked', () => {
        const onRemoveItem = jest.fn();
        const filterWrapper = renderFilterWrapper({ onRemoveItem });
        filterWrapper.find(IconButton.displayName).prop('onClick')();
        expect(onRemoveItem).toHaveBeenCalledTimes(1);
        expect(onRemoveItem).toHaveBeenCalledWith({ index: 0 });
      });
    });

    describe('multiple available types', () => {
      const filterWrapper = renderFilterWrapper();
      const filterTypeDropdown = filterWrapper.find(SelectInput);

      it('should render a filter type dropdown for each filter item', () => {
        expect(filterTypeDropdown).toHaveLength(1);
        expect(filterTypeDropdown.props()).toEqual(
          expect.objectContaining({
            options: [
              { value: 'someFilter', label: 'Some Filter' },
              { value: 'someOtherFilter', label: 'Some Other Filter' },
            ],
            value: 'someFilter',
            onChange: expect.any(Function),
          })
        );
      });
      it('should call onUpdateFilter when changed', () => {
        filterTypeDropdown.prop('onChange')({ target: { value: 'foo' } });
        expect(props.onUpdateFilter).toHaveBeenCalledTimes(1);
        expect(props.onUpdateFilter).toHaveBeenCalledWith({
          filter: { type: 'foo', value: null },
          index: 0,
        });
      });
      it('should render a filter for each filter item', () => {
        const filter = filterWrapper.find('Filter');

        expect(filter).toHaveLength(1);
        expect(filter.props()).toEqual(
          expect.objectContaining({
            value: 5,
            error: 'something',
            onUpdateFilter: expect.any(Function),
          })
        );
      });
    });

    describe('only one available type', () => {
      wrapper.setProps({
        filterOptions: {
          someFilter: {
            label: 'Some Filter',
            filterComponent: Filter,
          },
        },
      });
      const filterWrapper = renderFilterWrapper();
      const filterTypeDropdown = filterWrapper.find(SelectInput);
      it(
        oneLine`
        should render a label instead of a dropdown if there is only
        one type option
        `,
        () => {
          expect(filterTypeDropdown).toHaveLength(0);
          expect(filterWrapper.text()).toContain('Some Filter');
        }
      );
    });
  });
});

describe('callbacks', () => {
  it('should call the onAddFilter callback when a filter is added', () => {
    const props = createTestProps();
    const wrapper = shallow(<FieldFilters {...props} />);

    wrapper.instance().handleAddFilter({ index: 0 });

    expect(props.onAddFilter).toHaveBeenCalledTimes(1);
    expect(props.onAddFilter).toHaveBeenCalledWith({
      filter: { type: 'someFilter', value: null },
      index: 0,
    });
  });
});

describe('utils', () => {
  describe('extractValueFromEvent', () => {
    describe('without value and event', () => {
      it('should not extract anything', () => {
        expect(extractValueFromEvent()).not.toBeDefined();
      });
    });

    describe('with event', () => {
      const event = {
        target: {
          value: 'foo-value',
        },
      };

      it('should extract the value from the events target', () => {
        expect(extractValueFromEvent(event)).toEqual('foo-value');
      });
    });

    describe('without event (only value)', () => {
      it('should extract just the value', () => {
        expect(extractValueFromEvent('foo-value')).toEqual('foo-value');
      });
    });
  });
});
