import { defineMessages } from 'react-intl';

export default defineMessages({
  wasPrice: {
    id: 'Orders.Details.General.OrderItems.wasPrice',
    description: 'Message for the regular price when discount is applied',
    defaultMessage: 'Was {price}',
  },
  productDiscount: {
    id: 'Orders.Details.General.OrderItems.productDiscount',
    description: 'Message for the discount price when discount is applied',
    defaultMessage: 'Product discount {discount}',
  },
});
