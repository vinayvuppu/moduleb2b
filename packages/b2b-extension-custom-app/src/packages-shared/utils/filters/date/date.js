import moment from 'moment';
import oneLine from 'common-tags/lib/oneLine';
import { FILTER_TYPES } from '../../constants';
import rangeIsEmpty from '../is-empty/range';
import singleIsEmpty from '../is-empty/single';

const dateFormatDayStart = 'YYYY-MM-DDT00:00:00.000Z';
const dateFormatDayEnd = 'YYYY-MM-DDT23:59:59.999Z';

export default function dateTransformer(
  filterKey,
  filters,
  filterValidator = defaultFilterValidator
) {
  const queries = filters.map(({ type, value }) => {
    if (!filterValidator({ type, value })) return '';

    switch (type) {
      case FILTER_TYPES.lessThan:
        return `${filterKey} < "${value}"`;
      case FILTER_TYPES.moreThan:
        return `${filterKey} > "${value}"`;
      case FILTER_TYPES.equalTo:
        return oneLine`
            (${filterKey} >= "${moment(value).format(dateFormatDayStart)}"
            and ${filterKey} <= "${moment(value).format(dateFormatDayEnd)}")
          `;
      case FILTER_TYPES.range:
        return oneLine`
            (${filterKey} >= "${moment(value.from).format(dateFormatDayStart)}"
            and ${filterKey} <= "${moment(value.to).format(dateFormatDayEnd)}")
          `;
      default:
        return '';
    }
  });

  // The separator is and `or` as they are the same filter
  const queryString = queries.filter(q => q !== '').join(' or ');

  /* The parenthesis involing the `queryString` are needed since they are all part of the
   * same filter so we need something to work with
   * (
   *  (createdAt >= "2018-04-25T00:00:00.000+02:00" and createdAt <= "2018-04-25T23:59:59.999+02:00") o
   *  (createdAt >= "2018-02-15T00:00:00.000+01:00" and createdAt <= "2018-02-15T23:59:59.999+01:00")
   * ) or some_more_filters
   */
  return queryString === '' ? null : `(${queryString})`;
}

export function defaultFilterValidator({ type, value }) {
  if (
    type !== 'range' &&
    (singleIsEmpty({ value }) || !moment(value).isValid())
  )
    return false;

  if (
    type === 'range' &&
    (rangeIsEmpty({ value }) ||
      !moment(value.from).isValid() ||
      !moment(value.to).isValid())
  )
    return false;

  return true;
}
