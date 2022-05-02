import React from 'react';
import PropTypes from 'prop-types';
import flowRight from 'lodash.flowright';
import union from 'lodash.union';
import { graphql } from 'react-apollo';
import { withApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { FetchEmployeesQuery } from './employees-list-connector.graphql';
import createQueryVariables from './employees-list-query-variables';

const emptyEmployeesList = {
  count: 0,
  total: 0,
  results: [],
};

const employeesPagedQueryResultProps = PropTypes.shape({
  total: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
  offset: PropTypes.number.isRequired,
  results: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      lastModifiedAt: PropTypes.string.isRequired,
      version: PropTypes.number.isRequired,
      customerNumber: PropTypes.string,
      externalId: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      companyName: PropTypes.string,
      email: PropTypes.string.isRequired,
      customerGroup: PropTypes.shape({
        id: PropTypes.string.isRequired,
        version: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }),
      middleName: PropTypes.string,
      vatId: PropTypes.string,
      dateOfBirth: PropTypes.string,
      stores: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          key: PropTypes.string.isRequired,
          nameAllLocales: PropTypes.arrayOf(
            PropTypes.shape({
              locale: PropTypes.string.isRequired,
              value: PropTypes.string.isRequired,
            })
          ),
        })
      ),
    })
  ),
});

export class EmployeesListConnector extends React.PureComponent {
  static displayName = 'EmployeesListConnector';
  static propTypes = {
    children: PropTypes.func.isRequired,
    projectKey: PropTypes.string.isRequired,
    searchQuery: PropTypes.object.isRequired,

    // graphql
    employeesQuery: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      refetch: PropTypes.func.isRequired,
      inStores: PropTypes.shape({
        employees: employeesPagedQueryResultProps,
      }),
      employees: employeesPagedQueryResultProps,
    }),
    // withApplicationContext
  };

  render() {
    return this.props.children({
      employeesFetcher: {
        refetch: this.props.employeesQuery.refetch,
        isLoading: this.props.employeesQuery.loading,
        employees:
          this.props.employeesQuery.inStores?.employees ||
          this.props.employeesQuery.employees ||
          emptyEmployeesList,
      },
    });
  }
}

export default flowRight(
  withApplicationContext(applicationContext => {
    const hasGeneralPermissions =
      applicationContext.permissions.canViewCustomers ||
      applicationContext.permissions.canManageCustomers;

    const storeKeys = union(
      applicationContext.dataFences?.store?.customers?.canViewCustomers?.values,
      applicationContext.dataFences?.store?.customers?.canManageCustomers
        ?.values
    );

    return {
      hasGeneralPermissions,
      storeKeys,
    };
  }),
  graphql(FetchEmployeesQuery, {
    name: 'employeesQuery',
    options: ownProps => ({
      client: ownProps.apolloClient,
      fetchPolicy: 'cache-and-network',
      variables: createQueryVariables(ownProps.searchQuery, {
        projectKey: ownProps.projectKey,
        hasGeneralPermissions: ownProps.hasGeneralPermissions,
        storeKeys: ownProps.storeKeys,
      }),
    }),
  })
)(EmployeesListConnector);
