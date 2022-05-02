import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import { connect } from 'react-redux';
import { DOMAINS } from '@commercetools-frontend/constants';
import * as globalActions from '@commercetools-frontend/actions-global';

import { useFormik } from 'formik';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  CollapsiblePanel,
  Spacings,
  SelectField,
  SecondaryButton,
  RefreshIcon,
  Text,
  ErrorMessage,
} from '@commercetools-frontend/ui-kit';
import {
  RestrictedByPermissions,
  useIsAuthorized,
} from '@commercetools-frontend/permissions';
import { ConfirmationDialog } from '@commercetools-frontend/application-components';

import WarningSaveToolbar from '@commercetools-local/core/components/warning-save-toolbar';
import ReadOnlyMessage from '@commercetools-local/core/components/read-only-message';
import ResetEmployeesMutation from './reset-employees.graphql';

import { PERMISSIONS } from '../../../../../constants';
import { getRoles } from '../../../../utils/roles';
import messages from './messages';
import validate from '../company-form/validations';
import AmmountRolModalSection from './amount-roles-section';
import RequiresApprovalRuleSection from './requires-approval-rule-section';
import B2BApolloClientContext from '../../../../common/b2b-apollo-client-context';
import { requiredApprovalRolesValidator, budgetValidator } from './validations';

export const CompanyRulesForm = props => {
  const { formatMessage } = useIntl();

  const b2bApolloClientContext = useContext(B2BApolloClientContext.Context);

  const [resetEmployees] = useMutation(ResetEmployeesMutation, {
    client: b2bApolloClientContext.apolloClient,
  });

  const [isOpenResetConfirmation, setOpenResetConfirmation] = useState(false);
  const handleOpenResetConfirmation = () => setOpenResetConfirmation(true);
  const handleCloseResetConfirmation = () => setOpenResetConfirmation(false);

  const handleOnConfirmReset = async () => {
    props.hideAllPageNotifications();

    try {
      await resetEmployees({
        variables: { companyId: props.initialValues.id },
      });
      props.showNotification({
        kind: 'success',
        domain: DOMAINS.SIDE,
        text: formatMessage(messages.resetSuccess),
      });
      handleCloseResetConfirmation();
    } catch (error) {
      props.showNotification({
        kind: 'error',
        domain: DOMAINS.SIDE,
        text: formatMessage(messages.resetError),
      });
    }
  };

  const isAuthorized = useIsAuthorized({
    demandedPermissions: [PERMISSIONS.ManageCompanies],
  });

  const formik = useFormik({
    initialValues: props.initialValues,
    onSubmit: props.onSubmit,
    enableReinitialize: true,
    validate: values => validate(values, formatMessage),
  });

  return (
    <React.Fragment>
      <Spacings.Stack scale="m">
        <RestrictedByPermissions
          permissions={[PERMISSIONS.ManageCompanies]}
          unauthorizedComponent={ReadOnlyMessage}
        />
        <form onSubmit={formik.handleSubmit}>
          <Spacings.Stack scale="m">
            <CollapsiblePanel
              header={
                <CollapsiblePanel.Header>
                  <FormattedMessage {...messages.labelRequiredInfoTitle} />
                </CollapsiblePanel.Header>
              }
            >
              <SelectField
                title={formatMessage(messages.labelApproverRolesField)}
                name="approverRoles"
                value={formik.values.approverRoles}
                isMulti={true}
                options={getRoles(formatMessage)}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                errors={
                  formik.errors.approverRoles?.length && { approverRoles: true }
                }
                isDisabled={formik.isSubmitting || !isAuthorized}
                touched={formik.touched.approverRoles}
              />
              {formik.errors.approverRoles?.length &&
                formik.touched.approverRoles && (
                  <Spacings.Stack>
                    {formik.errors.approverRoles.map(error => (
                      <ErrorMessage key={error}>{error}</ErrorMessage>
                    ))}
                  </Spacings.Stack>
                )}
            </CollapsiblePanel>
            <RequiresApprovalRuleSection
              label={formatMessage(messages.requiredApporvalRolesLabel)}
              addLabel={formatMessage(messages.addRequiredApprovalRol)}
              formik={formik}
              validate={values =>
                requiredApprovalRolesValidator(
                  values,
                  formatMessage,
                  formik.values
                )
              }
            />
            <AmmountRolModalSection
              label={formatMessage(messages.labelCompanyBudgets)}
              addLabel={formatMessage(messages.addBuget)}
              values={formik.values.budget}
              setValues={values => formik.setFieldValue('budget', values)}
              validate={values =>
                budgetValidator(values, formatMessage, formik.values)
              }
              additionalActions={
                <SecondaryButton
                  label={formatMessage(messages.resetEmployeesBudget)}
                  iconLeft={<RefreshIcon />}
                  isDisabled={!isAuthorized}
                  onClick={handleOpenResetConfirmation}
                />
              }
            />
          </Spacings.Stack>
        </form>
        <WarningSaveToolbar
          onSave={formik.handleSubmit}
          onCancel={() => {
            formik.handleReset();
            props.onCancel();
          }}
          shouldWarnOnLeave={formik.dirty}
          isToolbarVisible={props.isSaveToolbarAlwaysVisible || formik.dirty}
          isToolbarDisabled={formik.isSubmitting}
        />
      </Spacings.Stack>
      {isOpenResetConfirmation && (
        <ConfirmationDialog
          zIndex={1100}
          title={formatMessage(messages.confirmResetBudget)}
          isOpen={isOpenResetConfirmation}
          onClose={handleCloseResetConfirmation}
          onCancel={handleCloseResetConfirmation}
          onConfirm={handleOnConfirmReset}
        >
          <Text.Body
            intlMessage={{
              ...messages.confirmResetBudgetDescription,
            }}
          />
        </ConfirmationDialog>
      )}
    </React.Fragment>
  );
};

const mapDispatchToProps = {
  showNotification: globalActions.showNotification,
  hideAllPageNotifications: globalActions.hideAllPageNotifications,
};

CompanyRulesForm.propTypes = {
  isSaveToolbarAlwaysVisible: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  initialValues: PropTypes.shape({
    id: PropTypes.string,
    key: PropTypes.string,
    name: PropTypes.string,
  }),
  // connect
  showNotification: PropTypes.func.isRequired,
  hideAllPageNotifications: PropTypes.func.isRequired,
};
CompanyRulesForm.defaultProps = {
  isSaveToolbarAlwaysVisible: false,
  onCancel: () => {},
};
CompanyRulesForm.displayName = 'CompanyRulesForm';

export default connect(null, mapDispatchToProps)(CompanyRulesForm);
