import rangeIsEmpty from '../../is-empty/range';
import singleIsEmpty from '../../is-empty/single';

export default function numberTransformer(
  filterKey,
  filters,
  filterValidator = isFilterValid
) {
  const queries = filters.map(({ type, value }) => {
    if (!filterValidator({ type, value })) return '';

    switch (type) {
      case 'lessThan':
        return `(* to ${value - 1})`;
      case 'moreThan':
        return `(${value + 1} to *)`;
      case 'equalTo':
        return `(${value} to ${value})`;
      case 'range':
        return `(${value.from} to ${value.to})`;
      default:
        return '';
    }
  });

  const queryString = queries.filter(q => q !== '').join(', ');

  return queryString === '' ? null : `${filterKey}: range${queryString}`;
}

export function isFilterValid({ type, value }) {
  if (type !== 'range' && singleIsEmpty({ value })) return false;

  if (type === 'range' && rangeIsEmpty({ value })) return false;

  return true;
}
