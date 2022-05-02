import gql from 'graphql-tag';
import withDereferencedResource from '../with-dereferenced-resource';

export const resourceName = 'productTypes';

export const fragmentSearchItem = gql`
  fragment ProductTypeFragment on ProductTypeDefinition {
    id
    name
    key
  }
`;

export const fragmentSearchResult = gql`
  fragment ProductTypeDefinitionQueryResultFragment on ProductTypeDefinitionQueryResult {
    results {
      ...ProductTypeFragment
    }
  }
  ${fragmentSearchItem}
`;

export const searchQuery = gql`
  query MCSearchProductType {
    items: productTypes {
      ...ProductTypeDefinitionQueryResultFragment
    }
  }
  ${fragmentSearchResult}
`;

export const getSearchVariables = () => ({});

export const dereferenceQuery = gql`
  query MCProductTypeDereference {
    items: products {
      ...ProductTypeDefinitionQueryResultFragment
    }
  }
  ${fragmentSearchResult}
`;

export const getDereferenceVariables = (value, isMulti) => {
  const ids = isMulti ? value.map(id => `"${id}"`) : [`"${value}"`];

  return `id in (${ids.join(',')})`;
};

export default function withDereferencedProductType({ isMulti }) {
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
