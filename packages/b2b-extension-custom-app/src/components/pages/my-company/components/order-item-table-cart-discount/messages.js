import { defineMessages } from 'react-intl';

export default defineMessages({
  wasPrice: {
    id: 'Orders.Details.General.OrderItems.wasPrice',
    description: 'Message for the regular price when discount is applied',
    defaultMessage: 'Was {price}',
  },
  cartDiscount: {
    id: 'Orders.Details.General.OrderItems.cartDiscount',
    description: 'Message for the cart discount price when discount is applied',
    defaultMessage: 'Cart Discount {discount}',
  },
});
