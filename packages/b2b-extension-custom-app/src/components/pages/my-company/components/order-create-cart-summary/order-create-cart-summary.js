import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import {
  GRAPHQL_TARGETS,
  NO_VALUE_FALLBACK,
} from '@commercetools-frontend/constants';
import {
  Card,
  CartIcon,
  Spacings,
  Text,
  IconButton,
  CloseBoldIcon,
  EditIcon,
} from '@commercetools-frontend/ui-kit';
import {
  formatMoney,
  getFractionedAmount,
} from '@commercetools-local/utils/formats/money';
import {
  formatPercentage,
  convertRatioToPercentage,
} from '@commercetools-local/utils/formats/percentage';
import * as priceUtils from '@commercetools-local/utils/prices';
import { withApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import Localize from '@commercetools-local/core/components/localize';
import * as orderPriceUtils from '../../utils/order-prices';
import { getAttributeValueByType } from '../../utils/attributes';

import {
  selectTotalGrossPrice,
  selectAllLineItems,
  selectDiscounts,
  selectShippingPrice,
} from '../../utils/cart-selectors';
import OrderCreateLocalizedChannelName from '../order-create-localized-channel-name';
import ChangeQuantityModal from './change-quantity-modal';
import FetchDiscountCodesQuery from './cart-applied-discounts-panel.graphql';

import styles from './order-create-cart-summary.mod.css';
import messages from './messages';

// Utility method similar to `getTotalAmountForDiscountedLineItem` in **/orderprices.js
// This should be made a common utility method and re-used
const getSubtotalDiscount = (discounts, fractionDigits) => {
  const totalDiscountAmount = discounts.reduce(
    (acc, discount) => acc + getFractionedAmount(discount.amount),
    0
  );

  return Math.round(totalDiscountAmount * 10 ** fractionDigits);
};

export const getVariantAttributes = attributes =>
  attributes.filter(
    attr => attr.attributeDefinition.attributeConstraint === 'CombinationUnique'
  );

const SummaryItem = props => (
  <Spacings.Inline justifyContent="space-between">
    {props.children}
  </Spacings.Inline>
);

SummaryItem.displayName = 'SummaryItem';
SummaryItem.propTypes = {
  children: PropTypes.node.isRequired,
};

export class OrderCreateCartSummary extends React.PureComponent {
  static displayName = 'OrderCreateCartSummary';

  state = {
    isChangeQuantityModalOpen: false,
    changeQuantityLineItem: undefined,
  };
  static propTypes = {
    cartDraft: PropTypes.shape({
      shippingInfo: PropTypes.shape({
        shippingMethodName: PropTypes.string.isRequired,
      }),
      totalPrice: PropTypes.shape({
        fractionDigits: PropTypes.number.isRequired,
      }),
      originalTotalPrice: PropTypes.object,
      quote: PropTypes.object,
    }).isRequired,
    discounts: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.object.isRequired,
        amount: PropTypes.shape({
          currencyCode: PropTypes.string.isRequired,
          centAmount: PropTypes.number.isRequired,
        }).isRequired,
      })
    ).isRequired,
    totalGross: PropTypes.shape({
      currencyCode: PropTypes.string.isRequired,
      centAmount: PropTypes.number.isRequired,
    }).isRequired,
    subtotal: PropTypes.shape({
      currencyCode: PropTypes.string.isRequired,
      centAmount: PropTypes.number.isRequired,
    }).isRequired,
    shippingPrice: PropTypes.shape({
      currencyCode: PropTypes.string.isRequired,
      centAmount: PropTypes.number.isRequired,
    }),
    allLineItems: PropTypes.array.isRequired,
    taxPortions: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        amount: PropTypes.shape({
          currencyCode: PropTypes.string.isRequired,
          centAmount: PropTypes.number.isRequired,
        }).isRequired,
        rate: PropTypes.number.isRequired,
      })
    ).isRequired,
    onRemoveDiscountCode: PropTypes.func.isRequired,
    onRemoveLineItem: PropTypes.func.isRequired,
    onChangeLineItemQuantity: PropTypes.func.isRequired,
    // HoC
    intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
      .isRequired,
    // withApplicationContext
    language: PropTypes.string.isRequired,
    languages: PropTypes.arrayOf(PropTypes.string).isRequired,
    dataLocale: PropTypes.string.isRequired,
    // graphql
    discountCodesQuery: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      discountCodes: PropTypes.shape({
        results: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            code: PropTypes.string.isRequired,
            nameAllLocales: PropTypes.arrayOf(
              PropTypes.shape({
                locale: PropTypes.string.isRequired,
                value: PropTypes.string.isRequired,
              })
            ),
          })
        ),
      }),
    }),
  };

  getDiscountCode = discountId => {
    let discountCode;
    if (
      this.props.discountCodesQuery &&
      this.props.discountCodesQuery.discountCodes &&
      this.props.discountCodesQuery.discountCodes.results
    ) {
      discountCode = this.props.discountCodesQuery.discountCodes.results.find(
        discount =>
          discount.cartDiscounts.find(
            cartDiscount => cartDiscount.id === discountId
          )
      );
    }
    return discountCode;
  };

  handleSelectLineItemToChangeQuantity = lineItem =>
    this.setState(prevState => ({
      ...prevState,
      isChangeQuantityModalOpen: true,
      changeQuantityLineItem: lineItem,
    }));

  handleCloseModal = () => {
    this.setState(prevState => ({
      ...prevState,
      isChangeQuantityModalOpen: false,
      changeQuantityLineItem: undefined,
    }));
  };

  handleChangeQuantity = async quantity => {
    await this.props.onChangeLineItemQuantity(
      this.state.changeQuantityLineItem.id,
      quantity
    );

    this.handleCloseModal();
  };

  render() {
    const itemsNumber = this.props.allLineItems.length;
    const { quote } = this.props.cartDraft;
    return (
      <Card>
        <Spacings.Stack>
          <Spacings.Inline alignItems="center" scale="xs">
            <CartIcon size="medium" />
            <Text.Detail
              isBold={true}
              tone="information"
              intlMessage={{
                ...messages.itemsLabel,
                values: { items: itemsNumber },
              }}
            />
            <Text.Detail isBold={true}>
              <FormattedMessage {...messages.cartSummaryTitle} />
            </Text.Detail>
          </Spacings.Inline>
          <div className={styles.separator} />
          {itemsNumber > 0 ? (
            this.props.allLineItems.map(lineItem => (
              <SummaryItem key={lineItem.id}>
                <Spacings.Inline>
                  {!quote && (
                    <IconButton
                      size="small"
                      data-testid={`remove-line-item-${lineItem.id}`}
                      icon={<CloseBoldIcon />}
                      label={this.props.intl.formatMessage(
                        messages.removeLineItem
                      )}
                      onClick={() => this.props.onRemoveLineItem(lineItem.id)}
                    />
                  )}

                  <Spacings.Stack>
                    <Text.Detail isBold={true}>
                      {typeof lineItem.name === 'string' ? (
                        lineItem.name
                      ) : (
                        <Localize object={lineItem} objectKey="name" />
                      )}
                    </Text.Detail>
                    {getVariantAttributes(lineItem.variant.attributesRaw).map(
                      attr => (
                        <Spacings.Inline key={attr.name}>
                          <Text.Detail tone="secondary">
                            {
                              attr.attributeDefinition.labelAllLocales.find(
                                loc => loc.locale === this.props.dataLocale
                              ).value
                            }
                          </Text.Detail>
                          <Text.Detail tone="secondary">
                            {
                              getAttributeValueByType(
                                attr.value,
                                attr.attributeDefinition.type.name,
                                this.props.dataLocale
                              ).label
                            }
                          </Text.Detail>
                        </Spacings.Inline>
                      )
                    )}
                    {lineItem.distributionChannel && (
                      <OrderCreateLocalizedChannelName
                        channel={lineItem.distributionChannel}
                      />
                    )}
                  </Spacings.Stack>
                </Spacings.Inline>
                <Spacings.Stack alignItems="flexEnd">
                  <Text.Detail tone="secondary">
                    {formatMoney(
                      lineItem.price
                        ? priceUtils.getNetUnitPrice({
                            lineItem,
                            shouldRoundAmount: true,
                          })
                        : lineItem.money,
                      this.props.intl
                    )}
                  </Text.Detail>
                  <Spacings.Inline>
                    {!quote && (
                      <IconButton
                        size="small"
                        icon={<EditIcon />}
                        label={this.props.intl.formatMessage(
                          messages.changeQuantity
                        )}
                        onClick={() =>
                          this.handleSelectLineItemToChangeQuantity(lineItem)
                        }
                      />
                    )}
                    <Text.Detail isBold={true}>
                      <FormattedMessage
                        {...messages.quantityLabel}
                        values={{ quantity: lineItem.quantity }}
                      />
                    </Text.Detail>
                  </Spacings.Inline>
                  {lineItem.discountedPricePerQuantity.length > 0 ? (
                    <Spacings.Inline>
                      <Text.Detail isBold={false}>
                        <div className={styles.was}>
                          {formatMoney(
                            {
                              ...lineItem.price.value,
                              centAmount:
                                lineItem.price.value.centAmount *
                                lineItem.quantity,
                            },
                            this.props.intl
                          )}
                        </div>
                      </Text.Detail>
                      <Text.Detail isBold={true}>
                        {formatMoney(lineItem.totalPrice, this.props.intl)}
                      </Text.Detail>
                    </Spacings.Inline>
                  ) : (
                    <Text.Detail isBold={true}>
                      {formatMoney(lineItem.totalPrice, this.props.intl)}
                    </Text.Detail>
                  )}
                </Spacings.Stack>
              </SummaryItem>
            ))
          ) : (
            <Text.Detail tone="secondary">
              <FormattedMessage {...messages.emptyShoppingCartLabel} />
            </Text.Detail>
          )}
          <div className={styles.separator} />
          <SummaryItem>
            <Text.Detail isBold={true}>
              <FormattedMessage {...messages.subtotalLabel} />
            </Text.Detail>
            <Text.Detail isBold={true}>
              {formatMoney(
                {
                  ...this.props.subtotal,
                  centAmount:
                    this.props.subtotal.centAmount +
                    getSubtotalDiscount(
                      this.props.discounts,
                      this.props.cartDraft.totalPrice.fractionDigits
                    ),
                },
                this.props.intl
              )}
            </Text.Detail>
          </SummaryItem>
          {this.props.discounts.map(discount => (
            <SummaryItem key={discount.id}>
              <Text.Detail tone="secondary">
                <Localize object={discount} objectKey="name" />
              </Text.Detail>
              <Text.Detail tone="secondary">
                {`- ${formatMoney(discount.amount, this.props.intl, {
                  minimumFractionDigits: undefined,
                })}`}
              </Text.Detail>
            </SummaryItem>
          ))}
          {this.props.discountCodesQuery &&
            this.props.discountCodesQuery.discountCodes &&
            this.props.discountCodesQuery.discountCodes.results.length > 0 && (
              <Spacings.Stack>
                <div className={styles.separator} />
                <SummaryItem>
                  <Text.Detail isBold={true}>
                    <FormattedMessage {...messages.discountCodes} />
                  </Text.Detail>
                </SummaryItem>
                {this.props.discountCodesQuery.discountCodes.results.map(
                  discountCode => (
                    <SummaryItem key={discountCode.id}>
                      <Spacings.Inline>
                        <IconButton
                          size="small"
                          data-testid={`remove-discount-${discountCode.id}`}
                          icon={<CloseBoldIcon />}
                          label={this.props.intl.formatMessage(
                            messages.removeDiscount
                          )}
                          onClick={() =>
                            this.props.onRemoveDiscountCode(discountCode.id)
                          }
                        />
                        <Text.Detail tone="secondary">
                          {discountCode.code}
                        </Text.Detail>
                      </Spacings.Inline>
                    </SummaryItem>
                  )
                )}
              </Spacings.Stack>
            )}
          {this.props.discounts.length > 0 && (
            <Spacings.Stack>
              <div className={styles.separator} />
              <SummaryItem>
                <Text.Detail isBold={true}>
                  <FormattedMessage {...messages.subtotalDiscountsLabel} />
                </Text.Detail>
                <Text.Detail isBold={true}>
                  {formatMoney(this.props.subtotal, this.props.intl)}
                </Text.Detail>
              </SummaryItem>
            </Spacings.Stack>
          )}
          {this.props.taxPortions.map((portion, index) => (
            <SummaryItem key={index}>
              <Text.Detail tone="secondary">
                {`${formatPercentage(
                  convertRatioToPercentage(portion.rate)
                )} ${portion.name || ''}`}
              </Text.Detail>
              <Text.Detail tone="secondary">{`+ ${formatMoney(
                portion.amount,
                this.props.intl
              )}`}</Text.Detail>
            </SummaryItem>
          ))}
          {this.props.cartDraft.shippingInfo && (
            <SummaryItem>
              <Spacings.Stack scale="xs">
                <Text.Detail tone="secondary">
                  <FormattedMessage {...messages.shippingLabel} />
                </Text.Detail>
                <Text.Detail tone="secondary">
                  {this.props.cartDraft.shippingInfo.shippingMethodName}
                </Text.Detail>
              </Spacings.Stack>
              <Text.Detail tone="secondary">
                {`+ ${formatMoney(this.props.shippingPrice, this.props.intl)}`}
              </Text.Detail>
            </SummaryItem>
          )}
          <div className={styles.separator} />
          {quote && (
            <Fragment>
              <SummaryItem>
                <Text.Body isBold={true}>
                  <FormattedMessage {...messages.originalTotalPriceLabel} />
                </Text.Body>
                <Text.Body isBold={true}>
                  {this.props.cartDraft.originalTotalPrice
                    ? formatMoney(
                        this.props.cartDraft.originalTotalPrice,
                        this.props.intl
                      )
                    : NO_VALUE_FALLBACK}
                </Text.Body>
              </SummaryItem>
              <div className={styles.separator} />
            </Fragment>
          )}
          <SummaryItem>
            <Text.Body isBold={true}>
              <FormattedMessage {...messages.totalLabel} />
            </Text.Body>
            <Text.Body isBold={true}>
              {formatMoney(this.props.totalGross, this.props.intl)}
            </Text.Body>
          </SummaryItem>
        </Spacings.Stack>
        {this.state.isChangeQuantityModalOpen && (
          <ChangeQuantityModal
            quantity={this.state.changeQuantityLineItem?.quantity}
            productName={this.state.changeQuantityLineItem?.name}
            isOpen={this.state.isChangeQuantityModalOpen}
            handleOnClose={this.handleCloseModal}
            handleOnSave={this.handleChangeQuantity}
          />
        )}
      </Card>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const allLineItems = selectAllLineItems(ownProps.cartDraft);
  return {
    allLineItems,
    totalGross: selectTotalGrossPrice(ownProps.cartDraft),
    discounts: selectDiscounts(ownProps.cartDraft),
    shippingPrice: selectShippingPrice(ownProps.cartDraft),
    subtotal: orderPriceUtils.getNetPriceWithoutShipping(ownProps.cartDraft),
    taxPortions: orderPriceUtils.getAllNonShippingTaxes(ownProps.cartDraft),
  };
};

const mapDiscountCodeIds = discountCodes =>
  discountCodes
    .map(discountCode => `"${discountCode.discountCode.id}"`)
    .join(',');

export const createQueryVariables = ownProps => ({
  target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
  where: `id in (${mapDiscountCodeIds(ownProps.cartDraft.discountCodes)})`,
});

export default compose(
  connect(mapStateToProps),
  injectIntl,
  withApplicationContext(applicationContext => ({
    language: applicationContext.dataLocale,
    languages: applicationContext.project.languages,
    dataLocale: applicationContext.dataLocale,
  })),
  graphql(FetchDiscountCodesQuery, {
    name: 'discountCodesQuery',
    options: ownProps => ({
      variables: createQueryVariables(ownProps),
      fetchPolicy: 'cache-and-network',
    }),
    skip: ownProps => !ownProps.cartDraft.discountCodes.length > 0,
  })
)(OrderCreateCartSummary);
