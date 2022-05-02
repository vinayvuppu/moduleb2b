import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { compose, withProps, branch, renderComponent } from 'recompose';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import { TextSingleFilter } from '../text-filter';
import ReferenceFilterFallback from '../reference-filter-fallback';
import createFormattedReferenceFilter from '../formatted-reference-filter';
import withDereferencedCustomerGroup from '../with-dereferenced-customer-group';
import messages from './messages';

export const mapItemToOption = customerGroup => ({
  value: customerGroup.id,
  label: customerGroup.name || NO_VALUE_FALLBACK,
  // Extra prop, used for filtering
  key: customerGroup.key,
});

export const renderItem = customerGroup => (
  <div>
    <strong>{customerGroup.name || NO_VALUE_FALLBACK}</strong>
    <div>
      <FormattedMessage {...messages.key} />
      {`: ${customerGroup.key || NO_VALUE_FALLBACK}`}
    </div>
  </div>
);
renderItem.displayName = 'Item';

// NOTE: if performance is slow because of large list, consider looking into
// https://github.com/JedWatson/react-select#filtering-large-lists
export const filterOption = (option, filter) =>
  option.label.toLowerCase().includes(filter) ||
  (option.key ? option.key.toLowerCase().includes(filter) : false);

export default function createCustomerGroupReferenceSingleFilter({
  isMulti = false,
  isClearable = false,
  className,
}) {
  const FormattedReferenceFilter = createFormattedReferenceFilter({
    isMulti,
    className,
    autoload: true,
  });

  return compose(
    branch(
      ownProps => ownProps.disabled,
      renderComponent(isMulti ? ReferenceFilterFallback : TextSingleFilter)
    ),
    injectIntl,
    withDereferencedCustomerGroup({ isMulti }),
    withProps(props => ({
      renderItem,
      mapItemToOption,
      isClearable,
      filterOption,
      placeholderLabel: do {
        if (props.placeholder) {
          props.placeholder;
        } else if (isMulti) {
          props.intl.formatMessage(messages.placeholderMulti);
        } else props.intl.formatMessage(messages.placeholder);
      },
    }))
  )(FormattedReferenceFilter);
}
