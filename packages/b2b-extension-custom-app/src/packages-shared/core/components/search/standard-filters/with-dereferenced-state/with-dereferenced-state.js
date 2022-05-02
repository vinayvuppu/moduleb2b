import gql from 'graphql-tag';
import withDereferencedResource from '../with-dereferenced-resource';

export const resourceName = 'state';

export const fragmentSearchItem = gql`
  fragment OrderStateQueryFragment on State {
    id
    name(locale: $locale)
    key
  }
`;

export const fragmentSearchResult = gql`
  fragment OrderStateQueryResultsFragment on StateQueryResult {
    results {
      ...OrderStateQueryFragment
    }
  }
  ${fragmentSearchItem}
`;

export const searchQuery = gql`
  query MC500OrderStates(
    $limit: Int!
    $sort: [String!]
    $locale: Locale!
    $where: String!
  ) {
    items: states(limit: $limit, sort: $sort, where: $where) {
      ...OrderStateQueryResultsFragment
    }
  }
  ${fragmentSearchResult}
`;

export const getSearchVariables = (searchText, language, stateType) => ({
  limit: 500, // The max API limit for one request
  // Alternatively we can sort by `name.<locale> asc` but if some
  // locales are missing, the first results will contain `null`
  // because of the sorting.
  sort: ['key asc'],
  where: `type in ("${stateType}")`,
});

export const dereferenceQuery = gql`
  query MCOrderStateDereference($where: String!, $locale: Locale!) {
    items: states(where: $where) {
      ...OrderStateQueryResultsFragment
    }
  }
  ${fragmentSearchResult}
`;

export const getDereferenceVariables = (value, isMulti, stateType) => {
  const ids = isMulti ? value.map(id => `"${id}"`) : [`"${value}"`];
  return {
    where: `id in (${ids.join(',')}) and type in ("${stateType}")`,
  };
};

export default function withDereferencedOrderState({ isMulti, stateType }) {
  return Component =>
    withDereferencedResource({
      resourceName,
      fragmentSearchItem,
      fragmentSearchResult,
      searchQuery,
      getSearchVariables,
      dereferenceQuery,
      getDereferenceVariables,
      isMulti,
      stateType,
    })(Component);
}
