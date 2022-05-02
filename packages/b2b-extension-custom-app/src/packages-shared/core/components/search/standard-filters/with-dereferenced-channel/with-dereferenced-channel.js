import gql from 'graphql-tag';
import withDereferencedResource from '../with-dereferenced-resource';

export const resourceName = 'channel';

export const fragmentSearchItem = gql`
  fragment ChannelQueryFragment on Channel {
    id
    name(locale: $locale)
    key
  }
`;

export const fragmentSearchResult = gql`
  fragment ChannelQueryResultsFragment on ChannelQueryResult {
    results {
      ...ChannelQueryFragment
    }
  }
  ${fragmentSearchItem}
`;

export const searchQuery = gql`
  query MC500Channels(
    $limit: Int!
    $sort: [String!]
    $locale: Locale!
    $where: String
  ) {
    items: channels(limit: $limit, sort: $sort, where: $where) {
      ...ChannelQueryResultsFragment
    }
  }
  ${fragmentSearchResult}
`;

export const getIdClause = (value, isMulti) => {
  const ids = isMulti ? value.map(id => `"${id}"`) : [`"${value}"`];

  return `id in (${ids.join(',')})`;
};
export const getRolesClause = roles =>
  roles.length > 0
    ? `roles contains any (${roles.map(role => `"${role}"`).join(',')})`
    : undefined;

export const createGetSearchVariables = ({
  roles,
}) => (/* searchText, language */) => ({
  limit: 500, // The max API limit for one request
  // Alternatively we can sort by `name.<locale> asc` but if some
  // locales are missing, the first results will contain `null`
  // because of the sorting.
  sort: ['key asc'],
  where: getRolesClause(roles),
});

export const dereferenceQuery = gql`
  query MCChannelDereference($where: String!, $locale: Locale!) {
    items: channels(where: $where) {
      ...ChannelQueryResultsFragment
    }
  }
  ${fragmentSearchResult}
`;

export const getDereferenceVariables = (value, isMulti) => ({
  where: getIdClause(value, isMulti),
});

export default function withDereferencedChannel({ isMulti, roles }) {
  return Component =>
    withDereferencedResource({
      resourceName,
      fragmentSearchItem,
      fragmentSearchResult,
      searchQuery,
      getSearchVariables: createGetSearchVariables({ roles }),
      dereferenceQuery,
      getDereferenceVariables,
      isMulti,
    })(Component);
}
