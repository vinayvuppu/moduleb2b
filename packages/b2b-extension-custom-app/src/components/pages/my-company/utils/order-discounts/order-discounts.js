import { transformLocalizedFieldToString } from '@commercetools-local/utils/graphql';
import { getFractionedAmount } from '@commercetools-local/utils/formats/money';
// Gets the discount code list for every discount. This allow us to group discounts
// codes by discount. Example, for the cart discounts with ids `discount-id-1` and `discount-id-2`:
// { 'discount-id-1': ['CODE1', 'CODE2'], 'discount-id-2': ['CODE3'] }
export const getDiscountsWithDiscountCodes = discountCodes =>
  discountCodes.reduce((orderAcc, { discountCode }) => {
    if (!discountCode?.obj) return orderAcc;
    return {
      ...orderAcc,
      ...discountCode.obj.cartDiscounts.reduce(
        (codeAcc, discount) => ({
          ...codeAcc,
          [discount.id]: [
            ...(orderAcc[discount.id] || []),
            discountCode.obj.code,
          ],
        }),
        {}
      ),
    };
  }, {});

export const reduceIncludedDiscounts = ({
  includedDiscounts,
  quantity = 1,
  fractionDigits,
  lineItemDiscounts = {},
}) =>
  includedDiscounts.reduce(
    (acc, { discount, discountedAmount }) => ({
      ...acc,
      [discount.id]: {
        name: do {
          if (discount.obj) discount.obj.name;
          else if (discount.nameAllLocales)
            transformLocalizedFieldToString(discount.nameAllLocales);
          else discount.id;
        },
        amount: {
          ...discountedAmount,
          centAmount: !acc[discount.id]
            ? discountedAmount.centAmount * quantity
            : acc[discount.id].amount.centAmount +
              discountedAmount.centAmount * quantity,
          preciseAmount: !acc[discount.id]
            ? getFractionedAmount(discountedAmount) *
              quantity *
              10 ** fractionDigits
            : acc[discount.id].amount.preciseAmount +
              getFractionedAmount(discountedAmount) *
                quantity *
                10 ** fractionDigits,
        },
      },
    }),
    lineItemDiscounts
  );

// This function groups the discounts data in just one object with the total
// discounted and the discount name (discount id in case the obj expansion object does not exist anymore)
export const getDiscountWithDiscountNameAndTotalDiscounted = lineItems =>
  lineItems.reduce(
    (orderDiscounts, lineItem) => ({
      ...orderDiscounts,
      ...lineItem.discountedPricePerQuantity.reduce(
        (lineItemDiscounts, discPerQty) => ({
          ...lineItemDiscounts,
          ...reduceIncludedDiscounts({
            includedDiscounts: discPerQty.discountedPrice.includedDiscounts,
            quantity: discPerQty.quantity,
            fractionDigits: discPerQty.discountedPrice.value.fractionDigits,
            lineItemDiscounts,
          }),
        }),
        orderDiscounts
      ),
    }),
    {}
  );
