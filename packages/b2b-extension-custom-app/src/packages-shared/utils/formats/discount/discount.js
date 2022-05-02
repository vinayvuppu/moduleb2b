import { formatMoney } from '../money';

export default function formatDiscount(discount, currencyCode, intl) {
  if (discount.type === 'relative') return `${discount.permyriad / 100}%`;
  if (!discount.money) return null;

  const moneyForCurrencyCode = discount.money.find(
    discountMoney => discountMoney.currencyCode === currencyCode
  );

  return moneyForCurrencyCode ? formatMoney(moneyForCurrencyCode, intl) : null;
}
