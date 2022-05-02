import moment from 'moment';

export function isValidISOTime({ value = '', strict = true }) {
  return moment(value.trim(), 'HH:mm:ss.SSS', strict).isValid();
}

export function isValidISODate({ value = '', strict = true }) {
  return moment(value.trim(), 'YYYY-MM-DD', strict).isValid();
}

export function isValidISODateTime({ value = '', strict = true }) {
  const trimmedValue = value.trim();
  return (
    moment(trimmedValue, 'YYYY-MM-DDTHH:mm:ss.SSSZ', strict).isValid() ||
    moment(trimmedValue, 'YYYY-MM-DDTHH:mm:ss.SSS', strict).isValid()
  );
}
