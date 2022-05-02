import graphqlNumberTransformer from '../number';

export default function graphqlCategoryLevelTransformer(
  filterKey,
  filters,
  filterValidator
) {
  const levelFilterQuery = graphqlNumberTransformer(
    filterKey,
    filters.filter(({ type }) => type !== 'lastLevel'),
    filterValidator
  );
  const lastLevelFilterQuery = filters.some(({ type }) => type === 'lastLevel')
    ? 'childCount: 0'
    : null;
  return [levelFilterQuery, lastLevelFilterQuery].filter(Boolean);
}
