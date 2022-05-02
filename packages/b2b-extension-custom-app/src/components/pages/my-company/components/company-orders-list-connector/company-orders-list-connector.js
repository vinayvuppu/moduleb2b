import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { graphql, Query } from 'react-apollo';
import { getIn } from 'formik';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { GRAPHQL_TARGETS, DOMAINS } from '@commercetools-frontend/constants';
import { withApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import * as globalActions from '@commercetools-frontend/actions-global';
import {
  FetchStatesQuery,
  FetchOrdersListQuery,
  FetchPaymentsQuery,
} from './company-orders-list-connector.graphql';
import messages from './messages';
import {
  createQueryVariables,
  createPaymentQueryVariables,
  buildPaymentFilterOptions,
} from './company-orders-list-query-variables';
import { transformApiError } from './conversions';

const emptyOrdersList = {
  count: 0,
  total: 0,
  results: [],
};

const hasPaymentFilters = filters =>
  filters.paymentTransactionId ||
  filters.paymentPredicate ||
  filters.paymentInteractionId ||
  filters.paymentCustomField;

export class CompanyOrdersListConnector extends React.Component {
  static displayName = 'CompanyOrdersListConnector';
  static propTypes = {
    projectKey: PropTypes.string.isRequired,
    children: PropTypes.func.isRequired,
    searchQuery: PropTypes.object.isRequired,

    // withApplicationContext
    userId: PropTypes.string.isRequired,
    // graphql
    statesQuery: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      states: PropTypes.shape({
        total: PropTypes.number.isRequired,
      }),
    }).isRequired,
    // connect
    showNotification: PropTypes.func.isRequired,
    // injectIntl
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
      locale: PropTypes.string.isRequired,
    }).isRequired,
  };

  handleQueryError = error => {
    const transformedApiError = transformApiError(error);

    if (transformedApiError?.predicate?.invalid)
      this.props.showNotification({
        kind: 'error',
        domain: DOMAINS.SIDE,
        text: this.props.intl.formatMessage(messages.invalidOrderPredicate),
      });
  };

  buildStatesFetcher = () => ({
    isLoading: this.props.statesQuery.loading,
    hasOrderStates: Boolean(getIn(this.props.statesQuery, 'states.total')),
  });

  render() {
    const skipPaymentsQuery = !hasPaymentFilters(
      this.props.searchQuery.filters
    );
    return (
      <Query
        query={FetchPaymentsQuery}
        variables={createPaymentQueryVariables(
          this.props.searchQuery,
          this.props.projectKey,
          this.props.intl.locale
        )}
        skip={skipPaymentsQuery}
        onError={this.handleQueryError}
      >
        {paymentsQuery => {
          if (paymentsQuery.loading) return null;

          // In case no payments are returned from the query we need to return an
          // empty results for orders
          if (paymentsQuery.data?.payments?.results.length === 0)
            return this.props.children({
              ordersFetcher: {
                isLoading: false,
                orders: emptyOrdersList,
              },
              statesFetcher: this.buildStatesFetcher(),
            });

          /* This is responsible of constructing a customized filter options
           * taking into account the results of the payments search. We will return a
           * valid "paymentPredicate" filter option so can be used in the
           * transformFiltersToWherePredicate util for the orders query
           */

          const newSearchQuery =
            !skipPaymentsQuery && !paymentsQuery.error
              ? buildPaymentFilterOptions(
                  this.props.searchQuery,
                  paymentsQuery.data?.payments.results,
                  this.props.intl.locale
                )
              : this.props.searchQuery;

          return (
            <Query
              query={FetchOrdersListQuery}
              variables={createQueryVariables(newSearchQuery, {
                projectKey: this.props.projectKey,
                locale: this.props.intl.locale,
              })}
              fetchPolicy="cache-and-network"
              onError={this.handleQueryError}
            >
              {ordersQuery => {
                return this.props.children({
                  ordersFetcher: {
                    isLoading: ordersQuery.loading,
                    orders:
                      ordersQuery.data?.orders ||
                      ordersQuery.data?.inStores?.orders ||
                      emptyOrdersList,
                    refetch: ordersQuery.refetch,
                  },
                  statesFetcher: this.buildStatesFetcher(),
                });
              }}
            </Query>
          );
        }}
      </Query>
    );
  }
}

const mapDispatchToProps = {
  showNotification: globalActions.showNotification,
};

export default compose(
  injectIntl,
  connect(null, mapDispatchToProps),
  graphql(FetchStatesQuery, {
    name: 'statesQuery',
    options: () => ({
      variables: {
        where: 'type in ("OrderState")',
        target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
      },
      fetchPolicy: 'cache-and-network',
    }),
  }),
  withApplicationContext(applicationContext => ({
    userId: applicationContext.user.id,
  }))
)(CompanyOrdersListConnector);
