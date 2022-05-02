import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import oneLineTrim from 'common-tags/lib/oneLineTrim';
import { withApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { withSearchViewRouterSearchQuery } from '@commercetools-local/core/components/search/search-view-router-container';
import { SEARCH_SLICE_NAME_ORDER_CREATE_CUSTOMERS } from '../../../../constants/misc';
import FetchEmployeesQuery from './order-create-owner-pick-connector.graphql';
import createQueryVariables from './order-create-owner-pick-connector-query-variables';

const emptyEmployees = {
  total: 0,
  count: 0,
  results: [],
};

export class OrderCreateOwnerPickConnector extends React.PureComponent {
  static displayName = 'OrderCreateOwnerPickConnector';
  static propTypes = {
    children: PropTypes.func.isRequired,
    projectKey: PropTypes.string.isRequired,
    storeKey: PropTypes.string,
    company: PropTypes.shape({
      id: PropTypes.string.isRequired,
      customerGroup: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,

    // graphql
    employeesQuery: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      refetch: PropTypes.func.isRequired,
      employees: PropTypes.shape({
        total: PropTypes.number.isRequired,
        count: PropTypes.number.isRequired,
        offset: PropTypes.number.isRequired,
        results: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            version: PropTypes.number.isRequired,
            customerNumber: PropTypes.string,
            firstName: PropTypes.string,
            lastName: PropTypes.string,
            companyName: PropTypes.string,
            email: PropTypes.string,
          })
        ),
      }),
    }),
    // withApplicationContext
    locale: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,

    // withSearchViewRouterSearchQuery
    searchQuery: PropTypes.shape({
      value: PropTypes.shape({
        page: PropTypes.number.isRequired,
        perPage: PropTypes.number.isRequired,
        sorting: PropTypes.object.isRequired,
      }),
    }),
  };

  render() {
    return this.props.children({
      employeesFetcher: {
        isLoading: this.props.employeesQuery.loading,
        employees: this.props.employeesQuery.employees || emptyEmployees,
        searchQuery: this.props.searchQuery,
      },
    });
  }
}

const initialSearchQuery = {
  page: 1,
  perPage: 20,
  filters: {},
  searchText: '',
  sorting: { key: 'createdAt', order: 'desc' },
};

export default compose(
  withApplicationContext(applicationContext => ({
    locale: applicationContext.dataLocale,
    userId: applicationContext.user.id,
  })),
  withSearchViewRouterSearchQuery({
    initialSearchQuery,
    storageSlice: ownProps =>
      oneLineTrim`
        ${ownProps.userId}/
        ${ownProps.projectKey}/
        ${SEARCH_SLICE_NAME_ORDER_CREATE_CUSTOMERS}
      `,
  }),
  graphql(FetchEmployeesQuery, {
    name: 'employeesQuery',
    options: ownProps => ({
      client: ownProps.apolloClient,

      // Ensure to always additionally fetch from the network.
      // This is important as e.g. new items can be added or removed from the list.
      variables: createQueryVariables(ownProps.searchQuery.value, {
        locale: ownProps.locale,
        storeKey: ownProps.storeKey,
        companyId: ownProps.company.customerGroup.id,
      }),
      fetchPolicy: 'network-only', // disables the apollo-cache for these queries
      /* We need to use this property in order to see the LoadingSpinner when
       * the user changes the page and the "fetchMore" function gets called if
       * not the "loading" property always is false
       * https://github.com/apollographql/react-apollo/issues/727
       */
      notifyOnNetworkStatusChange: true,
    }),
  })
)(OrderCreateOwnerPickConnector);
