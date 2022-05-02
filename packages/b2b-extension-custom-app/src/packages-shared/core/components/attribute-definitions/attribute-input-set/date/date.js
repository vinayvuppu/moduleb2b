import moment from 'moment';
import { messages as validationMessages } from '../../../../../utils/validation';
import AttributeInputDateTime from '../../attribute-input-datetime';

export function createDateSetConfig(intl) {
  return {
    attributeComponent: AttributeInputDateTime,
    customValidator(items) {
      const format = 'YYYY-MM-DD';
      const invalidValues = items
        .map(i => moment(i, format).format('X'))
        .sort((x, y) => x - y)
        .reduce((acc, dateValue, index, arr) => {
          if (
            arr[index + 1] &&
            arr[index + 1] === dateValue &&
            !acc.includes(dateValue)
          )
            acc.push(moment(dateValue, 'X').format(format));

          return acc;
        }, []);

      return {
        isValid: !invalidValues.length,
        invalidValues,
        message: intl.formatMessage(validationMessages.unique),
      };
    },
  };
}

export function createTimeSetConfig(intl) {
  return {
    attributeComponent: AttributeInputDateTime,
    customValidator(items) {
      const format = 'HH:mm';
      const invalidValues = items
        .map((i, index) => ({
          index,
          value: parseInt(moment(i, format).format('HHmm'), 10),
        }))
        .sort((x, y) => x.value - y.value)
        .reduce((acc, time, index, arr) => {
          if (
            arr[index + 1] !== undefined &&
            arr[index + 1].value === time.value &&
            !acc.includes(items[time.index])
          )
            acc.push(items[time.index]);

          return acc;
        }, []);

      return {
        isValid: !invalidValues.length,
        invalidValues,
        message: intl.formatMessage(validationMessages.unique),
      };
    },
  };
}

export function createDateTimeSetConfig(intl) {
  return {
    attributeComponent: AttributeInputDateTime,
    customValidator(items) {
      const format = 'YYYY-MM-DDTHH:mm';
      const invalidValues = items
        .map(i => moment(i, format).format('X'))
        .sort((x, y) => x - y)
        .reduce((acc, dateTimeValue, index, arr) => {
          if (
            arr[index + 1] &&
            arr[index + 1] === dateTimeValue &&
            !acc.includes(dateTimeValue)
          )
            acc.push(moment(dateTimeValue, 'X').format(format));

          return acc;
        }, []);

      return {
        isValid: !invalidValues.length,
        invalidValues,
        message: intl.formatMessage(validationMessages.unique),
      };
    },
  };
}
