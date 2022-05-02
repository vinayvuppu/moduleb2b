import { PropTypes } from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import requiredIf from 'react-required-if';
import { PRECISION_TYPES } from '@commercetools-local/utils/constants';
import { formatMoney } from '@commercetools-local/utils/formats/money';
import { getNetUnitPrice } from '@commercetools-local/utils/prices';

export const OrderItemTableUnitNetPriceCell = props => {
  if (props.isCustomLineItem) {
    // The net unit price is the total net divided by the quantity
    const netPrice = props.lineItem.taxedPrice
      ? props.lineItem.taxedPrice.totalNet.centAmount
      : props.lineItem.totalPrice.centAmount;
    return (
      <div data-testid="line-item-net-price">
        {formatMoney(
          {
            ...props.lineItem.money,
            centAmount: netPrice / props.lineItem.quantity,
          },
          props.intl
        )}
      </div>
    );
  }
  return (
    <div data-testid="line-item-net-price">
      {formatMoney(
        getNetUnitPrice({
          lineItem: props.lineItem,
          shouldRoundAmount: true,
        }),
        props.intl
      )}
    </div>
  );
};

OrderItemTableUnitNetPriceCell.displayName = 'OrderItemTableUnitNetPriceCell';
OrderItemTableUnitNetPriceCell.propTypes = {
  lineItem: PropTypes.shape({
    productId: PropTypes.string,
    quantity: PropTypes.number.isRequired,
    price: requiredIf(
      PropTypes.shape({
        value: PropTypes.shape({
          currencyCode: PropTypes.string.isRequired,
          centAmount: PropTypes.number.isRequired,
        }),
      }),
      lineItemProps => lineItemProps.productId
    ),
    taxRate: PropTypes.shape({
      includedInPrice: PropTypes.bool.isRequired,
    }),
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
  // HoC
  intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
    .isRequired,
};

export default injectIntl(OrderItemTableUnitNetPriceCell);
