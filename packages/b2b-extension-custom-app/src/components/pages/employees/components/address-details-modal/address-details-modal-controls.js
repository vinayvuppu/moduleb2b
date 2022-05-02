import PropTypes from 'prop-types';
import React from 'react';
import flowRight from 'lodash.flowright';
import { injectIntl, FormattedMessage } from 'react-intl';
import {
  Text,
  Tooltip,
  Spacings,
  TruckIcon,
  IconButton,
  BinLinearIcon,
  PrimaryButton,
  SecondaryButton,
  PaperBillInvertedIcon,
} from '@commercetools-frontend/ui-kit';
import {
  FormModalPage,
  ConfirmationDialog,
} from '@commercetools-frontend/application-components';
import { withApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { withCountries } from '@commercetools-frontend/l10n';
import { withModalState } from '@commercetools-local/core/components/modal-state-container';
import formatEmployeeName from '@commercetools-local/utils/customer/format-customer-name';
import messages from './messages';

export class AddressDetailsModalControls extends React.PureComponent {
  static displayName = 'AddressDetailsModalControls';

  static propTypes = {
    isCreateMode: PropTypes.bool.isRequired,
    hasUnsavedChanges: PropTypes.bool.isRequired,
    selectedAddress: PropTypes.object,
    employeeFetcher: PropTypes.shape({
      isLoading: PropTypes.bool.isRequired,
      employee: PropTypes.object,
    }).isRequired,
    onConfirmSetDefaultAddress: PropTypes.func.isRequired,
    onConfirmDeleteAddress: PropTypes.func.isRequired,
    canManageEmployees: PropTypes.bool.isRequired,
    shouldDisableFormButtons: PropTypes.bool,
    onSubmitForm: PropTypes.func,
    onCancelForm: PropTypes.func,

    // HOC
    intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
      .isRequired,
    countries: PropTypes.objectOf(PropTypes.string),

    // withModalState
    deletionConfirmationModal: PropTypes.shape({
      isOpen: PropTypes.bool.isRequired,
      handleOpen: PropTypes.func.isRequired,
      handleClose: PropTypes.func.isRequired,
    }).isRequired,
    defaultAddressConfirmationModal: PropTypes.shape({
      isOpen: PropTypes.bool.isRequired,
      handleOpen: PropTypes.func.isRequired,
      handleClose: PropTypes.func.isRequired,
    }).isRequired,
    navigationControls: PropTypes.node,
  };

  state = {
    confirmDefaultAddressType: null,
  };

  handleSetDefaultAddress = type => {
    this.setState(
      {
        confirmDefaultAddressType: type,
      },
      () => this.props.defaultAddressConfirmationModal.handleOpen()
    );
  };

  render() {
    const isDefaultShippingAddress = Boolean(
      this.props.selectedAddress &&
        this.props.employeeFetcher.employee.defaultShippingAddressId ===
          this.props.selectedAddress.id
    );
    const isDefaultBillingAddress = Boolean(
      this.props.selectedAddress &&
        this.props.employeeFetcher.employee.defaultBillingAddressId ===
          this.props.selectedAddress.id
    );

    let baseTooltipMessage = messages.makeDefaultAddress;
    if (
      (this.props.hasUnsavedChanges || this.props.isCreateMode) &&
      !isDefaultBillingAddress &&
      !isDefaultShippingAddress
    )
      baseTooltipMessage = messages.defaultButtonDisabledTooltip;

    const tooltipMessageBilling = isDefaultBillingAddress
      ? messages.isDefaultAddress
      : baseTooltipMessage;
    const tooltipMessageShipping = isDefaultShippingAddress
      ? messages.isDefaultAddress
      : baseTooltipMessage;

    return (
      <React.Fragment>
        <ConfirmationDialog
          zIndex={1100}
          title={this.props.intl.formatMessage(
            messages.confirmDefaultAddressSetTitle,
            {
              type: this.state.confirmDefaultAddressType,
            }
          )}
          isOpen={this.props.defaultAddressConfirmationModal.isOpen}
          onClose={this.props.defaultAddressConfirmationModal.handleClose}
          onCancel={this.props.defaultAddressConfirmationModal.handleClose}
          onConfirm={() =>
            this.props
              .onConfirmSetDefaultAddress(this.state.confirmDefaultAddressType)
              .then(() =>
                this.props.defaultAddressConfirmationModal.handleClose()
              )
          }
        >
          <Text.Body
            intlMessage={{
              ...messages.confirmDefaultAddressSet,
              values: {
                type: this.state.confirmDefaultAddressType,
              },
            }}
          />
        </ConfirmationDialog>
        <Spacings.Stack scale="m" alignItems="flex-end">
          {!this.props.isCreateMode && this.props.navigationControls}
          <Spacings.Inline scale="m">
            <Spacings.Inline>
              <Tooltip
                title={this.props.intl.formatMessage(tooltipMessageBilling, {
                  type: 'billing',
                })}
                placement="left"
              >
                <IconButton
                  data-testid="billing" /* used for tests */
                  label={this.props.intl.formatMessage(tooltipMessageBilling, {
                    type: 'billing',
                  })}
                  isDisabled={
                    this.props.hasUnsavedChanges ||
                    this.props.isCreateMode ||
                    isDefaultBillingAddress ||
                    !this.props.canManageEmployees
                  }
                  isToggled={isDefaultBillingAddress}
                  isToggleButton={true}
                  theme="info"
                  icon={<PaperBillInvertedIcon />}
                  onClick={() => this.handleSetDefaultAddress('billing')}
                />
              </Tooltip>
              <Tooltip
                title={this.props.intl.formatMessage(tooltipMessageShipping, {
                  type: 'shipping',
                })}
                placement="left"
              >
                <IconButton
                  data-testid="shipping" /* used for tests */
                  label={this.props.intl.formatMessage(tooltipMessageShipping, {
                    type: 'shipping',
                  })}
                  isDisabled={
                    this.props.hasUnsavedChanges ||
                    this.props.isCreateMode ||
                    isDefaultShippingAddress ||
                    !this.props.canManageEmployees
                  }
                  isToggleButton={true}
                  isToggled={isDefaultShippingAddress}
                  theme="info"
                  icon={<TruckIcon />}
                  onClick={() => this.handleSetDefaultAddress('shipping')}
                />
              </Tooltip>

              {!this.props.isCreateMode && (
                <React.Fragment>
                  <IconButton
                    label={this.props.intl.formatMessage(
                      messages.confirmDeleteTitle
                    )}
                    isDisabled={!this.props.canManageEmployees}
                    icon={<BinLinearIcon />}
                    onClick={this.props.deletionConfirmationModal.handleOpen}
                    data-track-component="Delete"
                    data-track-event="click"
                  />
                  <ConfirmationDialog
                    zIndex={1100}
                    title={this.props.intl.formatMessage(
                      messages.confirmDeleteTitle
                    )}
                    isOpen={this.props.deletionConfirmationModal.isOpen}
                    onClose={this.props.deletionConfirmationModal.handleClose}
                    onCancel={this.props.deletionConfirmationModal.handleClose}
                    onConfirm={this.props.onConfirmDeleteAddress}
                    labelPrimary={messages.confirmDeleteAddressButton}
                  >
                    <Text.Body>
                      <FormattedMessage
                        {...messages.confirmDeleteDialogMessage}
                        values={{
                          name: formatEmployeeName(
                            this.props.employeeFetcher.employee
                          ),
                        }}
                      />
                    </Text.Body>
                  </ConfirmationDialog>
                </React.Fragment>
              )}
            </Spacings.Inline>
            <Spacings.Inline>
              <SecondaryButton
                label={this.props.intl.formatMessage(FormModalPage.Intl.cancel)}
                onClick={this.props.onCancelForm}
                isDisabled={this.props.shouldDisableFormButtons}
              />
              <PrimaryButton
                label={this.props.intl.formatMessage(FormModalPage.Intl.save)}
                onClick={this.props.onSubmitForm}
                isDisabled={this.props.shouldDisableFormButtons}
              />
            </Spacings.Inline>
          </Spacings.Inline>
        </Spacings.Stack>
      </React.Fragment>
    );
  }
}

export default flowRight(
  injectIntl,
  withModalState('deletionConfirmationModal'),
  withModalState('defaultAddressConfirmationModal'),
  withApplicationContext(applicationContext => ({
    locale: applicationContext.user.locale,
  })),
  withCountries(ownProps => ownProps.locale)
)(AddressDetailsModalControls);
