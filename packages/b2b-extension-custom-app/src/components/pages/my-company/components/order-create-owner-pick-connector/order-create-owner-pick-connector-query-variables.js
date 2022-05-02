import { sanitize } from '@commercetools-local/utils/query-string';

export const getIndexOffset = (page, perPage) => (page - 1) * perPage;

export const getCustomerFilterPredicates = searchTerm => {
  if (!searchTerm) return [];

  const emailPredicate = `lowercaseEmail = "${searchTerm.toLowerCase()}"`;
  const customerNumberPredicate = `customerNumber = "${searchTerm}"`;
  const companyPredicate = `companyName = "${searchTerm}"`;
  return [emailPredicate, customerNumberPredicate, companyPredicate];
};

export default (searchOptions, { storeKey, companyId }) => {
  const sanitizedSearchText = sanitize(searchOptions.searchText);
  const searchQuery =
    searchOptions.searchText &&
    getCustomerFilterPredicates(sanitizedSearchText);

  const sortParams = searchOptions.sorting
    ? `${searchOptions.sorting.key} ${searchOptions.sorting.order}`
    : 'createdAt desc';

  const searchClause =
    searchQuery.length > 0 ? `(${searchQuery.join(' or ')})` : undefined;

  // when we have a storekey, we want to filter customers that either belong to this store
  // or that belong to no store
  const storeClause = storeKey
    ? `(stores(key = "${storeKey}") or stores is empty)`
    : undefined;

  const companyClause = `customerGroup(id = "${companyId}")`;

  const whereClause = [searchClause, storeClause, companyClause]
    .filter(Boolean)
    .join(' and ');
  return {
    // if we DO NOT HAVE any of the clauses, the `join` returns an empty string,
    // we don't need a where query, return undefined
    where: whereClause === '' ? undefined : whereClause,
    limit: searchOptions.perPage,
    offset: (searchOptions.page - 1) * searchOptions.perPage,
    sort: [sortParams],
  };
};
