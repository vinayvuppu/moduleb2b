import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import omit from 'lodash.omit';
import { withApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import FetchShippingMethodsByCartQuery from './order-create-set-shipping-method-connector.graphql';

// Exposes the shipping rate with `isMatching: true` with no other information
// related to the `zoneRate`.
const exposeMatchingShippingRate = zoneRates =>
  zoneRates
    .map(zoneRate =>
      zoneRate.shippingRates.find(shippingRate => shippingRate.isMatching)
    )
    // We need to find the existing one since only one shippingRate will have
    // `isMatching` to `true`
    .find(Boolean);

// when requesting the shipping methods by cart id we get the valid shipping rates
// marked with the flag isMatching set to `true`. This method filters the result to
// get the valid rates
export const mapShippingMethodsWithMatchingRate = ({
  shippingMethodsByCartQuery,
}) => {
  if (shippingMethodsByCartQuery.loading) {
    return { shippingMethodsByCartQuery };
  }

  const shippingMethods =
    shippingMethodsByCartQuery.shippingMethodsByCart ||
    shippingMethodsByCartQuery.inStores?.shippingMethodsByCart;

  return {
    shippingMethodsByCartQuery: {
      ...shippingMethodsByCartQuery,
      shippingMethodsByCart: shippingMethods?.map(shippingMethod => ({
        // We omit the current structure of zoneRates since we only need the matching
        // shippingRate with the cart configuration (country, currency, ...)
        ...omit(shippingMethod, 'zoneRates'),
        rate: exposeMatchingShippingRate(shippingMethod.zoneRates),
      })),
    },
  };
};

export class OrderCreateSetShippingMethodConnector extends React.PureComponent {
  static displayName = 'OrderCreateSetShippingMethodConnector';

  static propTypes = {
    children: PropTypes.func.isRequired,
    cartId: PropTypes.string,
    storeKey: PropTypes.string,
    hasGeneralPermissions: PropTypes.bool.isRequired,

    // graphql
    shippingMethodsByCartQuery: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      shippingMethodsByCart: PropTypes.array,
    }),
  };

  render() {
    return this.props.children({
      shippingMethodsByCartFetcher: {
        isLoading: this.props.shippingMethodsByCartQuery?.loading,
        shippingMethodsByCart: this.props.shippingMethodsByCartQuery
          ?.shippingMethodsByCart,
        defaultShippingMethod: this.props.shippingMethodsByCartQuery?.shippingMethodsByCart?.find(
          shippingMethod => shippingMethod.isDefault
        ),
      },
    });
  }
}

export const createQueryVariables = ownProps => ({
  target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
  cartId: ownProps.cartId,
  // Given that `storeKey` is required on `inStore` and
  // `storeKey` can be undefined when creating an order,
  // we use `inStores` and pass in an empty array
  storeKeys: ownProps.storeKey ? [ownProps.storeKey] : [],
  hasGeneralPermissions: ownProps.hasGeneralPermissions,
});

export default compose(
  withApplicationContext(applicationContext => ({
    hasGeneralPermissions: applicationContext.permissions.canManageOrders,
  })),
  graphql(FetchShippingMethodsByCartQuery, {
    name: 'shippingMethodsByCartQuery',
    props: mapShippingMethodsWithMatchingRate,
    options: ownProps => ({
      variables: createQueryVariables(ownProps),
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
    }),
    skip: ownProps => !ownProps.cartId,
  })
)(OrderCreateSetShippingMethodConnector);
