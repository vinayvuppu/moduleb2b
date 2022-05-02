import {
  INITIALIZE_SEARCH_SLICE,
  SET_SEARCH_FILTER_STATE,
  SET_SEARCH_FILTER_RESULT,
  REMOVE_ENTITY_BY_ID_FROM_SEARCH_RESULTS,
} from '../../constants';
import reducer, {
  selectIsSearchSliceInitialized,
  selectSearchFilters,
  selectSearchResults,
  selectSearchTotal,
  selectSearchCount,
} from './search';

function createInitialSliceState(props) {
  return {
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
    ...props,
  };
}
const sliceName = 'my-slice-name';

describe('reducing actions', () => {
  it('should return the initial state', () => {
    const actualState = reducer(undefined, {});
    expect(actualState).toEqual({});
  });

  describe('INITIALIZE_SEARCH_SLICE', () => {
    let initialState;

    beforeEach(() => {
      initialState = createInitialSliceState();
    });

    describe('without initial slice state', () => {
      it('should initialize search slice', () => {
        const actualState = reducer(
          {},
          {
            type: INITIALIZE_SEARCH_SLICE,
            payload: {},
            meta: { searchSliceName: sliceName },
          }
        );
        expect(actualState).toEqual(
          expect.objectContaining({
            'my-slice-name': initialState,
          })
        );
      });
    });

    describe('with initial slice state', () => {
      it('should initialize search slice with state', () => {
        const actualState = reducer(
          {},
          {
            type: INITIALIZE_SEARCH_SLICE,
            payload: { initial: 'state' },
            meta: { searchSliceName: sliceName },
          }
        );

        expect(actualState).toEqual(
          expect.objectContaining({
            'my-slice-name': {
              ...initialState,
              initial: 'state',
            },
          })
        );
      });
    });
  });

  describe('SET_SEARCH_FILTER_STATE', () => {
    it('should update search filters for slice', () => {
      const payload = {
        searchText: 'foo',
        sorting: { key: 'lastModifiedAt', order: 'asc' },
        filters: { foo: 'bar' },
        page: 2,
        perPage: 10,
      };

      const initialState = { [sliceName]: createInitialSliceState() };
      const actualState = reducer(initialState, {
        type: SET_SEARCH_FILTER_STATE,
        payload,
        meta: { searchSliceName: sliceName },
      });
      expect(actualState).toEqual(
        expect.objectContaining({
          [sliceName]: expect.objectContaining(payload),
        })
      );
    });
  });

  describe('SET_SEARCH_FILTER_RESULT', () => {
    it('should update search results for slice', () => {
      const payload = {
        count: 8,
        total: 20,
        results: [{ id: '1' }],
      };

      const initialState = { [sliceName]: createInitialSliceState() };
      const actualState = reducer(initialState, {
        type: SET_SEARCH_FILTER_RESULT,
        payload,
        meta: { searchSliceName: sliceName },
      });
      expect(actualState).toEqual(
        expect.objectContaining({
          [sliceName]: expect.objectContaining(payload),
        })
      );
    });
  });

  describe('REMOVE_ENTITY_BY_ID_FROM_SEARCH_RESULTS', () => {
    describe('when the search slice does not exist', () => {
      it('should not modify the state', () => {
        const initialState = { foo: 'bar' };
        const actualState = reducer(initialState, {
          type: REMOVE_ENTITY_BY_ID_FROM_SEARCH_RESULTS,
          payload: '1',
          meta: { searchSliceName: sliceName },
        });
        expect(actualState).toEqual(initialState);
      });
    });

    describe('when the search slice exists', () => {
      describe('when the results are normalized', () => {
        it('should remove entity if search slice exists', () => {
          const initialState = {
            [sliceName]: {
              ...createInitialSliceState(),
              count: 2,
              total: 2,
              results: ['1', '2'],
            },
          };
          const actualState = reducer(initialState, {
            type: REMOVE_ENTITY_BY_ID_FROM_SEARCH_RESULTS,
            payload: '1',
            meta: { searchSliceName: sliceName },
          });
          expect(actualState).toEqual(
            expect.objectContaining({
              [sliceName]: expect.objectContaining({
                count: 1,
                total: 1,
                results: ['2'],
              }),
            })
          );
        });
      });
      describe('when the results are from API response', () => {
        it('should remove entity if search slice exists', () => {
          const initialState = {
            [sliceName]: {
              ...createInitialSliceState(),
              count: 2,
              total: 2,
              results: [{ id: '1' }, { id: '2' }],
            },
          };
          const actualState = reducer(initialState, {
            type: REMOVE_ENTITY_BY_ID_FROM_SEARCH_RESULTS,
            payload: '1',
            meta: { searchSliceName: sliceName },
          });
          expect(actualState).toEqual(
            expect.objectContaining({
              [sliceName]: expect.objectContaining({
                count: 1,
                total: 1,
                results: [{ id: '2' }],
              }),
            })
          );
        });
      });
    });
  });
});

describe('selectors', () => {
  describe('selectIsSearchSliceInitialized', () => {
    it('is not initialized', () => {
      expect(selectIsSearchSliceInitialized({ search: {} }, sliceName)).toEqual(
        false
      );
    });
    it('is initialized', () => {
      expect(
        selectIsSearchSliceInitialized(
          { search: { [sliceName]: {} } },
          sliceName
        )
      ).toEqual(true);
    });
  });
  describe('selectSearchFilters', () => {
    it('is not initialized', () => {
      expect(selectSearchFilters.resultFunc()).toEqual({
        filters: {},
        page: 1,
        perPage: 20,
        searchText: null,
        sorting: {
          key: 'createdAt',
          order: 'desc',
        },
      });
    });
    it('is initialized', () => {
      const updatedState = {
        searchText: 'foo',
        sorting: { key: 'lastModifiedAt', order: 'asc' },
        filters: { foo: 'bar' },
        page: 2,
        perPage: 10,
      };
      const state = createInitialSliceState(updatedState);
      expect(selectSearchFilters.resultFunc(state)).toEqual(updatedState);
    });
  });
  describe('selectSearchResults', () => {
    it('is not initialized', () => {
      expect(selectSearchResults.resultFunc()).toEqual([]);
    });
    it('is initialized', () => {
      const updatedState = {
        results: [{ id: '1' }],
      };
      const state = createInitialSliceState(updatedState);
      expect(selectSearchResults.resultFunc(state)).toEqual([{ id: '1' }]);
    });
  });
  describe('selectSearchTotal', () => {
    it('is not initialized', () => {
      expect(selectSearchTotal.resultFunc()).toEqual(0);
    });
    it('selectSearchTotal', () => {
      const updatedState = {
        total: 5,
      };
      const state = createInitialSliceState(updatedState);
      expect(selectSearchTotal.resultFunc(state)).toEqual(5);
    });
  });
  describe('selectSearchCount', () => {
    it('is not initialized', () => {
      expect(selectSearchCount.resultFunc()).toEqual(0);
    });
    it('selectSearchCount', () => {
      const updatedState = {
        count: 2,
      };
      const state = createInitialSliceState(updatedState);
      expect(selectSearchCount.resultFunc(state)).toEqual(2);
    });
  });
});
