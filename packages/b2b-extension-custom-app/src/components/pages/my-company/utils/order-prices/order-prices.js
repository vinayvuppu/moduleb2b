import { getFractionedAmount } from '@commercetools-local/utils/formats/money';

export function getShippingPrices(order) {
  const { shippingInfo } = order;

  if (!shippingInfo) return null;

  const hasTaxes = Boolean(shippingInfo.taxedPrice);
  const hasDiscounts = Boolean(shippingInfo.discountedPrice?.value);

  if (hasTaxes)
    return {
      net: shippingInfo.taxedPrice.totalNet,
      gross: shippingInfo.taxedPrice.totalGross,
    };
  if (hasDiscounts)
    return {
      net: shippingInfo.discountedPrice.value,
      gross: shippingInfo.discountedPrice.value,
    };

  return {
    net: shippingInfo.price,
    gross: shippingInfo.price,
  };
}

export function getShippingDiscounts(order) {
  const { shippingInfo } = order;

  // no shipping or no shipping discounts
  if (!shippingInfo || !shippingInfo.discountedPrice) return null;

  return shippingInfo.discountedPrice.includedDiscounts;
}

export function getTotalShippingDiscounts(order) {
  const shippingDiscounts = getShippingDiscounts(order);
  return shippingDiscounts
    ? shippingDiscounts.reduce(
        (total, discount) => total + discount.discountedAmount.centAmount,
        0
      )
    : 0;
}

export function getNetPriceWithoutShipping(order) {
  const shippingPrices = getShippingPrices(order);
  const { taxedPrice, totalPrice } = order;
  const orderTotalPrice = taxedPrice ? taxedPrice.totalNet : totalPrice;

  if (shippingPrices)
    return {
      currencyCode: orderTotalPrice.currencyCode,
      centAmount: orderTotalPrice.centAmount - shippingPrices.net.centAmount,
    };

  return orderTotalPrice;
}

export function getGrossPriceWithoutShipping(order) {
  const shippingPrices = getShippingPrices(order);
  const { taxedPrice, totalPrice } = order;
  const orderTotalPrice = taxedPrice ? taxedPrice.totalGross : totalPrice;
  if (shippingPrices)
    return {
      currencyCode: orderTotalPrice.currencyCode,
      centAmount: orderTotalPrice.centAmount - shippingPrices.gross.centAmount,
      fractionDigits: orderTotalPrice.fractionDigits,
      type: orderTotalPrice.type,
    };

  return orderTotalPrice;
}

export function getAllNonShippingTaxes(order) {
  const { taxedPrice, shippingInfo } = order;
  // no taxes for this order
  if (!taxedPrice) return [];

  // shipping has no taxes, return all taxes
  if (taxedPrice && (!shippingInfo || !shippingInfo.taxedPrice))
    return taxedPrice.taxPortions;

  // final option
  const shippingPrice = getShippingPrices({ shippingInfo });
  const shippingTaxAmount =
    shippingPrice.gross.centAmount - shippingPrice.net.centAmount;
  const { taxRate } = shippingInfo;
  // Filter the shipping tax portion if it is independant from the rest of
  // tax portions
  const filteredTaxPortions = taxedPrice.taxPortions.filter(
    taxPortion =>
      taxRate.name !== taxPortion.name ||
      taxRate.amount !== taxPortion.rate ||
      taxPortion.amount.centAmount !== shippingTaxAmount
  );

  // If the shipping tax portion has been filtered, return tax portions
  // If not, subtract the shipping tax portion to the one where is contained
  if (filteredTaxPortions.length < taxedPrice.taxPortions.length)
    return filteredTaxPortions;
  return taxedPrice.taxPortions.map(taxPortion =>
    taxPortion.name === taxRate.name && taxRate.amount === taxPortion.rate
      ? {
          ...taxPortion,
          amount: {
            currencyCode: taxPortion.amount.currencyCode,
            centAmount: taxPortion.amount.centAmount - shippingTaxAmount,
          },
        }
      : taxPortion
  );
}

export function getTotalDiscountMoney(order) {
  const { lineItems, customLineItems, currencyCode } = order;
  const allLineItems = lineItems.concat(customLineItems);
  const totalDiscount =
    getTotalProductDiscount(lineItems) + getTotalCartDiscount(allLineItems);

  return totalDiscount > 0 ? { currencyCode, centAmount: totalDiscount } : null;
}

const getProductDiscountForLineItem = lineItem => {
  if (lineItem.price.discounted) {
    const regularPrice = getFractionedAmount(lineItem.price.value);
    const discountedPrice = getFractionedAmount(
      lineItem.price.discounted.value
    );
    return (
      (regularPrice - discountedPrice) *
      lineItem.quantity *
      10 ** lineItem.totalPrice.fractionDigits
    );
  }

  return 0;
};

export function getTotalProductDiscount(lineItems) {
  return lineItems.reduce(
    (total, lineItem) => total + getProductDiscountForLineItem(lineItem),
    0
  );
}

const getTotalAmountForDiscountedLineItem = includedDiscounts =>
  includedDiscounts.reduce(
    (acc, discount) => acc + getFractionedAmount(discount.discountedAmount),
    0
  );

const getTotalPriceForDiscountedLineItem = discountedPerQuantity =>
  discountedPerQuantity.reduce(
    (total, discounted) =>
      total +
      getTotalAmountForDiscountedLineItem(
        discounted.discountedPrice.includedDiscounts
      ) *
        discounted.quantity,
    0
  );

const getCartDiscountForLineItem = lineItem =>
  getTotalPriceForDiscountedLineItem(lineItem.discountedPricePerQuantity) *
  10 ** lineItem.totalPrice.fractionDigits;

export function getTotalCartDiscount(lineItems) {
  return lineItems.reduce(
    (acc, lineItem) => acc + getCartDiscountForLineItem(lineItem),
    0
  );
}

export function getTotalNetWithoutDiscounts(subtotal, totalDiscount) {
  return totalDiscount
    ? {
        ...subtotal,
        centAmount: subtotal.centAmount + totalDiscount.centAmount,
      }
    : subtotal;
}
