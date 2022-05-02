import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { TextField } from '@commercetools-frontend/ui-kit';
import FormBox from '@commercetools-local/core/components/form-box';
import messages from './messages';

export const AccountDetailsChangePasswordPasswordField = props => (
  <FormBox>
    <TextField
      title={<FormattedMessage {...messages.labelPassword} />}
      isRequired={true}
      name="password"
      value={props.formik.values.password}
      onChange={props.formik.handleChange}
      onBlur={props.formik.handleBlur}
      touched={props.formik.touched.password}
      errors={props.formik.errors.password}
      renderError={props.renderError}
    />
  </FormBox>
);

AccountDetailsChangePasswordPasswordField.displayName =
  'AccountDetailsChangePasswordPasswordField';
AccountDetailsChangePasswordPasswordField.propTypes = {
  formik: PropTypes.shape({
    values: PropTypes.shape({
      password: PropTypes.string,
    }).isRequired,
    touched: PropTypes.shape({
      password: PropTypes.bool,
    }).isRequired,
    errors: PropTypes.shape({
      password: PropTypes.object,
    }).isRequired,
    handleChange: PropTypes.func.isRequired,
    handleBlur: PropTypes.func.isRequired,
  }).isRequired,
  renderError: PropTypes.func.isRequired,
};

export default AccountDetailsChangePasswordPasswordField;
