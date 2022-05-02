import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Spacings } from '@commercetools-frontend/ui-kit';

import { Formik } from 'formik';
import LabelRequired from '@commercetools-local/core/components/fields/label-required';
import { injectAuthorized } from '@commercetools-frontend/permissions';
import ReadOnlyMessage from '@commercetools-local/core/components/read-only-message';
import PageBottomSpacer from '@commercetools-local/core/components/page-bottom-spacer';
import TabContentLayout from '@commercetools-local/core/components/tab-content-layout';
import MetaDates from '@commercetools-local/core/components/meta-dates';
import createSelectEmployeeDataFenceData from '../../../../utils/create-select-employee-data-fence-data';
import AccountDetailsResetPasswordPanel from '../account-details-reset-password-panel';
import GeneralDetailsSubform from '../general-details-subform';
import { PERMISSIONS, DATA_FENCES } from '../../../../../constants';
import messages from './messages';
import { docToFormValues, formValuesToDoc } from './conversions';
import validate from './validations';

const ManageMessage = () => (
  <div>
    <FormattedMessage {...messages.title} />
    <br />
    <LabelRequired />
  </div>
);
ManageMessage.displayName = 'ManageMessage';

export const GeneralInfoForm = props => (
  <Formik
    validate={validate}
    initialValues={docToFormValues(props.employee)}
    onSubmit={(values, formikBag) =>
      props.onSubmit(formValuesToDoc(values), formikBag)
    }
    enableReinitialize={true}
    render={formikProps => {
      const form = (
        <TabContentLayout
          header={
            <MetaDates
              created={formikProps.values.createdAt}
              modified={formikProps.values.lastModifiedAt}
            />
          }
          description={
            props.canManageEmployees ? <ManageMessage /> : <ReadOnlyMessage />
          }
          data-track-component="EmployeesGeneral"
        >
          <Spacings.Stack scale="m">
            <GeneralDetailsSubform
              canManageEmployees={props.canManageEmployees}
              formik={formikProps}
              companyId={props.employee.customerGroup.key}
              cannotChangeCustomerNumber={Boolean(
                props.employee.customerNumber
              )}
            />
            <AccountDetailsResetPasswordPanel
              firstName={formikProps.values.firstName}
              lastName={formikProps.values.lastName}
              onPasswordReset={props.onPasswordReset}
              canManageEmployees={props.canManageEmployees}
            />
          </Spacings.Stack>
          <PageBottomSpacer />
        </TabContentLayout>
      );
      return props.children({
        form,
        isDirty: formikProps.dirty,
        isSubmitting: formikProps.isSubmitting,
        handleSubmit: formikProps.handleSubmit,
        handleReset: formikProps.handleReset,
      });
    }}
  />
);
GeneralInfoForm.displayName = 'GeneralInfoForm';
GeneralInfoForm.propTypes = {
  children: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onPasswordReset: PropTypes.func.isRequired,
  employee: PropTypes.object.isRequired,
  canManageEmployees: PropTypes.bool.isRequired,
};

export default injectAuthorized(
  [PERMISSIONS.ManageEmployees],
  {
    dataFences: [DATA_FENCES.store.ManageEmployees],
    getSelectDataFenceData: createSelectEmployeeDataFenceData,
  },
  'canManageEmployees'
)(GeneralInfoForm);
