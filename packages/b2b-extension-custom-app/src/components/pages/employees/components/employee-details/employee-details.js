import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import flowRight from 'lodash.flowright';
import { injectIntl, FormattedMessage } from 'react-intl';
import oneLineTrim from 'common-tags/lib/oneLineTrim';
import { DOMAINS } from '@commercetools-frontend/constants';

import * as globalActions from '@commercetools-frontend/actions-global';
import { injectAuthorized } from '@commercetools-frontend/permissions';
import {
  PageNotFound,
  ConfirmationDialog,
} from '@commercetools-frontend/application-components';
import View from '@commercetools-local/core/components/view';
import ViewHeader from '@commercetools-local/core/components/view-header';
import TabHeader from '@commercetools-local/core/components/tab-header';
import TabContainer from '@commercetools-local/core/components/tab-container';
import BackToList from '@commercetools-local/core/components/back-to-list';
import { withModalState } from '@commercetools-local/core/components/modal-state-container';
import formatEmployeeName from '@commercetools-local/utils/customer/format-customer-name';
import {
  IconButton,
  BinLinearIcon,
  Spacings,
  Text,
  LoadingSpinner,
} from '@commercetools-frontend/ui-kit';
import { PERMISSIONS, DATA_FENCES } from '../../../../../constants';
import createSelectEmployeeDataFenceData from '../../../../utils/create-select-employee-data-fence-data';
import messages from './messages';

export const TAB_NAMES = {
  GENERAL: 'general',
  BUDGET: 'budget',
  CUSTOM_FIELDS: 'custom-fields',
  ADDRESSES: 'addresses',
  ORDERS: 'orders',
};

export class EmployeeDetails extends React.PureComponent {
  static displayName = 'EmployeeDetails';

  static propTypes = {
    children: PropTypes.node.isRequired,
    employeeDeleter: PropTypes.shape({
      isLoading: PropTypes.bool.isRequired,
      execute: PropTypes.func.isRequired,
    }).isRequired,
    employeeFetcher: PropTypes.shape({
      isLoading: PropTypes.bool.isRequired,
      employee: PropTypes.shape({
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        customerNumber: PropTypes.string,
      }),
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string,
      state: PropTypes.object,
    }),
    employeeListUrl: PropTypes.string.isRequired,
    employeeId: PropTypes.string.isRequired,
    projectKey: PropTypes.string.isRequired,

    // Connect
    showNotification: PropTypes.func.isRequired,
    onActionError: PropTypes.func.isRequired,

    // withModalState
    deletionConfirmationModal: PropTypes.shape({
      isOpen: PropTypes.bool.isRequired,
      handleOpen: PropTypes.func.isRequired,
      handleClose: PropTypes.func.isRequired,
    }).isRequired,

    // HOC
    intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
      .isRequired,
    canViewOrders: PropTypes.bool.isRequired,
    canManageEmployees: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    canViewOrders: true,
  };

  handleDelete = () => {
    this.props.employeeDeleter.execute().then(
      deletedEmployee => {
        this.props.history.push(this.props.employeeListUrl);
        this.props.showNotification({
          kind: 'success',
          text: this.props.intl.formatMessage(messages.employeeDeleted, {
            name: formatEmployeeName(deletedEmployee),
          }),
          domain: DOMAINS.SIDE,
        });
      },
      error => this.props.onActionError(error, 'EmployeeDetails/deleteCustomer')
    );
  };

  render() {
    if (this.props.employeeFetcher.isLoading) return <LoadingSpinner />;

    if (!this.props.employeeFetcher.employee) return <PageNotFound />;

    const myCompanyRestriction = this.props.location.pathname.indexOf('my-company') >= 0;

    return (
      <div data-track-component="EmployeesUpdate">
        <View data-testid="employee-details-view">
          <ViewHeader
            title={
              <Spacings.Stack scale="m">
                {formatEmployeeName({
                  firstName: this.props.employeeFetcher.employee.firstName,
                  lastName: this.props.employeeFetcher.employee.lastName,
                })}
                {this.props.employeeFetcher.employee.customerNumber && (
                  <Text.Detail>
                    {this.props.employeeFetcher.employee.customerNumber}
                  </Text.Detail>
                )}
              </Spacings.Stack>
            }
            backToList={
              <BackToList
                to={this.props.employeeListUrl}
                label={this.props.intl.formatMessage(messages.backToList)}
              />
            }
            commands={
              <Spacings.Inline alignItems="flexEnd">
                <IconButton
                  label={this.props.intl.formatMessage(
                    messages.confirmDeleteTitle
                  )}
                  icon={<BinLinearIcon />}
                  onClick={this.props.deletionConfirmationModal.handleOpen}
                  data-track-component="Delete"
                  data-track-event="click"
                  isDisabled={!this.props.canManageEmployees}
                />
              </Spacings.Inline>
            }
          >
            <TabHeader
              key={TAB_NAMES.GENERAL}
              name={TAB_NAMES.GENERAL}
              to={
                !myCompanyRestriction
                  ? oneLineTrim`
                /${this.props.projectKey}
                /b2b-extension
                /employees
                /${this.props.employeeId}
                /${TAB_NAMES.GENERAL}
              `
                  : oneLineTrim`
                /${this.props.projectKey}
                /b2b-extension
                /my-company
                /employees
                /${this.props.employeeId}
                /${TAB_NAMES.GENERAL}
              `
              }
              state={this.props.location?.state}
            >
              {this.props.intl.formatMessage(messages.tabGeneral)}
            </TabHeader>
            <TabHeader
              key={TAB_NAMES.BUDGET}
              name={TAB_NAMES.BUDGET}
              to={
                !myCompanyRestriction
                  ? oneLineTrim`
                /${this.props.projectKey}
                /b2b-extension
                /employees
                /${this.props.employeeId}
                /${TAB_NAMES.BUDGET}
              `
                  : oneLineTrim`
                /${this.props.projectKey}
                /b2b-extension
                /my-company
                /employees
                /${this.props.employeeId}
                /${TAB_NAMES.BUDGET}
              `
              }
              state={this.props.location?.state}
            >
              {this.props.intl.formatMessage(messages.tabBudget)}
            </TabHeader>
            <TabHeader
              key={TAB_NAMES.ADDRESSES}
              name={TAB_NAMES.ADDRESSES}
              to={
                !myCompanyRestriction
                  ? oneLineTrim`
                /${this.props.projectKey}
                /b2b-extension
                /employees
                /${this.props.employeeId}
                /${TAB_NAMES.ADDRESSES}
              `
                  : oneLineTrim`
                /${this.props.projectKey}
                /b2b-extension
                /my-company
                /employees
                /${this.props.employeeId}
                /${TAB_NAMES.ADDRESSES}
              `
              }
              state={this.props.location?.state}
            >
              {this.props.intl.formatMessage(messages.tabAddresses)}
            </TabHeader>
            <TabHeader
              key={TAB_NAMES.ORDERS}
              name={TAB_NAMES.ORDERS}
              to={
                !myCompanyRestriction
                  ? oneLineTrim`
                /${this.props.projectKey}
                /b2b-extension
                /employees
                /${this.props.employeeId}
                /${TAB_NAMES.ORDERS}
              `
                  : oneLineTrim`
                /${this.props.projectKey}
                /b2b-extension
                /my-company
                /employees
                /${this.props.employeeId}
                /${TAB_NAMES.ORDERS}
              `
              }
              isDisabled={!this.props.canViewOrders}
              state={this.props.location?.state}
            >
              {this.props.intl.formatMessage(messages.tabOrders)}
            </TabHeader>
          </ViewHeader>
          <TabContainer>{this.props.children}</TabContainer>
        </View>

        {this.props.deletionConfirmationModal.isOpen && (
          <ConfirmationDialog
            title={this.props.intl.formatMessage(messages.confirmDeleteTitle)}
            isOpen={true}
            onClose={this.props.deletionConfirmationModal.handleClose}
            onCancel={this.props.deletionConfirmationModal.handleClose}
            onConfirm={this.handleDelete}
            labelPrimary={messages.confirmDeleteButton}
          >
            <Text.Body>
              <FormattedMessage
                {...messages.confirmDeleteMessage}
                values={{
                  name: (
                    <Text.Body isBold={true} as="span">
                      {formatEmployeeName(this.props.employeeFetcher.employee)}
                    </Text.Body>
                  ),
                }}
              />
            </Text.Body>
          </ConfirmationDialog>
        )}
      </div>
    );
  }
}

export default flowRight(
  connect(null, {
    showNotification: globalActions.showNotification,
    onActionError: globalActions.handleActionError,
  }),
  injectAuthorized(
    [PERMISSIONS.ViewOrders],
    {
      dataFences: [
        DATA_FENCES.store.ViewOrders,
        DATA_FENCES.store.ManageOrders,
      ],
      // GIVEN user has datafence permissions `ViewOrders` or `ManageOrders`
      getSelectDataFenceData: () => ({ actualDataFenceValues }) =>
        actualDataFenceValues || [],
    },
    'canViewOrders'
  ),
  injectAuthorized(
    [PERMISSIONS.ManageEmployees],
    {
      dataFences: [DATA_FENCES.store.ManageEmployees],
      getSelectDataFenceData: ownProps =>
        createSelectEmployeeDataFenceData({
          employee: ownProps.employeeFetcher.employee,
        }),
    },
    'canManageEmployees'
  ),
  withModalState('deletionConfirmationModal'),
  injectIntl
)(EmployeeDetails);
