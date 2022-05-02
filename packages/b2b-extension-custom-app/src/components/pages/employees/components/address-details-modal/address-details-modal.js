import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import flowRight from 'lodash.flowright';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import oneLineTrim from 'common-tags/lib/oneLineTrim';
import { withCountries } from '@commercetools-frontend/l10n';
import {
  Text,
  Spacings,
  AngleLeftIcon,
  AngleRightIcon,
  LoadingSpinner,
  SecondaryIconButton,
} from '@commercetools-frontend/ui-kit';
import { withApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { DOMAINS } from '@commercetools-frontend/constants';

import * as globalActions from '@commercetools-frontend/actions-global';

import { injectAuthorized } from '@commercetools-frontend/permissions';
import {
  PageNotFound,
  InfoModalPage,
  FormModalPage,
} from '@commercetools-frontend/application-components';
import WarnOnLeave from '@commercetools-local/core/components/warn-on-leave';
import formatEmployeeName from '@commercetools-local/utils/customer/format-customer-name';

import createEmployeeDataFenceData from '../../../../utils/create-select-employee-data-fence-data';
import { PERMISSIONS, DATA_FENCES } from '../../../../../constants';

import { TAB_NAMES } from '../employee-details';
import AddressDetailsForm from '../address-details-form';
import employeeDetailMessages from '../employee-details/messages';
import messages from './messages';
import AddressDetailsModalControls from './address-details-modal-controls';
import initialValues from './conversions';

const NavigationControls = props => {
  return (
    <Spacings.Inline scale="s" alignItems="center">
      <SecondaryIconButton
        label="arrow-left"
        isDisabled={props.isPreviousDisabled}
        onClick={props.onPreviousClick}
        data-track-event="click"
        data-track-component="Previous"
        icon={<AngleLeftIcon size="small" color="primary" />}
      />
      <Text.Body>{props.children}</Text.Body>
      <SecondaryIconButton
        label="arrow-right"
        isDisabled={props.isNextDisabled}
        onClick={props.onNextClick}
        data-track-event="click"
        data-track-component="Next"
        icon={<AngleRightIcon size="small" color="primary" />}
      ></SecondaryIconButton>
    </Spacings.Inline>
  );
};

NavigationControls.displayName = 'NavigationControls';
NavigationControls.propTypes = {
  children: PropTypes.string,
  onNextClick: PropTypes.func.isRequired,
  onPreviousClick: PropTypes.func.isRequired,
  isNextDisabled: PropTypes.bool,
  isPreviousDisabled: PropTypes.bool,
};

export class AddressDetailsModal extends React.PureComponent {
  static displayName = 'AddressDetailsModal';

  static propTypes = {
    employeeUpdater: PropTypes.shape({
      isLoading: PropTypes.bool.isRequired,
      execute: PropTypes.func.isRequired,
    }).isRequired,
    employeeDefaultAddressUpdater: PropTypes.shape({
      isLoading: PropTypes.bool.isRequired,
      execute: PropTypes.func.isRequired,
    }),
    employeeFetcher: PropTypes.shape({
      isLoading: PropTypes.bool.isRequired,
      employee: PropTypes.object,
    }).isRequired,
    isCreateMode: PropTypes.bool.isRequired,
    projectKey: PropTypes.string.isRequired,
    addressId: PropTypes.string,

    // actions
    showNotification: PropTypes.func.isRequired,
    onActionError: PropTypes.func.isRequired,

    // HOC
    intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
      .isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    countries: PropTypes.object.isRequired,
    canManageEmployees: PropTypes.bool.isRequired,
  };

  handleCloseModal = () => {
    this.props.history.push(
      oneLineTrim`
        /${this.props.projectKey}
        /b2b-extension
        /employees
        /${this.props.employeeFetcher.employee.id}
        /${TAB_NAMES.ADDRESSES}
      `
    );
  };

  redirectToAddress = (employeeId, addressId) => {
    this.props.history.push(
      oneLineTrim`
        /${this.props.projectKey}
        /b2b-extension
        /employees
        /${employeeId}
        /${TAB_NAMES.ADDRESSES}
        /${addressId}
      `
    );
  };

  handleCreateAddress = (values, formikBag) => {
    const employeeWithNewAddressDraft = {
      ...this.props.employeeFetcher.employee,
      addresses: [...this.props.employeeFetcher.employee.addresses, values],
    };

    this.props.employeeUpdater.execute(employeeWithNewAddressDraft).then(
      updatedEmployee => {
        formikBag.setSubmitting(false);
        formikBag.resetForm();
        if (this.props.isCreateMode) {
          const newlyCreatedAddress =
            updatedEmployee.addresses[updatedEmployee.addresses.length - 1];
          this.redirectToAddress(updatedEmployee.id, newlyCreatedAddress.id);
        }

        this.props.showNotification({
          kind: 'success',
          domain: DOMAINS.SIDE,
          text: this.props.intl.formatMessage(
            employeeDetailMessages.employeeUpdated,
            { name: formatEmployeeName(updatedEmployee) }
          ),
        });
      },
      errors => {
        this.props.onActionError(
          errors,
          'AddressDetailsModal/handleCreateAddress'
        );
      }
    );
  };

  handleUpdateAddress = (values, formikBag) => {
    const addresses = this.props.employeeFetcher.employee.addresses;
    const addressIndex = addresses.findIndex(
      address => address.id === this.props.addressId
    );

    const employeeWithUpdatedAddressDraft = {
      ...this.props.employeeFetcher.employee,
      addresses: [
        ...addresses.slice(0, addressIndex),
        values,
        ...addresses.slice(addressIndex + 1),
      ],
    };

    this.props.employeeUpdater.execute(employeeWithUpdatedAddressDraft).then(
      updatedEmployee => {
        formikBag.setSubmitting(false);
        this.props.showNotification({
          kind: 'success',
          domain: DOMAINS.SIDE,
          text: this.props.intl.formatMessage(
            employeeDetailMessages.employeeUpdated,
            { name: formatEmployeeName(updatedEmployee) }
          ),
        });
      },
      errors => {
        this.props.onActionError(
          errors,
          'AddressDetailsModal/handleUpdateAddress'
        );
      }
    );
  };

  handleConfirmSetDefaultAddress = addressType => {
    const action = {
      action:
        addressType === 'shipping'
          ? 'setDefaultShippingAddress'
          : 'setDefaultBillingAddress',
      addressId: this.props.addressId,
    };
    return this.props.employeeDefaultAddressUpdater.execute(action).then(
      updatedEmployee => {
        this.props.showNotification({
          kind: 'success',
          domain: DOMAINS.SIDE,
          text: this.props.intl.formatMessage(messages.defaultAddressSet, {
            type: addressType,
            employeeName: formatEmployeeName(updatedEmployee),
          }),
        });
      },
      error =>
        this.props.onActionError(
          error,
          'AddressDetailsModal/setDefaultEmployeeAddress'
        )
    );
  };

  handleConfirmDeleteAddress = () => {
    const employeeWithoutDeletedAddressDraft = {
      ...this.props.employeeFetcher.employee,
      addresses: this.props.employeeFetcher.employee.addresses.filter(
        address => address.id !== this.props.addressId
      ),
    };

    this.props.employeeUpdater.execute(employeeWithoutDeletedAddressDraft).then(
      updatedEmployee => {
        this.props.showNotification({
          kind: 'success',
          text: this.props.intl.formatMessage(messages.employeeAddressDeleted, {
            name: formatEmployeeName(updatedEmployee),
          }),
          domain: DOMAINS.SIDE,
        });
        this.handleCloseModal();
      },
      errors => {
        this.props.onActionError(
          errors,
          'AddressDetailsModal/deleteEmployeeAddress'
        );
      }
    );
  };

  handleNavigateToAddress = addressIndex =>
    this.redirectToAddress(
      this.props.employeeFetcher.employee.id,
      this.props.employeeFetcher.employee.addresses[addressIndex].id
    );

  render() {
    if (this.props.employeeFetcher.isLoading) return <LoadingSpinner />;
    if (!this.props.employeeFetcher.employee) return <PageNotFound />;

    const selectedAddressIndex = this.props.employeeFetcher.employee.addresses.findIndex(
      address =>
        this.props.isCreateMode
          ? !address.id
          : address.id === this.props.addressId
    );
    const selectedAddress =
      selectedAddressIndex > -1
        ? this.props.employeeFetcher.employee.addresses[selectedAddressIndex]
        : null;

    if (!this.props.isCreateMode && !selectedAddress) {
      return (
        <InfoModalPage
          isOpen={true}
          onClose={this.handleCloseModal}
          title={this.props.intl.formatMessage(messages.createAddress)}
        >
          <PageNotFound />
        </InfoModalPage>
      );
    }

    return (
      <AddressDetailsForm
        canManageEmployees={this.props.canManageEmployees}
        isCreateMode={this.props.isCreateMode}
        address={this.props.isCreateMode ? initialValues : selectedAddress}
        countries={this.props.countries}
        onSubmit={
          this.props.isCreateMode
            ? this.handleCreateAddress
            : this.handleUpdateAddress
        }
      >
        {({ form, handleSubmit, handleReset, isDirty, isSubmitting }) => (
          <FormModalPage
            isOpen={true}
            onClose={this.handleCloseModal}
            title={
              this.props.isCreateMode
                ? this.props.intl.formatMessage(messages.createAddress)
                : formatEmployeeName({
                    firstName: (selectedAddress || {}).firstName,
                    lastName: (selectedAddress || {}).lastName,
                  })
            }
            subtitle={this.props.intl.formatMessage(
              messages[
                this.props.isCreateMode ? 'subtitleNewAddress' : 'subtitle'
              ]
            )}
            topBarCurrentPathLabel={`${formatEmployeeName(
              this.props.employeeFetcher.employee
            )} | ${this.props.intl.formatMessage(
              messages[
                this.props.isCreateMode ? 'createAddress' : 'editAddress'
              ]
            )}`}
            topBarPreviousPathLabel={this.props.intl.formatMessage(
              messages.backToAddressList
            )}
            customControls={
              <AddressDetailsModalControls
                isCreateMode={this.props.isCreateMode}
                canManageEmployees={this.props.canManageEmployees}
                employeeFetcher={this.props.employeeFetcher}
                hasUnsavedChanges={isDirty}
                selectedAddress={
                  this.props.isCreateMode
                    ? null
                    : this.props.employeeFetcher.employee.addresses.find(
                        address => address.id === this.props.addressId
                      )
                }
                onConfirmSetDefaultAddress={this.handleConfirmSetDefaultAddress}
                onConfirmDeleteAddress={this.handleConfirmDeleteAddress}
                onSubmitForm={handleSubmit}
                onCancelForm={
                  this.props.isCreateMode ? this.handleCloseModal : handleReset
                }
                shouldDisableFormButtons={
                  !(
                    isDirty ||
                    this.props.isCreateMode ||
                    (isDirty &&
                      !this.props.employeeUpdater.isLoading &&
                      isSubmitting)
                  )
                }
                navigationControls={
                  <NavigationControls
                    onNextClick={() =>
                      this.handleNavigateToAddress(selectedAddressIndex + 1)
                    }
                    onPreviousClick={() =>
                      this.handleNavigateToAddress(selectedAddressIndex - 1)
                    }
                    isNextDisabled={
                      selectedAddressIndex >=
                      this.props.employeeFetcher.employee.addresses.length - 1
                    }
                    isPreviousDisabled={selectedAddressIndex < 1}
                  >
                    {`${this.props.intl.formatMessage(
                      messages.address
                    )} ${selectedAddressIndex + 1} / ${
                      this.props.employeeFetcher.employee.addresses.length
                    }`}
                  </NavigationControls>
                }
              />
            }
            shouldDelayOnClose={!isDirty}
          >
            {form}
            <WarnOnLeave shouldWarn={isDirty} onConfirmLeave={handleReset} />
          </FormModalPage>
        )}
      </AddressDetailsForm>
    );
  }
}

export default flowRight(
  connect(null, {
    showNotification: globalActions.showNotification,
    onActionError: globalActions.handleActionError,
  }),
  injectAuthorized(
    [PERMISSIONS.ManageEmployees],
    {
      dataFences: [
        DATA_FENCES.store.ViewEmployees,
        DATA_FENCES.store.ManageEmployees,
      ],
      getSelectDataFenceData: ownProps =>
        createEmployeeDataFenceData({
          employee: ownProps.employeeFetcher.employee,
        }),
    },
    'canManageEmployees'
  ),
  withApplicationContext(applicationContext => ({
    user: {
      locale: applicationContext.user.locale,
    },
  })),
  withCountries(ownProps => ownProps.user.locale),
  injectIntl,
  withRouter
)(AddressDetailsModal);
