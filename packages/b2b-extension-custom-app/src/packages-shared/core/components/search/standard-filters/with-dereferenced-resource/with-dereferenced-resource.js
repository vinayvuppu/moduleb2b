import React from 'react';
import PropTypes from 'prop-types';
import { propType } from 'graphql-anywhere';
import { graphql, withApollo } from 'react-apollo';
import { injectIntl } from 'react-intl';
import { compose, getDisplayName } from 'recompose';
import oneLineTrim from 'common-tags/lib/oneLineTrim';
import { withApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import capitalizeFirst from '../../../../../utils/capitalize-first';

const createReadFragmentByIdFn = (
  client,
  fragment,
  locale,
  cachePrefix
) => id => {
  // If the fragment does not exist in the cache yet, force to
  // refetch the data.

  // When parsing a predicate like "resource.id = ('b')" the value received by
  // the ReferenceFilter (which is passed to this function) is an Array of ids.
  const refId = Array.isArray(id) ? id[0] : id;

  try {
    return client.readFragment({
      fragment,
      id: cachePrefix ? `${cachePrefix}:${refId}` : refId,
      variables: {
        target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
        locale,
      },
    });
  } catch (error) {
    return null;
  }
};

// Export this to make it easier to test
export const createDereferencedResource = (Component, options) => {
  class DereferencedResource extends React.PureComponent {
    static displayName = oneLineTrim`
    ${capitalizeFirst(options.resourceName)}DereferencedResource(
      ${getDisplayName(Component)}
    )
  `;
    static propTypes = {
      data: PropTypes.shape({
        loading: PropTypes.bool,
        items: propType(options.fragmentSearchResult),
      }),
      client: PropTypes.shape({
        query: PropTypes.func.isRequired,
        readFragment: PropTypes.func.isRequired,
      }).isRequired,
      // Value is always an ID or a list of IDs
      value: options.isMulti
        ? PropTypes.arrayOf(PropTypes.string)
        : PropTypes.string,
      intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
        .isRequired,
      language: PropTypes.string.isRequired,
    };

    // We need to trigger this query manually to show the user what results
    // are retrieved from the API.
    searchItems = searchText =>
      this.props.client
        .query({
          query: options.searchQuery,
          variables: {
            target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
            locale: this.props.language,
            ...options.getSearchVariables(
              searchText,
              this.props.language,
              options.stateType
            ),
          },
          fetchPolicy: options.fetchPolicy || 'cache-first',
        })
        .then(res => res.data.items.results);

    // This function will try to load an item by ID from the Apollo cache.
    readItemFromCache = createReadFragmentByIdFn(
      this.props.client,
      options.fragmentSearchItem,
      this.props.language,
      options.cachePrefix
    );

    render() {
      return (
        <Component
          {...this.props}
          loadItems={this.searchItems}
          readItemFromCache={this.readItemFromCache}
        />
      );
    }
  }
  return DereferencedResource;
};

export default function withDereferencedResource(options) {
  return Component => {
    const DereferencedResource = createDereferencedResource(Component, options);

    return compose(
      withApplicationContext(applicationContext => ({
        language: applicationContext.dataLocale,
      })),
      withApollo,
      graphql(options.dereferenceQuery, {
        options: ownProps => ({
          variables: {
            target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
            locale: ownProps.language,
            ...(ownProps.value
              ? options.getDereferenceVariables(
                  ownProps.value,
                  options.isMulti,
                  options.stateType
                )
              : {}),
          },
        }),
        // This part prevents the component to trigger the search query if there
        // is no item selected or all items are fetched and stored in the
        // cache from previous queries.
        skip: ownProps => {
          const readItemFromCache = createReadFragmentByIdFn(
            ownProps.client,
            options.fragmentSearchItem,
            ownProps.language,
            options.cachePrefix
          );
          return Boolean(
            !ownProps.value ||
              (options.isMulti && ownProps.value.every(readItemFromCache)) ||
              readItemFromCache(ownProps.value)
          );
        },
      }),
      injectIntl
    )(DereferencedResource);
  };
}
