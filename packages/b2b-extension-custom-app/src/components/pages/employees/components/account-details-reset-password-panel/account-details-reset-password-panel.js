import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import flowRight from 'lodash.flowright';
import { DOMAINS } from '@commercetools-frontend/constants';

import * as globalActions from '@commercetools-frontend/actions-global';
import { ConfirmationDialog } from '@commercetools-frontend/application-components';
import {
  CollapsiblePanel,
  PrimaryButton,
  TextInput,
  Spacings,
  FieldLabel,
  CheckboxInput,
  Text,
} from '@commercetools-frontend/ui-kit';
import FormBox from '@commercetools-local/core/components/form-box';
import formatEmployeeName from '@commercetools-local/utils/customer/format-customer-name';
import messages from './messages';

export class AccountDetailsResetPasswordPanel extends React.PureComponent {
  static displayName = 'AccountDetailsResetPasswordPanel';

  static propTypes = {
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    onPasswordReset: PropTypes.func.isRequired,
    showNotification: PropTypes.func.isRequired,
    onActionError: PropTypes.func.isRequired,

    intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
      .isRequired,
    canManageEmployees: PropTypes.bool.isRequired,
  };

  state = {
    isConfirmationDialogOpen: false,
    newPassword: null,
    useRandomGeneratedPassword: false,
    randomGeneratedPassword: null,
  };

  handleRandomGeneratedPasswordToggle = () => {
    this.setState(prevState => ({
      newPassword: null,
      useRandomGeneratedPassword: !prevState.useRandomGeneratedPassword,
      randomGeneratedPassword: prevState.useRandomGeneratedPassword
        ? null // reset value if option to generate a password is unchecked
        : generateRandomPassword(),
    }));
  };

  handleInputChange = event => {
    const {
      target: { value },
    } = event;
    this.setState({ newPassword: value || null });
  };

  handleResetPassword = () => {
    this.props
      .onPasswordReset(
        this.state.useRandomGeneratedPassword
          ? this.state.randomGeneratedPassword
          : this.state.newPassword
      )
      .then(
        nextEmployee => {
          this.setState({
            newPassword: null,
            useRandomGeneratedPassword: false,
            randomGeneratedPassword: null,
          });
          this.props.showNotification({
            kind: 'success',
            text: this.props.intl.formatMessage(
              messages.passwordResetNotification,
              {
                name: formatEmployeeName({
                  firstName: nextEmployee.firstName,
                  lastName: nextEmployee.lastName,
                }),
                password: this.state.randomGeneratedPassword,
              }
            ),
            domain: DOMAINS.SIDE,
          });
        },
        error =>
          this.props.onActionError(
            error,
            'AccountDetailsResetPasswordPanel/resetEmployeePassword'
          )
      );

    this.setState({ isConfirmationDialogOpen: false });
  };

  openConfirmationDialog = () => {
    this.setState({ isConfirmationDialogOpen: true });
  };

  closeConfirmationDialog = () => {
    this.setState({ isConfirmationDialogOpen: false });
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
        <FormBox>
          <Spacings.Stack>
            <Spacings.Stack scale="xs">
              <FieldLabel
                title={this.props.intl.formatMessage(messages.labelPassword)}
              />
              <Spacings.Inline alignItems="center">
                <TextInput
                  data-testid="newPassword"
                  isDisabled={!this.props.canManageEmployees}
                  name="newPassword"
                  value={
                    this.state.newPassword ||
                    this.state.randomGeneratedPassword ||
                    ''
                  }
                  onChange={this.handleInputChange}
                  isReadOnly={this.state.useRandomGeneratedPassword}
                />
                <PrimaryButton
                  data-testid="newPasswordButton"
                  label={this.props.intl.formatMessage(
                    messages.labelResetPasswordButton
                  )}
                  isDisabled={
                    !(
                      this.state.newPassword ||
                      this.state.useRandomGeneratedPassword
                    )
                  }
                  onClick={this.openConfirmationDialog}
                />
              </Spacings.Inline>
            </Spacings.Stack>
            <CheckboxInput
              data-testid="generateRandomPassword"
              value="generateRandomPassword"
              isChecked={this.state.useRandomGeneratedPassword}
              isDisabled={!this.props.canManageEmployees}
              onChange={this.handleRandomGeneratedPasswordToggle}
            >
              <FormattedMessage {...messages.labelGenerateRandomPassword} />
            </CheckboxInput>
          </Spacings.Stack>
        </FormBox>

        {this.state.isConfirmationDialogOpen && (
          <ConfirmationDialog
            title={this.props.intl.formatMessage(messages.modalTitle)}
            isOpen={true}
            onClose={this.closeConfirmationDialog}
            onCancel={this.closeConfirmationDialog}
            onConfirm={this.handleResetPassword}
            labelPrimary={messages.confirmResetButton}
          >
            <Text.Body>
              <FormattedMessage
                {...messages.modalMessage}
                values={{
                  name: (
                    <Text.Body isBold={true} as="span">
                      {formatEmployeeName({
                        firstName: this.props.firstName,
                        lastName: this.props.lastName,
                      })}
                    </Text.Body>
                  ),
                  password: (
                    <Text.Body isBold={true} as="span">
                      {(this.state.useRandomGeneratedPassword
                        ? this.state.randomGeneratedPassword
                        : this.state.newPassword) || ' '}
                    </Text.Body>
                  ),
                }}
              />
            </Text.Body>
          </ConfirmationDialog>
        )}
      </CollapsiblePanel>
    );
  }
}

export default flowRight(
  connect(null, {
    showNotification: globalActions.showNotification,
    onActionError: globalActions.handleActionError,
  }),
  injectIntl
)(AccountDetailsResetPasswordPanel);

function generateRandomPassword() {
  return Math.random()
    .toString(36)
    .slice(-8);
}
