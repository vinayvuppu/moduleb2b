import PropTypes from 'prop-types';
import {
  formatPercentage,
  convertRatioToPercentage,
} from '@commercetools-local/utils/formats/percentage';

export const getNumberOfDecimals = value => String(value).split('.')[1].length;

export const displayPercentage = percentage => {
  // If the value is an integer just return the formatted string
  if (Number.isInteger(percentage)) return formatPercentage(percentage);
  const numberOfDecimals = getNumberOfDecimals(percentage);

  // In case the percentage has more than 2 decimals we indicate with "..." that the value
  // is longer than the one that we display
  return numberOfDecimals > 2
    ? `${percentage.toFixed(2)}...%`
    : formatPercentage(percentage);
};

export const OrderItemTableTaxRateCell = props =>
  props.taxRate?.amount
    ? displayPercentage(convertRatioToPercentage(props.taxRate.amount))
    : '';

OrderItemTableTaxRateCell.displayName = 'OrderItemTableTaxRateCell';
OrderItemTableTaxRateCell.propTypes = {
  taxRate: PropTypes.shape({
    amount: PropTypes.number.isRequired,
  }),
};

export default OrderItemTableTaxRateCell;
