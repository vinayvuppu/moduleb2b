import React from 'react';
import { shallow } from 'enzyme';
import FiltersContainer from '../filters-container';
import { SearchView } from './search-view';

const createTestProps = props => ({
  onSearch: jest.fn(() => Promise.resolve()),
  filterDefinitions: {
    createdAt: {
      label: 'Created',
      filterTypes: {
        range: {
          filterComponent: jest.fn(),
          tagComponent: jest.fn(),
          label: 'range',
        },
      },
    },
  },
  noResultsText: undefined,

  searchText: null,
  sorting: {
    key: 'createdAt',
    order: 'desc',
  },
  filters: {},
  page: 1,
  perPage: 20,
  results: [],
  total: 0,
  count: 0,
  setSearchFiltersState: jest.fn(),
  children: jest.fn(),
  track: jest.fn(),
  pendingRequests: {
    isLoading: false,
    increment: jest.fn(() => {}),
    decrement: jest.fn(() => {}),
  },
  ...props,
});

describe('rendering', () => {
  describe('without results', () => {
    let props;
    let wrapper;

    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<SearchView {...props} />);
    });

    it('outputs correct tree', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should render FiltersContainer component', () => {
      const searchProps = {};
      const onUpdateSearchMock = jest.fn();
      const wrapperSearchContainer = shallow(
        <div>
          {wrapper.instance().createSearchFilterContainerRenderer({
            onUpdateSearch: onUpdateSearchMock,
          })(searchProps)}
        </div>
      );
      const filterContainer = wrapperSearchContainer.find(FiltersContainer);
      expect(wrapperSearchContainer).toRender(FiltersContainer);

      expect(filterContainer.props()).toEqual(
        expect.objectContaining({
          fieldDefinitions: props.filterDefinitions,
          filteredFields: props.filters,
          onUpdateSearch: onUpdateSearchMock,
          children: expect.any(Function),
          searchText: props.searchText,
        })
      );
    });
  });

  describe('with results', () => {
    let props;
    let wrapper;

    beforeEach(() => {
      props = createTestProps({ total: 10, count: 10 });
      wrapper = shallow(<SearchView {...props} />);
    });

    it('outputs correct tree', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('calls `children` with arguments', () => {
      expect(props.children).toHaveBeenLastCalledWith({
        searchText: props.searchText,
        rowCount: 10,
        results: props.results,
        sorting: props.sorting,
        onSortChange: wrapper.instance().handleSortChange,
        registerMeasurementCache: expect.any(Function),
        footer: expect.any(Object),
      });
    });
  });
});

describe('default props', () => {
  describe('transformSearchFilterStateBeforeSet', () => {
    let filterState;

    beforeEach(() => {
      filterState = { sorting: 'random' };
    });

    it('should return the passed filter state', () => {
      expect(
        SearchView.defaultProps.transformSearchFilterStateBeforeSet(filterState)
      ).toBe(filterState);
    });
  });
});

describe('callbacks', () => {
  describe('getOptionsForSearchRequest', () => {
    let props;
    let wrapper;

    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<SearchView {...props} />);
    });

    it('return options for search request', () => {
      expect(
        wrapper.instance().getOptionsForSearchRequest({ page: 2 })
      ).toEqual({
        searchText: props.searchText,
        sorting: props.sorting,
        filters: props.filters,
        page: 2,
        perPage: props.perPage,
        track: props.track,
      });
    });
  });
  describe('handleUpdateSearch', () => {
    describe('without `searchOptions`', () => {
      let props;
      let wrapper;

      beforeEach(() => {
        props = createTestProps({
          transformSearchFilterStateBeforeSet: jest.fn(),
        });
        wrapper = shallow(<SearchView {...props} />);

        wrapper.instance().handleUpdateSearch();
      });

      it('not dispatch filters state update if no options are passed', () => {
        expect(props.setSearchFiltersState).toHaveBeenCalledTimes(0);
      });

      it('invokes the `transformSearchFilterStateBeforeSet` hook', () => {
        expect(props.transformSearchFilterStateBeforeSet).toHaveBeenCalledTimes(
          1
        );
      });

      it('invokes `transformSearchFilterStateBeforeSet` hook with the filter state', () => {
        expect(
          props.transformSearchFilterStateBeforeSet
        ).toHaveBeenLastCalledWith(
          wrapper.instance().getOptionsForSearchRequest(),
          expect.any(Array)
        );
      });
    });

    describe('with `searchOptions`', () => {
      let props;
      let wrapper;

      beforeEach(() => {
        props = createTestProps({
          transformSearchFilterStateBeforeSet: jest.fn(_ => _),
        });
        wrapper = shallow(<SearchView {...props} />);

        wrapper.instance().handleUpdateSearch({ page: 2 });
      });

      it('dispatch filters state update', () => {
        expect(props.setSearchFiltersState).toHaveBeenCalledTimes(1);
        expect(props.setSearchFiltersState).toHaveBeenLastCalledWith({
          searchText: props.searchText,
          sorting: props.sorting,
          filters: props.filters,
          perPage: props.perPage,
          page: 2,
          track: props.track,
        });
      });

      it('invokes `onSearch`', () => {
        expect(props.onSearch).toHaveBeenCalledTimes(1);
        expect(props.onSearch).toHaveBeenLastCalledWith({
          searchText: props.searchText,
          sorting: props.sorting,
          filters: props.filters,
          perPage: props.perPage,
          page: 2,
          track: props.track,
        });
      });

      it('invokes the `transformSearchFilterStateBeforeSet` hook', () => {
        expect(props.transformSearchFilterStateBeforeSet).toHaveBeenCalledTimes(
          1
        );
      });

      it('invokes `transformSearchFilterStateBeforeSet` hook with the filter state', () => {
        expect(
          props.transformSearchFilterStateBeforeSet
        ).toHaveBeenLastCalledWith(
          {
            searchText: props.searchText,
            sorting: props.sorting,
            filters: props.filters,
            perPage: props.perPage,
            page: 2,
            track: props.track,
          },
          ['page']
        );
      });
    });
  });

  describe('handleSortChange', () => {
    let props;
    let wrapper;

    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<SearchView {...props} />);

      wrapper.instance().handleSortChange('lastModifiedAt', 'asc');
    });

    it('trigger search with new sorting', () => {
      expect(props.onSearch).toHaveBeenLastCalledWith(
        expect.objectContaining({
          sorting: {
            key: 'lastModifiedAt',
            order: 'asc',
          },
        })
      );
    });
  });

  describe('handleChangePage', () => {
    let props;
    let wrapper;

    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<SearchView {...props} />);

      wrapper.instance().handlePageChange(2);
    });

    it('trigger search with new page', () => {
      expect(props.onSearch).toHaveBeenLastCalledWith(
        expect.objectContaining({ page: 2 })
      );
    });
  });

  describe('handlePerPageChange', () => {
    let props;
    let wrapper;

    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<SearchView {...props} />);

      wrapper.instance().handlePerPageChange(10);
    });

    it('trigger search with new page', () => {
      expect(props.onSearch).toHaveBeenLastCalledWith(
        expect.objectContaining({ perPage: 10 })
      );
    });
  });

  describe('handlePerPageChange yields out of bounds it should switch to last page with content', () => {
    let props;
    let wrapper;

    beforeEach(() => {
      props = createTestProps({ total: 100, perPage: 20, page: 5 });
      wrapper = shallow(<SearchView {...props} />);

      wrapper.instance().handlePerPageChange(50);
    });

    it('trigger search with new page', () => {
      expect(props.onSearch).toHaveBeenLastCalledWith(
        expect.objectContaining({ perPage: 50, page: 2 })
      );
    });
  });
});

describe('lifecycle', () => {
  describe('componentWillReceiveProps', () => {
    describe('different number of results', () => {
      let props;
      let wrapper;

      beforeEach(() => {
        props = createTestProps();
        wrapper = shallow(<SearchView {...props} />);
        wrapper.instance().measurementCache = { clearAll: jest.fn() };
        wrapper
          .instance()
          .UNSAFE_componentWillReceiveProps({ count: props.count + 1 });
      });

      it('should reset measurement cache', () => {
        expect(wrapper.instance().measurementCache.clearAll).toHaveBeenCalled();
      });
    });
    describe('different result IDs', () => {
      let props;
      let wrapper;

      beforeEach(() => {
        props = createTestProps({ results: [{ id: '1' }] });
        wrapper = shallow(<SearchView {...props} />);
        wrapper.instance().measurementCache = { clearAll: jest.fn() };
        wrapper
          .instance()
          .UNSAFE_componentWillReceiveProps({ results: [{ id: '2' }] });
      });

      it('should reset measurement cache', () => {
        expect(wrapper.instance().measurementCache.clearAll).toHaveBeenCalled();
      });
    });
  });

  describe('shouldComponentUpdate', () => {
    let props;
    let wrapper;

    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<SearchView {...props} />);
    });

    it('should return true if there are no pending requests', () => {
      expect(
        wrapper
          .instance()
          .shouldComponentUpdate({ pendingRequests: { isLoading: false } })
      ).toBe(true);
    });

    it('should return false if there are pending requests', () => {
      expect(
        wrapper
          .instance()
          .shouldComponentUpdate({ pendingRequests: { isLoading: true } })
      ).toBe(false);
    });
  });
});
