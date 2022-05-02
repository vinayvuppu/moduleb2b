export default function referenceTransformer(
  filterKey,
  filters,
  filterValidator = isFilterValid
) {
  const queries = filters.map(({ type, value }) => {
    if (!filterValidator({ type, value })) return '';

    switch (type) {
      case 'equalTo':
        return `"${value}"`;
      default:
        return '';
    }
  });

  const queryString = queries.filter(q => q !== '').join(', ');

  return queryString === '' ? null : `${filterKey}.id: ${queryString}`;
}

export function isFilterValid({ type, value }) {
  if (type === 'equalTo' && ![null, undefined, ''].includes(value)) return true;

  return false;
}
