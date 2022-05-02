import moment from 'moment';
import oneLine from 'common-tags/lib/oneLine';
import rangeIsEmpty from '../../is-empty/range';
import singleIsEmpty from '../../is-empty/single';

const dateFormatDayStart = 'YYYY-MM-DDT00:00:00.000Z';
const dateFormatDayEnd = 'YYYY-MM-DDT23:59:59.999Z';

export default function dateTransformer(
  filterKey,
  filters,
  filterValidator = isFilterValid
) {
  const queries = filters.map(({ type, value }) => {
    if (!filterValidator({ type, value })) return '';

    switch (type) {
      case 'lessThan':
        return `(* to "${moment(value).format(dateFormatDayStart)}")`;
      case 'moreThan':
        return `("${moment(value).format(dateFormatDayEnd)}" to *)`;
      case 'equalTo':
        return oneLine`
            ("${moment(value).format(dateFormatDayStart)}"
            to "${moment(value).format(dateFormatDayEnd)}")
          `;
      case 'range':
        return oneLine`
            ("${moment(value.from).format(dateFormatDayStart)}"
            to "${moment(value.to).format(dateFormatDayEnd)}")
          `;
      default:
        return '';
    }
  });

  const queryString = queries.filter(q => q !== '').join(', ');

  return queryString === '' ? null : `${filterKey}: range${queryString}`;
}

export function isFilterValid({ type, value }) {
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
