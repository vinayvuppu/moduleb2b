import React from 'react';
import PropTypes from 'prop-types';
import flowRight from 'lodash.flowright';
import { graphql } from 'react-apollo';
import oneLineTrim from 'common-tags/lib/oneLineTrim';
import { withApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { withSearchViewRouterSearchQuery } from '@commercetools-local/core/components/search/search-view-router-container';
import { SEARCH_SLICE_NAME_COMPANY_EMPLOYEES } from '../../../../constants/search';
import { DEFAULT_PAGE_SIZE } from '../../../../constants/pagination';

import FectchCompanyEmployeesListQuery from './employees-list-connector.graphql';

const emptyCompanyEmployeesList = {
  count: 0,
  total: 0,
  results: [],
};

export class EmployeesListConnector extends React.Component {
  static displayName = 'EmployeesListConnector';
  static propTypes = {
    companyId: PropTypes.string.isRequired,
    projectKey: PropTypes.string.isRequired,
    children: PropTypes.func.isRequired,
    // withApplicationContext
    userId: PropTypes.string.isRequired,

    // withSearchViewRouterSearchQuery
    searchQuery: PropTypes.shape({
      set: PropTypes.func.isRequired,
      get: PropTypes.func.isRequired,
      value: PropTypes.shape({
        page: PropTypes.number.isRequired,
        perPage: PropTypes.number.isRequired,
        sorting: PropTypes.shape({
          key: PropTypes.string.isRequired,
          order: PropTypes.string.isRequired,
        }).isRequired,
      }),
    }),

    // graphql
    companyEmployeesListQuery: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      error: PropTypes.shape({
        message: PropTypes.string.isRequired,
      }),
      employees: PropTypes.shape({
        total: PropTypes.number.isRequired,
        count: PropTypes.number.isRequired,
        results: PropTypes.array.isRequired,
      }),
    }),
  };

  render() {
    return this.props.children({
      employeesFetcher: {
        isLoading: this.props.companyEmployeesListQuery.loading,
        employees:
          this.props.companyEmployeesListQuery.employees ||
          emptyCompanyEmployeesList,
      },
      searchQuery: {
        value: this.props.searchQuery.value,
        set: this.props.searchQuery.set,
        get: this.props.searchQuery.get,
      },
    });
  }
}

const initialSearchQuery = {
  page: 1,
  perPage: DEFAULT_PAGE_SIZE,
  sorting: {
    key: 'createdAt',
    order: 'desc',
  },
};

export const createQueryVariables = ownProps => {
  const sortParams = ownProps.searchQuery.value.sorting
    ? `${ownProps.searchQuery.value.sorting.key} ${ownProps.searchQuery.value.sorting.order}`
    : 'createdAt desc';
  return {
    where: `customerGroup(id="${ownProps.companyId}")`,
    limit: ownProps.searchQuery.value.perPage,
    offset:
      (ownProps.searchQuery.value.page - 1) *
      ownProps.searchQuery.value.perPage,
    sort: [sortParams],
  };
};

export default flowRight(
  withApplicationContext(applicationContext => ({
    userId: applicationContext.user.id,
  })),
  withSearchViewRouterSearchQuery({
    initialSearchQuery,
    storageSlice: ownProps =>
      oneLineTrim`
        ${ownProps.userId}/
        ${ownProps.projectKey}/
        ${SEARCH_SLICE_NAME_COMPANY_EMPLOYEES}
      `,
  }),
  graphql(FectchCompanyEmployeesListQuery, {
    name: 'companyEmployeesListQuery',
    options: ownProps => ({
      client: ownProps.apolloClient,
      variables: createQueryVariables(ownProps),
      fetchPolicy: 'cache-and-network',
    }),
    skip: ownProps => !ownProps.companyId,
  })
)(EmployeesListConnector);
