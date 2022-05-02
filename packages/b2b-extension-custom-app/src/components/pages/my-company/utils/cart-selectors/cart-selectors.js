import { createSelector } from 'reselect';
import {
  getDiscountWithDiscountNameAndTotalDiscounted,
  getDiscountsWithDiscountCodes,
  reduceIncludedDiscounts,
} from '../order-discounts';

export const selectCartDraft = cartDraft => cartDraft;

export const selectAllLineItems = cartDraft => cartDraft.lineItems || [];
export const selectTotalGrossPrice = cartDraft =>
  cartDraft.taxedPrice ? cartDraft.taxedPrice.totalGross : cartDraft.totalPrice;

export const selectDiscountCodes = cartDraft =>
  cartDraft.discountCodes.map(({ discountCode }) => ({
    id: discountCode.id,
    name: discountCode.id,
    code: discountCode.id,
  }));

export const selectShippingDiscountedPrice = cartDraft =>
  cartDraft.shippingInfo ? cartDraft.shippingInfo.discountedPrice : undefined;

export const selectShippingPrice = cartDraft => do {
  if (!cartDraft.shippingInfo) undefined;
  else if (cartDraft.shippingInfo.taxedPrice)
    cartDraft.shippingInfo.taxedPrice.totalGross;
  else cartDraft.shippingInfo.price;
};

export const selectDiscountsWithDiscountCodes = cartDraft =>
  getDiscountsWithDiscountCodes(cartDraft.discountCodes || []);

export const selectDiscounts = createSelector(
  selectAllLineItems,
  selectDiscountsWithDiscountCodes,
  (lineItems = [], discountsWithDiscountCodes = []) =>
    Object.entries(
      getDiscountWithDiscountNameAndTotalDiscounted(lineItems)
    ).map(([discountId, discount]) => ({
      id: discountId,
      name: discount.name,
      amount: discount.amount,
      discountCodes: discountsWithDiscountCodes[discountId] || [],
    }))
);

export const selectShippingDiscounts = createSelector(
  selectDiscountsWithDiscountCodes,
  selectShippingDiscountedPrice,
  (discountsWithDiscountCodes, shippingDiscountedPrice) => {
    const shippingDiscounts = shippingDiscountedPrice
      ? reduceIncludedDiscounts({
          ...shippingDiscountedPrice,
          fractionDigits: shippingDiscountedPrice.value.fractionDigits,
        })
      : {};
    return Object.entries(shippingDiscounts).map(([key, value]) => ({
      id: key,
      name: value.name,
      amount: value.amount,
      discountCodes: discountsWithDiscountCodes[key] || [],
    }));
  }
);
