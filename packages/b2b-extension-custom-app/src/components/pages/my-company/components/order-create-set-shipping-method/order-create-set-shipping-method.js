import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { compose } from 'recompose';
import { DOMAINS } from '@commercetools-frontend/constants';
import * as globalActions from '@commercetools-frontend/actions-global';
import {
  CollapsiblePanel,
  Spacings,
  RadioInput,
  Table,
  Text,
  LoadingSpinner,
} from '@commercetools-frontend/ui-kit';
import { formatMoney } from '@commercetools-local/utils/formats/money';
import replaceLocationWhenDraftIsMissing from '../../utils/replace-location-when-draft-is-missing';
import messages from './messages';
import createColumnsDefinitions from './column-definitions';

export class OrderCreateSetShippingMethod extends React.PureComponent {
  static displayName = 'OrderCreateSetShippingMethod';

  static propTypes = {
    renderSaveToolbarStep: PropTypes.func.isRequired,
    shippingMethodsByCartFetcher: PropTypes.shape({
      isLoading: PropTypes.bool.isRequired,
      shippingMethodsByCart: PropTypes.array,
      defaultShippingMethod: PropTypes.object,
    }),
    cartDraft: PropTypes.shape({
      id: PropTypes.string.isRequired,
      version: PropTypes.number.isRequired,
      shippingAddress: PropTypes.object,
      shippingInfo: PropTypes.shape({
        shippingMethod: PropTypes.shape({
          id: PropTypes.string.isRequired,
        }).isRequired,
      }),
    }),
    cartUpdater: PropTypes.shape({
      isLoading: PropTypes.bool.isRequired,
      hasErrors: PropTypes.bool.isRequired,
      execute: PropTypes.func.isRequired,
    }),
    // connected
    onActionError: PropTypes.func.isRequired,
    showNotification: PropTypes.func.isRequired,
    // HoC
    intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
      .isRequired,
  };

  componentDidUpdate() {
    if (!this.props.shippingMethodsByCartFetcher.isLoading) {
      // In case the user has a default shipping method we set it
      // as the shipping method of the cart directly
      if (
        this.props.shippingMethodsByCartFetcher.defaultShippingMethod &&
        !this.props.cartDraft.shippingInfo &&
        !this.props.cartUpdater.isLoading &&
        !this.props.cartUpdater.hasErrors
      ) {
        return this.setShippingMethodToCart(
          this.props.shippingMethodsByCartFetcher.defaultShippingMethod
        );
      }
    }
  }

  setShippingMethodToCart = shippingMethod => {
    return this.props.cartUpdater
      .execute([
        {
          action: 'setShippingMethod',
          shippingMethod: {
            id: shippingMethod.id,
            typeId: 'shipping-method',
          },
        },
      ])
      .then(
        () => {
          this.props.showNotification({
            kind: 'success',
            domain: DOMAINS.SIDE,
            text: this.props.intl.formatMessage(messages.shippingMethodUpdated),
          });
        },
        graphQLErrors => {
          if (graphQLErrors.length > 0) {
            const graphQLError = graphQLErrors[0];
            this.props.showNotification({
              kind: 'error',
              domain: DOMAINS.SIDE,
              text:
                graphQLError.code === 'MissingTaxRateForCountry'
                  ? this.props.intl.formatMessage(
                      messages.setShippingMethodFailure
                    )
                  : // return a raw message as a fall back for now.
                    graphQLError.message,
            });
          } else {
            this.props.onActionError(
              graphQLErrors,
              'OrderCreateSetShippingMethod/updateCart'
            );
          }
        }
      );
  };

  renderItem = ({ columnKey, rowIndex }) => {
    const shippingMethod = this.props.shippingMethodsByCartFetcher
      .shippingMethodsByCart[rowIndex];
    switch (columnKey) {
      case 'check':
        return (
          <RadioInput.Option
            isChecked={Boolean(
              this.props.cartDraft.shippingInfo &&
                this.props.cartDraft.shippingInfo.shippingMethod.id ===
                  shippingMethod.id
            )}
            isDisabled={this.props.cartUpdater.isLoading}
            value={shippingMethod.id}
            onChange={() => this.setShippingMethodToCart(shippingMethod)}
          >
            {''}
          </RadioInput.Option>
        );
      case 'name':
        return shippingMethod.name;
      case 'description':
        return shippingMethod.description;
      case 'taxCategory':
        return shippingMethod.taxCategory.name;
      case 'isDefault':
        return shippingMethod.isDefault ? (
          <FormattedMessage {...messages.yes} />
        ) : (
          <FormattedMessage {...messages.no} />
        );
      case 'shippingRate':
        return formatMoney(shippingMethod.rate.price, this.props.intl);
      case 'freeAbove':
        return shippingMethod.rate.freeAbove
          ? formatMoney(shippingMethod.rate.freeAbove, this.props.intl)
          : '-';
      default:
        return undefined;
    }
  };

  handleSetShippingMethod = index => {
    const shippingMethod = this.props.shippingMethodsByCartFetcher
      .shippingMethodsByCart[index];
    // If the cart does not have shipping info assigned yet
    if (!this.props.cartDraft.shippingInfo) {
      return this.setShippingMethodToCart(shippingMethod);
    }
    // if the cart has already shipping info but the selected shipping method
    // is not the same as the one in the cart
    if (
      shippingMethod.id !==
        this.props.cartDraft.shippingInfo.shippingMethod.id &&
      !this.props.cartUpdater.isLoading
    ) {
      return this.setShippingMethodToCart(shippingMethod);
    }
  };

  render() {
    const hasShippingMethodsByCart = Boolean(
      this.props.shippingMethodsByCartFetcher.shippingMethodsByCart?.length > 0
    );

    return (
      <Spacings.Stack scale="m">
        <Text.Headline as="h2">
          <FormattedMessage {...messages.title} />
        </Text.Headline>
        <CollapsiblePanel
          header={
            <CollapsiblePanel.Header>
              <FormattedMessage {...messages.shippingMethodsTitle} />
            </CollapsiblePanel.Header>
          }
        >
          {do {
            if (this.props.shippingMethodsByCartFetcher.isLoading)
              <LoadingSpinner />;
            else if (!hasShippingMethodsByCart)
              <Text.Body>
                <FormattedMessage {...messages.noAvailableShippingMethods} />
              </Text.Body>;
            else
              <Table
                columns={createColumnsDefinitions(this.props.intl)}
                rowCount={
                  hasShippingMethodsByCart
                    ? this.props.shippingMethodsByCartFetcher
                        .shippingMethodsByCart.length
                    : 0
                }
                itemRenderer={this.renderItem}
                items={
                  this.props.shippingMethodsByCartFetcher.shippingMethodsByCart
                }
                onRowClick={(_, index) => this.handleSetShippingMethod(index)}
              />;
          }}
        </CollapsiblePanel>
        {this.props.renderSaveToolbarStep()}
      </Spacings.Stack>
    );
  }
}

const mapDispatchToProps = {
  onActionError: globalActions.handleActionError,
  showNotification: globalActions.showNotification,
};

export default compose(
  injectIntl,
  connect(null, mapDispatchToProps),
  replaceLocationWhenDraftIsMissing
)(OrderCreateSetShippingMethod);
