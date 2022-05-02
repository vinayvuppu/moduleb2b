import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import { injectTransformedLocalizedFields } from '@commercetools-local/utils/graphql';
import FetchStoresQuery from './stores.graphql';

export class StoresConnector extends React.PureComponent {
  static displayName = 'StoresConnector';
  static propTypes = {
    children: PropTypes.func.isRequired,
    // graphql
    fetchStoresQuery: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      stores: PropTypes.arrayOf(
        PropTypes.shape({
          key: PropTypes.string.isRequired,
          name: PropTypes.objectOf(PropTypes.string).isRequired,
        })
      ),
    }),
  };

  render() {
    return this.props.children({
      storesFetcher: {
        isLoading: this.props.fetchStoresQuery.loading,
        stores: this.props.fetchStoresQuery.stores,
      },
    });
  }
}

export const mapStoresDataToProps = stores =>
  stores.results.map(store =>
    injectTransformedLocalizedFields(store, [
      { from: 'nameAllLocales', to: 'name' },
    ])
  );

export const mapStoresQueryToProps = ({ fetchStoresQuery }) => ({
  fetchStoresQuery: {
    ...fetchStoresQuery,
    stores:
      fetchStoresQuery.loading || !fetchStoresQuery.stores
        ? []
        : mapStoresDataToProps(fetchStoresQuery.stores),
  },
});

export default graphql(FetchStoresQuery, {
  name: 'fetchStoresQuery',
  options: () => ({
    variables: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  }),
  props: mapStoresQueryToProps,
})(StoresConnector);
