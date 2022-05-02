import React from 'react';
import { defineMessages } from 'react-intl';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import localize from '@commercetools-local/utils/localize';
import {
  searchCategories,
  getCategoryById,
} from '../../../../actions/reference-search/category';

const messages = defineMessages({
  placeholder: {
    id: 'CategoryReferenceSearch.placeholder',
    description: 'Placeholder for search for a category',
    defaultMessage: 'Search by name, external ID, or slug.',
  },
  isMissing: {
    id: 'CategoryReferenceSearch.isMissing',
    description: 'Label above the field for deleted reference of a category',
    defaultMessage: 'This Category has been deleted.',
  },
  noResults: {
    id: 'CategoryReferenceSearch.noResults',
    description: 'Message for no results found for category reference',
    defaultMessage:
      'Sorry, but there are no categories that match your search.',
  },
  searchPrompt: {
    id: 'CategoryReferenceSearch.searchPrompt',
    description: 'Message for search prompt for category reference',
    defaultMessage: 'Enter search term',
  },
  externalId: {
    id: 'CategoryReferenceSearch.externalId',
    description: 'external id label',
    defaultMessage: 'External ID',
  },
  parentCategory: {
    id: 'CategoryReferenceSearch.parentCategory',
    description: 'parent category label',
    defaultMessage: 'Parent Category',
  },
});

/* eslint-disable react/display-name */
export const createConfig = ({ search, getById }) => ({
  type: 'category',
  loadItems: (text, language, apolloClient) =>
    search(apolloClient, {
      searchText: text,
      language,
    }),
  getItemById: (id, apolloClient) => getById(apolloClient, { categoryId: id }),
  mapItemToOption: (category, { language, languages }) => ({
    value: category.id,
    label: localize({
      obj: category,
      key: 'name',
      language,
      fallback: category.id,
      fallbackOrder: languages,
    }),
  }),
  renderItem: (category, { language, formatMessage, languages }) => (
    <div>
      <strong>
        {localize({
          obj: category,
          key: 'name',
          language,
          fallbackOrder: languages,
        })}
      </strong>
      {category.parent && category.parent ? (
        <div>
          {`${formatMessage(messages.parentCategory)}: `}
          {localize({
            obj: category.parent,
            key: 'name',
            language,
            fallbackOrder: languages,
          })}
        </div>
      ) : null}
      <div>
        {'Slug: '}
        {localize({
          obj: category,
          key: 'slug',
          language,
          fallbackOrder: languages,
        })}
      </div>
      {category.externalId && (
        <div>
          {`${formatMessage(messages.externalId)}: `}
          {category.externalId || NO_VALUE_FALLBACK}
        </div>
      )}
    </div>
  ),
  labels: messages,
  filterOption: () => true,
});

export default createConfig({
  search: searchCategories,
  getById: getCategoryById,
});
