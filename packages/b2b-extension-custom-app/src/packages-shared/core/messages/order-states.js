import { defineMessages } from 'react-intl';

export const orderStateMessages = defineMessages({
  Open: {
    id: 'OrderState.Open',
    description: 'Order state: Open',
    defaultMessage: 'Open',
  },
  Confirmed: {
    id: 'OrderState.Confirmed',
    description: 'Order state: Confirmed',
    defaultMessage: 'Confirmed',
  },
  Complete: {
    id: 'OrderState.Complete',
    description: 'Order state: Complete',
    defaultMessage: 'Complete',
  },
  Cancelled: {
    id: 'OrderState.Cancelled',
    description: 'Order state: Cancelled',
    defaultMessage: 'Cancelled',
  },
});

export const shipmentStateMessages = defineMessages({
  Ready: {
    id: 'ShipmentState.Ready',
    description: 'Shipment state: Ready',
    defaultMessage: 'Ready',
  },
  Pending: {
    id: 'ShipmentState.Pending',
    description: 'Shipment state: Pending',
    defaultMessage: 'Pending',
  },
  Partial: {
    id: 'ShipmentState.Partial',
    description: 'Shipment state: Partial',
    defaultMessage: 'Partial',
  },
  Delayed: {
    id: 'ShipmentState.Delayed',
    description: 'Shipment state: Delayed',
    defaultMessage: 'Delayed',
  },
  Shipped: {
    id: 'ShipmentState.Shipped',
    description: 'Shipment state: Shipped',
    defaultMessage: 'Shipped',
  },
  Backorder: {
    id: 'ShipmentState.Backorder',
    description: 'Shipment state: Back order',
    defaultMessage: 'Back order',
  },
});

export const paymentStateMessages = defineMessages({
  BalanceDue: {
    id: 'PaymentState.BalanceDue',
    description: 'Payment state: Balance due',
    defaultMessage: 'Balance due',
  },
  Pending: {
    id: 'PaymentState.Pending',
    description: 'Payment state: Pending',
    defaultMessage: 'Pending',
  },
  Paid: {
    id: 'PaymentState.Paid',
    description: 'Payment state: Paid',
    defaultMessage: 'Paid',
  },
  CreditOwed: {
    id: 'PaymentState.CreditOwed',
    description: 'Payment state: Credit owed',
    defaultMessage: 'Credit owed',
  },
  Failed: {
    id: 'PaymentState.Failed',
    description: 'Payment state: Failed',
    defaultMessage: 'Failed',
  },
});
