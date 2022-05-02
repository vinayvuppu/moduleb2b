import {
  INITIALIZE_SEARCH_SLICE,
  SET_SEARCH_FILTER_STATE,
  SET_SEARCH_FILTER_RESULT,
  REMOVE_ENTITY_BY_ID_FROM_SEARCH_RESULTS,
} from '../../constants';
import {
  initializeSearchSlice,
  setSearchFiltersState,
  removeEntityByIdFromResults,
  createSearchCategories,
  trackSearchCategories,
  createSearchFilterSortingTransformation,
} from './search';

describe('initializeSearchSlice', () => {
  it('should return `INITIALIZE_SEARCH_SLICE` action', () => {
    expect(initializeSearchSlice({ state: 'foo' }, 'my-slice-name')).toEqual({
      type: INITIALIZE_SEARCH_SLICE,
      payload: expect.any(Object),
      meta: expect.any(Object),
    });
  });

  it('should return `meta` with passed `searchSliceName`', () => {
    expect(initializeSearchSlice({ state: 'foo' }, 'my-slice-name')).toEqual({
      type: expect.any(String),
      payload: expect.any(Object),
      meta: { searchSliceName: 'my-slice-name' },
    });
  });

  it('should return passed `initialSliceState` as `payload`', () => {
    expect(initializeSearchSlice({ state: 'foo' }, 'my-slice-name')).toEqual({
      type: expect.any(String),
      payload: { state: 'foo' },
      meta: expect.any(Object),
    });
  });
});

describe('setSearchFiltersState', () => {
  it('should return `SET_SEARCH_FILTER_STATE` action', () => {
    expect(setSearchFiltersState({ page: 1 }, 'my-slice-name')).toEqual({
      type: SET_SEARCH_FILTER_STATE,
      payload: expect.any(Object),
      meta: expect.any(Object),
    });
  });

  it('should return passed filter state as `payload`', () => {
    expect(setSearchFiltersState({ page: 1 }, 'my-slice-name')).toEqual({
      type: expect.any(String),
      payload: { page: 1 },
      meta: expect.any(Object),
    });
  });

  it('should return `meta` with passed `searchSliceName`', () => {
    expect(setSearchFiltersState({ page: 1 }, 'my-slice-name')).toEqual({
      type: expect.any(String),
      payload: expect.any(Object),
      meta: { searchSliceName: 'my-slice-name' },
    });
  });
});

describe('removeEntityByIdFromResults', () => {
  it('should return `REMOVE_ENTITY_BY_ID_FROM_SEARCH_RESULTS` action', () => {
    expect(removeEntityByIdFromResults('123', 'my-slice-name')).toEqual({
      type: REMOVE_ENTITY_BY_ID_FROM_SEARCH_RESULTS,
      payload: '123',
      meta: { searchSliceName: 'my-slice-name' },
    });
  });
});

describe('searchCategories', () => {
  let client;
  let searchCategories;
  let dispatch;
  const mockedResponseBody = {
    data: {
      categories: {
        results: [
          {
            id: '1',
            nameAllLocales: [
              {
                locale: 'en',
                value: 'Hi',
              },
              {
                locale: 'de',
                value: 'Hallo',
              },
            ],
            ancestors: [
              {
                id: '2',
                nameAllLocales: [
                  {
                    value: 'Sale',
                    locale: 'en',
                  },
                ],
              },
            ],
          },
        ],
        count: 1,
        total: 100,
      },
    },
  };

  beforeEach(async () => {
    dispatch = jest.fn();
    client = { query: jest.fn(() => Promise.resolve(mockedResponseBody)) };
    searchCategories = createSearchCategories({
      filterConfig: {
        missingExternalId: {
          key: 'externalId',
          transform: () => 'externalId:missing',
        },
      },
      searchSliceName: 'my-slice-name',
    });
    await searchCategories(client, {
      searchText: null,
      sorting: { key: 'createdAt', order: 'desc' },
      filters: { missingExternalId: [{ type: 'missing', value: null }] },
      perPage: 20,
      page: 1,
    })(dispatch);
  });

  it('should query the graphql client', () => {
    expect(client.query).toHaveBeenCalled();
  });

  it('should resolve to a `SET_SEARCH_FILTER_RESULT` action', () => {
    expect(dispatch).toHaveBeenCalledWith({
      type: SET_SEARCH_FILTER_RESULT,
      payload: expect.any(Object),
      meta: expect.any(Object),
    });
  });

  it('should resolve with meta containing the `searchSliceName`', () => {
    expect(dispatch).toHaveBeenCalledWith({
      type: expect.any(String),
      payload: expect.any(Object),
      meta: { searchSliceName: 'my-slice-name' },
    });
  });

  it('should resolve a payload with results', () => {
    expect(dispatch).toHaveBeenCalledWith({
      type: SET_SEARCH_FILTER_RESULT,
      payload: {
        results: [
          {
            id: '1',
            name: { en: 'Hi', de: 'Hallo' },
            ancestors: [
              {
                id: '2',
                name: { en: 'Sale' },
              },
            ],
          },
        ],
        count: 1,
        total: 100,
      },
      meta: expect.any(Object),
    });
  });

  describe('graphql query', () => {
    describe('with `createdAt` sorting', () => {
      it('should sort by createdAt in descending order', () => {
        expect(client.query).toHaveBeenCalledWith(
          expect.objectContaining({
            variables: expect.objectContaining({
              sorts: ['createdAt desc'],
            }),
          })
        );
      });
    });
    describe('with `relevance` sorting', () => {
      beforeEach(() => {
        dispatch = jest.fn();
        client = { query: jest.fn(() => Promise.resolve(mockedResponseBody)) };
        searchCategories = createSearchCategories({
          filterConfig: {
            missingExternalId: {
              key: 'externalId',
              transform: () => 'externalId:missing',
            },
          },
          searchSliceName: 'my-slice-name',
        });
        searchCategories(client, {
          searchText: 'search text',
          sorting: { key: 'relevance', order: 'desc' },
          filters: {},
          perPage: 20,
          page: 1,
        })(dispatch);
      });
      it('should omit not set any sorting', () => {
        expect(client.query).not.toHaveBeenCalledWith(
          expect.objectContaining({
            variables: expect.objectContaining({
              sorts: expect.any(String),
            }),
          })
        );
      });
    });
    describe('with search term', () => {
      beforeEach(() => {
        dispatch = jest.fn();
        client = { query: jest.fn(() => Promise.resolve(mockedResponseBody)) };
        searchCategories = createSearchCategories({
          searchSliceName: 'my-slice-name',
        });
        searchCategories(client, {
          searchText: 'search term',
          language: 'en',
          sorting: { key: 'relevance', order: 'desc' },
          filters: {},
          perPage: 20,
          page: 1,
        })(dispatch);
      });
      it('should call `client.query`', () => {
        expect(client.query).toHaveBeenCalledTimes(1);
      });
      it('should call `client.query` with fullText and locale', () => {
        expect(client.query).toHaveBeenCalledWith(
          expect.objectContaining({
            variables: expect.objectContaining({
              fullText: {
                text: 'search term',
                locale: 'en',
              },
            }),
          })
        );
      });
    });

    describe('without search term', () => {
      beforeEach(() => {
        dispatch = jest.fn();
        client = { query: jest.fn(() => Promise.resolve(mockedResponseBody)) };
        searchCategories = createSearchCategories({
          searchSliceName: 'my-slice-name',
        });
        searchCategories(client, {
          sorting: { key: 'relevance', order: 'desc' },
          filters: {},
          perPage: 20,
          page: 1,
        })(dispatch);
      });
      it('should call `client.query`', () => {
        expect(client.query).toHaveBeenCalledTimes(1);
      });
      it('should call `client.query` without fullText and locale', () => {
        expect(client.query).not.toHaveBeenCalledWith(
          expect.objectContaining({
            variables: expect.objectContaining({
              fullText: {
                text: 'search term',
                locale: 'en',
              },
            }),
          })
        );
      });
    });
  });
});

describe('trackSearchCategories', () => {
  describe('with filters', () => {
    const track = jest.fn();
    const trackingPrefix = 'foo-prefix';
    const filters = {
      createdAt: {},
      modifiedAt: {},
      missingName: {},
    };

    beforeEach(() => {
      trackSearchCategories(trackingPrefix, filters, track);
    });

    it('should invoke `track` for each filter key', () => {
      expect(track).toHaveBeenCalledWith(
        expect.any(String),
        undefined,
        'foo-prefix-createdAt',
        expect.any(Object)
      );
      expect(track).toHaveBeenCalledWith(
        expect.any(String),
        undefined,
        'foo-prefix-modifiedAt',
        expect.any(Object)
      );
      expect(track).toHaveBeenCalledWith(
        expect.any(String),
        undefined,
        'foo-prefix-missingName',
        expect.any(Object)
      );
    });

    it('should invoke `track` with a sorted combination of all filter keys', () => {
      expect(track).toHaveBeenCalledWith(
        expect.any(String),
        undefined,
        'foo-prefix-createdAt-missingName-modifiedAt',
        expect.any(Object)
      );
    });

    it('should invoke `track` as `click` event', () => {
      expect(track).toHaveBeenCalledWith(
        'click',
        undefined,
        expect.any(String),
        expect.any(Object)
      );
    });

    it('should invoke `track` with `force` option', () => {
      expect(track).toHaveBeenCalledWith(
        expect.any(String),
        undefined,
        expect.any(String),
        { force: true }
      );
    });
  });

  describe('without filters', () => {
    const track = jest.fn();
    const trackingPrefix = 'foo-prefix';
    const filters = {};

    beforeEach(() => {
      trackSearchCategories(trackingPrefix, filters, track);
    });

    it('should not invoke `track`', () => {
      expect(track).not.toHaveBeenCalled();
    });
  });
});

describe('createSearchFilterSortingTransformation', () => {
  const initialFilterState = {
    searchText: 'foo',
  };
  const defaultSorting = {
    key: 'createdAt',
    order: 'desc',
  };

  let transform;

  beforeEach(() => {
    transform = createSearchFilterSortingTransformation(defaultSorting);
  });

  describe('with `searchText` in change scope and `searchText` specified', () => {
    let actual;
    beforeEach(() => {
      actual = transform(
        {
          ...initialFilterState,
          sorting: defaultSorting,
        },
        ['searchText']
      );
    });

    it('should overwrite the `sorting` to `relevance`', () => {
      expect(actual).toEqual({
        ...initialFilterState,
        sorting: { key: 'relevance', order: 'desc' },
      });
    });
  });

  describe('without `searchText` and `relevance` sorting enabled', () => {
    let actual;
    beforeEach(() => {
      actual = transform(
        {
          searchText: '',
          sorting: { key: 'relevance' },
        },
        ['sorting']
      );
    });

    it('should reset to the default sorting', () => {
      expect(actual).toEqual({
        searchText: '',
        sorting: defaultSorting,
      });
    });
  });

  describe('without `searchText` in change scope', () => {
    let actual;
    beforeEach(() => {
      actual = transform(
        {
          ...initialFilterState,
          sorting: defaultSorting,
        },
        ['sorting']
      );
    });

    it('should not overwrite filter state', () => {
      expect(actual).toEqual({
        ...initialFilterState,
        sorting: defaultSorting,
      });
    });
  });
});
