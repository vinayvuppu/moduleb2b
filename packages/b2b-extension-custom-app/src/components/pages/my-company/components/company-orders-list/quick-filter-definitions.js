import { defaultMemoize } from 'reselect';
import { createOptionsForDateQuickFilters } from '@commercetools-local/core/components/search/standard-quick-filter-definitions';

export default defaultMemoize(intl => [
  ...createOptionsForDateQuickFilters(intl),
]);
