import { defineMessages } from 'react-intl';
import isEmpty from '../../is-empty/single';
import { FILTER_TYPES, FIELD_TYPES } from '../../../constants';

export const messages = defineMessages({
  inputFieldError: {
    id: 'Search.Filters.validation.customField.inputFieldError',
    description: 'Error message for empty input field ',
    defaultMessage: 'Please fill in this required field.',
  },
  optionFieldError: {
    id: 'Search.Filters.validation.customField.optionFieldError',
    description: 'Error message for empty option field ',
    defaultMessage: 'Please select an option.',
  },
});

const hasOptionDropdown = type =>
  [
    FIELD_TYPES.Money,
    FIELD_TYPES.Number,
    FIELD_TYPES.Date,
    FIELD_TYPES.DateTime,
    FIELD_TYPES.Time,
  ].includes(type);

const validateValue = (value, type, intl) => {
  if (isEmpty({ value })) {
    return intl.formatMessage(messages.inputFieldError);
  }

  if (
    type === FIELD_TYPES.Money &&
    (isEmpty({ value: value.currencyCode }) || isEmpty({ value: value.amount }))
  ) {
    return intl.formatMessage(messages.inputFieldError);
  }

  return null;
};

export default function validateFilter({ value }, intl) {
  if (!value || !value.type) {
    return { type: intl.formatMessage(messages.optionFieldError) };
  }

  const typeName = value.type.name;
  const hasOption = hasOptionDropdown(typeName);
  const filterValue = value.value;

  if (hasOption && !value.option) {
    return { option: intl.formatMessage(messages.optionFieldError) };
  }

  if (value.option === FILTER_TYPES.range) {
    const from = validateValue(filterValue?.from, typeName, intl);
    const to = from ? null : validateValue(filterValue?.to, typeName, intl);
    return from || to
      ? {
          input: {
            from,
            to,
          },
        }
      : null;
  }

  const inputErrors = validateValue(filterValue, typeName, intl);
  return inputErrors ? { input: inputErrors } : null;
}
