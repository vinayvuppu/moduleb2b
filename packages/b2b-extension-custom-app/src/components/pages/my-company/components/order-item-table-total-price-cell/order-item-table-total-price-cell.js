import { PropTypes } from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import requiredIf from 'react-required-if';
import { PRECISION_TYPES } from '@commercetools-local/utils/constants';
import { formatMoney } from '@commercetools-local/utils/formats/money';
import { getSelectedPrice } from '@commercetools-local/utils/prices';
import { getTotalCartDiscount } from '../../utils/order-prices';
import OrderItemTableCartDiscount from '../order-item-table-cart-discount';

export const OrderItemTableTotalPriceCell = props => {
  // if tax IS included in price, show cart discounts in the
  // gross total column, if NOT included show gross total
  const grossTotal = props.lineItem.taxedPrice
    ? props.lineItem.taxedPrice.totalGross
    : props.lineItem.totalPrice;
  if (props.isCustomLineItem) {
    const totalDiscount = getTotalCartDiscount([props.lineItem]);
    return props.lineItem.taxRate && props.lineItem.taxRate.includedInPrice ? (
      <OrderItemTableCartDiscount
        data-testid="line-item-total-price"
        lineItem={props.lineItem}
        unitPrice={props.lineItem.money}
        totalPrice={{
          ...grossTotal,
          centAmount: grossTotal.centAmount - totalDiscount,
        }}
      />
    ) : (
      formatMoney(grossTotal, props.intl)
    );
  }
  return props.lineItem.taxRate && props.lineItem.taxRate.includedInPrice ? (
    <OrderItemTableCartDiscount
      data-testid="line-item-total-price"
      lineItem={props.lineItem}
      unitPrice={getSelectedPrice(props.lineItem.price).value}
      totalPrice={grossTotal}
    />
  ) : (
    formatMoney(grossTotal, props.intl)
  );
};

OrderItemTableTotalPriceCell.displayName = 'OrderItemTableTotalPriceCell';
OrderItemTableTotalPriceCell.propTypes = {
  lineItem: PropTypes.shape({
    productId: PropTypes.string,
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

export default injectIntl(OrderItemTableTotalPriceCell);
