import gql from 'graphql-tag';
import withDereferencedResource from '../with-dereferenced-resource';

export const resourceName = 'customer-group';

export const fragmentSearchItem = gql`
  fragment CustomerGroupQueryFragment on CustomerGroup {
    id
    name
    key
  }
`;

export const fragmentSearchResult = gql`
  fragment CustomerGroupQueryResultsFragment on CustomerGroupQueryResult {
    results {
      ...CustomerGroupQueryFragment
    }
  }
  ${fragmentSearchItem}
`;

export const searchQuery = gql`
  query MC500CustomerGroups($limit: Int!, $sort: [String!]) {
    items: customerGroups(limit: $limit, sort: $sort) {
      ...CustomerGroupQueryResultsFragment
    }
  }
  ${fragmentSearchResult}
`;

export const getSearchVariables = (/* searchText, language */) => ({
  limit: 500, // The max API limit for one request
  // Alternatively we can sort by `name.<locale> asc` but if some
  // locales are missing, the first results will contain `null`
  // because of the sorting.
  sort: ['key asc'],
});

export const dereferenceQuery = gql`
  query MCCustomerGroupDereference($where: String!) {
    items: customerGroups(where: $where) {
      ...CustomerGroupQueryResultsFragment
    }
  }
  ${fragmentSearchResult}
`;

export const getDereferenceVariables = (value, isMulti) => {
  const ids = isMulti ? value.map(id => `"${id}"`) : [`"${value}"`];
  return {
    where: `id in (${ids.join(',')})`,
  };
};

export default function withDereferencedCustomerGroup({ isMulti }) {
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
    })(Component);
}
