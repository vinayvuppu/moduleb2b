import moment from 'moment';
import { defineMessages } from 'react-intl';
import isEmpty from '../../is-empty/single';

const messages = defineMessages({
  rangeMissingValue: {
    id: 'Search.Filters.validation.date.rangeMissingValue',
    description: 'error message if missing a value in a range',
    defaultMessage: 'Please enter a value for this field.',
  },
  rangeToSmallerThanFrom: {
    id: 'Search.Filters.validation.date.rangeToSmallerThanFrom',
    description: 'error message if to is smaller than from in a range',
    defaultMessage: 'Please enter the earlier date first.',
  },
});

export default function validateFilter({ value, type }, intl) {
  if (type !== 'range') return null;

  if (isEmpty({ value: value.from }))
    return {
      from: intl.formatMessage(messages.rangeMissingValue),
    };

  if (isEmpty({ value: value.to }))
    return {
      to: intl.formatMessage(messages.rangeMissingValue),
    };

  if (moment(value.to).isBefore(value.from))
    return { from: intl.formatMessage(messages.rangeToSmallerThanFrom) };

  return null;
}
