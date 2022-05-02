import oneLine from 'common-tags/lib/oneLine';
import moment from 'moment-timezone';

export function formatDateRangeValue(
  value,
  type,
  options = { locale: 'en', timeZone: moment.tz.guess() }
) {
  if (value.from === value.to) return formatDateTime(type, value.from, options);
  if (value.from && value.to)
    return oneLine`
      ${formatDateTime(type, value.from, options)} -
      ${formatDateTime(type, value.to, options)}
    `;
  if (value.from) return `from ${formatDateTime(type, value.from, options)}`;
  if (value.to) return `to ${formatDateTime(type, value.to, options)}`;

  return '';
}

export function formatDateTime(
  type,
  value,
  { locale = 'en', timeZone = moment.tz.guess() } = {}
) {
  switch (type) {
    case 'time':
      return moment(value, 'HH:mm:ss.SSS')
        .tz(timeZone)
        .locale(locale)
        .format('LT');
    case 'datetime':
      return moment(value)
        .tz(timeZone)
        .locale(locale)
        .format('L LT');
    case 'date':
      return moment(value)
        .tz(timeZone)
        .locale(locale)
        .format('L');
    default:
      return value;
  }
}
