import gql from 'graphql-tag';
import withDereferencedResource from '../with-dereferenced-resource';

export const resourceName = 'store';

export const fragmentSearchItem = gql`
  fragment StoreQueryFragment on Store {
    key
    nameAllLocales {
      locale
      value
    }
  }
`;

export const fragmentSearchResult = gql`
  fragment StoreQueryResultsFragment on StoreQueryResult {
    results {
      ...StoreQueryFragment
    }
  }
  ${fragmentSearchItem}
`;

export const searchQuery = gql`
  query MC500Stores($limit: Int!, $sort: [String!], $where: String) {
    items: stores(limit: $limit, sort: $sort, where: $where) {
      ...StoreQueryResultsFragment
    }
  }
  ${fragmentSearchResult}
`;

export const createGetSearchVariables = dataFenceStores => () => ({
  limit: 500, // The max API limit for one request
  // Alternatively we can sort by `name.<locale> asc` but if some
  // locales are missing, the first results will contain `null`
  // because of the sorting.
  sort: ['key asc'],
  ...(Boolean(dataFenceStores) && {
    where: `key in (${dataFenceStores.map(store => `"${store}"`).join(', ')})`,
  }),
});

export const dereferenceQuery = gql`
  query MCStoreDereference($where: String!) {
    items: stores(where: $where) {
      ...StoreQueryResultsFragment
    }
  }
  ${fragmentSearchResult}
`;

export const getDereferenceVariables = (value, isMulti) => {
  const ids = isMulti ? value.map(id => `"${id}"`) : [`"${value}"`];
  return {
    where: `key in (${ids.join(',')})`,
  };
};

export default function withDereferencedStore({ isMulti, dataFenceStores }) {
  return Component =>
    withDereferencedResource({
      resourceName,
      fragmentSearchItem,
      fragmentSearchResult,
      searchQuery,
      getSearchVariables: createGetSearchVariables(dataFenceStores),
      dereferenceQuery,
      getDereferenceVariables,
      isMulti,
      cachePrefix: 'Store',
    })(Component);
}
