import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import withPendingRequests from '@commercetools-local/utils/with-pending-requests';
import {
  createGraphQlUpdateActions,
  extractErrorFromGraphQlResponse,
} from '@commercetools-local/utils/graphql';
import {
  FetchEmployeeQuery,
  UpdateEmployeeMutation,
} from './order-create-owner-connector.graphql';

export class OrderCreateOwnerConnector extends React.PureComponent {
  static displayName = 'OrderCreateOwnerConnector';

  static propTypes = {
    // parent
    children: PropTypes.func.isRequired,
    employeeId: PropTypes.string,

    // withPendingRequests
    pendingUpdaterRequests: PropTypes.shape({
      increment: PropTypes.func.isRequired,
      decrement: PropTypes.func.isRequired,
      isLoading: PropTypes.bool.isRequired,
    }).isRequired,

    // graphql
    employeeQuery: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      error: PropTypes.shape({
        message: PropTypes.string.isRequired,
      }),
      employee: PropTypes.shape({
        id: PropTypes.string.isRequired,
        version: PropTypes.number.isRequired,
        email: PropTypes.string,
        defaultBillingAddress: PropTypes.string,
        defaultShippingAddress: PropTypes.string,
        company: PropTypes.shape({
          id: PropTypes.string.isRequired,
        }),
        addresses: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            firstName: PropTypes.string,
            lastName: PropTypes.string,
            company: PropTypes.string,
            streetName: PropTypes.string,
            streetNumber: PropTypes.string,
            city: PropTypes.string,
            postalCode: PropTypes.string,
            region: PropTypes.string,
            country: PropTypes.string.isRequired,
            additionalAddressInfo: PropTypes.string,
            email: PropTypes.string,
            phone: PropTypes.string,
          })
        ),
      }),
    }),
    updateEmployeeMutation: PropTypes.func.isRequired,
  };

  handleUpdateEmployee = actions => {
    this.props.pendingUpdaterRequests.increment();

    return this.props
      .updateEmployeeMutation({
        variables: {
          // target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
          id: this.props.employeeQuery.employee.id,
          actions: createGraphQlUpdateActions(actions),
          version: this.props.employeeQuery.employee.version,
        },
      })
      .then(
        updatedEmployee => {
          this.props.pendingUpdaterRequests.decrement();

          return updatedEmployee;
        },
        graphQlResponse => {
          this.props.pendingUpdaterRequests.decrement();
          throw extractErrorFromGraphQlResponse(graphQlResponse);
        }
      );
  };

  render() {
    return this.props.children({
      employeeFetcher: {
        isLoading: Boolean(
          this.props.employeeId && this.props.employeeQuery.loading
        ),
        employee: this.props.employeeId
          ? this.props.employeeQuery.employee
          : undefined,
      },
      employeeUpdater: {
        isLoading: this.props.pendingUpdaterRequests.isLoading,
        execute: this.handleUpdateEmployee,
      },
    });
  }
}

export const createQueryVariables = ownProps => ({
  id: ownProps.employeeId,
});

export default compose(
  graphql(FetchEmployeeQuery, {
    name: 'employeeQuery',
    options: ownProps => ({
      client: ownProps.apolloClient,
      variables: createQueryVariables(ownProps),
      fetchPolicy: 'cache-and-network',
    }),
    skip: ownProps => !ownProps.employeeId,
  }),
  graphql(UpdateEmployeeMutation, {
    name: 'updateEmployeeMutation',
    options: ownProps => ({ client: ownProps.apolloClient }),
  }),
  withPendingRequests('pendingUpdaterRequests')
)(OrderCreateOwnerConnector);
