import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { withApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import withPendingRequests from '@commercetools-local/utils/with-pending-requests';
import {
  createGraphQlUpdateActions,
  extractErrorFromGraphQlResponse,
} from '@commercetools-local/utils/graphql';
import OrderCreateConnectorContext from './order-create-connector-context';
import {
  CreateCartMutation,
  UpdateCartMutation,
  UpdateOrderMutation,
  CreateOrderFromCartMutation,
  ReplicateCartMutation,
} from './order-create-connector.graphql';
import { cartDraftToDoc, cartDraftToOrderCartCommand } from './conversions';
import QuoteCreateConnector from '../../../quotes/components/quote-create-connector';

export const initialCartDraft = {
  customerId: null,
  billingAddress: null,
  shippingAddress: null,
  lineItems: null,
  customLineItems: null,
  discountCodes: null,
  currency: null,
  customerEmail: null,
  deleteDaysAfterLastModification: 1,
  origin: 'Merchant',
};

export class OrderCreateConnectorProvider extends React.PureComponent {
  static displayName = 'OrderCreateConnectorProvider';

  static propTypes = {
    children: PropTypes.node.isRequired,

    // graphql
    createCartMutation: PropTypes.func.isRequired,
    updateCartMutation: PropTypes.func.isRequired,
    createOrderMutation: PropTypes.func.isRequired,
    updateOrderMutation: PropTypes.func.isRequired,
    replicateCartMutation: PropTypes.func.isRequired,

    // withPendingRequests
    pendingCreateCartRequests: PropTypes.shape({
      increment: PropTypes.func.isRequired,
      decrement: PropTypes.func.isRequired,
      isLoading: PropTypes.bool.isRequired,
    }).isRequired,
    pendingUpdateRequests: PropTypes.shape({
      increment: PropTypes.func.isRequired,
      decrement: PropTypes.func.isRequired,
      isLoading: PropTypes.bool.isRequired,
    }).isRequired,
    pendingCreateOrderRequests: PropTypes.shape({
      increment: PropTypes.func.isRequired,
      decrement: PropTypes.func.isRequired,
      isLoading: PropTypes.bool.isRequired,
    }).isRequired,
    pendingUpdateOrderRequests: PropTypes.shape({
      increment: PropTypes.func.isRequired,
      decrement: PropTypes.func.isRequired,
      isLoading: PropTypes.bool.isRequired,
    }).isRequired,

    // injectIntl
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
    }).isRequired,

    location: PropTypes.shape({
      state: PropTypes.shape({
        quote: PropTypes.object,
      }),
    }).isRequired,

    // withApplicationContext
    locale: PropTypes.string.isRequired,

    convertedQuote: PropTypes.func.isRequired,
  };

  state = {
    cartDraft: initialCartDraft,
    hasErrorsUpdatingCart: false,
    isInitialSelectionModalOpen: true,
    owner: {
      type: undefined,
      company: undefined,
      employeeId: undefined,
    },
  };

  handleReplicateCartFromQuote = quote => {
    this.props.pendingCreateCartRequests.increment();
    return this.props
      .replicateCartMutation({
        variables: {
          target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
          reference: { typeId: 'cart', id: quote.id },
          locale: this.props.locale,
        },
      })
      .then(
        response => {
          const cart = response.data.replicateCart;
          this.setState(
            {
              cartDraft: {
                ...cart,
                currency: cart.totalPrice?.currencyCode,
                quote: {
                  id: quote.id,
                  version: quote.version,
                  quoteNumber: quote.quoteNumber,
                },
                originalTotalPrice: quote.originalTotalPrice,
              },
            },
            () => {
              this.props.pendingCreateCartRequests.decrement();
              this.handleUpdateCart([{ action: 'setCustomType' }]);
            }
          );
          return response;
        },
        graphQLErrors => {
          this.props.pendingCreateCartRequests.decrement();
          throw extractErrorFromGraphQlResponse(graphQLErrors);
        }
      );
  };

  handleCreateCart = ({ storeKey, currency, employeeId }) => {
    const { location } = this.props;
    if (location.state?.quote)
      return this.handleReplicateCartFromQuote(location.state.quote);
    this.props.pendingCreateCartRequests.increment();
    return this.props
      .createCartMutation({
        variables: {
          target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
          draft: {
            ...cartDraftToDoc(this.state.cartDraft),
            currency,
            customerId: employeeId,
          },
          locale: this.props.locale,
          storeKey,
        },
      })
      .then(
        createdCart => {
          const cart = createdCart.data.createCart;
          this.setState(
            {
              cartDraft: {
                ...cart,
                currency: cart.totalPrice?.currencyCode,
              },
            },
            () => this.props.pendingCreateCartRequests.decrement()
          );
          return createdCart;
        },
        graphQLErrors => {
          this.props.pendingCreateCartRequests.decrement();
          throw extractErrorFromGraphQlResponse(graphQLErrors);
        }
      );
  };

  handleUpdateCart = actions => {
    this.props.pendingUpdateRequests.increment();
    return this.props
      .updateCartMutation({
        variables: {
          target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
          id: this.state.cartDraft.id,
          version: this.state.cartDraft.version,
          locale: this.props.locale,
          actions: createGraphQlUpdateActions(actions),
          storeKey: this.state.store?.key,
        },
      })
      .then(
        updatedCart => {
          const cart = updatedCart.data.updateCart;
          this.setState(
            prevState => ({
              cartDraft: {
                ...prevState.cartDraft,
                ...cart,
                currency: cart.totalPrice?.currencyCode,
              },
              hasErrorsUpdatingCart: false,
            }),
            () => this.props.pendingUpdateRequests.decrement()
          );
          return updatedCart;
        },
        graphQLErrors => {
          this.setState({ hasErrorsUpdatingCart: true });
          this.props.pendingUpdateRequests.decrement();
          throw extractErrorFromGraphQlResponse(graphQLErrors);
        }
      );
  };

  handleCreateOrder = initialOrderStateId => {
    this.props.pendingCreateOrderRequests.increment();
    return this.props
      .createOrderMutation({
        variables: {
          target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
          draft: cartDraftToOrderCartCommand({
            ...this.state.cartDraft,
            state: { typeId: 'state', id: initialOrderStateId },
          }),
          locale: this.props.locale,
          storeKey: this.state.store?.key,
        },
      })
      .then(
        results => {
          this.props.pendingCreateOrderRequests.decrement();
          if (this.state.cartDraft.quote) {
            this.props.convertedQuote(this.state.cartDraft.quote);
          }
          return results.data.createdOrder;
        },
        graphQLErrors => {
          this.props.pendingCreateOrderRequests.decrement();
          throw extractErrorFromGraphQlResponse(graphQLErrors);
        }
      );
  };

  handleUpdateOrder = (order, actions) => {
    this.props.pendingUpdateOrderRequests.increment();
    return this.props
      .updateOrderMutation({
        variables: {
          target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
          id: order.id,
          version: order.version,
          locale: this.props.locale,
          actions: createGraphQlUpdateActions(actions),
        },
      })
      .then(
        updatedOrder => {
          this.props.pendingUpdateOrderRequests.decrement();
          return updatedOrder.data.updateOrder;
        },
        graphQLErrors => {
          this.props.pendingUpdateOrderRequests.decrement();
          throw extractErrorFromGraphQlResponse(graphQLErrors);
        }
      );
  };

  handleUpdateCartDraft = updatedCartDraft =>
    this.setState(prevState => ({
      cartDraft: {
        ...prevState.cartDraft,
        ...updatedCartDraft,
      },
    }));

  handleResetCartDraft = () => this.setState({ cartDraft: initialCartDraft });

  handleStoreUpdate = store => this.setState({ store });

  handleCloseInitialSelectionModal = () =>
    this.setState({ isInitialSelectionModalOpen: false });

  handleSelectOwner = owner => this.setState({ owner });

  render() {
    return (
      <OrderCreateConnectorContext.Provider
        value={{
          cartDraftState: {
            value: this.state.cartDraft,
            update: this.handleUpdateCartDraft,
            reset: this.handleResetCartDraft,
          },
          cartCreator: {
            isLoading: this.props.pendingCreateCartRequests.isLoading,
            execute: this.handleCreateCart,
          },
          cartUpdater: {
            isLoading: this.props.pendingUpdateRequests.isLoading,
            execute: this.handleUpdateCart,
            hasErrors: this.state.hasErrorsUpdatingCart,
          },
          orderCreator: {
            isLoading: this.props.pendingCreateOrderRequests.isLoading,
            execute: this.handleCreateOrder,
          },
          orderUpdater: {
            isLoading: this.props.pendingUpdateOrderRequests.isLoading,
            execute: this.handleUpdateOrder,
          },
          storeState: {
            value: this.state.store,
            update: this.handleStoreUpdate,
          },
          initialSelectionModalState: {
            isOpen: this.state.isInitialSelectionModalOpen,
            close: this.handleCloseInitialSelectionModal,
          },
          ownerState: {
            owner: this.state.owner,
            update: this.handleSelectOwner,
          },
        }}
      >
        {this.props.children}
      </OrderCreateConnectorContext.Provider>
    );
  }
}

const OrderCreateConnectorProviderWrapper = props => (
  <QuoteCreateConnector>
    {({ convertedQuote }) => (
      <OrderCreateConnectorProvider
        {...props}
        convertedQuote={convertedQuote}
      />
    )}
  </QuoteCreateConnector>
);
OrderCreateConnectorProviderWrapper.displayName =
  'OrderCreateConnectorProviderWrapper';

export default compose(
  withApplicationContext(applicationContext => ({
    locale: applicationContext.dataLocale,
  })),
  graphql(CreateCartMutation, { name: 'createCartMutation' }),
  graphql(UpdateCartMutation, { name: 'updateCartMutation' }),
  graphql(UpdateOrderMutation, { name: 'updateOrderMutation' }),
  graphql(CreateOrderFromCartMutation, { name: 'createOrderMutation' }),
  graphql(ReplicateCartMutation, { name: 'replicateCartMutation' }),
  injectIntl,
  withPendingRequests('pendingCreateCartRequests'),
  withPendingRequests('pendingCreateOrderRequests'),
  withPendingRequests('pendingUpdateOrderRequests'),
  withPendingRequests('pendingUpdateRequests'),
  withRouter
)(OrderCreateConnectorProviderWrapper);
