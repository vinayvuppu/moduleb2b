import { PropTypes } from 'prop-types';
import React from 'react';
import requiredIf from 'react-required-if';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Spacings } from '@commercetools-frontend/ui-kit';
import { filterDataAttributes } from '@commercetools-local/utils/dataset';
import { formatMoney } from '@commercetools-local/utils/formats/money';
import { PRECISION_TYPES } from '@commercetools-local/utils/constants';
import { getTotalCartDiscount } from '../../utils/order-prices';
import styles from './order-item-table-cart-discount.mod.css';
import messages from './messages';

export const OrderItemTableCartDiscount = props => {
  const totalDiscount = getTotalCartDiscount([props.lineItem]);
  const price = formatMoney(
    {
      ...props.lineItem.totalPrice,
      centAmount: Math.round(
        props.unitPrice.centAmount * props.lineItem.quantity
      ),
    },
    props.intl
  );

  return props.lineItem.discountedPricePerQuantity.length > 0 ? (
    <Spacings.Stack scale="xs" {...filterDataAttributes(props)}>
      <span className={styles['regular-price-block']}>
        <FormattedMessage {...messages.wasPrice} values={{ price }} />
      </span>
      <span className={styles['discounted-price']}>
        {formatMoney(props.totalPrice, props.intl)}
      </span>
      <div className={styles['cart-discount-text']}>
        <FormattedMessage
          {...messages.cartDiscount}
          values={{
            discount: formatMoney(
              {
                ...props.lineItem.totalPrice,
                centAmount: totalDiscount,
              },
              props.intl
            ),
          }}
        />
      </div>
    </Spacings.Stack>
  ) : (
    formatMoney(props.totalPrice, props.intl)
  );
};

OrderItemTableCartDiscount.displayName = 'OrderItemTableCartDiscount';
OrderItemTableCartDiscount.propTypes = {
  lineItem: PropTypes.shape({
    quantity: PropTypes.number.isRequired,
    totalPrice: PropTypes.shape({
      currencyCode: PropTypes.string.isRequired,
      centAmount: PropTypes.number.isRequired,
    }).isRequired,
    discountedPricePerQuantity: PropTypes.array.isRequired,
    productId: PropTypes.string,
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
  unitPrice: PropTypes.shape({
    currencyCode: PropTypes.string.isRequired,
    centAmount: PropTypes.number,
  }).isRequired,
  totalPrice: PropTypes.shape({
    currencyCode: PropTypes.string.isRequired,
    centAmount: PropTypes.number.isRequired,
  }).isRequired,
  intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
    .isRequired,
};

export default injectIntl(OrderItemTableCartDiscount);
