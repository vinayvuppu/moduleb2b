import { createSelector } from 'reselect';
import createReducer from '../../../utils/create-reducer';
import {
  INITIALIZE_SEARCH_SLICE,
  SET_SEARCH_FILTER_STATE,
  SET_SEARCH_FILTER_RESULT,
  REMOVE_ENTITY_BY_ID_FROM_SEARCH_RESULTS,
} from '../../constants';

const initialState = {
  searchText: null,
  sorting: {
    key: 'createdAt',
    order: 'desc',
  },
  filters: {},
  page: 1,
  perPage: 20,
};

const initialDataState = {
  results: [],
  total: 0,
  count: 0,
};

const actionHandlers = {
  [INITIALIZE_SEARCH_SLICE]: (state, { payload, meta }) => ({
    [meta.searchSliceName]: state[meta.searchSliceName] || {
      ...initialState,
      ...initialDataState,
      ...payload,
    },
  }),
  [SET_SEARCH_FILTER_STATE]: (state, { payload, meta }) => ({
    [meta.searchSliceName]: {
      ...state[meta.searchSliceName],
      searchText: payload.searchText,
      sorting: payload.sorting,
      filters: payload.filters,
      page: payload.page,
      perPage: payload.perPage,
    },
  }),
  [SET_SEARCH_FILTER_RESULT]: (state, { payload, meta }) => ({
    [meta.searchSliceName]: {
      ...state[meta.searchSliceName],
      count: payload.count,
      total: payload.total,
      results: payload.results,
      entities: payload.entities,
    },
  }),
  [REMOVE_ENTITY_BY_ID_FROM_SEARCH_RESULTS]: (state, { payload, meta }) => {
    if (!state[meta.searchSliceName]) return state;
    return {
      [meta.searchSliceName]: {
        ...state[meta.searchSliceName],
        count: state[meta.searchSliceName].count - 1,
        total: state[meta.searchSliceName].total - 1,
        results: state[meta.searchSliceName].results.filter(
          // Differentiate between "normalized" state (just a list of IDs) and
          // the API results (objects with `id`s).
          result =>
            typeof result === 'string'
              ? result !== payload
              : result.id !== payload
        ),
      },
    };
  },
};

export default createReducer({}, actionHandlers);

// Selectors

// Use: selectSearchSlice(state, sliceName)
function selectSearchSlice(state, sliceName) {
  return state.search[sliceName];
}

// Use: selectIsSearchSliceInitialized(state, sliceName)
export const selectIsSearchSliceInitialized = createSelector(
  selectSearchSlice,
  searchSlice => Boolean(searchSlice)
);

// Use: selectSearchFilters(state, sliceName)
export const selectSearchFilters = createSelector(
  selectSearchSlice,
  searchSlice =>
    searchSlice
      ? {
          searchText: searchSlice.searchText,
          sorting: searchSlice.sorting,
          filters: searchSlice.filters,
          page: searchSlice.page,
          perPage: searchSlice.perPage,
        }
      : initialState
);
// Use: selectSearchResults(state, sliceName)
export const selectSearchResults = createSelector(
  selectSearchSlice,
  searchSlice => (searchSlice ? searchSlice.results : initialDataState.results)
);
// Use: selectSearchTotal(state, sliceName)
export const selectSearchTotal = createSelector(
  selectSearchSlice,
  searchSlice => (searchSlice ? searchSlice.total : initialDataState.total)
);
// Use: selectSearchCount(state, sliceName)
export const selectSearchCount = createSelector(
  selectSearchSlice,
  searchSlice => (searchSlice ? searchSlice.count : initialDataState.count)
);
