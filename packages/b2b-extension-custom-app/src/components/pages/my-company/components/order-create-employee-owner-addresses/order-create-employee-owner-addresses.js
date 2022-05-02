import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { defaultMemoize } from 'reselect';
import { compose, branch, lifecycle, renderNothing } from 'recompose';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Formik } from 'formik';
import {
  CloseBoldIcon,
  EditIcon,
  CollapsiblePanel,
  Constraints,
  IconButton,
  LinkButton,
  PrimaryButton,
  SecondaryButton,
  Spacings,
  TextInput,
  LoadingSpinner,
} from '@commercetools-frontend/ui-kit';
import { injectAuthorized } from '@commercetools-frontend/permissions';

import { DOMAINS } from '@commercetools-frontend/constants';
import { withCountries, countriesShape } from '@commercetools-frontend/l10n';
import * as globalActions from '@commercetools-frontend/actions-global';
import { withApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import formatEmployeeName from '@commercetools-local/utils/customer/format-customer-name';
import OrderCreateOwnerAddressDetails from '../order-create-owner-address-details';
import OrderCreateOwnerAddressTitle from '../order-create-owner-address-title';
import createSelectEmployeeDataFenceData from '../../../../utils/create-select-employee-data-fence-data';
import { PERMISSIONS, DATA_FENCES } from '../../../../../constants';

import {
  selectAddress,
  selectSameAddress,
} from '../../utils/address-selection';
import SelectablePanel from '../selectable-panel';
import messages from './messages';
import { docToFormValues, formValuesToDoc } from './conversions';
import validate from './validations';
import { OWNER_TYPES } from '../order-create-owner-pick/constants';

const MODES = {
  EDIT: 'edit',
  READ: 'read',
  DISABLED: 'disabled',
};

export class OrderCreateEmployeeOwnerAddresses extends React.PureComponent {
  static displayName = 'OrderCreateEmployeeOwnerAddresses';

  static propTypes = {
    goToOwnerSelection: PropTypes.func.isRequired,
    goToFirstStep: PropTypes.func.isRequired,
    employeesNewPath: PropTypes.string.isRequired,
    projectKey: PropTypes.string.isRequired,
    cartDraftState: PropTypes.shape({
      value: PropTypes.object.isRequired,
      update: PropTypes.func.isRequired,
    }),
    ownerState: PropTypes.shape({
      owner: PropTypes.shape({
        type: PropTypes.string,
        company: PropTypes.object,
      }).isRequired,
      update: PropTypes.func.isRequired,
    }),
    employeeFetcher: PropTypes.shape({
      isLoading: PropTypes.bool.isRequired,
      employee: PropTypes.shape({
        email: PropTypes.string.isRequired,
        addresses: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            firstName: PropTypes.string,
            lastName: PropTypes.string,
            phone: PropTypes.string,
            email: PropTypes.string,
            company: PropTypes.string,
            streetName: PropTypes.string,
            streetNumber: PropTypes.string,
            city: PropTypes.string,
            postalCode: PropTypes.string,
            region: PropTypes.string,
            country: PropTypes.string,
            additionalAddressInfo: PropTypes.string,
          })
        ),
      }),
    }),
    employeeUpdater: PropTypes.shape({
      execute: PropTypes.func.isRequired,
    }).isRequired,
    // Connected
    showNotification: PropTypes.func.isRequired,

    // HoC
    intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
      .isRequired,
    countries: countriesShape.isRequired,
    canManageEmployees: PropTypes.bool.isRequired,
  };

  state = {
    idOfShippingAddressInEditMode: null,
    idOfBillingAddressInEditMode: null,
  };

  handleClearEmployeeSelection = () => {
    this.props.cartDraftState.update({
      customerId: null,
      billingAddress: {},
      shippingAddress: {},
      customerEmail: null,
    });
    this.props.ownerState.update({
      type: undefined,
      company: undefined,
      customerId: undefined,
    });
    this.props.goToOwnerSelection();
  };

  handleSelectAddress = (type, addressId, employee) => {
    this.props.cartDraftState.update(selectAddress(type, addressId, employee));
  };

  handleSelectSameAddress = (isSameAsBillingAddress, customer) => {
    this.props.cartDraftState.update(
      selectSameAddress(
        isSameAsBillingAddress,
        this.props.cartDraftState.value,
        customer
      )
    );
  };

  enterReadMode = () =>
    this.setState({
      idOfShippingAddressInEditMode: null,
      idOfBillingAddressInEditMode: null,
    });

  enterEditMode = (addressId, type) =>
    this.setState({
      idOfShippingAddressInEditMode: type === 'shipping' ? addressId : null,
      idOfBillingAddressInEditMode: type === 'billing' ? addressId : null,
    });

  createHandleUpdateAddress = defaultMemoize(
    (execute, customer) => (addressDraft, formikBag) => {
      formikBag.setSubmitting(true);
      const action = {
        action: 'changeAddress',
        addressId: addressDraft.id,
        address: formValuesToDoc(addressDraft),
      };
      return execute([action]).then(() => {
        formikBag.setSubmitting(false);
        this.enterReadMode();
        this.props.showNotification({
          kind: 'success',
          domain: DOMAINS.SIDE,
          text: this.props.intl.formatMessage(messages.addressUpdated, {
            address: addressDraft.id,
          }),
        });
        this.props.cartDraftState.update({
          ...selectAddress(
            'shipping',
            this.props.cartDraftState.value.shippingAddress.id,
            customer
          ),
          ...selectAddress(
            'billing',
            this.props.cartDraftState.value.billingAddress.id,
            customer
          ),
        });
      });
    }
  );

  renderEmpty = () => (
    <Spacings.Stack>
      <FormattedMessage {...messages.noAddresses} />
      {this.props.canManageEmployees && (
        <LinkButton
          to={this.props.employeesNewPath}
          label={this.props.intl.formatMessage(messages.addAddress)}
        />
      )}
    </Spacings.Stack>
  );

  determineShippingAddressMode = addressId => {
    const isPanelOpen =
      this.props.cartDraftState.value.shippingAddress.id === addressId;
    const isAddressInEdition =
      this.state.idOfShippingAddressInEditMode === addressId;

    if (
      this.state.idOfBillingAddressInEditMode ||
      (this.state.idOfShippingAddressInEditMode !== null && !isAddressInEdition)
    )
      return MODES.DISABLED;

    if (isPanelOpen && isAddressInEdition) return MODES.EDIT;

    return MODES.READ;
  };

  determineBillingAddressMode = addressId => {
    const isPanelOpen =
      this.props.cartDraftState.value.billingAddress.id === addressId;
    const isAddressInEdition =
      this.state.idOfBillingAddressInEditMode === addressId;

    if (
      this.state.idOfShippingAddressInEditMode ||
      (this.state.idOfBillingAddressInEditMode !== null && !isAddressInEdition)
    )
      return MODES.DISABLED;

    if (isPanelOpen && isAddressInEdition) return MODES.EDIT;

    return MODES.READ;
  };

  render() {
    if (this.props.employeeFetcher.isLoading) return <LoadingSpinner />;
    return (
      <Spacings.Stack scale="m">
        <div>
          <Spacings.Inline alignItems="center">
            <Constraints.Horizontal constraint="xl">
              <TextInput
                value={`${formatEmployeeName(
                  this.props.employeeFetcher.employee
                )} (${this.props.employeeFetcher.employee.email})`}
                onChange={() => {}}
                isDisabled={true}
              />
            </Constraints.Horizontal>
            <IconButton
              size="medium"
              label={this.props.intl.formatMessage(
                messages.removeCustomerSelection
              )}
              icon={<CloseBoldIcon />}
              onClick={this.handleClearEmployeeSelection}
            />
          </Spacings.Inline>
        </div>

        <CollapsiblePanel
          header={
            <CollapsiblePanel.Header>
              <FormattedMessage {...messages.titleShippingAddress} />
            </CollapsiblePanel.Header>
          }
        >
          <Constraints.Horizontal>
            <Spacings.Stack>
              {this.props.employeeFetcher.employee.addresses.length > 0
                ? this.props.employeeFetcher.employee.addresses.map(address => (
                    <Formik
                      key={address.id}
                      initialValues={docToFormValues(address)}
                      validate={validate}
                      enableReinitialize={true}
                      onSubmit={this.createHandleUpdateAddress(
                        this.props.employeeUpdater.execute,
                        this.props.employeeFetcher.employee
                      )}
                      render={formikProps => (
                        <SelectablePanel
                          isOpen={
                            this.props.cartDraftState.value.shippingAddress
                              .id === address.id
                          }
                          header={
                            <OrderCreateOwnerAddressTitle
                              cartDraft={this.props.cartDraftState.value}
                              type="shipping"
                              address={address}
                              employee={this.props.employeeFetcher.employee}
                              onSelectAddress={() =>
                                this.handleSelectAddress(
                                  'shipping',
                                  address.id,
                                  this.props.employeeFetcher.employee
                                )
                              }
                              isDisabled={
                                this.determineShippingAddressMode(
                                  address.id
                                ) === MODES.DISABLED ||
                                this.props.employeeFetcher.employee.addresses
                                  .length === 1
                              }
                            />
                          }
                          controls={
                            this.determineShippingAddressMode(address.id) ===
                            MODES.EDIT ? (
                              <Spacings.Inline alignItems="center">
                                <SecondaryButton
                                  label={this.props.intl.formatMessage(
                                    messages.cancelButton
                                  )}
                                  onClick={() => {
                                    formikProps.resetForm();
                                    this.enterReadMode();
                                  }}
                                />
                                <PrimaryButton
                                  label={this.props.intl.formatMessage(
                                    messages.saveButton
                                  )}
                                  onClick={formikProps.handleSubmit}
                                  isDisabled={
                                    formikProps.isSubmitting ||
                                    !formikProps.dirty
                                  }
                                />
                              </Spacings.Inline>
                            ) : (
                              this.props.canManageEmployees && (
                                <IconButton
                                  icon={<EditIcon size="medium" />}
                                  isDisabled={
                                    this.determineShippingAddressMode(
                                      address.id
                                    ) === MODES.DISABLED ||
                                    this.props.cartDraftState.value
                                      .shippingAddress.id !== address.id
                                  }
                                  label={this.props.intl.formatMessage(
                                    messages.editButton
                                  )}
                                  onClick={() =>
                                    this.enterEditMode(address.id, 'shipping')
                                  }
                                  size="medium"
                                />
                              )
                            )
                          }
                        >
                          <OrderCreateOwnerAddressDetails
                            formik={formikProps}
                            type="shipping"
                            onSelectSameAddress={isSameAsBillingAddress =>
                              this.handleSelectSameAddress(
                                isSameAsBillingAddress,
                                this.props.employeeFetcher.employee
                              )
                            }
                            hasActiveEdition={
                              !this.state.idOfShippingAddressInEditMode !==
                              address.id
                            }
                            isFormEditable={
                              this.determineShippingAddressMode(address.id) ===
                              MODES.EDIT
                            }
                            isSameAsBillingAddress={
                              this.props.cartDraftState.value.shippingAddress
                                .id ===
                              this.props.cartDraftState.value.billingAddress.id
                            }
                            countries={this.props.countries}
                            isUniqueAddress={
                              this.props.employeeFetcher.employee.addresses
                                .length === 1
                            }
                          />
                        </SelectablePanel>
                      )}
                    />
                  ))
                : this.renderEmpty()}
            </Spacings.Stack>
          </Constraints.Horizontal>
        </CollapsiblePanel>
        <CollapsiblePanel
          header={
            <CollapsiblePanel.Header>
              <FormattedMessage {...messages.titleBillingAddress} />
            </CollapsiblePanel.Header>
          }
        >
          <Constraints.Horizontal>
            <Spacings.Stack>
              {this.props.employeeFetcher.employee.addresses.length > 0
                ? this.props.employeeFetcher.employee.addresses.map(address => (
                    <Formik
                      key={address.id}
                      initialValues={docToFormValues(address)}
                      validate={validate}
                      enableReinitialize={true}
                      onSubmit={this.createHandleUpdateAddress(
                        this.props.employeeUpdater.execute,
                        this.props.employeeFetcher.employee
                      )}
                      render={formikProps => (
                        <SelectablePanel
                          isOpen={
                            this.props.cartDraftState.value.billingAddress
                              .id === address.id
                          }
                          header={
                            <OrderCreateOwnerAddressTitle
                              cartDraft={this.props.cartDraftState.value}
                              type="billing"
                              address={address}
                              employee={this.props.employeeFetcher.employee}
                              onSelectAddress={() =>
                                this.handleSelectAddress(
                                  'billing',
                                  address.id,
                                  this.props.employeeFetcher.employee
                                )
                              }
                              isDisabled={
                                this.determineBillingAddressMode(address.id) ===
                                  MODES.DISABLED ||
                                this.props.employeeFetcher.employee.addresses
                                  .length === 1
                              }
                            />
                          }
                          controls={
                            this.determineBillingAddressMode(address.id) ===
                            MODES.EDIT ? (
                              <Spacings.Inline alignItems="center">
                                <SecondaryButton
                                  label={this.props.intl.formatMessage(
                                    messages.cancelButton
                                  )}
                                  onClick={() => {
                                    formikProps.resetForm();
                                    this.enterReadMode();
                                  }}
                                />
                                <PrimaryButton
                                  label={this.props.intl.formatMessage(
                                    messages.saveButton
                                  )}
                                  onClick={formikProps.handleSubmit}
                                  isDisabled={
                                    formikProps.isSubmitting ||
                                    !formikProps.dirty
                                  }
                                />
                              </Spacings.Inline>
                            ) : (
                              this.props.canManageEmployees && (
                                <IconButton
                                  icon={<EditIcon size="medium" />}
                                  isDisabled={
                                    this.determineBillingAddressMode(
                                      address.id
                                    ) === MODES.DISABLED ||
                                    this.props.cartDraftState.value
                                      .billingAddress.id !== address.id
                                  }
                                  label={this.props.intl.formatMessage(
                                    messages.editButton
                                  )}
                                  onClick={() =>
                                    this.enterEditMode(address.id, 'billing')
                                  }
                                  size="medium"
                                />
                              )
                            )
                          }
                        >
                          <OrderCreateOwnerAddressDetails
                            formik={formikProps}
                            isFormEditable={
                              this.determineBillingAddressMode(address.id) ===
                              MODES.EDIT
                            }
                            type="billing"
                            countries={this.props.countries}
                          />
                        </SelectablePanel>
                      )}
                    />
                  ))
                : this.renderEmpty()}
            </Spacings.Stack>
          </Constraints.Horizontal>
        </CollapsiblePanel>
      </Spacings.Stack>
    );
  }
}

const mapDispatchToProps = {
  showNotification: globalActions.showNotification,
};

export default compose(
  withApplicationContext(applicationContext => ({
    locale: applicationContext.dataLocale,
  })),
  injectAuthorized(
    [PERMISSIONS.ManageEmployees],
    {
      dataFences: [DATA_FENCES.store.ManageEmployees],
      getSelectDataFenceData: createSelectEmployeeDataFenceData,
    },
    'canManageEmployees'
  ),
  connect(null, mapDispatchToProps),
  branch(
    props =>
      /* This logic is for redirect to the first step taking into account specific cases:
       *    1. If the user tries to access this component with a customerId that
       *       no longer exists in the API.
       *    2. When duplicating, if the user tries to access this component with a customerId
       *       different from the one set in the duplicated cart. This is such a particular
       *       use case, when duplicating a cart all the info of the original cart
       *       gets replicated in the new `cartDraft` but in the route we could try to
       *       get the info of a different existing customer. E.g:
       *
       *       cartDraft : { customerId: 'my-customer-id-1'},
       *       route: '/orders/order-id-1/duplicate/customer/my-customer-id-2/addresses
       *
       */
      // Case 1
      (!props.employeeFetcher.isLoading && !props.employeeFetcher.employee) ||
      // Case 2
      (!props.employeeFetcher.isLoading &&
        props.ownerState.owner.type !== OWNER_TYPES.OWNER_EMPLOYEE &&
        props.cartDraftState.value.customerId !==
          props.employeeFetcher.employee?.id),
    compose(
      lifecycle({
        UNSAFE_componentWillMount() {
          this.props.goToFirstStep();
        },
      }),
      renderNothing
    )
  ),
  injectIntl,
  withCountries(ownProps => ownProps.locale)
)(OrderCreateEmployeeOwnerAddresses);
