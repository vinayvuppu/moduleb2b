import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import { FetchStoresQuery } from './stores-list-query.graphql';

// eslint-disable-next-line import/prefer-default-export
export const createFetchStoresListQueryMock = (custom = {}) => ({
  request: {
    variables: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
      limit: 20,
      offset: 0,
      sort: `createdAt desc`,
    },
    ...custom.request,
    query: FetchStoresQuery,
  },
  result: {
    data: {
      stores: {
        count: 2,
        offset: 0,
        total: 2,
        results: [
          {
            id: 'store-1',
            key: 'germany',
            version: 1,
            nameAllLocales: [{ locale: 'en-GB', value: 'Germany' }],
            createdAt: '2018-12-19T15:26:51.174Z',
            lastModifiedAt: '2019-03-01T09:00:51.174Z',
          },
          {
            id: 'store-2',
            key: 'usa',
            version: 1,
            nameAllLocales: [{ locale: 'en-GB', value: 'USA' }],
            createdAt: '2019-06-10T15:00:51.140Z',
            lastModifiedAt: '2019-08-30T10:26:51.140Z',
          },
        ],
      },
    },
    ...custom.result,
  },
});
