import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { injectIntl, FormattedMessage } from 'react-intl';
import { matchPath, Redirect } from 'react-router-dom';
import { defaultMemoize } from 'reselect';
import oneLineTrim from 'common-tags/lib/oneLineTrim';
import { DOMAINS } from '@commercetools-frontend/constants';
import { joinPaths } from '@commercetools-frontend/url-utils';
import * as globalActions from '@commercetools-frontend/actions-global';
import { LoadingSpinner, Spacings } from '@commercetools-frontend/ui-kit';
import WarnOnLeave from '@commercetools-local/core/components/warn-on-leave';
import PageBottomSpacer from '@commercetools-local/core/components/page-bottom-spacer';
import View from '@commercetools-local/core/components/view';
import Steps from '@commercetools-local/core/components/steps';
import { useStateFetcher } from '@commercetools-local/hooks';

import CartSummarySection from '../cart-summary-section';
import OrderCreateConnector from '../order-create-connector';
import OrderCreateTabRoutes from './order-create-tab-routes';
import styles from './order-create.mod.css';
import messages from './messages';
import { ORDER_CREATE_TAB_NAMES, ORDER_STATES } from './constants';

const createStepsDefinition = defaultMemoize(intl => [
  {
    key: ORDER_CREATE_TAB_NAMES.ADD_LINE_ITEMS,
    label: intl.formatMessage(messages.stepLineItems),
  },
  {
    key: ORDER_CREATE_TAB_NAMES.SET_OWNER,
    label: intl.formatMessage(messages.stepOwner),
  },
  {
    key: ORDER_CREATE_TAB_NAMES.SET_SHIPPING_METHOD,
    label: intl.formatMessage(messages.stepShippingMethod),
  },
  {
    key: ORDER_CREATE_TAB_NAMES.CONFIRMATION,
    label: intl.formatMessage(messages.stepConfirmation),
  },
]);

export class OrderCreate extends React.PureComponent {
  static displayName = 'OrderCreate';

  static propTypes = {
    initialOrderStateId: PropTypes.string,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }).isRequired,
    match: PropTypes.shape({
      path: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      params: PropTypes.shape({
        projectKey: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
      .isRequired,
    company: PropTypes.object.isRequired,
    employee: PropTypes.object.isRequired,

    // Actions
    onActionError: PropTypes.func.isRequired,
    showNotification: PropTypes.func.isRequired,
  };

  shouldSkipWarnOnLeave = false;

  handleCancel = event => {
    event.preventDefault();
    this.props.history.push(
      `/${this.props.match.params.projectKey}/b2b-extension/my-company/orders`
    );
  };

  handleSave = execute => {
    return execute(this.props.initialOrderStateId)
      .then(() => {
        this.shouldSkipWarnOnLeave = true;

        this.props.showNotification({
          kind: 'success',
          domain: DOMAINS.SIDE,
          text: this.props.intl.formatMessage(messages.orderCreated),
        });
        this.props.history.push(
          `/${this.props.match.params.projectKey}/b2b-extension/my-company/orders`
        );
      })
      .catch(error => {
        if (
          error &&
          error.length &&
          error[0].code === 'InvalidOperation' &&
          error[0].message === 'The budget is over'
        ) {
          this.props.showNotification({
            kind: 'error',
            domain: DOMAINS.SIDE,
            text: this.props.intl.formatMessage(messages.orderErrorBudgetOver),
          });
        } else {
          this.props.onActionError(error);
        }
      });
  };

  render() {
    const tabNames = Object.values(ORDER_CREATE_TAB_NAMES);
    const activeTabIndex = tabNames.findIndex(tabName =>
      Boolean(
        matchPath(this.props.location.pathname, {
          path: `/${this.props.match.params.projectKey}/b2b-extension/my-company/orders/new/${tabName}`,
          exact: false,
          strict: false,
        })
      )
    );
    const activeTab = tabNames[activeTabIndex];

    if (!activeTab) {
      // redirect from /new to /new/lineItems

      return (
        <Redirect
          from={this.props.match.url}
          to={joinPaths(
            this.props.match.url,
            ORDER_CREATE_TAB_NAMES.ADD_LINE_ITEMS
          )}
          // prevent redirecting from / new/* to /new/lineItems
          exact={true}
        />
      );
    }

    const totalSteps = Object.keys(ORDER_CREATE_TAB_NAMES).length;
    return (
      <OrderCreateConnector.Consumer>
        {({
          cartDraftState,
          orderCreator,
          cartCreator,
          storeState,
          initialSelectionModalState,
          cartUpdater,
          ownerState,
        }) => {
          return (
            <div data-track-component="Add Order">
              <View>
                <div className={styles.header}>
                  <Spacings.Inset scale="s">
                    <div className={styles['tabs-list']}>
                      <Steps
                        steps={createStepsDefinition(this.props.intl)}
                        activeStepKey={activeTab}
                      />
                    </div>
                  </Spacings.Inset>
                </div>
                <div className={styles.container}>
                  {cartCreator.isLoading ? (
                    <div className={styles['center-content']}>
                      <LoadingSpinner>
                        <FormattedMessage {...messages.creatingOrder} />
                      </LoadingSpinner>
                    </div>
                  ) : (
                    <React.Fragment>
                      <div
                        className={styles.slider}
                        data-testid="customers-list"
                      >
                        <div key={activeTabIndex} className={styles.wrapper}>
                          <OrderCreateTabRoutes
                            routerProps={{
                              path: this.props.match.path,
                              url: this.props.match.url,
                              pathname: this.props.location.pathname,
                            }}
                            createHandleGoToStep={stepName =>
                              this.props.history.push(stepName)
                            }
                            projectKey={this.props.match.params.projectKey}
                            totalSteps={totalSteps}
                            onCancel={this.handleCancel}
                            onSave={() => this.handleSave(orderCreator.execute)}
                            cartDraftState={cartDraftState}
                            cartCreator={cartCreator}
                            cartUpdater={cartUpdater}
                            storeState={storeState}
                            initialSelectionModalState={
                              initialSelectionModalState
                            }
                            ownerState={ownerState}
                          />
                          <PageBottomSpacer />
                        </div>
                      </div>
                      {cartDraftState.value.currency && (
                        <CartSummarySection
                          cartDraft={cartDraftState.value}
                          goToCountrySelection={({ availableCountries }) =>
                            this.props.history.push({
                              pathname: oneLineTrim`
                              /${this.props.match.params.projectKey}
                              /b2b-extension
                              /my-company
                              /orders
                              /new
                              /lineitems
                              /change-country
                            `,
                              state: { availableCountries },
                            })
                          }
                          title={this.props.intl.formatMessage(
                            messages.orderSummaryTitle
                          )}
                          store={storeState.value}
                          cartUpdater={cartUpdater}
                          company={this.props.company}
                        />
                      )}
                    </React.Fragment>
                  )}
                </div>
              </View>
              <WarnOnLeave
                shouldWarn={nextLocation => {
                  const isStayingInCreateOrderFlow = Boolean(
                    // nextLocation might be undefined when the user closes the browser
                    nextLocation &&
                      matchPath(nextLocation.pathname, {
                        path: `/:projectKey/b2b-extension/my-company/orders/new`,
                      })
                  );
                  const cartIsCreated = Boolean(cartDraftState.value.id);
                  return (
                    !isStayingInCreateOrderFlow &&
                    cartIsCreated &&
                    !this.shouldSkipWarnOnLeave
                  );
                }}
              />
            </div>
          );
        }}
      </OrderCreateConnector.Consumer>
    );
  }
}

const mapDispatchToProps = {
  onActionError: globalActions.handleActionError,
  showNotification: globalActions.showNotification,
};

export const OrderCreateWithState = props => {
  const stateFetcher = useStateFetcher({
    stateKey: ORDER_STATES.OPEN,
  });

  return (
    <OrderCreate {...props} initialOrderStateId={stateFetcher.state?.id} />
  );
};
OrderCreateWithState.displayName = 'OrderCreateWithState';

export default compose(
  injectIntl,
  connect(null, mapDispatchToProps)
)(OrderCreateWithState);
