import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { compose, withProps } from 'recompose';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import createFormattedReferenceFilter from '../formatted-reference-filter';
import withDereferencedProductType from '../with-dereferenced-product-type';
import messages from './messages';

export const filterOption = (option, filter) =>
  option.data.label.toLowerCase().includes(filter) ||
  option.data.key.toLowerCase().includes(filter);

export const mapItemToOption = productType => ({
  value: productType.id,
  label: productType.name || productType.key || NO_VALUE_FALLBACK,
  // Extra prop, used for filtering
  key: productType.key || NO_VALUE_FALLBACK,
});

export const renderItem = productType => (
  <div>
    <strong>{productType.name || NO_VALUE_FALLBACK}</strong>
    <div>
      <FormattedMessage {...messages.key} />
      {`: ${productType.key || NO_VALUE_FALLBACK}`}
    </div>
  </div>
);
renderItem.displayName = 'Item';

export default function createProductTypeReferenceSingleFilter({
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
    withDereferencedProductType({ isMulti }),
    withProps(props => ({
      renderItem,
      mapItemToOption,
      filterOption,
      placeholderLabel: props.intl.formatMessage(messages.placeholder),
      searchPromptLabel: props.intl.formatMessage(messages.searchPrompt),
    }))
  )(FormattedReferenceFilter);
}
