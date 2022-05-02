export default function missingLocaleTransformer(filterKey, filters) {
  // Note: we assume for now that there can only be 1 missing filter value,
  // as the API doesn't support yet multiple OR values (for missing).
  if (filters.length === 0) return null;

  const missingLocale = filters[0].value.value;
  return `${filterKey}.${missingLocale}:missing`;
}
