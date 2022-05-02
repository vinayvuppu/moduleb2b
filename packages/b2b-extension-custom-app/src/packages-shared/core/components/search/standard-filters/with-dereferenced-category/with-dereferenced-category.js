import gql from 'graphql-tag';
import withDereferencedResource from '../with-dereferenced-resource';

export const resourceName = 'category';

export const fragmentSearchItem = gql`
  fragment CategorySearchFragment on CategorySearch {
    id
    name(locale: $locale)
    slug(locale: $locale)
    externalId
    parent {
      name(locale: $locale)
    }
    ancestors {
      name(locale: $locale)
    }
  }
`;

export const fragmentSearchResult = gql`
  fragment CategorySearchResultsFragment on CategorySearchResult {
    results {
      ...CategorySearchFragment
    }
  }
  ${fragmentSearchItem}
`;

export const searchQuery = gql`
  query MCSearchCategory($searchText: LocalizedText, $locale: Locale!) {
    items: categorySearch(fulltext: $searchText) {
      ...CategorySearchResultsFragment
    }
  }
  ${fragmentSearchResult}
`;

export const getSearchVariables = (searchText, language) => ({
  searchText: {
    locale: language,
    text: searchText || '',
  },
});

export const dereferenceQuery = gql`
  query MCCategoryDereference($filters: [SearchFilter!], $locale: Locale!) {
    items: categorySearch(filters: $filters) {
      ...CategorySearchResultsFragment
    }
  }
  ${fragmentSearchResult}
`;

export const getDereferenceVariables = (value, isMulti) => {
  const ids = isMulti ? value.map(id => `"${id}"`) : [`"${value}"`];
  return {
    filters: [`id: ${ids.join(',')}`],
  };
};

export default function withDereferencedCategory({ isMulti }) {
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
