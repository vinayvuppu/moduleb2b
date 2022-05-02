import { PropTypes } from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import requiredIf from 'react-required-if';
import { formatMoney } from '@commercetools-local/utils/formats/money';
import { getNetUnitPrice } from '@commercetools-local/utils/prices';
import { PRECISION_TYPES } from '@commercetools-local/utils/constants';
import { getTotalCartDiscount } from '../../utils/order-prices';
import OrderItemTableCartDiscount from '../order-item-table-cart-discount';

export const OrderItemTableSubtotalPriceCell = props => {
  if (props.isCustomLineItem) {
    const totalLineItemDiscount = getTotalCartDiscount([props.lineItem]);
    const netTotal = props.lineItem.taxedPrice
      ? props.lineItem.taxedPrice.totalNet
      : props.lineItem.totalPrice;

    // if tax IS NOT included in price, show cart discounts in the
    // subtotal column, if included, show total net without discounts
    return !props.lineItem.taxRate ||
      !props.lineItem.taxRate.includedInPrice ? (
      <OrderItemTableCartDiscount
        data-testid="line-item-subtotal-price"
        lineItem={props.lineItem}
        unitPrice={{
          ...netTotal,
          centAmount: netTotal.centAmount / props.lineItem.quantity,
        }}
        totalPrice={{
          ...netTotal,
          centAmount: netTotal.centAmount - totalLineItemDiscount,
        }}
      />
    ) : (
      formatMoney(netTotal, props.intl)
    );
  }

  const selectedNetPrice = getNetUnitPrice({
    lineItem: props.lineItem,
    shouldRoundAmount: false,
  });

  // get the total net without discounts
  const netTotal = {
    ...props.lineItem.totalPrice,
    centAmount: Math.round(
      selectedNetPrice.centAmount * props.lineItem.quantity
    ),
  };
  // if tax IS NOT included in price, show cart discounts in the
  // subtotal column, if included, show total net without discounts
  return !props.lineItem.taxRate || !props.lineItem.taxRate.includedInPrice ? (
    <OrderItemTableCartDiscount
      data-testid="line-item-subtotal-price"
      lineItem={props.lineItem}
      unitPrice={selectedNetPrice}
      totalPrice={
        props.lineItem.taxedPrice
          ? props.lineItem.taxedPrice.totalNet
          : props.lineItem.totalPrice
      }
    />
  ) : (
    formatMoney(netTotal, props.intl)
  );
};

OrderItemTableSubtotalPriceCell.displayName = 'OrderItemTableSubtotalPriceCell';
OrderItemTableSubtotalPriceCell.propTypes = {
  lineItem: PropTypes.shape({
    productId: PropTypes.string,
    quantity: PropTypes.number.isRequired,
    taxRate: PropTypes.shape({
      includedInPrice: PropTypes.bool.isRequired,
    }),
    price: requiredIf(
      PropTypes.shape({
        value: PropTypes.shape({
          currencyCode: PropTypes.string.isRequired,
          centAmount: requiredIf(
            PropTypes.number,
            props => props.type === PRECISION_TYPES.centPrecision
          ),
          preciseAmount: requiredIf(
            PropTypes.number,
            props => props.type === PRECISION_TYPES.highPrecision
          ),
        }),
      }),
      lineItemProps => lineItemProps.productId
    ),
    taxedPrice: PropTypes.shape({
      totalNet: PropTypes.shape({
        currencyCode: PropTypes.string.isRequired,
        centAmount: PropTypes.number.isRequired,
      }).isRequired,
      totalGross: PropTypes.shape({
        currencyCode: PropTypes.string.isRequired,
        centAmount: PropTypes.number.isRequired,
      }).isRequired,
    }),
    totalPrice: PropTypes.shape({
      currencyCode: PropTypes.string.isRequired,
      centAmount: PropTypes.number.isRequired,
    }).isRequired,
    money: requiredIf(
      PropTypes.shape({
        currencyCode: PropTypes.string.isRequired,
        centAmount: requiredIf(
          PropTypes.number,
          props => props.type === PRECISION_TYPES.centPrecision
        ),
        preciseAmount: requiredIf(
          PropTypes.number,
          props => props.type === PRECISION_TYPES.highPrecision
        ),
      }),
      lineItemProps => !lineItemProps.productId
    ),
  }).isRequired,
  isCustomLineItem: PropTypes.bool.isRequired,
  intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
    .isRequired,
};

export default injectIntl(OrderItemTableSubtotalPriceCell);
