import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { CollapsiblePanel } from '@commercetools-frontend/ui-kit';
import AccountDetailsChangePasswordPasswordField from './account-details-change-password-password-field';
import AccountDetailsChangePasswordPasswordConfirmationField from './account-details-change-password-password-confirmation-field';
import messages from './messages';

// eslint-disable-next-line react/display-name
const renderError = key => {
  switch (key) {
    case 'notMatch':
      return <FormattedMessage {...messages.passwordMismatch} />;
    default:
      return null;
  }
};

export class AccountDetailsChangePasswordSubform extends React.PureComponent {
  static displayName = 'AccountDetailsChangePasswordSubform';

  static propTypes = {
    formik: PropTypes.shape({
      values: PropTypes.shape({
        password: PropTypes.string,
        confirmedPassword: PropTypes.string,
      }).isRequired,
      errors: PropTypes.obj,
      touched: PropTypes.shape({
        password: PropTypes.bool,
      }),
      handleBlur: PropTypes.func.isRequired,
      handleChange: PropTypes.func.isRequired,
    }).isRequired,
  };

  render() {
    return (
      <CollapsiblePanel
        header={
          <CollapsiblePanel.Header>
            <FormattedMessage {...messages.panelTitle} />
          </CollapsiblePanel.Header>
        }
      >
        <AccountDetailsChangePasswordPasswordField
          formik={this.props.formik}
          renderError={renderError}
        />
        <AccountDetailsChangePasswordPasswordConfirmationField
          formik={this.props.formik}
          renderError={renderError}
        />
      </CollapsiblePanel>
    );
  }
}

export default AccountDetailsChangePasswordSubform;
