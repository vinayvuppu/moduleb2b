import PropTypes from 'prop-types';
import React from 'react';
import { compose, branch, hoistStatics } from 'recompose';
import { graphql } from 'react-apollo';
import invariant from 'tiny-invariant';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import FetchTypeDefinitionsQuery from './custom-field-type-definitions-connector.graphql';
import {
  restDocToForm,
  graphQlDocToForm,
  formToRestDoc,
  formToGraphQlDoc,
  createEmptyCustomFields,
} from './utils';

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
  'cart-discount',
];

const emptyTypeDefinitions = {
  total: 0,
  count: 0,
  results: [],
};

export class CustomFieldTypeDefinitionsConnector extends React.Component {
  static displayName = 'CustomFieldTypeDefinitionsConnector';
  static propTypes = {
    resources: PropTypes.arrayOf(PropTypes.string).isRequired,
    typeKey: PropTypes.string,
    projectKey: PropTypes.string.isRequired,
    limit: PropTypes.number,
    isDisabled: PropTypes.bool.isRequired,

    // parent
    children: PropTypes.func.isRequired,

    // Apollo
    fetchTypeDefinitionsQuery: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      error: PropTypes.shape({
        message: PropTypes.string.isRequired,
      }),
      typeDefinitions: PropTypes.object,
    }),
  };

  static defaultProps = {
    resources: [],
    limit: 500,
  };

  static restDocToForm = restDocToForm;
  static graphQlDocToForm = graphQlDocToForm;
  static formToRestDoc = formToRestDoc;
  static formToGraphQlDoc = formToGraphQlDoc;
  static createEmptyCustomFields = createEmptyCustomFields;

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
      customFieldTypeDefinitionsFetcher: {
        isLoading: this.props.isDisabled
          ? false
          : this.props.fetchTypeDefinitionsQuery.loading,
        customFieldTypeDefinitions: this.props.isDisabled
          ? emptyTypeDefinitions
          : this.props.fetchTypeDefinitionsQuery.typeDefinitions ||
            emptyTypeDefinitions,
      },
    });
  }
}

const stringifyResources = resources =>
  resources.map(resource => `"${resource}"`).join();

const createGraphQlOptions = ownProps => {
  let where =
    ownProps.resources.length > 0
      ? `resourceTypeIds contains any (${stringifyResources(
          ownProps.resources
        )})`
      : '';

  if (ownProps.typeKey) {
    where = `${where} and key="${ownProps.typeKey}"`;
  }
  return {
    variables: {
      where,
      limit: ownProps.limit,
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
      projectKey: ownProps.projectKey,
    },
  };
};

export default hoistStatics(
  compose(
    branch(
      props => !props.isDisabled,
      graphql(FetchTypeDefinitionsQuery, {
        name: 'fetchTypeDefinitionsQuery',
        options: createGraphQlOptions,
      })
    )
  )
)(CustomFieldTypeDefinitionsConnector);
