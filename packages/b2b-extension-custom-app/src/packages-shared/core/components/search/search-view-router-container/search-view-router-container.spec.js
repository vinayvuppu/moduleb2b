import React from 'react';
import { shallow } from 'enzyme';
import { reportErrorToSentry } from '@commercetools-frontend/sentry';
import SearchView from '../search-view';
import { SearchViewRouterContainer } from './search-view-router-container';
import { VERSION_KEY, augmentWithVersion, encode, encodeToUrl } from './utils';

jest.mock('@commercetools-frontend/sentry');

const version = 1;
const createTestProps = props => ({
  location: {
    search: 'foo-search',
    pathname: 'foo-path',
  },
  history: {
    replace: jest.fn(),
    createHref: jest.fn(() => 'next-href'),
  },
  version,

  children: jest.fn(),
  render: jest.fn(),

  ...props,
});

describe('rendering', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<SearchViewRouterContainer {...props} />);
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render a `<SearchView>`', () => {
    expect(wrapper).toRender(SearchView);
  });

  describe('`<SearchView>`', () => {
    let searchViewWrapper;

    beforeEach(() => {
      searchViewWrapper = wrapper.find(SearchView);
    });

    it('should receive `onSearch`', () => {
      expect(searchViewWrapper).toHaveProp(
        'onSearch',
        wrapper.instance().handleOnSearch
      );
    });

    it('should receive `setSearchFiltersState`', () => {
      expect(searchViewWrapper).toHaveProp(
        'setSearchFiltersState',
        wrapper.instance().handleSetSearchFilterState
      );
    });
  });
});

describe('interacting', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    window.localStorage.setItem.mockClear();
    window.localStorage.getItem.mockClear();
    window.localStorage.removeItem.mockClear();
  });

  describe('`handleSetSearchFilterState`', () => {
    const searchOptions = { foo: 'bar' };

    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<SearchViewRouterContainer {...props} />);
    });

    describe('without `storageSlice`', () => {
      beforeEach(() => {
        wrapper.instance().handleSetSearchFilterState(searchOptions);
      });

      it('should invoke `createHref` on `history`', () => {
        expect(props.history.createHref).toHaveBeenCalledWith({
          pathname: props.location.pathname,
          search: encodeToUrl(
            augmentWithVersion(searchOptions, props.version),
            props.location.search
          ),
        });
      });

      it('should invoke `replace` on `history`', () => {
        expect(props.history.replace).toHaveBeenCalledWith('next-href');
      });
    });

    describe('with `storageSlice`', () => {
      beforeEach(() => {
        props = createTestProps({ storageSlice: 'foo-slice' });
        wrapper = shallow(<SearchViewRouterContainer {...props} />);
        wrapper.instance().handleSetSearchFilterState(searchOptions);
      });

      it('should invoke `put` on `storage`', () => {
        expect(window.localStorage.setItem).toHaveBeenCalled();
      });
    });

    describe('with previous query', () => {
      const encodedPreviousQuery = encode({ prev: 'search' });
      beforeEach(() => {
        props = createTestProps({
          location: {
            search: 'foo-search',
            pathname: 'foo-path',
            query: {
              query: encodedPreviousQuery,
            },
          },
        });
        wrapper = shallow(<SearchViewRouterContainer {...props} />);
        wrapper.instance().handleSetSearchFilterState(searchOptions);
      });

      it('should invoke `createHref` on `history`', () => {
        expect(props.history.createHref).toHaveBeenCalledWith({
          pathname: props.location.pathname,
          search: expect.any(String),
        });
      });
    });

    describe('with `onChange`', () => {
      beforeEach(() => {
        props = createTestProps({ onChange: jest.fn() });
        wrapper = shallow(<SearchViewRouterContainer {...props} />);
        wrapper.instance().handleSetSearchFilterState(searchOptions);
      });

      it('should invoke `onChange` with `searchOptions`', () => {
        expect(props.onChange).toHaveBeenCalledWith(searchOptions);
      });
    });
  });

  describe('`restoreSearchOptions`', () => {
    let restoredSearchQuery;

    describe('with `storageSlice`', () => {
      beforeEach(() => {
        reportErrorToSentry.mockClear();

        window.localStorage.getItem.mockImplementation(() =>
          encode({ foo: 'bar', [VERSION_KEY]: version })
        );
        props = createTestProps({
          storageSlice: 'foo-slice',
          render: jest.fn(),
        });
        wrapper = shallow(<SearchViewRouterContainer {...props} />);
      });

      describe('when storage contains valid JSON', () => {
        beforeEach(() => {
          restoredSearchQuery = wrapper.instance().restoreSearchOptions();
        });

        it('should invoke `get` on `storage`', () => {
          expect(window.localStorage.getItem).toHaveBeenCalled();
        });

        it('should invoke `get` on `storage` with the `storageSlice`', () => {
          expect(window.localStorage.getItem).toHaveBeenCalledWith(
            props.storageSlice
          );
        });

        it('should return the `searchQuery`', () => {
          expect(restoredSearchQuery).toEqual({ foo: 'bar' });
        });
      });

      describe('when storage contains invalid JSON', () => {
        beforeEach(() => {
          window.localStorage.getItem.mockImplementation(() => '#2@---');

          restoredSearchQuery = wrapper.instance().restoreSearchOptions();
        });

        it('should invoke `get` on `storage` with the `storageSlice`', () => {
          expect(window.localStorage.getItem).toHaveBeenCalledWith(
            props.storageSlice
          );
        });

        it('should invoke `remove` on `storage`', () => {
          expect(window.localStorage.removeItem).toHaveBeenCalled();
        });

        it('should invoke `remove` on `storage` with the `storageSlice`', () => {
          expect(window.localStorage.removeItem).toHaveBeenCalledWith(
            props.storageSlice
          );
        });

        it('should return `null` as the `searchQuery`', () => {
          expect(restoredSearchQuery).toBeNull();
        });

        it('should invoke `reportErrorToSentry`', () => {
          expect(reportErrorToSentry).toHaveBeenCalled();
        });
      });

      describe('when storage contains outdated version', () => {
        beforeEach(() => {
          window.localStorage.getItem.mockImplementation(() =>
            encode({ foo: 'bar', [VERSION_KEY]: 3 })
          );

          restoredSearchQuery = wrapper.instance().restoreSearchOptions();
        });

        it('should invoke `get` on `storage` with the `storageSlice`', () => {
          expect(window.localStorage.getItem).toHaveBeenCalledWith(
            props.storageSlice
          );
        });

        it('should invoke `remove` on `storage`', () => {
          expect(window.localStorage.removeItem).toHaveBeenCalled();
        });

        it('should invoke `remove` on `storage` with the `storageSlice`', () => {
          expect(window.localStorage.removeItem).toHaveBeenCalledWith(
            props.storageSlice
          );
        });

        it('should return `null` as the `searchQuery`', () => {
          expect(restoredSearchQuery).toBeNull();
        });

        it('should not invoke `reportErrorToSentry`', () => {
          expect(reportErrorToSentry).not.toHaveBeenCalled();
        });
      });
    });

    describe('without `storageSlice`', () => {
      beforeEach(() => {
        wrapper = shallow(
          <SearchViewRouterContainer
            {...createTestProps({
              render: jest.fn(),
            })}
          />
        );
      });

      it('should return `null`', () => {
        expect(wrapper.instance().restoreSearchOptions()).toBeNull();
      });
    });
  });
});
