import { defineMessages } from 'react-intl';

export default defineMessages({
  itemsLabel: {
    id: 'CartSummary.itemsLabel',
    description: 'items label when items are selected',
    defaultMessage: '{items} items',
  },
  cartSummaryTitle: {
    id: 'CartSummary.cartSummaryTitle',
    description: 'title for the cart summary panel',
    defaultMessage: 'in your cart',
  },
  quantityLabel: {
    id: 'CartSummary.quantityLabel',
    description: 'label for the line item quantity',
    defaultMessage: 'Qty: {quantity}',
  },
  shippingLabel: {
    id: 'CartSummary.shippingLabel',
    description: 'label for the shipping',
    defaultMessage: 'Shipping(gross)',
  },
  subtotalLabel: {
    id: 'CartSummary.subtotalLabel',
    description: 'label for the cart subtotal',
    defaultMessage: 'Subtotal',
  },
  subtotalDiscountsLabel: {
    id: 'CartSummary.subtotalDiscountsLabel',
    description: 'label for the cart subtotal after discounts applied',
    defaultMessage: 'Subtotal Discounts',
  },
  totalLabel: {
    id: 'CartSummary.totalLabel',
    description: 'label for the cart total',
    defaultMessage: 'Total (gross)',
  },
  originalTotalPriceLabel: {
    id: 'CartSummary.originalTotalPrice',
    description: 'label for the cart total original price',
    defaultMessage: 'Total original price',
  },
  emptyShoppingCartLabel: {
    id: 'CartSummary.emptyShoppingCartLabel',
    description: 'label for the empty shopping cart message',
    defaultMessage: 'Your shopping cart is empty',
  },
  removeDiscount: {
    id: 'CartSummary.removeDiscount',
    defaultMessage: 'Remove discount code',
  },
  discountCodes: {
    id: 'CartSummary.discountCodes',
    defaultMessage: 'Discount codes',
  },
  removeLineItem: {
    id: 'CartSummary.removeLineItem',
    defaultMessage: 'Remove Line item',
  },
  changeQuantity: {
    id: 'CartSummary.changeQuantity',
    defaultMessage: 'Change quantity',
  },
  changeQuantityTitle: {
    id: 'CartSummary.changeQuantityTitle',
    defaultMessage: 'Change {name} quantity',
  },
});
