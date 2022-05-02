import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import oneLineTrim from 'common-tags/lib/oneLineTrim';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Redirect, Route, Switch, matchPath } from 'react-router-dom';
import { DOMAINS } from '@commercetools-frontend/constants';
import * as globalActions from '@commercetools-frontend/actions-global';
import { withApplicationContext } from '@commercetools-frontend/application-shell-connectors';

import SaveToolbarSteps from '@commercetools-local/core/components/save-toolbar-steps';

import OrderCreateOwnerPick from '../order-create-owner-pick';
import OrderCreateOwner from '../order-create-owner';

import OrderCreateOwnerConnector from '../order-create-owner-connector';
import OrderCreateEmployeeOwnerAddresses from '../order-create-employee-owner-addresses';
import OrderCreateCompanyOwnerAddresses from '../order-create-company-owner-addresses';
import OrderCreateAddLineItems from '../order-create-add-line-items';
import OrderCreateSelectCountry from '../order-create-select-country';
import OrderCreateSetShippingMethod from '../order-create-set-shipping-method';
import OrderCreateSetShippingMethodConnector from '../order-create-set-shipping-method-connector';
import OrderCreateQuoteDetails from '../order-create-quote-details';
import OrderCreateConfirmation from '../order-create-confirmation';
import EmployeeDetailWrapper from '../employee-detail-wrapper';
import CompanyDetailsConnector from '../../../companies/components/company-details-connector';
import B2BApolloClientContext from '../../../../common/b2b-apollo-client-context';

import {
  validateCustomer,
  validateCompany,
  validateLineItems,
  validateShippingMethod,
} from '../../utils/validate-order';

import OrderCreateCheckoutToolbar from '../order-create-checkout-toolbar';
import { addressToDoc } from '../order-create-connector/conversions';
import { ORDER_CREATE_TAB_NAMES } from './constants';
import { OWNER_TYPES } from '../order-create-owner-pick/constants';
import messages from './messages';

const goToFirstStep = routerProps =>
  routerProps.history.replace(oneLineTrim`
    /${routerProps.match.params.projectKey}
    /b2b-extension
    /my-company
    /orders
    /new
    /lineitems
  `);

const getIsSaveToolbarVisible = (tab, toolbarBag) => {
  switch (tab) {
    case ORDER_CREATE_TAB_NAMES.SET_OWNER: {
      const hasPickedMe = Boolean(
        matchPath(toolbarBag.pathname, {
          path: oneLineTrim`
              /${toolbarBag.projectKey}
              /b2b-extension
              /my-company
              /orders
              /new
              /${ORDER_CREATE_TAB_NAMES.SET_OWNER}
              /${toolbarBag.cartDraft.customerId}
              /addresses
              `,
          exact: true,
          strict: false,
        })
      );
      const hasPickedEmployee = Boolean(
        matchPath(toolbarBag.pathname, {
          path: oneLineTrim`
              /${toolbarBag.projectKey}
              /b2b-extension
              /my-company
              /orders
              /new
              /${ORDER_CREATE_TAB_NAMES.SET_OWNER}
              /${toolbarBag.ownerState.owner.employeeId}
              /addresses
              `,
          exact: true,
          strict: false,
        })
      );
      const hasPickedCompany = Boolean(
        matchPath(toolbarBag.pathname, {
          path: oneLineTrim`
              /${toolbarBag.projectKey}
              /b2b-extension
              /my-company
              /orders
              /new
              /${ORDER_CREATE_TAB_NAMES.SET_OWNER}
              /company
              /addresses
              `,
          exact: true,
          strict: false,
        })
      );

      // only show the toolbar after the user has went through
      // the initial modal to select the currency and/or the store
      if (!toolbarBag.isInitialSelectionModalStateOpen) return true;

      return (
        Boolean(
          (hasPickedMe || hasPickedEmployee) &&
            toolbarBag.cartDraft.billingAddress?.id &&
            toolbarBag.cartDraft.shippingAddress?.id
        ) ||
        Boolean(
          hasPickedCompany &&
            toolbarBag.cartDraft.billingAddress?.country &&
            toolbarBag.cartDraft.shippingAddress?.country
        )
      );
    }
    // The save toolbar will be always visible and validation will run
    case ORDER_CREATE_TAB_NAMES.ADD_LINE_ITEMS: {
      return Boolean(
        matchPath(toolbarBag.pathname, {
          path: oneLineTrim`
            /${toolbarBag.projectKey}
            /b2b-extension
            /my-company
            /orders
            /new
            /${ORDER_CREATE_TAB_NAMES.ADD_LINE_ITEMS}
          `,
          exact: true,
          strict: false,
        })
      );
    }
    case ORDER_CREATE_TAB_NAMES.SET_SHIPPING_METHOD:
    case ORDER_CREATE_TAB_NAMES.CONFIRMATION:
      return true;
    default:
      throw new Error(`Unexpected tab "${tab}"`);
  }
};

const createOwnerOnBackHandler = props => () => {
  props.ownerState.update({ type: undefined, company: undefined });
  props.createHandleGoToStep(oneLineTrim`
    /${props.projectKey}
    /b2b-extension
    /my-company
    /orders
    /new
    /${ORDER_CREATE_TAB_NAMES.ADD_LINE_ITEMS}
  `);
};

const createHandleGoToOwnerSelection = props => () =>
  props.history.push(oneLineTrim`
    /${props.match.params.projectKey}
    /b2b-extension
    /my-company
    /orders
    /new
    /owner
    /pick
  `);

const createGoToAddressSelectionHandler = props => (employeeId = 'company') =>
  props.history.push(oneLineTrim`
    /${props.match.params.projectKey}
    /b2b-extension
    /my-company
    /orders
    /new
    /owner
    /${employeeId}
    /addresses
  `);

const createGoToOrdersListHandler = props => () =>
  props.history.push(oneLineTrim`
    /${props.match.params.projectKey}
    /b2b-extension
    /my-company
    /orders
  `);

const createEmployeesNewPath = props =>
  oneLineTrim`
    /${props.match.params.projectKey}
    /b2b-extension
    /employees
    /${props.match.params.employeeId}
    /addresses
    /new`;

const createGoToCountrySelectionHandler = orderLineItemsRouterProps => ({
  availableCountries,
}) =>
  orderLineItemsRouterProps.history.push({
    pathname: oneLineTrim`
        /${orderLineItemsRouterProps.match.params.projectKey}
        /b2b-extension
        /my-company
        /orders
        /new
        /lineitems
        /select-country
      `,
    state: { availableCountries },
  });

const createSelectCountryHandleCloseModal = countrySelectionRouterProps => () =>
  countrySelectionRouterProps.history.push(oneLineTrim`
    /${countrySelectionRouterProps.match.params.projectKey}
    /b2b-extension
    /my-company
    /orders
    /new
    /lineitems
  `);

const createOwnerOnNextHandler = props => async () => {
  if (props.ownerState.owner.type === OWNER_TYPES.OWNER_COMPANY) {
    const hasError = validateCompany(
      props.cartDraftState.value,
      props.ownerState.owner.company
    );
    if (hasError) {
      props.showNotification({
        kind: 'error',
        domain: DOMAINS.PAGE,
        text: props.intl.formatMessage(messages.validateCompany),
      });
      return;
    }
  } else {
    const hasError = validateCustomer(props.cartDraftState.value);
    if (hasError) {
      props.showNotification({
        kind: 'error',
        domain: DOMAINS.PAGE,
        text: props.intl.formatMessage(messages.validateCustomer),
      });
      return;
    }
  }
  try {
    const actions = [
      {
        action: 'setShippingAddress',
        address: addressToDoc(props.cartDraftState.value.shippingAddress),
      },
      {
        action: 'setBillingAddress',
        address: addressToDoc(props.cartDraftState.value.billingAddress),
      },
      {
        action: 'setCustomerEmail',
        email: props.cartDraftState.value.customerEmail,
      },
      {
        action: 'setCustomerId',
        customerId: props.cartDraftState.value.customerId,
      },
    ];

    if (!props.cartDraftState.value.customerId) {
      actions.push({
        action: 'setCustomerGroup',
        customerGroup: {
          key: props.cartDraftState.value.customerGroup?.key,
          typeId: 'customer-group',
        },
      });
    }

    await props.cartUpdater.execute(actions);
    props.hideAllPageNotifications();
    props.createHandleGoToStep(
      `/${props.projectKey}/b2b-extension/my-company/orders/new/${ORDER_CREATE_TAB_NAMES.SET_SHIPPING_METHOD}`
    );
  } catch (errors) {
    const firstError = errors[0];
    if (firstError?.code === 'ExtensionBadResponse') {
      props.showNotification({
        kind: 'error',
        domain: DOMAINS.PAGE,
        text: props.intl.formatMessage(messages.extensionError),
      });
    } else if (firstError?.code === 'MissingTaxRateForCountry') {
      props.showNotification({
        kind: 'error',
        domain: DOMAINS.SIDE,
        text: props.intl.formatMessage(messages.taxCategoryError),
      });
    } else {
      props.onActionError(errors, 'OrderCreate/onNextStep');
    }
  }
};

const createLineItemsOnNextHandler = props => () => {
  const error = validateLineItems(props.cartDraftState.value);
  if (error)
    props.showNotification({
      kind: 'error',
      domain: DOMAINS.PAGE,
      text: props.intl.formatMessage(messages.validateLineItems),
    });
  else {
    props.hideAllPageNotifications();
    props.createHandleGoToStep(oneLineTrim`
      /${props.projectKey}
      /b2b-extension
      /my-company
      /orders
      /new
      /owner
      /pick
    `);
  }
};

const createShippingOnBackHandler = props => () => {
  props.ownerState.update({ type: undefined, company: undefined });
  props.createHandleGoToStep(oneLineTrim`
    /${props.projectKey}
    /b2b-extension
    /my-company
    /orders
    /new
    /owner
    /pick
  `);
};

const createConfirmationOnBackHandler = props => () => {
  props.createHandleGoToStep(oneLineTrim`
    /${props.projectKey}
    /b2b-extension
    /my-company
    /orders
    /new
    /${ORDER_CREATE_TAB_NAMES.SET_SHIPPING_METHOD}
  `);
};

const createShippingOnNextHandler = props => () => {
  const error = validateShippingMethod(props.cartDraftState.value);
  if (error)
    props.showNotification({
      kind: 'error',
      domain: DOMAINS.PAGE,
      text: props.intl.formatMessage(messages.validateShippingMethod),
    });
  else {
    props.hideAllPageNotifications();
    props.createHandleGoToStep(oneLineTrim`
      /${props.projectKey}
      /b2b-extension
      /my-company
      /orders
      /new
      /${ORDER_CREATE_TAB_NAMES.CONFIRMATION}
    `);
  }
};

export const OrderCreateTabRoutes = props => {
  useEffect(() => {
    async function createCart({ storeKey, currency, employeeId, companyId }) {
      await props.cartCreator.execute({
        storeKey,
        currency,
        employeeId,
        companyId,
      });
    }
    if (
      !props.cartDraftState.value.currency &&
      props.projectCurrencies &&
      props.projectCurrencies.length === 1
    ) {
      props.cartDraftState.update({
        currency: props.projectCurrencies[0],
      });
      if (!props.cartDraftState.value.id) {
        createCart({
          storeKey: props.company.id,
          currency: props.projectCurrencies[0],
          employeeId: props.employee.id,
          companyId: props.company.customerGroup.id,
        });
      }
    } else if (
      props.cartDraftState.value.currency &&
      !props.cartDraftState.value.id
    ) {
      createCart({
        storeKey: props.company.id,
        currency: props.cartDraftState.value.currency,
        employeeId: props.employee.id,
        companyId: props.company.customerGroup.id,
      });
    }
  }, [
    props.cartCreator,
    props.cartDraftState,
    props.cartDraftState.value,
    props.company.id,
    props.employee.id,
    props.projectCurrencies,
    props.company.customerGroup.id,
  ]);

  const toolbarBag = {
    pathname: props.routerProps.pathname,
    projectKey: props.projectKey,
    cartDraft: props.cartDraftState.value,
    ownerState: props.ownerState,
    isInitialSelectionModalStateOpen: props.initialSelectionModalState.isOpen,
  };

  return (
    <Switch>
      <Route
        path={`${props.routerProps.path}/${ORDER_CREATE_TAB_NAMES.ADD_LINE_ITEMS}`}
        render={orderLineItemsRouterProps =>
          props.cartDraftState.value.quote ? (
            <OrderCreateQuoteDetails
              renderSaveToolbarStep={() => (
                <SaveToolbarSteps
                  currentStep={1}
                  totalSteps={props.totalSteps}
                  isVisible={true}
                  onNext={createLineItemsOnNextHandler(props)}
                  onCancel={props.onCancel}
                />
              )}
            />
          ) : (
            <OrderCreateAddLineItems
              cartDraftState={props.cartDraftState}
              cartUpdater={props.cartUpdater}
              updateStore={props.storeState.update}
              hideInitialSelectionModal={props.initialSelectionModalState.close}
              projectKey={orderLineItemsRouterProps.match.params.projectKey}
              goToCountrySelection={createGoToCountrySelectionHandler(
                orderLineItemsRouterProps
              )}
              goToOrdersList={createGoToOrdersListHandler(
                orderLineItemsRouterProps
              )}
              renderSaveToolbarStep={() => (
                <SaveToolbarSteps
                  currentStep={1}
                  totalSteps={props.totalSteps}
                  isVisible={getIsSaveToolbarVisible(
                    ORDER_CREATE_TAB_NAMES.ADD_LINE_ITEMS,
                    toolbarBag
                  )}
                  onNext={createLineItemsOnNextHandler(props)}
                  onCancel={props.onCancel}
                />
              )}
            >
              <Route
                path={oneLineTrim`${orderLineItemsRouterProps.match.path}/select-country`}
                render={countrySelectionRouterProps => (
                  <OrderCreateSelectCountry
                    {...countrySelectionRouterProps}
                    projectKey={
                      countrySelectionRouterProps.match.params.projectKey
                    }
                    cartDraft={props.cartDraftState.value}
                    cartUpdater={props.cartUpdater}
                    handleCloseModal={createSelectCountryHandleCloseModal(
                      countrySelectionRouterProps
                    )}
                  />
                )}
              />
              <Route
                path={oneLineTrim`${orderLineItemsRouterProps.match.path}/change-country`}
                render={customLineItemRouterProps => (
                  <OrderCreateSelectCountry
                    {...customLineItemRouterProps}
                    cartDraft={props.cartDraftState.value}
                    cartUpdater={props.cartUpdater}
                    updateStore={props.storeState.update}
                    hideInitialSelectionModal={
                      props.initialSelectionModalState.close
                    }
                    isChange={true}
                    projectKey={
                      orderLineItemsRouterProps.match.params.projectKey
                    }
                    handleCloseModal={createSelectCountryHandleCloseModal(
                      customLineItemRouterProps
                    )}
                  />
                )}
              />
            </OrderCreateAddLineItems>
          )
        }
      />
      <Route
        path={oneLineTrim`${props.routerProps.path}/${ORDER_CREATE_TAB_NAMES.SET_OWNER}`}
        render={orderPickOwnerRouterProps => (
          <OrderCreateOwner
            renderSaveToolbarStep={() => (
              <SaveToolbarSteps
                currentStep={2}
                totalSteps={props.totalSteps}
                isVisible={true}
                buttonProps={{
                  next: {
                    isDisabled: !getIsSaveToolbarVisible(
                      ORDER_CREATE_TAB_NAMES.SET_OWNER,
                      toolbarBag
                    ),
                  },
                }}
                onBack={createOwnerOnBackHandler(props)}
                onNext={createOwnerOnNextHandler(props)}
                onCancel={props.onCancel}
              />
            )}
          >
            <Switch>
              <Route
                path={`${orderPickOwnerRouterProps.match.path}/pick`}
                render={pickRouterProps => (
                  <OrderCreateOwnerPick
                    title={props.intl.formatMessage(messages.stepCustomer)}
                    goToAddressSelection={createGoToAddressSelectionHandler(
                      pickRouterProps
                    )}
                    goToFirstStep={() =>
                      goToFirstStep(orderPickOwnerRouterProps)
                    }
                    projectKey={pickRouterProps.match.params.projectKey}
                    cartDraftState={props.cartDraftState}
                    cartDraft={props.cartDraftState.value}
                    storeState={props.storeState}
                    initialSelectionModalState={
                      props.initialSelectionModalState
                    }
                    ownerState={props.ownerState}
                  />
                )}
              />
              <Route
                path={oneLineTrim`${orderPickOwnerRouterProps.match.path}/company`}
                render={ownerAddressesRouterProps => (
                  <Switch>
                    <Route
                      path={oneLineTrim`${ownerAddressesRouterProps.match.path}/addresses`}
                      render={() => (
                        <CompanyDetailsConnector
                          projectKey={
                            ownerAddressesRouterProps.match.params.projectKey
                          }
                          companyId={props.ownerState.owner?.company?.id}
                        >
                          {({ companyUpdater }) => (
                            <OrderCreateCompanyOwnerAddresses
                              cartDraftState={props.cartDraftState}
                              companyUpdater={companyUpdater}
                              ownerState={props.ownerState}
                              projectKey={
                                ownerAddressesRouterProps.match.params
                                  .projectKey
                              }
                              goToFirstStep={() =>
                                goToFirstStep(ownerAddressesRouterProps)
                              }
                              goToOwnerSelection={createHandleGoToOwnerSelection(
                                ownerAddressesRouterProps
                              )}
                            />
                          )}
                        </CompanyDetailsConnector>
                      )}
                    />
                    <Redirect
                      to={oneLineTrim`${ownerAddressesRouterProps.match.url}/addresses`}
                    />
                  </Switch>
                )}
              />
              <Route
                path={oneLineTrim`${orderPickOwnerRouterProps.match.path}/:employeeId`}
                render={employeeAddressesRouterProps => (
                  <Switch>
                    <Route
                      path={oneLineTrim`${employeeAddressesRouterProps.match.path}/addresses`}
                      render={() => (
                        <B2BApolloClientContext.Consumer>
                          {({ apolloClient }) => {
                            return (
                              <OrderCreateOwnerConnector
                                apolloClient={apolloClient}
                                employeeId={
                                  employeeAddressesRouterProps.match.params
                                    .employeeId
                                }
                              >
                                {({ employeeFetcher, employeeUpdater }) => (
                                  <OrderCreateEmployeeOwnerAddresses
                                    cartDraftState={props.cartDraftState}
                                    ownerState={props.ownerState}
                                    projectKey={
                                      employeeAddressesRouterProps.match.params
                                        .projectKey
                                    }
                                    employeeFetcher={employeeFetcher}
                                    employeeUpdater={employeeUpdater}
                                    goToFirstStep={() =>
                                      goToFirstStep(
                                        employeeAddressesRouterProps
                                      )
                                    }
                                    goToOwnerSelection={createHandleGoToOwnerSelection(
                                      employeeAddressesRouterProps
                                    )}
                                    employeesNewPath={createEmployeesNewPath(
                                      employeeAddressesRouterProps
                                    )}
                                  />
                                )}
                              </OrderCreateOwnerConnector>
                            );
                          }}
                        </B2BApolloClientContext.Consumer>
                      )}
                    />
                    <Redirect
                      to={oneLineTrim`${employeeAddressesRouterProps.match.url}/addresses`}
                    />
                  </Switch>
                )}
              />
              <Redirect
                to={oneLineTrim`${orderPickOwnerRouterProps.match.url}/pick`}
              />
            </Switch>
          </OrderCreateOwner>
        )}
      />

      <Route
        path={`${props.routerProps.path}/${ORDER_CREATE_TAB_NAMES.SET_SHIPPING_METHOD}`}
        render={shippingMethodRouterProps => (
          <OrderCreateSetShippingMethodConnector
            cartId={props.cartDraftState.value.id}
            storeKey={props.storeState.value?.key}
          >
            {({ shippingMethodsByCartFetcher }) => (
              <OrderCreateSetShippingMethod
                shippingMethodsByCartFetcher={shippingMethodsByCartFetcher}
                cartDraft={props.cartDraftState.value}
                cartUpdater={props.cartUpdater}
                goToFirstStep={() => goToFirstStep(shippingMethodRouterProps)}
                renderSaveToolbarStep={() => (
                  <SaveToolbarSteps
                    currentStep={3}
                    totalSteps={props.totalSteps}
                    isVisible={getIsSaveToolbarVisible(
                      ORDER_CREATE_TAB_NAMES.SET_SHIPPING_METHOD,
                      toolbarBag
                    )}
                    onNext={createShippingOnNextHandler(props)}
                    onBack={createShippingOnBackHandler(props)}
                    onCancel={props.onCancel}
                  />
                )}
              />
            )}
          </OrderCreateSetShippingMethodConnector>
        )}
      />
      <Route
        path={`${props.routerProps.path}/${ORDER_CREATE_TAB_NAMES.CONFIRMATION}`}
        render={confirmationRouterProps => (
          <B2BApolloClientContext.Consumer>
            {({ apolloClient }) => {
              return (
                <OrderCreateOwnerConnector
                  apolloClient={apolloClient}
                  employeeId={props.employee.id}
                >
                  {({ employeeFetcher }) => (
                    <OrderCreateConfirmation
                      cartDraft={props.cartDraftState.value}
                      goToFirstStep={() =>
                        goToFirstStep(confirmationRouterProps)
                      }
                      renderSaveToolbarStep={() => (
                        <OrderCreateCheckoutToolbar
                          currentStep={4}
                          totalSteps={props.totalSteps}
                          isVisible={getIsSaveToolbarVisible(
                            ORDER_CREATE_TAB_NAMES.CONFIRMATION,
                            toolbarBag
                          )}
                          onBack={createConfirmationOnBackHandler(props)}
                          onCancel={props.onCancel}
                          onSave={props.onSave}
                          company={props.company}
                          employee={employeeFetcher.employee}
                          cart={props.cartDraftState.value}
                        />
                      )}
                    />
                  )}
                </OrderCreateOwnerConnector>
              );
            }}
          </B2BApolloClientContext.Consumer>
        )}
      />
    </Switch>
  );
};

export const ConnectedOrderCreateTabRoutes = props => (
  <EmployeeDetailWrapper projectKey={props.projectKey}>
    {({ company, employee }) => (
      <OrderCreateTabRoutes {...props} company={company} employee={employee} />
    )}
  </EmployeeDetailWrapper>
);

ConnectedOrderCreateTabRoutes.displayName = 'ConnectedOrderCreateTabRoutes';
ConnectedOrderCreateTabRoutes.propTypes = {
  projectKey: PropTypes.string.isRequired,
};

OrderCreateTabRoutes.displayName = 'OrderCreateTabRoutes';
OrderCreateTabRoutes.propTypes = {
  projectKey: PropTypes.string.isRequired,
  company: PropTypes.object.isRequired,
  employee: PropTypes.object.isRequired,
  totalSteps: PropTypes.number.isRequired,
  routerProps: PropTypes.shape({
    path: PropTypes.string.isRequired,
    pathname: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }),
  createHandleGoToStep: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  cartDraftState: PropTypes.shape({
    value: PropTypes.object,
    update: PropTypes.func.isRequired,
  }),
  cartUpdater: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    execute: PropTypes.func.isRequired,
  }),
  cartCreator: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    execute: PropTypes.func.isRequired,
  }),
  storeState: PropTypes.shape({
    value: PropTypes.shape({
      id: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
      nameAllLocales: PropTypes.arrayOf(
        PropTypes.shape({
          locale: PropTypes.string.isRequired,
          value: PropTypes.string.isRequired,
        })
      ).isRequired,
    }),
    update: PropTypes.func.isRequired,
  }),
  ownerState: PropTypes.shape({
    owner: PropTypes.shape({
      type: PropTypes.string,
      company: PropTypes.object,
    }),
    update: PropTypes.func.isRequired,
  }),

  initialSelectionModalState: PropTypes.shape({
    isOpen: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
  }),

  // Actions
  onActionError: PropTypes.func.isRequired,
  showNotification: PropTypes.func.isRequired,
  hideAllPageNotifications: PropTypes.func.isRequired,

  intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
    .isRequired,
  // withApplicationContext
  projectCurrencies: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const mapDispatchToProps = {
  onActionError: globalActions.handleActionError,
  showNotification: globalActions.showNotification,
  hideAllPageNotifications: globalActions.hideAllPageNotifications,
};

export default compose(
  withApplicationContext(applicationContext => ({
    projectCurrencies: applicationContext.project.currencies,
  })),
  injectIntl,
  connect(null, mapDispatchToProps)
)(ConnectedOrderCreateTabRoutes);
