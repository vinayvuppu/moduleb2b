import React from 'react';
import PropTypes from 'prop-types';
import flowRight from 'lodash.flowright';
import { graphql } from 'react-apollo';
import union from 'lodash.union';
import { createSyncCustomers } from '@commercetools/sync-actions';
import {
  createGraphQlUpdateActions,
  extractErrorFromGraphQlResponse,
} from '@commercetools-local/utils/graphql';
import { withApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import withPendingRequests from '@commercetools-local/utils/with-pending-requests';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import { mapDataToProps } from './conversions';
import {
  UpdateEmployeeMutation,
  DeleteEmployeeMutation,
  FetchEmployeeQuery,
  EmployeeResetPasswordMutation,
  EmployeeCreatePasswordResetTokenMutation,
} from './employee-details-connector.graphql';

const sync = createSyncCustomers();

const employeeDetailsQueryShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  version: PropTypes.number.isRequired,
  email: PropTypes.string.isRequired,
});

export class EmployeeDetailsConnector extends React.PureComponent {
  static displayName = 'EmployeeDetailsConnector';
  static propTypes = {
    children: PropTypes.func.isRequired,
    employeeId: PropTypes.string.isRequired,

    // with-pending-requests
    pendingUpdaterRequests: PropTypes.shape({
      isLoading: PropTypes.bool.isRequired,
      increment: PropTypes.func.isRequired,
      decrement: PropTypes.func.isRequired,
    }),
    pendingDeleterRequests: PropTypes.shape({
      isLoading: PropTypes.bool.isRequired,
      increment: PropTypes.func.isRequired,
      decrement: PropTypes.func.isRequired,
    }),
    // graphql
    employeeQuery: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      error: PropTypes.object,
      refetch: PropTypes.func,
      employee: employeeDetailsQueryShape,
      inStores: PropTypes.shape({
        employee: employeeDetailsQueryShape,
      }),
    }),
    updateEmployeeMutation: PropTypes.func.isRequired,
    deleteEmployeeMutation: PropTypes.func.isRequired,
    employeeResetPasswordMutation: PropTypes.func.isRequired,
    employeeCreatePasswordResetTokenMutation: PropTypes.func.isRequired,
  };

  getEmployeeStoreKey = () =>
    (this.props.employeeQuery.employee.stores ?? []).map(store => store.key)[0];

  addUpdateStoreAction = (oldStores, newStores) => {
    // just one store is allowed at this moment
    return oldStores[0].key !== newStores[0].key
      ? { action: 'setStores', stores: newStores }
      : undefined;
  };

  rolesAction = ({ actions, oldEmployee, newEmployee }) => {
    const newActions = actions.filter(
      action => action.action !== 'setCustomType'
    );

    if (
      oldEmployee.roles.length !== newEmployee.roles.length ||
      JSON.stringify(oldEmployee.roles) !== JSON.stringify(newEmployee.roles)
    ) {
      newActions.push({
        action: 'setRoles',
        roles: newEmployee.roles,
      });
    }

    return newActions;
  };

  employeeNumberAction = actions => {
    return actions.map(action => {
      if (action.action === 'setCustomerNumber') {
        return {
          action: 'setEmployeeNumber',
          employeeNumber: action.customerNumber,
        };
      }
      return action;
    });
  };

  b2bActions = ({ draft, employee }) => {
    let actions = sync.buildActions(draft, employee);
    // we need manually build the store action, is not in the buildActions library
    const storeAction = this.addUpdateStoreAction(
      employee.stores,
      draft.stores
    );
    if (storeAction) {
      actions = [...actions, storeAction];
    }
    actions = this.rolesAction({
      actions,
      oldEmployee: employee,
      newEmployee: draft,
    });
    actions = this.employeeNumberAction(actions);
    return actions;
  };

  handleUpdateEmployee = employeeDraft => {
    const actions = this.b2bActions({
      draft: employeeDraft,
      employee: this.props.employeeQuery.employee,
    });
    this.props.pendingUpdaterRequests.increment();
    return this.props
      .updateEmployeeMutation({
        variables: {
          target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
          id: this.props.employeeQuery.employee.id,
          version: this.props.employeeQuery.employee.version,
          actions: createGraphQlUpdateActions(actions),
        },
      })
      .then(response => {
        this.props.pendingUpdaterRequests.decrement();

        return response.data.updateEmployee;
      })
      .catch(graphQlResponse => {
        this.props.pendingUpdaterRequests.decrement();
        throw extractErrorFromGraphQlResponse(graphQlResponse);
      });
  };

  handleSetDefaultAddress = action => {
    this.props.pendingUpdaterRequests.increment();
    return this.props
      .updateEmployeeMutation({
        variables: {
          target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
          id: this.props.employeeQuery.employee.id,
          version: this.props.employeeQuery.employee.version,
          actions: createGraphQlUpdateActions([action]),
          storeKey: this.getEmployeeStoreKey(),
        },
      })
      .then(response => {
        this.props.pendingUpdaterRequests.decrement();

        return response.data.updateEmployee;
      })
      .catch(graphQlResponse => {
        this.props.pendingUpdaterRequests.decrement();
        throw extractErrorFromGraphQlResponse(graphQlResponse);
      });
  };

  handleDeleteEmployee = () => {
    this.props.pendingDeleterRequests.increment();
    return this.props
      .deleteEmployeeMutation({
        variables: {
          target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
          id: this.props.employeeQuery.employee.id,
          version: this.props.employeeQuery.employee.version,
          storeKey: this.getEmployeeStoreKey(),
        },
      })
      .then(response => {
        this.props.pendingDeleterRequests.decrement();

        return response.data.deleteEmployee;
      })
      .catch(graphQlResponse => {
        this.props.pendingDeleterRequests.decrement();
        throw extractErrorFromGraphQlResponse(graphQlResponse);
      });
  };

  handleResetEmployeePassword = newPassword => {
    this.props.pendingDeleterRequests.increment();
    return this.props
      .employeeCreatePasswordResetTokenMutation({
        variables: {
          target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
          email: this.props.employeeQuery.employee.email,
          storeKey: this.getEmployeeStoreKey(),
        },
      })
      .then(tokenResponse => {
        const employeeToken =
          tokenResponse.data.employeeCreatePasswordResetToken.value;
        return this.props.employeeResetPasswordMutation({
          variables: {
            target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
            version: this.props.employeeQuery.employee.version,
            tokenValue: employeeToken,
            newPassword,
            storeKey: this.getEmployeeStoreKey(),
          },
        });
      })
      .then(response => {
        this.props.pendingDeleterRequests.decrement();
        return response.data.employeeResetPassword;
      })
      .catch(graphQlResponse => {
        this.props.pendingDeleterRequests.decrement();
        throw extractErrorFromGraphQlResponse(graphQlResponse);
      });
  };

  render() {
    return this.props.children({
      employeeFetcher: {
        isLoading: this.props.employeeQuery.loading,
        employee:
          this.props.employeeQuery.inStores?.employee ||
          this.props.employeeQuery.employee,
      },
      employeeUpdater: {
        execute: this.handleUpdateEmployee,
        isLoading: this.props.pendingUpdaterRequests.isLoading,
      },
      employeeDefaultAddressUpdater: {
        execute: this.handleSetDefaultAddress,
        isLoading: this.props.pendingUpdaterRequests.isLoading,
      },
      employeeDeleter: {
        execute: this.handleDeleteEmployee,
        isLoading: this.props.pendingDeleterRequests.isLoading,
      },
      employeePasswordReseter: {
        execute: this.handleResetEmployeePassword,
        isLoading: this.props.pendingUpdaterRequests.isLoading,
      },
    });
  }
}

export const createFetchEmployeeQueryVariables = ownProps => ({
  variables: {
    target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    id: ownProps.employeeId,
    hasGeneralPermissions: ownProps.hasGeneralPermissions,
    storeKeys: ownProps.storeKeys,
  },
  fetchPolicy: 'cache-and-network',
  client: ownProps.apolloClient,
});

export default flowRight(
  withApplicationContext(applicationContext => {
    const storeKeys = union(
      applicationContext.dataFences?.store?.customers?.canViewCustomers?.values,
      applicationContext.dataFences?.store?.customers?.canManageCustomers
        ?.values
    );

    const hasGeneralPermissions =
      applicationContext.permissions.canManageCustomers ||
      applicationContext.permissions.canViewCustomers;

    return {
      storeKeys,
      language: applicationContext.dataLocale,
      hasGeneralPermissions,
    };
  }),
  withPendingRequests('pendingUpdaterRequests'),
  withPendingRequests('pendingDeleterRequests'),
  graphql(FetchEmployeeQuery, {
    name: 'employeeQuery',
    options: createFetchEmployeeQueryVariables,
    props: mapDataToProps,
  }),
  graphql(UpdateEmployeeMutation, {
    name: 'updateEmployeeMutation',
    options: ownProps => ({ client: ownProps.apolloClient }),
  }),
  graphql(DeleteEmployeeMutation, {
    name: 'deleteEmployeeMutation',
    options: ownProps => ({ client: ownProps.apolloClient }),
  }),
  graphql(EmployeeResetPasswordMutation, {
    name: 'employeeResetPasswordMutation',
    options: ownProps => ({ client: ownProps.apolloClient }),
  }),
  graphql(EmployeeCreatePasswordResetTokenMutation, {
    name: 'employeeCreatePasswordResetTokenMutation',
  })
)(EmployeeDetailsConnector);
