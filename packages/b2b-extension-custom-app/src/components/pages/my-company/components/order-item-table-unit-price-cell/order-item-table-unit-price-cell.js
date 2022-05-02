import { PropTypes } from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import requiredIf from 'react-required-if';
import { Spacings } from '@commercetools-frontend/ui-kit';
import { PRECISION_TYPES } from '@commercetools-local/utils/constants';
import { formatMoney } from '@commercetools-local/utils/formats/money';
import OrderItemTableProductDiscount from '../order-item-table-product-discount';
import OrderCreateLocalizedChannelName from '../order-create-localized-channel-name';

export const OrderItemTableUnitPriceCell = props =>
  props.isCustomLineItem ? (
    formatMoney(props.lineItem.money, props.intl)
  ) : (
    <Spacings.Stack scale="xs">
      <span>
        <OrderItemTableProductDiscount
          lineItem={props.lineItem}
          data-test-id="line-item-price"
        />
      </span>
      {props.lineItem.distributionChannel && (
        <OrderCreateLocalizedChannelName
          channel={props.lineItem.distributionChannel}
        />
      )}
    </Spacings.Stack>
  );

OrderItemTableUnitPriceCell.displayName = 'OrderItemTableUnitPriceCell';
OrderItemTableUnitPriceCell.propTypes = {
  lineItem: PropTypes.shape({
    productId: PropTypes.string,
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
      props => props.isCustomLineItem
    ),
    distributionChannel: PropTypes.object,
  }).isRequired,
  isCustomLineItem: PropTypes.bool.isRequired,
  // HoC
  intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
    .isRequired,
};

export default injectIntl(OrderItemTableUnitPriceCell);
