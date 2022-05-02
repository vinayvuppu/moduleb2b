import { PropTypes } from 'prop-types';
import React from 'react';
import requiredIf from 'react-required-if';
import { injectIntl } from 'react-intl';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import { formatMoney } from '@commercetools-local/utils/formats/money';
import { PRECISION_TYPES } from '@commercetools-local/utils/constants';
import OrderItemTableProductDiscount from '../order-item-table-product-discount';

export const OrderItemTableUnitGrossPriceCell = props => {
  if (props.isCustomLineItem)
    return formatMoney(props.lineItem.money, props.intl);
  return props.lineItem.taxRate && props.lineItem.taxRate.includedInPrice ? (
    <OrderItemTableProductDiscount
      lineItem={props.lineItem}
      data-testid="line-item-gross-price"
    />
  ) : (
    NO_VALUE_FALLBACK
  );
};

OrderItemTableUnitGrossPriceCell.displayName =
  'OrderItemTableUnitGrossPriceCell';
OrderItemTableUnitGrossPriceCell.propTypes = {
  lineItem: PropTypes.shape({
    productId: PropTypes.string,
    taxRate: PropTypes.shape({
      includedInPrice: PropTypes.bool.isRequired,
    }),
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

export default injectIntl(OrderItemTableUnitGrossPriceCell);
