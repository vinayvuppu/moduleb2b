import { getIn } from 'formik';
import lowerFirst from 'lodash.lowerfirst';
import upperFirst from 'lodash.upperfirst';
import {
  transformLocalizedStringToField,
  transformLocalizedFieldToString,
} from '@commercetools-local/utils/graphql';

const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_PAGE = 1;
const DEFAULT_SORT = {
  key: 'createdAt',
  order: 'desc',
};

export const initialViewState = {
  page: DEFAULT_PAGE,
  perPage: DEFAULT_PAGE_SIZE,
  filters: {},
  searchText: '',
  sorting: DEFAULT_SORT,
  visibleColumns: null,
};

export const viewToDoc = view => ({
  nameAllLocales: transformLocalizedStringToField(view.name),
  search: view.searchText,
  table: {
    visibleColumns: view.visibleColumns || [],
  },
  sort: {
    key: view.sorting && view.sorting.key,
    order: view.sorting && upperFirst(view.sorting.order),
  },
  filters: do {
    const entriesOfView = Object.entries(view.filters);

    if (!view.filters || entriesOfView.length === 0) undefined;

    entriesOfView.reduce(
      (transformedFilters, [target, filtersForTarget]) => [
        ...transformedFilters,
        ...filtersForTarget.map(filter => ({
          type: upperFirst(filter.type),
          target,
          json: {
            value: filter.value,
          },
        })),
      ],
      []
    );
  },
});

export const docToView = doc => ({
  id: doc.id,
  name: transformLocalizedFieldToString(doc.nameAllLocales),
  searchText: doc.search || '',
  sorting: {
    key: getIn(doc, 'sort.key', DEFAULT_SORT.key),
    order: getIn(doc, 'sort.order', DEFAULT_SORT.order).toLowerCase(),
  },
  page: DEFAULT_PAGE,
  perPage: DEFAULT_PAGE_SIZE,
  isActive: doc.isActive,
  filters: doc.filters
    ? doc.filters.reduce((transformedFilters, filter) => {
        if (transformedFilters[filter.type]) {
          return {
            ...transformedFilters,
            [filter.target]: [
              ...transformedFilters[filter.type],
              {
                type: lowerFirst(filter.type),
                value: filter.json.value,
              },
            ],
          };
        }

        return {
          ...transformedFilters,
          [filter.target]: [
            {
              type: lowerFirst(filter.type),
              value: filter.json.value,
            },
          ],
        };
      }, {})
    : {},
  visibleColumns:
    doc.table?.visibleColumns?.length > 0 ? doc.table.visibleColumns : null,
});
