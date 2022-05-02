/* eslint-disable import/prefer-default-export */
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import flatMap from 'lodash.flatmap';
import intersection from 'lodash.intersection';
import FetchCustomersQuery from './order-create-customer-pick-connector.graphql';

export const createCustomersFetchQueryMock = (stores = []) => {
  const whereClause =
    stores.length === 0
      ? undefined
      : `(stores(key = "${stores.join(',')}") or stores is empty)`;
  const customers = [
    {
      id: 'customer-1',
      version: 4,
      firstName: 'Anna',
      lastName: 'Banana',
      email: 'annabanana@blablub.com',
      customerNumber: '111',
      companyName: null,
      customerGroup: null,
      stores: [
        {
          id: 'store-2',
          key: 'usa',
          nameAllLocales: [{ locale: 'en-GB', value: 'USA' }],
        },
      ],
      addresses: [
        {
          id: '_ZqTe0es',
          firstName: '3333',
          streetName: 'Fakestreet',
          streetNumber: '23',
          country: 'DE',
          additionalAddressInfo: 'Additional address info2',
          additionalStreetInfo: 'Additional street info',
          email: null,
          phone: null,
          city: null,
          company: null,
          lastName: null,
          postalCode: null,
          region: null,
        },
      ],
    },
    {
      id: 'customer-2',
      version: 1,
      firstName: 'Ali',
      lastName: 'Baba',
      customerNumber: '235',
      email: 'alibaba@testest.de',
      companyName: null,
      customerGroup: null,
      stores: [
        {
          id: 'store-1',
          key: 'germany',
          nameAllLocales: [{ locale: 'en-GB', value: 'Germany' }],
        },
      ],
      addresses: [],
    },
    {
      id: 'customer-3',
      version: 3,
      customerNumber: '128',
      firstName: 'Amin',
      lastName: 'Rocks',
      email: 'email@ct.de',
      companyName: null,
      customerGroup: null,
      stores: [],
      addresses: [
        {
          id: 'yUQGmqRG',
          firstName: 'first',
          lastName: 'last2',
          company: 'company',
          streetName: 'Street name',
          streetNumber: 'House number',
          city: 'city',
          postalCode: '66215',
          region: 'region',
          country: 'US',
          additionalAddressInfo: 'Additional address info2',
          additionalStreetInfo: 'Additional street info',
          email: 'email2@email.com',
          phone: 'phone',
        },
      ],
    },
  ].filter(customer => {
    // if we don't pass stores then we don't filter
    if (!stores) return true;

    const customerStoresArray = flatMap(customer.stores, s => s.key);
    return (
      // true if the customer belongs to one of the stores passed
      intersection(customerStoresArray, stores).length !== 0 ||
      // or the customer belongs to no store
      customerStoresArray.length === 0
    );
  });

  return {
    request: {
      variables: {
        target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
        projectKey: 'context-playground',
        limit: 20,
        locale: 'en',
        offset: 0,
        sort: ['createdAt desc'],
        where: whereClause,
      },
      query: FetchCustomersQuery,
    },
    result: {
      data: {
        customers: {
          count: 3,
          offset: 0,
          total: 3,
          results: customers,
        },
      },
    },
  };
};
