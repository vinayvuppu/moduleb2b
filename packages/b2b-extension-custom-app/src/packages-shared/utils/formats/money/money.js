import { PRECISION_TYPES } from '../../constants';

export function formatMoneyRangeValue(value, intl) {
  if (value.from === value.to)
    return formatMoneyValue(value.from, value.currency, intl);
  if (value.from && value.to)
    return `${formatMoneyValue(value.from, value.currency, intl)} -
      ${formatMoneyValue(value.to, value.currency, intl)}`;
  if (value.from)
    return `from ${formatMoneyValue(value.from, value.currency, intl)}`;
  if (value.to) return `to ${formatMoneyValue(value.to, value.currency, intl)}`;

  return '';
}

export function formatMoneyValue(amount, currency, intl) {
  return formatMoney(
    {
      centAmount: amount,
      ...(currency ? { currencyCode: currency } : {}),
    },
    intl
  );
}

export function getFractionedAmount(moneyValue) {
  const { fractionDigits = 2 } = moneyValue;

  // the amount should be available on preciseAmount for highPrecision
  const amount =
    moneyValue.type === PRECISION_TYPES.highPrecision
      ? moneyValue.preciseAmount
      : moneyValue.centAmount;

  return amount / 10 ** fractionDigits;
}

export function formatMoney(moneyValue, intl, options) {
  return intl.formatNumber(getFractionedAmount(moneyValue), {
    style: 'currency',
    currency: moneyValue.currencyCode,
    minimumFractionDigits: moneyValue.fractionDigits,
    ...options,
  });
}
