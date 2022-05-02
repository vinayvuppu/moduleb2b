import React from 'react';
import { shallow } from 'enzyme';
import { SEARCH_FILTERS_EVENTS } from '..';
import { FiltersContainer } from './filters-container';

const Filter = jest.fn();
Filter.displayName = 'Filter';

const Tag = jest.fn();
Tag.displayName = 'Tag';

const filterTypes = {
  someType: {
    filterComponent: Filter,
    tagComponent: Tag,
    validator: jest.fn(),
    label: 'Some Filter',
  },
  someOtherType: {
    filterComponent: Filter,
    tagComponent: Tag,
    label: 'Some Other Filter',
  },
};

const createTestProps = props => ({
  children: jest.fn(),
  onUpdateSearch: jest.fn(),
  searchText: '',
  filteredFields: {},
  fieldDefinitions: {
    someField: {
      label: 'Some Field',
      filterTypes,
    },
    someOtherField: {
      label: 'Some Other Field',
      filterTypes,
    },
    someThirdField: {
      label: 'Some Third Field',
      filterTypes,
    },
    someFourthField: {
      label: 'Some Fourth Field',
      filterTypes,
    },
  },
  intl: { formatMessage: jest.fn() },
  track: jest.fn(),
  isEditMode: true,
  ...props,
});

describe('rendering', () => {
  const props = createTestProps({
    filteredFields: {
      someField: [
        { type: 'someType', value: 'something' },
        { type: 'someOtherType', value: { something: 'something' } },
      ],
    },
  });
  const wrapper = shallow(<FiltersContainer {...props} />);

  it('should call the `children` function', () => {
    expect(props.children).toHaveBeenCalledTimes(1);

    // Check params passed to children
    expect(props.children).toHaveBeenCalledWith({
      onCancelFilterChanges: wrapper.instance().handleCancelFilterChanges,
      onApplyFilters: wrapper.instance().handleApplyFilters,
      onUpdateFilterForField: wrapper.instance().handleUpdateFilterForField,
      onUpdateQuickFilterForField: wrapper.instance()
        .handleUpdateQuickFilterForField,
      onRemoveFilterFromField: wrapper.instance().handleRemoveFilterFromField,
      onAddFilterToField: wrapper.instance().handleAddFilterToField,
      onAddField: wrapper.instance().handleAddField,
      onClearFiltersFromField: wrapper.instance().handleClearFiltersFromField,
      onRemoveFilterTagFromField: wrapper.instance()
        .handleRemoveFilterTagFromField,
      filteredFields: {
        someField: [
          { type: 'someType', value: 'something' },
          { type: 'someOtherType', value: { something: 'something' } },
        ],
      },
      searchText: '',
      hasChangesInFilters: false,
      showOnClearAll: true,
      onClearAll: wrapper.instance().handleClearAll,
      hasChangesInTextSearch: false,
      onChangeSearchText: wrapper.instance().handleChangeSearchText,
    });
  });
});

describe('callbacks', () => {
  describe('updating one of a fields filters', () => {
    const children = jest.fn();
    const filteredFields = {
      someField: [
        { type: 'someType', value: 'something' },
        { type: 'someOtherType', value: { something: 'something' } },
      ],
      anotherField: [{ type: 'anotherType', value: 'something' }],
    };
    const props = createTestProps({ filteredFields, children });
    shallow(<FiltersContainer {...props} />);

    it('should pass on the initial state', () => {
      expect(children).toHaveBeenCalledTimes(1);
      expect(children).toHaveBeenCalledWith(
        expect.objectContaining({
          filteredFields,
        })
      );
    });
    it('should update the state', () => {
      children.mock.calls[0][0].onUpdateFilterForField({
        fieldName: 'someField',
        index: 0,
        filter: 'some different value',
      });
      expect(children).toHaveBeenCalledTimes(2);
      expect(children).toHaveBeenLastCalledWith(
        expect.objectContaining({
          filteredFields: {
            someField: [
              'some different value',
              { type: 'someOtherType', value: { something: 'something' } },
            ],
            anotherField: [{ type: 'anotherType', value: 'something' }],
          },
        })
      );
    });
  });

  describe('removing one of a fields filters', () => {
    const filteredFields = {
      someField: [
        { type: 'someType', value: 'something' },
        { type: 'someOtherType', value: { something: 'something' } },
      ],
      anotherField: [{ type: 'anotherType', value: 'something' }],
    };
    const children = jest.fn();
    const props = createTestProps({ filteredFields, children });
    shallow(<FiltersContainer {...props} />);

    it('should pass on the initial state', () => {
      expect(children).toHaveBeenCalledTimes(1);
      expect(children).toHaveBeenCalledWith(
        expect.objectContaining({
          filteredFields,
        })
      );
    });
    it('should remove the filter from the state', () => {
      children.mock.calls[0][0].onRemoveFilterFromField({
        fieldName: 'someField',
        index: 0,
      });
      expect(children).toHaveBeenCalledTimes(2);
      expect(children).toHaveBeenLastCalledWith(
        expect.objectContaining({
          filteredFields: {
            someField: [
              { type: 'someOtherType', value: { something: 'something' } },
            ],
            anotherField: [{ type: 'anotherType', value: 'something' }],
          },
        })
      );
    });
    it('should remove the field completely if there are no filters', () => {
      children.mock.calls[1][0].onRemoveFilterFromField({
        fieldName: 'someField',
        index: 0,
      });
      expect(children).toHaveBeenCalledTimes(3);
      expect(children).toHaveBeenLastCalledWith(
        expect.objectContaining({
          filteredFields: {
            anotherField: [{ type: 'anotherType', value: 'something' }],
          },
        })
      );
    });
  });

  describe('removing a field filter tag', () => {
    const filteredFields = {
      someField: [{ type: 'someType', value: 'something' }],
      anotherField: [{ type: 'anotherType', value: 'something' }],
    };
    const children = jest.fn();
    const props = createTestProps({ filteredFields, children });
    shallow(<FiltersContainer {...props} />);

    children.mock.calls[0][0].onRemoveFilterTagFromField({
      fieldName: 'someField',
      index: 0,
    });

    it('should remove the filter from the state and update filters', () => {
      const expectedFilters = {
        anotherField: [{ type: 'anotherType', value: 'something' }],
      };
      expect(children).toHaveBeenCalledTimes(2);
      expect(children).toHaveBeenLastCalledWith(
        expect.objectContaining({
          filteredFields: expectedFilters,
        })
      );
    });
  });

  describe('adding a filter to a field', () => {
    const filteredFields = {
      someField: [
        { type: 'someType', value: 'something' },
        { type: 'someOtherType', value: { something: 'something' } },
      ],
      anotherField: [{ type: 'anotherType', value: 'something' }],
    };
    const children = jest.fn();
    const props = createTestProps({ filteredFields, children });
    shallow(<FiltersContainer {...props} />);

    it('should pass on the initial state', () => {
      expect(children).toHaveBeenCalledTimes(1);
      expect(children).toHaveBeenCalledWith(
        expect.objectContaining({
          filteredFields,
        })
      );
    });
    it('should add the filter to the state', () => {
      children.mock.calls[0][0].onAddFilterToField({
        fieldName: 'someField',
        filter: { type: 'newFilter', value: null },
        index: 0,
      });
      expect(children).toHaveBeenCalledTimes(2);
      expect(children).toHaveBeenLastCalledWith(
        expect.objectContaining({
          filteredFields: {
            someField: [
              { type: 'newFilter', value: null },
              { type: 'someType', value: 'something' },
              { type: 'someOtherType', value: { something: 'something' } },
            ],
            anotherField: [{ type: 'anotherType', value: 'something' }],
          },
        })
      );
    });
  });

  describe('adding a field', () => {
    const filteredFields = {
      someField: [
        { type: 'someType', value: 'something' },
        { type: 'someOtherType', value: { something: 'something' } },
      ],
    };
    const children = jest.fn();
    const props = createTestProps({ filteredFields, children });
    shallow(<FiltersContainer {...props} />);

    it('should pass on the initial state', () => {
      expect(children).toHaveBeenCalledTimes(1);
      expect(children).toHaveBeenCalledWith(
        expect.objectContaining({
          filteredFields,
        })
      );
    });
    it('should add the field to the state', () => {
      children.mock.calls[0][0].onAddField({ fieldName: 'someThirdField' });
      expect(children).toHaveBeenCalledTimes(2);
      expect(children).toHaveBeenLastCalledWith(
        expect.objectContaining({
          filteredFields: {
            someField: [
              { type: 'someType', value: 'something' },
              { type: 'someOtherType', value: { something: 'something' } },
            ],
            someThirdField: [{ type: 'someType', value: null }],
          },
        })
      );
    });
  });

  describe('removing all filters from a field', () => {
    const filteredFields = {
      someField: [
        { type: 'newFilter', value: null },
        { type: 'someType', value: 'something' },
        { type: 'someOtherType', value: { something: 'something' } },
      ],
      someOtherField: [{ type: 'someType', value: 'something' }],
    };
    const children = jest.fn();
    const props = createTestProps({ filteredFields, children });
    shallow(<FiltersContainer {...props} />);

    it('should pass on the initial state', () => {
      expect(children).toHaveBeenCalledTimes(1);
      expect(children).toHaveBeenCalledWith(
        expect.objectContaining({
          filteredFields,
        })
      );
    });
    it('should remove all filters from `someField`', () => {
      children.mock.calls[0][0].onClearFiltersFromField({
        fieldName: 'someField',
      });
      expect(children).toHaveBeenCalledTimes(2);
      expect(children).toHaveBeenLastCalledWith(
        expect.objectContaining({
          filteredFields: {
            someOtherField: [{ type: 'someType', value: 'something' }],
          },
        })
      );
    });
  });

  describe('applying the state', () => {
    const filteredFields = {
      someField: [
        { type: 'someType', value: 'something' },
        { type: 'someOtherType', value: { something: 'something' } },
      ],
    };
    const changedFilteredFields = {
      someField: [
        { type: 'someType', value: 'something' },
        { type: 'someOtherType', value: { something: 'something' } },
        { type: 'someType', value: null },
      ],
    };

    const removedEmptyFields = {
      filters: {
        someField: [
          { type: 'someType', value: 'something' },
          { type: 'someOtherType', value: { something: 'something' } },
        ],
      },
      searchText: '',
      page: 1,
    };

    let props;
    let wrapper;

    beforeEach(() => {
      props = createTestProps({ filteredFields });
      wrapper = shallow(<FiltersContainer {...props} />);

      wrapper.setState({
        filteredFields: changedFilteredFields,
      });

      wrapper.instance().handleApplyFilters();
    });

    it('should call all validators for filteredFields', () => {
      const someFieldFilterTypes = props.fieldDefinitions.someField.filterTypes;
      expect(someFieldFilterTypes.someType.validator).toHaveBeenCalledTimes(1);
      expect(someFieldFilterTypes.someType.validator).toHaveBeenCalledWith(
        { type: 'someType', value: 'something' },
        props.intl
      );
    });

    describe('all values are valid', () => {
      it('should call onUpdateSearch', () => {
        expect(props.onUpdateSearch).toHaveBeenCalledTimes(1);
        expect(props.onUpdateSearch).toHaveBeenCalledWith({
          filters: changedFilteredFields,
          searchText: '',
          page: 1,
        });
      });
    });

    describe('not all values are valid', () => {
      const onUpdateSearch = jest.fn();
      beforeEach(() => {
        wrapper.setProps({
          onUpdateSearch,
          fieldDefinitions: {
            someField: {
              label: 'Some Field',
              filterTypes: {
                someType: {
                  filterComponent: Filter,
                  tagComponent: Tag,
                  validator: jest.fn(() => 'some error'),
                  label: 'Some Filter',
                },
                someOtherType: {
                  filterComponent: Filter,
                  tagComponent: Tag,
                  label: 'Some Other Filter',
                },
              },
            },
          },
        });

        wrapper.instance().handleApplyFilters();
      });
      it('should not call onUpdateSearch', () => {
        expect(onUpdateSearch).toHaveBeenCalledTimes(0);
      });

      it('should set errors in filteredFields in state', () => {
        expect(wrapper.state('filteredFields')).toEqual({
          someField: [
            { type: 'someType', value: 'something', error: 'some error' },
            { type: 'someOtherType', value: { something: 'something' } },
          ],
        });
      });
    });

    describe('removing empty filters', () => {
      beforeEach(() => {
        wrapper.instance().handleApplyFilters({ removeEmptyFilters: true });
      });
      it('should remove empty filters', () => {
        expect(props.onUpdateSearch).toHaveBeenCalledWith(removedEmptyFields);
      });
    });
  });

  describe('reverting the state', () => {
    const children = jest.fn();
    const filteredFields = {
      someField: [
        { type: 'someType', value: 'something' },
        { type: 'someOtherType', value: { something: 'something' } },
      ],
    };
    const props = createTestProps({ filteredFields, children });
    const wrapper = shallow(<FiltersContainer {...props} />);

    const changedFilteredFields = {
      someField: [{ type: 'different', value: 'something different' }],
    };
    wrapper.setState({
      filteredFields: changedFilteredFields,
    });

    it('should pass on the changed state', () => {
      expect(children).toHaveBeenCalledTimes(2);
      expect(children).toHaveBeenCalledWith(
        expect.objectContaining({
          filteredFields: changedFilteredFields,
        })
      );
    });
    it('should revert the state', () => {
      children.mock.calls[1][0].onCancelFilterChanges();
      expect(children).toHaveBeenCalledTimes(3);
      expect(children).toHaveBeenCalledWith(
        expect.objectContaining({
          filteredFields,
        })
      );
    });
  });

  describe('clear filters and text', () => {
    const children = jest.fn();
    const filteredFields = {
      someField: [{ type: 'someType', value: 'something' }],
      someOtherField: [
        { type: 'someOtherType', value: { something: 'something' } },
      ],
    };
    const searchText = 'test';
    let props;
    let wrapper;
    beforeEach(() => {
      props = createTestProps({ filteredFields, children, searchText });
      wrapper = shallow(<FiltersContainer {...props} />);
    });

    it('shouldShowClearAll should return true', () => {
      expect(wrapper.instance().shouldShowClearAll()).toBe(true);
    });

    it('should clear the state', () => {
      wrapper.instance().handleClearAll();
      expect(wrapper.instance().state).toEqual(
        expect.objectContaining({
          filteredFields: {},
          searchText: null,
        })
      );
    });

    it('shouldShowClearAll should return false', () => {
      wrapper.instance().handleClearAll();
      expect(wrapper.instance().shouldShowClearAll()).toBe(false);
    });

    describe('shouldShowClearAll', () => {
      describe('when filterFields is null', () => {
        beforeEach(() => {
          props = createTestProps({
            filteredFields: null,
            children,
            searchText,
          });
          wrapper = shallow(<FiltersContainer {...props} />);
        });
        it('should return true', () => {
          expect(wrapper.instance().shouldShowClearAll()).toBe(true);
        });
      });
    });
  });

  describe('detect changes in filters', () => {
    const props = createTestProps({
      filteredFields: {
        someField: [
          { type: 'someType', value: 'something' },
          { type: 'someOtherType', value: { something: 'something' } },
        ],
      },
    });
    const wrapper = shallow(<FiltersContainer {...props} />);

    it('should set hasChangesInFilters to true', () => {
      const newFilters = {
        someDifferentField: [{ type: 'someType', value: 'nothing' }],
      };
      const newState = wrapper.instance().detectChangesInFilters(
        {
          filteredFields: newFilters,
        },
        wrapper.instance().state
      );

      expect(newState.hasChangesInFilters).toBeTruthy();
    });

    it('should set hasChangesInTextSearch to true', () => {
      const newSearchText = 'someType';
      const newState = wrapper.instance().detectChangesInFilters(
        {
          searchText: newSearchText,
        },
        wrapper.instance().state
      );

      expect(newState.hasChangesInTextSearch).toBeTruthy();
    });
  });
  describe('call `onChange` once it changes', () => {
    let props;
    let instance;
    let wrapper;
    let fieldName;
    let index;
    let filter;
    beforeEach(() => {
      const onChange = jest.fn();
      const children = jest.fn();
      const fieldDefinitions = {
        someField: {
          label: 'Some Field',
          filterTypes: {
            someType: {
              filterComponent: Filter,
              tagComponent: Tag,
              validator: jest.fn(() => 'some error'),
              label: 'Some Filter',
            },
            someOtherType: {
              filterComponent: Filter,
              tagComponent: Tag,
              label: 'Some Other Filter',
            },
          },
        },
        someOtherField: {
          label: 'Some Other Field',
          filterTypes,
        },
      };
      fieldName = 'someField';
      index = 'index';
      filter = 'filter';
      props = createTestProps({ children, onChange, fieldDefinitions });
      wrapper = shallow(<FiltersContainer {...props} />);
      instance = wrapper.instance();
    });
    describe('handleUpdateFilterForField', () => {
      it('should call `onChange` when filter changes', () => {
        instance.handleUpdateFilterForField({ fieldName, index, filter });
        expect(props.onChange).toHaveBeenCalledTimes(1);
        expect(props.onChange).toHaveBeenCalledWith({
          fieldName,
          fieldValue: filter,
          eventName: SEARCH_FILTERS_EVENTS.updateFilterValue,
        });
      });
    });
    describe('handleCancelFilterChanges', () => {
      it('should call `onChange` when canceling filter changes', () => {
        instance.handleCancelFilterChanges();
        expect(props.onChange).toHaveBeenCalledTimes(1);
        expect(props.onChange).toHaveBeenCalledWith({
          eventName: SEARCH_FILTERS_EVENTS.cancelFilterChanges,
        });
      });
    });
    describe('handleRemoveFilterFromField', () => {
      it('should call `onChange` when removing filter from field', () => {
        instance.handleRemoveFilterFromField({ fieldName, index });
        expect(props.onChange).toHaveBeenCalledTimes(1);
        expect(props.onChange).toHaveBeenCalledWith({
          eventName: SEARCH_FILTERS_EVENTS.removeFilterFromField,
          fieldName,
        });
      });
    });
    describe('handleClearAllFilters', () => {
      it('should call `onChange` when clearing all filters', () => {
        instance.handleClearAllFilters();
        expect(props.onChange).toHaveBeenCalledTimes(1);
        expect(props.onChange).toHaveBeenCalledWith({
          eventName: SEARCH_FILTERS_EVENTS.clearAllFilters,
        });
      });
    });
    describe('handleAddFilterToField', () => {
      it('should call `onChange` when add filter to field', () => {
        instance.handleAddFilterToField({ fieldName, index, filter });
        expect(props.onChange).toHaveBeenCalledTimes(1);
        expect(props.onChange).toHaveBeenCalledWith({
          eventName: SEARCH_FILTERS_EVENTS.addFilterToField,
          fieldName,
          filter,
        });
      });
    });
    describe('handleClearFiltersFromField', () => {
      it('should call `onChange` when clearing filters', () => {
        instance.handleClearFiltersFromField({ fieldName });
        expect(props.onChange).toHaveBeenCalledTimes(1);
        expect(props.onChange).toHaveBeenCalledWith({
          eventName: SEARCH_FILTERS_EVENTS.clearFiltersFromField,
          fieldName,
        });
      });
    });
    describe('handleAddField', () => {
      it('should call `onChange` when adding field', () => {
        instance.handleAddField({ fieldName });
        expect(props.onChange).toHaveBeenCalledTimes(1);
        expect(props.onChange).toHaveBeenCalledWith({
          eventName: SEARCH_FILTERS_EVENTS.addField,
          fieldName,
        });
      });
    });
    describe('handleApplyFilters', () => {
      describe('when `removeEmptyFilters` is true', () => {
        it('should call `onChange` when calling `removeEmptyFilters`', () => {
          instance.handleApplyFilters({ removeEmptyFilters: true });
          expect(props.onChange).toHaveBeenCalledTimes(1);
          expect(props.onChange).toHaveBeenCalledWith({
            eventName: SEARCH_FILTERS_EVENTS.applyFiltersAndRemoveEmpty,
          });
        });
      });
      describe('when `removeEmptyFilters` is false', () => {
        it('should call `onChange` when calling `removeEmptyFilters`', () => {
          instance.handleApplyFilters({ removeEmptyFilters: false });
          expect(props.onChange).toHaveBeenCalledTimes(1);
          expect(props.onChange).toHaveBeenCalledWith({
            eventName: SEARCH_FILTERS_EVENTS.applyFilters,
          });
        });
      });
      describe('handleUpdateQuickFilterForField', () => {
        beforeEach(() => {
          fieldName = 'someField';
          index = 0;
          filter = {
            type: 'someType',
            value: {
              from: '2018-09-20',
              to: '2018-09-25',
            },
          };
          instance.handleUpdateQuickFilterForField({
            fieldName,
            index,
            filter,
          });
        });
        it('should call `onChange`', () => {
          expect(props.onChange).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});

describe('lifecycle', () => {
  let props;
  let wrapper;
  describe('componentWillReceiveProps', () => {
    beforeEach(() => {
      props = createTestProps({
        filteredFields: {
          someField: [
            { type: 'someType', value: 'something' },
            { type: 'someOtherType', value: { something: 'something' } },
          ],
        },
        searchText: 'Test',
      });
      wrapper = shallow(<FiltersContainer {...props} />);
    });

    describe('when filters change', () => {
      let nextFilters;

      beforeEach(() => {
        nextFilters = {
          someDifferentField: [{ type: 'someType', value: 'nothing' }],
        };

        wrapper.instance().UNSAFE_componentWillReceiveProps({
          filteredFields: nextFilters,
        });
      });

      it('should replace filters when props update', () => {
        expect(wrapper).toHaveState('filteredFields', nextFilters);
      });
    });

    describe('when search text changes', () => {
      let nextSearchText;

      beforeEach(() => {
        nextSearchText = 'NewSearchTerm';

        wrapper.instance().UNSAFE_componentWillReceiveProps({
          searchText: nextSearchText,
        });
      });

      it('should not update local state when it receives new props', () => {
        expect(wrapper).toHaveState('searchText', props.searchText);
      });
    });
  });
});
