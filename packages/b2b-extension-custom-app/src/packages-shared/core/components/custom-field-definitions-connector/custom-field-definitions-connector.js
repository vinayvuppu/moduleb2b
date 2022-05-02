import PropTypes from 'prop-types';
import React from 'react';
import { compose, branch } from 'recompose';
import { graphql } from 'react-apollo';
import flatten from 'lodash.flatten';
import uniqBy from 'lodash.uniqby';
import invariant from 'tiny-invariant';
import { injectTransformedLocalizedFields } from '@commercetools-local/utils/graphql';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import FetchTypeDefinitionsQuery from './custom-field-definitions-connector.graphql';

const customizableResources = [
  'asset',
  'category',
  'channel',
  'customer',
  'order',
  'discount-code',
  'inventory-entry',
  'line-item',
  'custom-line-item',
  'product-price',
  'payment',
  'payment-interface-interaction',
  'shopping-list',
  'shopping-list-text-line-item',
  'review',
];

export class CustomFieldDefinitionsConnector extends React.Component {
  static displayName = 'CustomFieldDefinitionsConnector';
  static propTypes = {
    resources: PropTypes.arrayOf(PropTypes.string).isRequired,

    // withRouter
    match: PropTypes.shape({
      params: PropTypes.shape({
        projectKey: PropTypes.string.isRequired,
      }),
    }),

    // parent
    children: PropTypes.func.isRequired,

    // Apollo
    fetchTypeDefinitionsQuery: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      error: PropTypes.shape({
        message: PropTypes.string.isRequired,
      }),
      customFieldDefinitions: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.object,
        })
      ),
    }),
    isDisabled: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    resources: [],
  };

  componentDidMount() {
    const hasUnsupportedResource = this.props.resources.some(
      resource => !customizableResources.includes(resource)
    );
    invariant(
      !hasUnsupportedResource,
      `core/components/custom-field-definitions-connector: some of the specified resources are not supported.`
    );
  }

  render() {
    return this.props.children({
      customFieldDefinitionsFetcher: {
        isLoading: this.props.isDisabled
          ? false
          : this.props.fetchTypeDefinitionsQuery.loading,
        customFieldDefinitions: this.props.isDisabled
          ? []
          : this.props.fetchTypeDefinitionsQuery.customFieldDefinitions,
      },
    });
  }
}

const stringifyResources = resources =>
  resources.map(resource => `"${resource}"`).join();

const mapPropsToOptions = ownProps => {
  const where =
    ownProps.resources.length > 0
      ? `resourceTypeIds contains any (${stringifyResources(
          ownProps.resources
        )})`
      : undefined;
  return {
    variables: {
      where,
      limit: 500,
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  };
};

export const mapDataToProps = ({ fetchTypeDefinitionsQuery }) => {
  if (fetchTypeDefinitionsQuery.typeDefinitions) {
    const fieldDefinitionsToOptionsMap = flatten(
      fetchTypeDefinitionsQuery.typeDefinitions.results.map(typeDefiniton =>
        typeDefiniton.fieldDefinitions.map(fieldDefinition => fieldDefinition)
      )
    );

    return {
      fetchTypeDefinitionsQuery: {
        loading: fetchTypeDefinitionsQuery.loading,
        customFieldDefinitions: uniqBy(
          fieldDefinitionsToOptionsMap.map(fieldDefinition => ({
            ...injectTransformedLocalizedFields(fieldDefinition, [
              { from: 'labelAllLocales', to: 'label' },
            ]),
          })),
          'name'
        ),
      },
    };
  }
  return { fetchTypeDefinitionsQuery };
};

export default compose(
  branch(
    props => !props.isDisabled,
    graphql(FetchTypeDefinitionsQuery, {
      name: 'fetchTypeDefinitionsQuery',
      options: mapPropsToOptions,
      props: mapDataToProps,
    })
  )
)(CustomFieldDefinitionsConnector);
