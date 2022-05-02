import moment from 'moment';
import oneLine from 'common-tags/lib/oneLine';
import { FILTER_TYPES } from '../../constants';
import rangeIsEmpty from '../is-empty/range';
import singleIsEmpty from '../is-empty/single';

const formatTime = 'HH:mm:ss.SSS';

/* TimeInput only allows HH:mm:ss and adds the seconds as 00 and
 * the milliseconds always as 000.
 * This function returns the same time with the
 */
const getEndOfSecond = value =>
  moment(value, formatTime)
    .endOf('minute')
    .format(formatTime);

const defaultFilterValidator = ({ type, value }) => {
  if (type !== FILTER_TYPES.range && singleIsEmpty({ value })) return false;

  if (type === FILTER_TYPES.range && rangeIsEmpty({ value })) return false;

  return true;
};

const timeTransformer = (
  filterKey,
  filters,
  filterValidator = defaultFilterValidator
) => {
  const queries = filters.map(({ type, value }) => {
    if (!filterValidator({ type, value })) return '';

    switch (type) {
      case FILTER_TYPES.lessThan:
        return `${filterKey} < "${value}"`;
      case FILTER_TYPES.moreThan:
        return `${filterKey} > "${value}"`;
      case FILTER_TYPES.equalTo:
        return oneLine`
          (${filterKey} >= "${value}"
          and ${filterKey} <= "${getEndOfSecond(value)}")
          `;
      case FILTER_TYPES.range:
        return oneLine`
          (${filterKey} >= "${value.from}"
          and ${filterKey} <= "${getEndOfSecond(value.to)}")
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
   *  (pickUpTime >= "12:00" and pickUpTime <= "13:00") o
   *  (pickUpTime >= "14:00" and pickUpTime <= "15:00")
   * ) or some_more_filters
   */
  return queryString === '' ? null : `(${queryString})`;
};

export { timeTransformer as default, getEndOfSecond, defaultFilterValidator };
