import has from 'lodash.has';
import isNil from 'lodash.isnil';
import { getFractionedAmount } from '../formats/money';
import { PRECISION_TYPES } from '../constants';

export function getPriceChannelName(price, language) {
  if (price.channel && price.channel.obj) {
    if (price.channel.obj.name && has(price.channel.obj.name, language))
      // TODO: show channel `key` as tooltip
      return price.channel.obj.name[language];

    // Fallback to key if there is no localized name
    // for current language
    return price.channel.obj.key;
  }

  return null;
}

export function getDiscountValue(price) {
  let preciseAmount;
  if (price.value?.type === PRECISION_TYPES.highPrecision)
    preciseAmount =
      price.value.preciseAmount - price.discounted.value.preciseAmount;
  return price.discounted
    ? {
        ...price.value,
        centAmount: price.value.centAmount - price.discounted.value.centAmount,
        preciseAmount,
      }
    : { ...price.value, centAmount: 0 };
}

export function getSelectedPrice(price) {
  return price.discounted ? price.discounted : price;
}

export function getNetUnitPrice({ lineItem, shouldRoundAmount }) {
  const price = getSelectedPrice(lineItem.price);

  if (lineItem.taxRate && lineItem.taxRate.includedInPrice) {
    const centAmount = price.value.centAmount / (1 + lineItem.taxRate.amount);
    let preciseAmount;
    if (price.value?.type === PRECISION_TYPES.highPrecision)
      preciseAmount = price.value.preciseAmount / (1 + lineItem.taxRate.amount);

    return {
      ...price.value,
      centAmount: shouldRoundAmount ? Math.round(centAmount) : centAmount,
      preciseAmount,
    };
  }
  return price.value;
}

export function getMinimumPricesByCurrencyCode(prices) {
  const minPricesByCurrency = prices.reduce((minPrices, price) => {
    const currencyCode = price.value.currencyCode;
    const fractionedAmount = getFractionedAmount(price.value);

    if (currencyCode && !isNil(fractionedAmount)) {
      if (
        !minPrices[currencyCode] ||
        fractionedAmount < getFractionedAmount(minPrices[currencyCode])
      )
        return {
          ...minPrices,
          [currencyCode]: price.value,
        };
    }
    return minPrices;
  }, {});

  return Object.values(minPricesByCurrency);
}
