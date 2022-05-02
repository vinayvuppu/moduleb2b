export default function textTransformer(filterKey, queries) {
  if (queries.length === 0) return null;

  // Note: we assume for now that there can only be 1 text filter.
  const queryValue = queries[0].value;

  return queryValue ? `${filterKey}:"${queryValue}"` : null;
}
