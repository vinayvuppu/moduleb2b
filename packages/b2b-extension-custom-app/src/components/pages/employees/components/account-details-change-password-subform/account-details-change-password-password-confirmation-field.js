import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { TextField } from '@commercetools-frontend/ui-kit';
import FormBox from '@commercetools-local/core/components/form-box';
import messages from './messages';

export const AccountDetailsChangePasswordPasswordConfirmationField = props => (
  <FormBox>
    <TextField
      title={<FormattedMessage {...messages.labelConfirmPassword} />}
      isRequired={true}
      name="confirmedPassword"
      value={props.formik.values.confirmedPassword}
      onChange={props.formik.handleChange}
      onBlur={props.formik.handleBlur}
      touched={props.formik.touched.confirmedPassword}
      errors={props.formik.errors.confirmedPassword}
      renderError={props.renderError}
    />
  </FormBox>
);

AccountDetailsChangePasswordPasswordConfirmationField.displayName =
  'AccountDetailsChangePasswordPasswordConfirmationField';
AccountDetailsChangePasswordPasswordConfirmationField.propTypes = {
  formik: PropTypes.shape({
    values: PropTypes.shape({
      confirmedPassword: PropTypes.string,
    }).isRequired,
    touched: PropTypes.shape({
      confirmedPassword: PropTypes.bool,
    }).isRequired,
    errors: PropTypes.shape({
      confirmedPassword: PropTypes.object,
    }).isRequired,
    handleChange: PropTypes.func.isRequired,
    handleBlur: PropTypes.func.isRequired,
  }).isRequired,
  renderError: PropTypes.func.isRequired,
};

export default AccountDetailsChangePasswordPasswordConfirmationField;
