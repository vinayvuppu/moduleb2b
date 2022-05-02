import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { compose, withProps } from 'recompose';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import createFormattedReferenceFilter from '../formatted-reference-filter';
import withDereferencedCategory from '../with-dereferenced-category';
import messages from './messages';

export const mapItemToOption = category => ({
  value: category.id,
  label:
    category.name || category.slug || category.externalId || NO_VALUE_FALLBACK,
});

export const renderItem = category => (
  <div>
    <strong>{category.name || NO_VALUE_FALLBACK}</strong>
    {category.parent ? (
      <div>
        <FormattedMessage {...messages.parentCategory} />
        {`: ${category.parent.name || NO_VALUE_FALLBACK}`}
      </div>
    ) : null}
    <div>
      <FormattedMessage {...messages.slug} />
      {`: ${category.slug || NO_VALUE_FALLBACK}`}
    </div>
    {category.externalId ? (
      <div>
        <FormattedMessage {...messages.externalId} />
        {`: ${category.externalId || NO_VALUE_FALLBACK}`}
      </div>
    ) : null}
  </div>
);
renderItem.displayName = 'Item';

export default function createCategoryReferenceSingleFilter({
  isMulti = false,
  className,
}) {
  const FormattedReferenceFilter = createFormattedReferenceFilter({
    isMulti,
    className,
    arrowRenderer: () => null, // Stop arrow from rendering
    autoload: true,
  });

  return compose(
    injectIntl,
    withDereferencedCategory({ isMulti }),
    withProps(props => ({
      renderItem,
      mapItemToOption,
      filterOption: () => true,
      placeholderLabel: props.intl.formatMessage(messages.placeholder),
      searchPromptLabel: props.intl.formatMessage(messages.searchPrompt),
    }))
  )(FormattedReferenceFilter);
}
