import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { compose, withProps } from 'recompose';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import { branchOnPermissions } from '@commercetools-frontend/permissions';
import { TextSingleFilter } from '../text-filter';
import ReferenceFilterFallback from '../reference-filter-fallback';
import createFormattedReferenceFilter from '../formatted-reference-filter';
import withDereferencedState from '../with-dereferenced-state';
import { permissions } from '../../../../constants';
import messages from './messages';

export const mapItemToOption = state => ({
  value: state.id,
  label: state.name || NO_VALUE_FALLBACK,
  // Extra prop, used for filtering
  key: state.key,
});

export const renderItem = state => (
  <div>
    <strong>{state.name || NO_VALUE_FALLBACK}</strong>
    <div>
      <FormattedMessage {...messages.key} />
      {`: ${state.key || NO_VALUE_FALLBACK}`}
    </div>
  </div>
);
renderItem.displayName = 'Item';

// NOTE: if performance is slow because of large list, consider looking into
// https://github.com/JedWatson/react-select#filtering-large-lists
export const filterOption = (option, filter) =>
  option.label.toLowerCase().includes(filter) ||
  (option.key ? option.key.toLowerCase().includes(filter) : false);

export default function createStateReferenceSingleFilter({
  isMulti = false,
  isClearable = false,
  className,
  stateType = 'OrderState',
}) {
  const FormattedReferenceFilter = createFormattedReferenceFilter({
    isMulti,
    className,
    autoload: true,
  });

  return compose(
    branchOnPermissions(
      [permissions.ViewStates],
      isMulti ? ReferenceFilterFallback : TextSingleFilter
    ),
    injectIntl,
    withDereferencedState({ isMulti, stateType }),
    withProps(props => ({
      renderItem,
      mapItemToOption,
      isClearable,
      filterOption,
      placeholderLabel: isMulti
        ? props.intl.formatMessage(messages.placeholderMulti)
        : props.intl.formatMessage(messages.placeholder),
    }))
  )(FormattedReferenceFilter);
}
