import {
  GRAPHQL_TARGETS,
  SHOW_LOADING,
  HIDE_LOADING,
} from '@commercetools-frontend/constants';
import { transformLocalizedFieldsForCategory } from '@commercetools-local/utils/graphql';
import graphqlQueryBuilder from '@commercetools-local/utils/filters/graphql';
import {
  INITIALIZE_SEARCH_SLICE,
  SET_SEARCH_FILTER_STATE,
  SET_SEARCH_FILTER_RESULT,
  REMOVE_ENTITY_BY_ID_FROM_SEARCH_RESULTS,
} from '../../constants';
import { CategorySearch } from './search.graphql';

export function initializeSearchSlice(initialSliceState, searchSliceName) {
  return {
    type: INITIALIZE_SEARCH_SLICE,
    payload: initialSliceState,
    meta: {
      searchSliceName,
    },
  };
}

export function setSearchFiltersState(searchFiltersState, searchSliceName) {
  return {
    type: SET_SEARCH_FILTER_STATE,
    payload: searchFiltersState,
    meta: {
      searchSliceName,
    },
  };
}

export function removeEntityByIdFromResults(id, searchSliceName) {
  return {
    type: REMOVE_ENTITY_BY_ID_FROM_SEARCH_RESULTS,
    payload: id,
    meta: {
      searchSliceName,
    },
  };
}

export function trackSearchCategories(prefix, filters, track = () => {}) {
  const sortedFilterKeys = Object.keys(filters).sort();
  const combinedFilterKeys = sortedFilterKeys.join('-');

  if (!sortedFilterKeys.length) return;

  // Track each fitler individually
  sortedFilterKeys.forEach(filterKey =>
    track('click', undefined, `${prefix}-${filterKey}`, { force: true })
  );
  // ...and track the sorted combination
  track('click', undefined, `${prefix}-${combinedFilterKeys}`, { force: true });
}

/**
 * Whenever the user specified a search text we suggest/enable relevance sorting
 * Whenever the user has no search text we move to default sorting again
 * Otherwise we allow custom sorting and filtering
 */
export const createSearchFilterSortingTransformation = defaultSorting => (
  filterState,
  changeScope
) => {
  if (changeScope.includes('searchText') && Boolean(filterState.searchText)) {
    return {
      ...filterState,
      sorting: {
        key: 'relevance',
        order: 'desc',
      },
    };
  }
  if (!filterState.searchText && filterState.sorting.key === 'relevance') {
    return {
      ...filterState,
      sorting: defaultSorting,
    };
  }

  return filterState;
};

// To use this action creator, you need to pass a configuration object
// describing the filters mapping to apply the transformation for GraphQL.
// See `core/utils/filters/README.md`
export function createSearchCategories({
  filterConfig,
  trackingPrefix,
  searchSliceName,
}) {
  const getSortDefinition = (language, { sorting }) => {
    switch (sorting.key) {
      case 'name':
        return `name.${language} ${sorting.order}`;
      case 'relevance':
        // The `SearchSort` will be overwritten
        // to be `undefined` and hence not passed as a variable for the
        // GraphQL request. This triggers the API to default to sort by
        // `relevance`.
        return undefined;
      default:
        return `${sorting.key} ${sorting.order}`;
    }
  };
  return function searchCategories(
    apolloClient,
    options = {},
    callback = () => {}
  ) {
    return dispatch => {
      const sortDefinition = getSortDefinition(options.language, options);

      trackSearchCategories(trackingPrefix, options.filters, options.track);
      dispatch({ type: SHOW_LOADING, payload: SET_SEARCH_FILTER_RESULT });
      return apolloClient
        .query({
          query: CategorySearch,
          variables: {
            target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
            sorts: sortDefinition ? [sortDefinition] : undefined,
            limit: options.perPage,
            offset: (options.page - 1) * options.perPage,
            ...(options.searchText
              ? {
                  fullText: {
                    text: options.searchText,
                    locale: options.language,
                  },
                }
              : {}),
            filters:
              Object.keys(options.filters).length > 0
                ? graphqlQueryBuilder({
                    config: filterConfig,
                    filters: options.filters,
                  })
                : [],
          },
          fetchPolicy: 'network-only',
        })
        .then(response => ({
          ...response.data.categories,
          results: response.data.categories.results.map(result =>
            transformLocalizedFieldsForCategory(result)
          ),
        }))
        .then(
          response => {
            // NOTE this part fakes resolveServicePromise, but the whole
            // SearchViewWithReduxState should function differently
            dispatch({
              type: HIDE_LOADING,
              payload: SET_SEARCH_FILTER_RESULT,
            });
            dispatch({
              type: SET_SEARCH_FILTER_RESULT,
              payload: response,
              meta: { searchSliceName },
            });
            callback(null, response);
          },
          error => {
            dispatch({
              type: HIDE_LOADING,
              payload: SET_SEARCH_FILTER_RESULT,
            });
            callback(error);
          }
        );
    };
  };
}
