import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { defaultMemoize } from 'reselect';
import { compose, branch, lifecycle, renderNothing } from 'recompose';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { injectAuthorized } from '@commercetools-frontend/permissions';

import { Formik } from 'formik';
import {
  CloseBoldIcon,
  CollapsiblePanel,
  Constraints,
  IconButton,
  PrimaryButton,
  SecondaryButton,
  Spacings,
  TextInput,
  EditIcon,
} from '@commercetools-frontend/ui-kit';
import { withCountries, countriesShape } from '@commercetools-frontend/l10n';
import * as globalActions from '@commercetools-frontend/actions-global';
import { withApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import OrderCreateOwnerAddressDetails from '../order-create-owner-address-details';
import OrderCreateOwnerAddressTitle from '../order-create-owner-address-title';
import { PERMISSIONS } from '../../../../../constants';

import {
  selectAddress,
  selectSameAddress,
} from '../../utils/address-selection';
import SelectablePanel from '../selectable-panel';

import messages from './messages';
import { docToFormValues } from './conversions';
import validate from './validations';

const MODES = {
  EDIT: 'edit',
  READ: 'read',
  DISABLED: 'disabled',
};
export class OrderCreateCompanyOwnerAddresses extends React.PureComponent {
  static displayName = 'OrderCreateCompanyOwnerAddresses';

  static propTypes = {
    goToOwnerSelection: PropTypes.func.isRequired,
    goToFirstStep: PropTypes.func.isRequired,
    projectKey: PropTypes.string.isRequired,
    cartDraftState: PropTypes.shape({
      value: PropTypes.object.isRequired,
      update: PropTypes.func.isRequired,
    }),
    ownerState: PropTypes.shape({
      owner: PropTypes.shape({
        type: PropTypes.string,
        company: PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          addresses: PropTypes.arrayOf(
            PropTypes.shape({ id: PropTypes.string.isRequired })
          ),
        }).isRequired,
      }).isRequired,
      update: PropTypes.func.isRequired,
    }),
    companyUpdater: PropTypes.shape({
      execute: PropTypes.func.isRequired,
    }).isRequired,
    // Connected
    showNotification: PropTypes.func.isRequired,

    // HoC
    intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
      .isRequired,
    countries: countriesShape.isRequired,
    canManageCompanies: PropTypes.bool.isRequired,
  };

  state = {
    idOfShippingAddressInEditMode: null,
    idOfBillingAddressInEditMode: null,
  };

  handleClearCustomerSelection = () => {
    this.props.cartDraftState.update({
      customerId: null,
      billingAddress: {},
      shippingAddress: {},
      customerEmail: null,
    });
    this.props.ownerState.update({
      type: undefined,
      company: undefined,
    });
    this.props.goToOwnerSelection();
  };

  handleSelectAddress = (type, addressId, company) => {
    this.props.cartDraftState.update(selectAddress(type, addressId, company));
  };

  handleSelectSameAddress = (isSameAsBillingAddress, company) => {
    this.props.cartDraftState.update(
      selectSameAddress(
        isSameAsBillingAddress,
        this.props.cartDraftState.value,
        company
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

  createHandleUpdateShippingAddress = defaultMemoize(
    (execute, company) => async (addressDraft, formikBag) => {
      formikBag.setSubmitting(true);
      await execute({
        ...company,
        addresses: company.addresses.map(address =>
          address.id === addressDraft.id ? addressDraft : address
        ),
      });
      this.props.cartDraftState.update({
        shippingAddress: addressDraft,
      });
      formikBag.setSubmitting(false);
      this.enterReadMode();
    }
  );
  createHandleUpdateBillingAddress = defaultMemoize(
    (execute, company) => async (addressDraft, formikBag) => {
      formikBag.setSubmitting(true);
      await execute({
        ...company,
        addresses: company.addresses.map(address =>
          address.id === addressDraft.id ? addressDraft : address
        ),
      });
      this.props.cartDraftState.update({
        billingAddress: addressDraft,
      });
      formikBag.setSubmitting(false);
      this.enterReadMode();
    }
  );

  renderEmpty = () => (
    <Spacings.Stack>
      <FormattedMessage {...messages.noAddresses} />
      {this.props.canManageCompanies && (
        <Link
          to={`/${this.props.projectKey}/b2b-extension/companies/${this.props.ownerState.owner.company.id}/`}
        >
          <FormattedMessage {...messages.editCompanyLabel} />
        </Link>
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
    return (
      <Spacings.Stack scale="m">
        <div>
          <Spacings.Inline alignItems="center">
            <Constraints.Horizontal constraint="xl">
              <TextInput
                value={this.props.ownerState.owner.company.name}
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
              onClick={this.handleClearCustomerSelection}
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
              {this.props.ownerState.owner.company.addresses.length > 0
                ? this.props.ownerState.owner.company.addresses.map(address => (
                    <Formik
                      key={address.id}
                      initialValues={docToFormValues(address)}
                      validate={validate}
                      enableReinitialize={true}
                      onSubmit={this.createHandleUpdateShippingAddress(
                        this.props.companyUpdater.execute,
                        this.props.ownerState.owner.company
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
                              employee={this.props.ownerState.owner.company}
                              onSelectAddress={() =>
                                this.handleSelectAddress(
                                  'shipping',
                                  address.id,
                                  this.props.ownerState.owner.company
                                )
                              }
                              isDisabled={
                                this.determineShippingAddressMode(
                                  address.id
                                ) === MODES.DISABLED ||
                                this.props.ownerState.owner.company.addresses
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
                              this.props.canManageCompanies && (
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
                                this.props.ownerState.owner.company
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
                              this.props.ownerState.owner.company.addresses
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
              {this.props.ownerState.owner.company.addresses.length > 0
                ? this.props.ownerState.owner.company.addresses.map(address => (
                    <Formik
                      key={address.id}
                      initialValues={docToFormValues(address)}
                      validate={validate}
                      enableReinitialize={true}
                      onSubmit={this.createHandleUpdateBillingAddress(
                        this.props.companyUpdater.execute,
                        this.props.ownerState.owner.company
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
                              employee={this.props.ownerState.owner.company}
                              onSelectAddress={() =>
                                this.handleSelectAddress(
                                  'billing',
                                  address.id,
                                  this.props.ownerState.owner.company
                                )
                              }
                              isDisabled={
                                this.determineBillingAddressMode(address.id) ===
                                  MODES.DISABLED ||
                                this.props.ownerState.owner.company.addresses
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
                              this.props.canManageCompanies && (
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
    [PERMISSIONS.ManageCompanies],
    {
      dataFences: [],
    },
    'canManageCompanies'
  ),
  connect(null, mapDispatchToProps),
  branch(
    props => !props.ownerState.owner.company,
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
)(OrderCreateCompanyOwnerAddresses);
