import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import flowRight from 'lodash.flowright';
import memoize from 'memoize-one';
import { injectIntl } from 'react-intl';
import { DOMAINS } from '@commercetools-frontend/constants';
import formatEmployeeName from '@commercetools-local/utils/customer/format-customer-name';
import * as globalActions from '@commercetools-frontend/actions-global';
import WarnOnLeave from '@commercetools-local/core/components/warn-on-leave';
import SaveToolbar from '@commercetools-local/core/components/save-toolbar';
import { LoadingSpinner } from '@commercetools-frontend/ui-kit';
import employeeDetailMessages from '../employee-details/messages';
import GeneralInfoForm from '../general-info-form';
import transformErrors from './transform-errors';

export class EmployeeDetailsGeneralTab extends React.Component {
  static displayName = 'EmployeeDetailsGeneralTab';
  static propTypes = {
    employeeFetcher: PropTypes.shape({
      isLoading: PropTypes.bool.isRequired,
      employee: PropTypes.object,
    }),
    employeeUpdater: PropTypes.shape({
      isLoading: PropTypes.bool.isRequired,
      execute: PropTypes.func.isRequired,
    }),
    employeePasswordReseter: PropTypes.shape({
      isLoading: PropTypes.bool.isRequired,
      execute: PropTypes.func.isRequired,
    }),
    // Connected
    showNotification: PropTypes.func.isRequired,
    onActionError: PropTypes.func.isRequired,
    intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
      .isRequired,
  };

  createHandleUpdate = memoize(execute => (draft, formikBag) => {
    execute(draft).then(
      updatedEmployee => {
        formikBag.setSubmitting(false);
        this.props.showNotification({
          kind: 'success',
          domain: DOMAINS.SIDE,
          text: this.props.intl.formatMessage(
            employeeDetailMessages.employeeUpdated,
            {
              name: formatEmployeeName({
                firstName: updatedEmployee.firstName,
                lastName: updatedEmployee.lastName,
              }),
            }
          ),
        });
      },
      errors => {
        formikBag.setSubmitting(false);
        const transformedErrors = transformErrors(errors);
        formikBag.setErrors(transformedErrors.formErrors);
        if (transformedErrors.unmappedErrors.length > 0) {
          this.props.onActionError(
            transformedErrors.unmappedErrors,
            'EmployeeDetailsGeneralTab/createHandleUpdate'
          );
        }
      }
    );
  });

  createHandleResetEmployeePassword = memoize(execute => newPassword =>
    execute(newPassword)
  );

  render() {
    return this.props.employeeFetcher.isLoading ? (
      <LoadingSpinner />
    ) : (
      <GeneralInfoForm
        onSubmit={this.createHandleUpdate(this.props.employeeUpdater.execute)}
        employee={this.props.employeeFetcher.employee}
        onPasswordReset={this.createHandleResetEmployeePassword(
          this.props.employeePasswordReseter.execute
        )}
      >
        {({ form, isDirty, isSubmitting, handleSubmit, handleReset }) => (
          <React.Fragment>
            {form}
            <WarnOnLeave shouldWarn={isDirty} onConfirmLeave={handleReset} />
            <SaveToolbar
              onSave={handleSubmit}
              onCancel={handleReset}
              isVisible={isDirty && !isSubmitting}
            />
          </React.Fragment>
        )}
      </GeneralInfoForm>
    );
  }
}

export default flowRight(
  connect(null, {
    showNotification: globalActions.showNotification,
    onActionError: globalActions.handleActionError,
  }),
  injectIntl
)(EmployeeDetailsGeneralTab);
