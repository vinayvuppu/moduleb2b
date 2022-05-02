import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { injectIntl } from 'react-intl';
import {
  EditIcon,
  IconButton,
  Spacings,
  Text,
  LoadingSpinner,
  Card,
} from '@commercetools-frontend/ui-kit';
import PageBottomSpacer from '@commercetools-local/core/components/page-bottom-spacer';
import { NO_VALUE_FALLBACK, DOMAINS } from '@commercetools-frontend/constants';
import { useLocalize } from '@commercetools-local/hooks';
import formatEmployeeName from '@commercetools-local/utils/customer/format-customer-name';
import * as globalActions from '@commercetools-frontend/actions-global';

import useTracking from '../../hooks/use-tracking';
import OrderCreateCartSummary from '../order-create-cart-summary';
import {
  getAvailableCountries,
  getMatchingPrices,
} from '../../utils/country-selection';
import OrderCreateOwnerConnector from '../order-create-owner-connector';
import CartAddDiscountCode from '../cart-add-discount-code';
import styles from './cart-summary-section.mod.css';
import messages from './messages';
import B2BApolloClientContext from '../../../../common/b2b-apollo-client-context';
import CartSummaryBudgetRemaining from '../cart-summary-budget-remaining';
import CartSummaryAmountForRequiredApproval from '../cart-summary-amount-for-required-approval';
import CartSummaryRulesCheck from '../cart-summary-rules-check';

const getAllPricesFromLineItems = lineItems =>
  lineItems.reduce(
    (allPrices, lineItem) => allPrices.concat(lineItem.variant.prices),
    []
  );

export const CartSummarySection = props => {
  const localize = useLocalize();
  const tracking = useTracking();
  const allPrices = getAllPricesFromLineItems(props.cartDraft.lineItems || []);

  const matchingPrices = getMatchingPrices(
    allPrices,
    props.cartDraft.currency,
    props.cartDraft.customerGroup && props.cartDraft.customerGroup.id
  );
  const availableCountries = getAvailableCountries(matchingPrices);

  const handleGoToCountrySelection = () =>
    props.goToCountrySelection({
      availableCountries,
    });

  const handleUpdateCart = actions => {
    return props.cartUpdater.execute(actions).then(
      () => {
        props.showNotification({
          kind: 'success',
          domain: DOMAINS.SIDE,
          text: props.intl.formatMessage(messages.cartUpdated),
        });
      },
      graphQLErrors => {
        if (graphQLErrors.length > 0) {
          let errorMessage;
          const graphQLError = graphQLErrors[0];
          errorMessage = graphQLError.message;
          if (graphQLError.code === 'DiscountCodeNonApplicable') {
            // Error when the discount code does not exist
            if (graphQLError.reason === 'DoesNotExist') {
              errorMessage = props.intl.formatMessage(
                messages.missingDiscountCode
              );
            } else if (graphQLError.reason === 'TimeRangeNonApplicable') {
              // else it's outdated
              errorMessage = props.intl.formatMessage(
                messages.outdatedDiscountCode
              );
            }
          }
          props.showNotification({
            kind: 'error',
            domain: DOMAINS.SIDE,
            text: errorMessage,
          });
        } else {
          props.onActionError(
            graphQLErrors,
            'OrderCreateAddLineItems/updateCart'
          );
        }
      }
    );
  };

  const handleApplyDiscountCode = code => {
    return handleUpdateCart([
      {
        action: 'addDiscountCode',
        code,
      },
    ]);
  };

  const handleRemoveDiscountCode = id => {
    return handleUpdateCart([
      {
        action: 'removeDiscountCode',
        discountCode: {
          typeId: 'discount-code',
          id,
        },
      },
    ]);
  };

  const handleRemoveLineItem = id => {
    const action = { action: 'removeLineItem', lineItemId: id };
    return handleUpdateCart([action]);
  };

  const handleChangeLineItemQuantity = (lineItemId, quantity) => {
    const action = {
      action: 'changeLineItemQuantity',
      lineItemId,
      quantity: +quantity,
    };
    return handleUpdateCart([action]);
  };

  return (
    <div className={styles.wrapper}>
      <Spacings.Inset scale="m">
        <Spacings.Stack>
          <Text.Headline as="h2">{props.title}</Text.Headline>
          {props.store && (
            <Spacings.Inline alignItems="center" scale="xs">
              <Text.Body intlMessage={messages.store}></Text.Body>
              <Text.Detail isBold>
                {localize(props.store.nameAllLocales, props.store.key)}
              </Text.Detail>
            </Spacings.Inline>
          )}
          {props.cartDraft.currency && (
            <Spacings.Inline alignItems="center" scale="xs">
              <Text.Body intlMessage={messages.currency}></Text.Body>
              <Text.Detail isBold>{props.cartDraft.currency}</Text.Detail>
            </Spacings.Inline>
          )}
          {props.cartDraft.country && (
            <Spacings.Inline alignItems="center" scale="xs">
              <Text.Body intlMessage={messages.country}></Text.Body>
              <Text.Detail isBold>{props.cartDraft.country}</Text.Detail>
              <IconButton
                label={props.intl.formatMessage(messages.changeCountryLabel)}
                size="medium"
                icon={<EditIcon />}
                onClick={tracking.forwardHandler(
                  tracking.trackSetCountrySpecificPricing,
                  handleGoToCountrySelection
                )}
              />
            </Spacings.Inline>
          )}
          {props.cartDraft.quote && (
            <Spacings.Inline alignItems="center" scale="xs">
              <Text.Body intlMessage={messages.quoteNumber}></Text.Body>
              <Text.Detail isBold>
                {props.cartDraft.quote.quoteNumber || NO_VALUE_FALLBACK}
              </Text.Detail>
            </Spacings.Inline>
          )}

          {props.cartDraft.customerId && (
            <B2BApolloClientContext.Consumer>
              {({ apolloClient }) => {
                return (
                  <OrderCreateOwnerConnector
                    apolloClient={apolloClient}
                    employeeId={props.cartDraft.customerId}
                  >
                    {({ employeeFetcher }) => do {
                      if (employeeFetcher.isLoading) <LoadingSpinner />;
                      else
                        <React.Fragment>
                          {employeeFetcher.employee?.company && (
                            <Spacings.Inline alignItems="center" scale="xs">
                              <Text.Body
                                intlMessage={{
                                  ...messages.company,
                                  values: {
                                    name: (
                                      <b>
                                        {employeeFetcher.employee.company.name}
                                      </b>
                                    ),
                                  },
                                }}
                              />
                            </Spacings.Inline>
                          )}
                          {employeeFetcher.employee && (
                            <React.Fragment>
                              <Text.Body
                                intlMessage={{
                                  ...messages.customer,
                                  values: {
                                    name: (
                                      <b>
                                        {formatEmployeeName(
                                          employeeFetcher.employee
                                        )}
                                      </b>
                                    ),
                                    email: employeeFetcher.employee.email,
                                  },
                                }}
                              />

                              <CartSummaryBudgetRemaining
                                cartTotalPrice={props.cartDraft?.totalPrice}
                                employeeAmountRemaining={
                                  employeeFetcher.employee.amountRemaining
                                }
                              />
                              <CartSummaryAmountForRequiredApproval
                                cartTotalPrice={props.cartDraft?.totalPrice}
                                employeeRoles={employeeFetcher.employee.roles}
                                company={props.company}
                              />
                              <CartSummaryRulesCheck
                                company={props.company}
                                employee={employeeFetcher.employee}
                                cart={props.cartDraft}
                              />
                            </React.Fragment>
                          )}
                        </React.Fragment>;
                    }}
                  </OrderCreateOwnerConnector>
                );
              }}
            </B2BApolloClientContext.Consumer>
          )}
          {props.cartDraft.id && (
            <React.Fragment>
              <OrderCreateCartSummary
                cartDraft={props.cartDraft}
                onRemoveDiscountCode={handleRemoveDiscountCode}
                onRemoveLineItem={handleRemoveLineItem}
                onChangeLineItemQuantity={handleChangeLineItemQuantity}
              />
              {props.cartDraft.lineItems.length > 0 && !props.cartDraft.quote && (
                <Card>
                  <CartAddDiscountCode
                    onApplyDiscountCode={handleApplyDiscountCode}
                  />
                </Card>
              )}
            </React.Fragment>
          )}
        </Spacings.Stack>
      </Spacings.Inset>
      <PageBottomSpacer />
    </div>
  );
};
CartSummarySection.displayName = 'CartSummarySection';
CartSummarySection.propTypes = {
  goToCountrySelection: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  cartDraft: PropTypes.shape({
    country: PropTypes.string,
    customerId: PropTypes.string,
    customerGroup: PropTypes.shape({
      id: PropTypes.string,
    }),
    currency: PropTypes.string,
    id: PropTypes.string,
    lineItems: PropTypes.array,
    quote: PropTypes.object,
    totalPrice: PropTypes.number,
  }),
  cartUpdater: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    execute: PropTypes.func.isRequired,
  }),
  company: PropTypes.object.isRequired,
  store: PropTypes.shape({
    id: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired,
    nameAllLocales: PropTypes.arrayOf(
      PropTypes.shape({
        locale: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      })
    ).isRequired,
  }),
  // injectIntl
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  showNotification: PropTypes.func.isRequired,
  onActionError: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  showNotification: globalActions.showNotification,
  onActionError: globalActions.handleActionError,
};

export default compose(
  connect(null, mapDispatchToProps),
  injectIntl
)(CartSummarySection);
