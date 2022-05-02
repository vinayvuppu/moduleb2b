import PropTypes from 'prop-types';
import React from 'react';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import { injectTransformedLocalizedFields } from '@commercetools-local/utils/graphql';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import { convertApolloQueryDataToConnectorData } from '../../../../../utils/connector';
import { ProductTypeDetails } from './product-type-details-connector.graphql';

export const createProductTypeQueryVariables = ownProps => ({
  id: ownProps.id,
  target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
});

export const injectElementTypeValuesTransformedLocalizedFields = elementTypeValues =>
  elementTypeValues.map(value => ({
    ...value,
    ...(value.labelAllLocales
      ? injectTransformedLocalizedFields(value, [
          {
            from: 'labelAllLocales',
            to: 'label',
          },
        ])
      : undefined),
  }));

const injectProductTypeTransformedLocalizedFields = productType => ({
  ...productType,
  attributes: productType.attributeDefinitions.results.map(definition => ({
    ...definition,
    ...injectTransformedLocalizedFields(definition, [
      {
        from: 'labelAllLocales',
        to: 'label',
      },
    ]),
    ...injectTransformedLocalizedFields(definition, [
      {
        from: 'inputTipAllLocales',
        to: 'inputTip',
      },
    ]),
    type: {
      ...definition.type,
      elementType: definition.type.elementType?.values
        ? {
            ...definition.type.elementType,
            values: injectElementTypeValuesTransformedLocalizedFields(
              definition.type.elementType.values.results
            ),
          }
        : definition.type.elementType,
      values: definition.type.values
        ? definition.type.values.results.map(value => ({
            ...value,
            ...(value.labelAllLocales
              ? injectTransformedLocalizedFields(value, [
                  {
                    from: 'labelAllLocales',
                    to: 'label',
                  },
                ])
              : undefined),
          }))
        : undefined,
    },
  })),
});
export class ProductTypeDetailsConnector extends React.Component {
  static displayName = 'ProductTypeDetailsConnector';
  static propTypes = {
    // parent
    children: PropTypes.func.isRequired,
    page: PropTypes.number,
    perPage: PropTypes.number,
    sortBy: PropTypes.string,
    sortDirection: PropTypes.oneOf(['asc', 'desc']),
    // HoC
    fetchProductTypeDetails: PropTypes.shape({
      isLoading: PropTypes.bool.isRequired,
      error: PropTypes.shape({
        message: PropTypes.string.isRequired,
      }),
      productType: PropTypes.shape({
        name: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        key: PropTypes.string,
        version: PropTypes.number.isRequired,
        attributeDefinitions: PropTypes.shape({
          results: PropTypes.arrayOf(
            PropTypes.shape({
              name: PropTypes.string.isRequired,
              type: PropTypes.shape({
                name: PropTypes.string.isRequired,
                elementType: PropTypes.shape({
                  name: PropTypes.string.isRequired,
                }),
              }).isRequired,
              attributeConstraint: PropTypes.string,
              isRequired: PropTypes.bool,
              isSearchable: PropTypes.bool,
            })
          ),
        }),
      }),
    }),
  };

  render() {
    return this.props.children({
      productTypeDetails: this.props.fetchProductTypeDetails,
    });
  }
}

export const createproductTypePropsFromGraphQlResponse = graphQlResponse => {
  const fetchProductTypeDetails = {
    ...convertApolloQueryDataToConnectorData(
      graphQlResponse.fetchProductTypeDetails,
      'productType'
    ),
  };
  if (!fetchProductTypeDetails.isLoading && !fetchProductTypeDetails.error)
    return {
      ...graphQlResponse,
      fetchProductTypeDetails: {
        ...fetchProductTypeDetails,
        productType: injectProductTypeTransformedLocalizedFields(
          fetchProductTypeDetails.productType
        ),
      },
    };

  return {
    ...graphQlResponse,
    fetchProductTypeDetails,
  };
};

export default compose(
  // We need to define defaultProps here instead of on the component itself as
  // the HoC are using the same defaultProps as well
  graphql(ProductTypeDetails, {
    name: 'fetchProductTypeDetails',
    props: createproductTypePropsFromGraphQlResponse,
    options: ownProps => ({
      variables: {
        ...createProductTypeQueryVariables(ownProps),
      },
    }),
  })
)(ProductTypeDetailsConnector);
