import { sanitize } from '@commercetools-local/utils/query-string';
import transformFiltersToWherePredicate from '../../../../utils/transform-filters-to-where-predicate';

export const mapFiltersToPredicate = filters =>
  Object.entries(filters).map(
    ([key, value]) =>
      `${transformFiltersToWherePredicate({
        target: key,
        value,
      })}`
  );

const createQueryVariables = searchOptions => {
  const sanitizedSearchText = sanitize(searchOptions.searchText);
  const searchQuery =
    searchOptions.searchText &&
    `lowercaseEmail = "${sanitizedSearchText.toLowerCase()}" or customerNumber = "${sanitizedSearchText}" or companyName = "${sanitizedSearchText}" or externalId = "${sanitizedSearchText}"`;

  const filtersQueries = mapFiltersToPredicate(searchOptions.filters);
  const sortParams = searchOptions.sorting
    ? `${searchOptions.sorting.key} ${searchOptions.sorting.order}`
    : 'createdAt desc';
  const whereQueries = [searchQuery, filtersQueries.join(' and ')].filter(
    Boolean
  );
  const whereQuery =
    whereQueries.length > 0 ? whereQueries.join(' and ') : undefined;

  return {
    where: whereQuery,
    limit: searchOptions.perPage,
    offset: (searchOptions.page - 1) * searchOptions.perPage,
    sort: [sortParams],
  };
};
export default createQueryVariables;
