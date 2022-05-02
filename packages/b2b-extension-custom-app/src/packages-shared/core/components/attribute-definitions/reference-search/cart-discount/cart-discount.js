import React from 'react';
import { defineMessages } from 'react-intl';
import { Text } from '@commercetools-frontend/ui-kit';
import localize from '@commercetools-local/utils/localize';
import {
  searchCartDiscounts,
  getCartDiscountById,
} from '../../../../actions/reference-search/cart-discount';

const messages = defineMessages({
  placeholder: {
    id: 'CartDiscountReferenceSearch.placeholder',
    description: 'Placeholder for search for a cart discount',
    defaultMessage: 'Search by name',
  },
  isMissing: {
    id: 'CartDiscountReferenceSearch.isMissing',
    description:
      'Label above the field for deleted reference of a cart discount',
    defaultMessage: 'This Cart Discount has been deleted.',
  },
  noResults: {
    id: 'CartDiscountReferenceSearch.noResults',
    description: 'Message for no results found for cart discount reference',
    defaultMessage:
      'Sorry, but there are no cart discounts that match your search.',
  },
  searchPrompt: {
    id: 'CartDiscountReferenceSearch.searchPrompt',
    description: 'Message for search prompt for cart discount reference',
    defaultMessage: 'Enter search term',
  },
});

/* eslint-disable react/display-name */
export const createConfig = ({ search, getById }) => ({
  type: 'cart-discount',
  loadItems: (text, language, apolloClient) => search(apolloClient),
  getItemById: (id, apolloClient) =>
    getById(apolloClient, { cartDiscountId: id }),
  mapItemToOption: (cartDiscount, { language, languages }) => ({
    value: cartDiscount.id,
    label: localize({
      obj: cartDiscount,
      key: 'name',
      language,
      fallbackOrder: languages,
    }),
  }),
  renderItem: (cartDiscount, { language, languages }) => (
    <Text.Detail data-testid="cart-discount-option">
      {localize({
        obj: cartDiscount,
        key: 'name',
        language,
        fallbackOrder: languages,
      })}
    </Text.Detail>
  ),
  labels: messages,
  filterOption: (option, text) =>
    option.label.toLocaleLowerCase().includes(text.toLowerCase()),
});

export default createConfig({
  search: searchCartDiscounts,
  getById: getCartDiscountById,
});
