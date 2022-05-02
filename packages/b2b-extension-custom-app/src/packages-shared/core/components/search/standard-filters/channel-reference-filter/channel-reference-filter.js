import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { compose, withProps } from 'recompose';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import createFormattedReferenceFilter from '../formatted-reference-filter';
import withDereferencedChannel from '../with-dereferenced-channel';
import messages from './messages';

export const mapItemToOption = channel => ({
  value: channel.id,
  label: channel.name || channel.key || NO_VALUE_FALLBACK,
  // Extra prop, used for filtering
  key: channel.key,
});

export const renderItem = channel => (
  <div>
    <strong>{channel.name || NO_VALUE_FALLBACK}</strong>
    <div>
      <FormattedMessage {...messages.key} />
      {`: ${channel.key}`}
    </div>
  </div>
);
renderItem.displayName = 'Item';

// NOTE: if performance is slow because of large list, consider looking into
// https://github.com/JedWatson/react-select#filtering-large-lists
export const filterOption = (option, filter) =>
  option.data.label.toLowerCase().includes(filter) ||
  option.data.key.toLowerCase().includes(filter);

export default function createChannelReferenceSingleFilter({
  isMulti = false,
  isClearable = false,
  className,
  roles = [],
}) {
  const FormattedReferenceFilter = createFormattedReferenceFilter({
    isMulti,
    className,
    autoload: true,
  });

  return compose(
    injectIntl,
    withDereferencedChannel({ isMulti, roles }),
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
