import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import flowRight from 'lodash.flowright';
import memoize from 'memoize-one';
import { Formik } from 'formik';
import { injectIntl, FormattedMessage } from 'react-intl';
import { DOMAINS } from '@commercetools-frontend/constants';
import { injectAuthorized } from '@commercetools-frontend/permissions';
import formatEmployeeName from '@commercetools-local/utils/customer/format-customer-name';
import * as globalActions from '@commercetools-frontend/actions-global';
import View from '@commercetools-local/core/components/view';
import ViewHeader from '@commercetools-local/core/components/view-header';
import TabContainer from '@commercetools-local/core/components/tab-container';
import WarningSaveToolbar from '@commercetools-local/core/components/warning-save-toolbar';
import TabContentLayout from '@commercetools-local/core/components/tab-content-layout';
import PageBottomSpacer from '@commercetools-local/core/components/page-bottom-spacer';
import LabelRequired from '@commercetools-local/core/components/fields/label-required';
import { Spacings } from '@commercetools-frontend/ui-kit';
import GeneralDetailsSubform from '../general-details-subform';
import AccountDetailsChangePasswordSubform from '../account-details-change-password-subform';
import EmployeeCreateConnector from '../employee-create-connector';
import { PERMISSIONS, DATA_FENCES } from '../../../../../constants';
import B2BApolloClientContext from '../../../../common/b2b-apollo-client-context';

import messages from './messages';
import validate from './validations';
import { formValuesToDoc, initialValues } from './conversions';
import transformErrors from './transform-errors';

export class EmployeeCreate extends React.PureComponent {
  static displayName = 'EmployeeCreate';

  static propTypes = {
    projectKey: PropTypes.string.isRequired,
    companyId: PropTypes.string,
    goToEmployeeDetails: PropTypes.func.isRequired,
    goToEmployeesList: PropTypes.func.isRequired,
    // Action creators
    showNotification: PropTypes.func.isRequired,
    onActionError: PropTypes.func.isRequired,

    // HOC
    intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
      .isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    canManageEmployees: PropTypes.bool.isRequired,
  };

  createHandleCreate = memoize(execute => (employeeDraft, formikBag) => {
    return execute(formValuesToDoc(employeeDraft)).then(
      createdEmployee => {
        formikBag.resetForm();
        this.props.goToEmployeeDetails(createdEmployee.id);

        this.props.showNotification({
          kind: 'success',
          domain: DOMAINS.SIDE,
          text: this.props.intl.formatMessage(messages.employeeCreated, {
            name: formatEmployeeName({
              firstName: createdEmployee.firstName,
              lastName: createdEmployee.lastName,
            }),
          }),
        });
      },
      errors => {
        const transformedErrors = transformErrors(errors);
        formikBag.setErrors(transformedErrors.formErrors);
        if (transformedErrors.unmappedErrors.length > 0) {
          this.props.onActionError(
            transformedErrors.unmappedErrors,
            'EmployeeCreate/createHandleCreate'
          );
        }
      }
    );
  });

  render() {
    return (
      <div data-track-component="EmployeesCreate">
        <View>
          <ViewHeader
            title={this.props.intl.formatMessage(messages.title)}
            subtitle={
              <div>
                <FormattedMessage {...messages.subtitle} />
                <br />
                <LabelRequired />
              </div>
            }
          />
          <B2BApolloClientContext.Consumer
            data-track-component={'B2b-apollo-context'}
          >
            {({ apolloClient }) => {
              return (
                <EmployeeCreateConnector apolloClient={apolloClient}>
                  {({ employeeCreator }) => (
                    <Formik
                      initialValues={{
                        ...initialValues,
                        company: this.props.companyId,
                        customerGroup: this.props.companyId,
                        stores: [this.props.companyId],
                      }}
                      onSubmit={this.createHandleCreate(
                        employeeCreator.execute
                      )}
                      enableReinitialize={true}
                      validate={validate}
                      render={formikProps => (
                        <TabContainer>
                          <TabContentLayout>
                            <Spacings.Stack scale="m">
                              <GeneralDetailsSubform
                                canManageEmployees={
                                  this.props.canManageEmployees
                                }
                                formik={formikProps}
                                cannotChangeCustomerNumber={false}
                                companyId={this.props.companyId}
                              />
                              <AccountDetailsChangePasswordSubform
                                formik={formikProps}
                              />

                              <PageBottomSpacer />
                            </Spacings.Stack>
                          </TabContentLayout>
                          <WarningSaveToolbar
                            onSave={formikProps.handleSubmit}
                            onCancel={this.props.goToEmployeesList}
                            shouldWarnOnLeave={
                              formikProps.dirty || formikProps.isSubmitting
                            }
                            isToolbarVisible={!employeeCreator.isLoading}
                          />
                        </TabContainer>
                      )}
                    />
                  )}
                </EmployeeCreateConnector>
              );
            }}
          </B2BApolloClientContext.Consumer>
        </View>
      </div>
    );
  }
}

export default flowRight(
  connect(null, {
    showNotification: globalActions.showNotification,
    onActionError: globalActions.handleActionError,
  }),
  injectIntl,
  injectAuthorized(
    [PERMISSIONS.ManageEmployees],
    {
      dataFences: [DATA_FENCES.store.ManageEmployees],
      getSelectDataFenceData: () => ({ actualDataFenceValues }) =>
        actualDataFenceValues || [],
    },
    'canManageEmployees'
  )
)(EmployeeCreate);
