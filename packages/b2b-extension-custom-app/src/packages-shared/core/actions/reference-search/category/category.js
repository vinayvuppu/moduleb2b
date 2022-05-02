import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import { transformLocalizedFieldsForCategory } from '@commercetools-local/utils/graphql';
import { SearchCategoryReference, FetchCategoryById } from './category.graphql';

export function searchCategories(apolloClient, options) {
  return apolloClient
    .query({
      query: SearchCategoryReference,
      variables: {
        target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
        locale: options.language,
        text: options.searchText,
      },
    })
    .then(response =>
      response.data.categories.results
        .map(category =>
          transformLocalizedFieldsForCategory(category, [
            { from: 'nameAllLocales', to: 'name' },
            { from: 'slugAllLocales', to: 'slug' },
          ])
        )
        .map(category => category)
    );
}

export function getCategoryById(apolloClient, options) {
  return apolloClient
    .query({
      query: FetchCategoryById,
      variables: {
        categoryId: options.categoryId,
        target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
      },
    })
    .then(response =>
      response.data.category
        ? transformLocalizedFieldsForCategory(response.data.category, [
            { from: 'nameAllLocales', to: 'name' },
            { from: 'slugAllLocales', to: 'slug' },
          ])
        : null
    );
}
