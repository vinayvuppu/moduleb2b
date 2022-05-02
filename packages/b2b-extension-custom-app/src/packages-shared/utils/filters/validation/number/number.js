import { defineMessages } from 'react-intl';
import * as numbers from '../../../numbers';
import { messages as validationMessages } from '../../../validation';
import isEmpty from '../../is-empty/single';

const messages = defineMessages({
  rangeMissingValue: {
    id: 'Search.Filters.validation.number.rangeMissingValue',
    description: 'error message if missing a value in a range',
    defaultMessage: 'Please enter a value for this field.',
  },
  rangeToSmallerThanFrom: {
    id: 'Search.Filters.validation.number.rangeToSmallerThanFrom',
    description: 'error message if to is smaller than from in a range',
    defaultMessage: 'Please enter the smaller number first.',
  },
});

export default function validateFilter(
  { value, type, allowFloat = true },
  intl
) {
  if (type !== 'range') {
    if (!allowFloat && !numbers.isInteger(value))
      return intl.formatMessage(validationMessages.integer);

    return null;
  }

  // only range types from here

  if (!allowFloat && !numbers.isInteger(value.from))
    return { from: intl.formatMessage(validationMessages.integer) };

  if (!allowFloat && !numbers.isInteger(value.to))
    return { to: intl.formatMessage(validationMessages.integer) };

  if (isEmpty({ value: value.from }))
    return {
      from: intl.formatMessage(messages.rangeMissingValue),
    };

  if (isEmpty({ value: value.to }))
    return {
      to: intl.formatMessage(messages.rangeMissingValue),
    };

  if (parseFloat(value.to) < parseFloat(value.from))
    return { from: intl.formatMessage(messages.rangeToSmallerThanFrom) };

  return null;
}
