import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';

import { DOMAINS } from '@commercetools-frontend/constants';
import * as globalActions from '@commercetools-frontend/actions-global';
import { Spacings, Text, LoadingSpinner } from '@commercetools-frontend/ui-kit';
import Pagination from '@commercetools-local/core/components/search/pagination';
import {
  ProjectExtensionProviderForImageRegex,
  withApplicationContext,
} from '@commercetools-frontend/application-shell-connectors';
import SearchInput from '@commercetools-local/core/components/fields/search-input';

import styles from './quote-create-add-line-items.mod.css';
import messages from './messages';

import OrderCreateProductsListItem from '../../../my-company/components/order-create-products-list-item';

import * as productActions from './actions';

export class QuoteCreateAddLineItems extends React.PureComponent {
  static displayName = 'QuoteCreateAddLineItems';

  state = {
    products: null,
    facets: null,
    total: 0,
    perPage: 20,
    page: 1,
    searchTerm: '',
  };

  static propTypes = {
    renderSaveToolbarStep: PropTypes.func.isRequired,
    addLineItem: PropTypes.func.isRequired,
    quote: PropTypes.object,
    company: PropTypes.shape({
      customerGroup: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }),
    }),
    projectKey: PropTypes.string.isRequired,
    allLineItems: PropTypes.array.isRequired,
    showNotification: PropTypes.func.isRequired,
    onActionError: PropTypes.func.isRequired,
    fetchProducts: PropTypes.func.isRequired,
    // HoC
    intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
      .isRequired,
    // withApplicationContext
    dataLocale: PropTypes.string.isRequired,
  };

  handleAddVariantToCart = variant => {
    return this.props
      .addLineItem({ sku: variant.sku, quantity: parseFloat(variant.quantity) })
      .then(
        () => {
          this.props.showNotification({
            kind: 'success',
            domain: DOMAINS.SIDE,
            text: this.props.intl.formatMessage(messages.addVariantSuccess, {
              sku: variant.sku,
            }),
          });
        },
        graphQLErrors => {
          if (graphQLErrors.length > 0) {
            const graphQLError = graphQLErrors[0];
            let errorMessage = graphQLError.message;
            if (graphQLError.code === 'MatchingPriceNotFound')
              errorMessage = this.props.intl.formatMessage(
                messages.addVariantFailure
              );
            if (graphQLError.code === 'MissingTaxRateForCountry')
              errorMessage = this.props.intl.formatMessage(
                messages.addVariantFailureTaxRate
              );
            this.props.showNotification({
              kind: 'error',
              domain: DOMAINS.SIDE,
              text: errorMessage,
            });
          } else {
            this.props.onActionError(
              graphQLErrors,
              'OrderCreateVariantSearch/updateCart'
            );
          }
        }
      );
  };

  setSearchTerm = nextSearchTerm =>
    this.setState(prevState => ({
      ...prevState,
      searchTerm: nextSearchTerm,
    }));

  handlePageChange = nextPage =>
    this.setState(prevState => ({
      ...prevState,
      page: nextPage,
    }));

  handlePerPageChange = nextPerPage =>
    this.setState(prevState => ({
      ...prevState,
      perPage: nextPerPage,
    }));

  searchProducts = async () => {
    try {
      const options = {
        filter: [`variants.scopedPrice:exists`],
        page: this.state.page,
        perPage: this.state.perPage,
        priceCurrency: this.props.quote.totalPrice.currencyCode,
        priceCustomerGroup: this.props.company?.customerGroup?.id,
        ...(this.state.searchTerm && {
          text: {
            value: this.state.searchTerm,
            language: this.props.dataLocale,
          },
        }),
        ...(!this.state.searchTerm && {
          sort: [{ by: 'id', direction: 'asc' }], // this is done for mantain order when the searchTerm is not provided
        }),
      };

      const response = await this.props.fetchProducts(options);

      this.setState(prevState => ({
        ...prevState,
        products: response.results,
        total: response.total,
      }));
    } catch (error) {
      this.props.onActionError(error, 'ProductPage/fetchProducts');
    }
  };

  async componentDidMount() {
    await this.searchProducts();
  }

  async componentDidUpdate(prevProps, prevState) {
    if (
      prevState.searchTerm !== this.state.searchTerm ||
      prevState.page !== this.state.page ||
      prevState.perPage !== this.state.perPage
    ) {
      await this.searchProducts();
    }
  }

  render() {
    if (!this.state.products) {
      return <LoadingSpinner />;
    }

    return (
      <Spacings.Stack scale="m">
        <Spacings.Inline scale="l" justifyContent="space-between">
          <Text.Headline as="h2">
            <FormattedMessage {...messages.title} />
          </Text.Headline>
        </Spacings.Inline>
        <SearchInput
          initialValue={this.state.searchTerm}
          onSubmit={this.setSearchTerm}
          placeholder={this.props.intl.formatMessage(
            messages.searchPlaceHolder
          )}
        />
        <ProjectExtensionProviderForImageRegex>
          <div className={styles['products-container']}>
            {this.state.products.map(product => (
              <OrderCreateProductsListItem
                {...product}
                key={product.id}
                onAddVariantToCart={this.handleAddVariantToCart}
                isAddingVariant={false /* this.props.cartUpdater.isLoading */}
              />
            ))}
          </div>
        </ProjectExtensionProviderForImageRegex>
        <Pagination
          totalItems={this.state.total}
          perPage={this.state.perPage}
          page={this.state.page}
          onPerPageChange={this.handlePerPageChange}
          onPageChange={this.handlePageChange}
        />
        {this.props.renderSaveToolbarStep()}
      </Spacings.Stack>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    allLineItems: ownProps.quote?.lineItems || [],
  };
};

const mapDispatchToProps = {
  showNotification: globalActions.showNotification,
  onActionError: globalActions.handleActionError,
  fetchProducts: productActions.fetchProducts,
};

export default compose(
  withApplicationContext(applicationContext => ({
    dataLocale: applicationContext.dataLocale,
  })),
  injectIntl,
  connect(mapStateToProps, mapDispatchToProps)
)(QuoteCreateAddLineItems);
