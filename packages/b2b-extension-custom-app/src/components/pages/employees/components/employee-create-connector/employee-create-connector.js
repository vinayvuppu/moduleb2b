import React from 'react';
import PropTypes from 'prop-types';
import flowRight from 'lodash.flowright';
import { graphql } from 'react-apollo';
import withPendingRequests from '@commercetools-local/utils/with-pending-requests';
import { extractErrorFromGraphQlResponse } from '@commercetools-local/utils/graphql';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import { CreateEmployeeMutation } from './employee-create-connector.graphql';

export class EmployeeCreateConnector extends React.PureComponent {
  static displayName = 'EmployeeCreateConnector';
  static propTypes = {
    children: PropTypes.func.isRequired,

    // with-pending-requests
    pendingCreatorRequests: PropTypes.shape({
      isLoading: PropTypes.bool.isRequired,
      increment: PropTypes.func.isRequired,
      decrement: PropTypes.func.isRequired,
    }),
    // graphql
    createEmployeeMutation: PropTypes.func.isRequired,
  };

  handleCreateEmployee = employeeDraft => {
    this.props.pendingCreatorRequests.increment();
    return this.props
      .createEmployeeMutation({
        variables: {
          target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
          draft: employeeDraft,
        },
      })
      .then(response => {
        this.props.pendingCreatorRequests.decrement();

        return response.data.employeeSignUp.employee;
      })
      .catch(graphQlResponse => {
        this.props.pendingCreatorRequests.decrement();
        throw extractErrorFromGraphQlResponse(graphQlResponse);
      });
  };

  render() {
    return this.props.children({
      employeeCreator: {
        execute: this.handleCreateEmployee,
        isLoading: this.props.pendingCreatorRequests.isLoading,
      },
    });
  }
}

export default flowRight(
  withPendingRequests('pendingCreatorRequests'),
  graphql(CreateEmployeeMutation, {
    name: 'createEmployeeMutation',
    options: ownProps => ({ client: ownProps.apolloClient }),
  })
)(EmployeeCreateConnector);
