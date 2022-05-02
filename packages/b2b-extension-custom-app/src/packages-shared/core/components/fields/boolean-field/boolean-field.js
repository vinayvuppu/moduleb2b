import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { SelectInput } from '@commercetools-frontend/ui-kit';
import React from 'react';
import messages from './messages';

export const valueMapping = {
  yes: true,
  no: false,
  all: [true, false],
};

export const BooleanField = props => {
  let selectedValue;

  if (typeof props.value === 'boolean')
    selectedValue = getBooleanValue(props.value);
  else if (props.isMulti && Array.isArray(props.value) && props.value.length)
    selectedValue =
      props.value.length === 2 ? 'all' : getBooleanValue(props.value[0]);

  const yesLabel = props.intl.formatMessage(messages.yes);
  const noLabel = props.intl.formatMessage(messages.no);
  const options = [
    { value: 'yes', label: yesLabel },
    { value: 'no', label: noLabel },
  ];
  if (props.isMulti)
    options.push({
      value: 'all',
      label: `${yesLabel} / ${noLabel}`,
    });

  return (
    <SelectInput
      {...{
        name: props.name,
        isClearable: !props.isRequired,
        isSearchable: false,
        value: selectedValue,

        onChange: event => {
          const option = event.target.value;
          let newValue = option ? valueMapping[option.toLowerCase()] : null;
          if (newValue !== null && newValue !== undefined && props.isMulti)
            newValue = Array.isArray(newValue) ? newValue : [newValue];
          props.onChange(newValue);
        },
        options,
        isDisabled: props.disabled,
      }}
    />
  );
};
BooleanField.displayName = 'BooleanField';

BooleanField.propTypes = {
  isMulti: PropTypes.bool,
  isRequired: PropTypes.bool,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  // injectIntl
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
};
BooleanField.defaultProps = {
  isRequired: false,
  disabled: false,
};

export default injectIntl(BooleanField);

function getBooleanValue(value) {
  if (typeof value !== 'boolean') return undefined;
  return value === false ? 'no' : 'yes';
}
