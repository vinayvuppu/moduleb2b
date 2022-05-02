import React from 'react';
import { shallow } from 'enzyme';
import { SearchViewContainer } from './search-view-containers';

const createTestProps = props => ({
  isSearchSliceInitialized: false,
  searchSliceName: 'foo',
  initializeSearchSlice: jest.fn(),
  setSearchFiltersState: jest.fn(),

  // proxied props
  onSearch: jest.fn(),
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

  children: jest.fn(),

  ...props,
});

describe('rendering', () => {
  describe('when initialized', () => {
    let props;
    let wrapper;

    describe('when proxying props', () => {
      beforeEach(() => {
        props = createTestProps({
          isSearchSliceInitialized: true,
          one: 'one',
          two: 'two',
          three: 'three',
        });
        wrapper = shallow(<SearchViewContainer {...props} />);
      });

      it('should output correct tree', () => {
        expect(wrapper).toMatchSnapshot();
      });
    });
  });
  describe('when not initialized', () => {
    let props;
    let wrapper;

    beforeEach(() => {
      props = createTestProps({ isSearchSliceInitialized: false });
      wrapper = shallow(<SearchViewContainer {...props} />);
    });

    it('should not render anything', () => {
      expect(wrapper.type()).toEqual(null);
    });
  });
});

describe('interactions', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = createTestProps({ isSearchSliceInitialized: false });
    wrapper = shallow(<SearchViewContainer {...props} />);
  });

  describe('when search filters change', () => {
    describe('with search text', () => {
      beforeEach(() => {
        wrapper.instance().handleSetSearchFilterState({
          searchText: 'foo',
          sorting: { key: 'createdAt', order: 'asc' },
        });
      });

      it('should invoke `setSearchFiltersState` with sorting key', () => {
        expect(props.setSearchFiltersState).toHaveBeenLastCalledWith(
          {
            searchText: expect.any(String),
            sorting: { key: 'createdAt', order: expect.any(String) },
          },
          expect.any(String)
        );
      });

      it('should invoke `setSearchFiltersState` with sorting order', () => {
        expect(props.setSearchFiltersState).toHaveBeenLastCalledWith(
          {
            searchText: expect.any(String),
            sorting: { key: expect.any(String), order: 'asc' },
          },
          expect.any(String)
        );
      });

      it('should invoke `setSearchFiltersState` with search text', () => {
        expect(props.setSearchFiltersState).toHaveBeenLastCalledWith(
          {
            searchText: 'foo',
            sorting: expect.any(Object),
          },
          expect.any(String)
        );
      });
    });
  });
});

describe('callbacks', () => {
  let props;
  let wrapper;

  describe('when `setSearchFiltersState` is invoked', () => {
    beforeEach(() => {
      props = createTestProps({ isSearchSliceInitialized: true });
      wrapper = shallow(<SearchViewContainer {...props} />);

      wrapper.prop('setSearchFiltersState')({ foo: 'bar' });
    });

    it('should call action creator with the slice name', () => {
      expect(props.setSearchFiltersState).toHaveBeenCalledTimes(1);
      expect(props.setSearchFiltersState).toHaveBeenLastCalledWith(
        expect.any(Object),
        'foo'
      );
    });

    it('should call action creator with the search options', () => {
      expect(props.setSearchFiltersState).toHaveBeenCalledTimes(1);
      expect(props.setSearchFiltersState).toHaveBeenLastCalledWith(
        { foo: 'bar' },
        expect.any(String)
      );
    });
  });
});

describe('mounting', () => {
  let props;
  let wrapper;

  describe('when search slice is initialized', () => {
    beforeEach(() => {
      props = createTestProps({ isSearchSliceInitialized: true });
      wrapper = shallow(<SearchViewContainer {...props} />);
      wrapper.instance().componentDidMount();
    });

    it('should not dispatch `initializeSearchSlice`', () => {
      expect(props.initializeSearchSlice).not.toHaveBeenCalled();
    });
  });
  describe('when search slice is not initialized', () => {
    beforeEach(() => {
      props = createTestProps({ isSearchSliceInitialized: false });
      wrapper = shallow(<SearchViewContainer {...props} />);
      wrapper.instance().componentDidMount();
    });

    describe('without initial state', () => {
      it('should dispatch `initializeSearchSlice`', () => {
        expect(props.initializeSearchSlice).toHaveBeenCalledTimes(1);
        expect(props.initializeSearchSlice).toHaveBeenLastCalledWith({}, 'foo');
      });
    });

    describe('with initial state', () => {
      const initialSliceState = { initial: 'state' };

      beforeEach(() => {
        props = createTestProps({
          isSearchSliceInitialized: false,
          initialSliceState,
        });
        wrapper = shallow(<SearchViewContainer {...props} />);
        wrapper.instance().componentDidMount();
      });

      it('should dispatch `initializeSearchSlice` passing the state', () => {
        expect(props.initializeSearchSlice).toHaveBeenCalledTimes(1);
        expect(props.initializeSearchSlice).toHaveBeenLastCalledWith(
          initialSliceState,
          'foo'
        );
      });
    });
  });
});
