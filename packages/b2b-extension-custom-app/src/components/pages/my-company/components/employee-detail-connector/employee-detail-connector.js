import React from 'react';
import PropTypes from 'prop-types';
import flowRight from 'lodash.flowright';
import { graphql } from 'react-apollo';
import oneLineTrim from 'common-tags/lib/oneLineTrim';
import { withApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { withSearchViewRouterSearchQuery } from '@commercetools-local/core/components/search/search-view-router-container';
import { SEARCH_SLICE_NAME_COMPANY_EMPLOYEES } from '../../../../constants/search';
import { DEFAULT_PAGE_SIZE } from '../../../../constants/pagination';

import FectchCompanyEmployeeQuery from './employee-detail-connector.graphql';

export class EmployeeDetailConnector extends React.Component {
  static displayName = 'EmployeeDetailConnector';
  static propTypes = {
    projectKey: PropTypes.string.isRequired,
    children: PropTypes.func.isRequired,
    // withApplicationContext
    userId: PropTypes.string.isRequired,
    userEmail: PropTypes.string,
    userExternalId: PropTypes.string,

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
    companyEmployeeQuery: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      error: PropTypes.shape({
        message: PropTypes.string.isRequired,
      }),
      employees: PropTypes.shape({
        total: PropTypes.number.isRequired,
        results: PropTypes.array.isRequired,
      }),
    }),
  };

  render() {
    return this.props.children({
      employeeFetcher: {
        isLoading: this.props.companyEmployeeQuery.loading,
        employee:
          this.props.companyEmployeeQuery.employees &&
          this.props.companyEmployeeQuery.employees.total
            ? this.props.companyEmployeeQuery.employees.results[0]
            : undefined,
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
    where: `email="${ownProps.userEmail}" or externalId="${ownProps.userExternalId}"`,
    // target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    limit: ownProps.searchQuery.value.perPage,
    offset:
      (ownProps.searchQuery.value.page - 1) *
      ownProps.searchQuery.value.perPage,
    sort: [sortParams],
    // projectKey: ownProps.projectKey,
  };
};

export const getExtenralAuthId = encodedEmail => {
  try {
    const [encoded] = encodedEmail.split('@');
    const encodedId = Buffer.from(encoded, 'base64').toString();
    // rest = https://ct-b2b.auth0.com
    // externalId = auth0|5e1e1078be6bdb0db3c05070
    // eslint-disable-next-line
    const [rest, externalId] = encodedId.split('/:');
    return externalId;
  } catch (error) {
    return undefined;
  }
};

export default flowRight(
  withApplicationContext(applicationContext => ({
    userId: applicationContext.user.id,
    userEmail: applicationContext.user.email,
    userExternalId: getExtenralAuthId(applicationContext.user.email),
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
  graphql(FectchCompanyEmployeeQuery, {
    name: 'companyEmployeeQuery',
    options: ownProps => ({
      client: ownProps.apolloClient,
      variables: createQueryVariables(ownProps),
      fetchPolicy: 'cache-first',
    }),
    skip: ownProps => !ownProps.userEmail,
  })
)(EmployeeDetailConnector);
