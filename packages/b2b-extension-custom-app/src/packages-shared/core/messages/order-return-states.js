import { defineMessages } from 'react-intl';

export const shipmentReturnStatesMessages = defineMessages({
  Advised: {
    id: 'ReturnShipmentState.Advised',
    description: 'Localized state Advised',
    defaultMessage: 'Advised',
  },
  Returned: {
    id: 'ReturnShipmentState.Returned',
    description: 'Localized state Returned',
    defaultMessage: 'Returned',
  },
  BackInStock: {
    id: 'ReturnShipmentState.BackInStock',
    description: 'Localized state BackInStock',
    defaultMessage: 'BackInStock',
  },
  Unusable: {
    id: 'ReturnShipmentState.Unusable',
    description: 'Localized state Unusable',
    defaultMessage: 'Unusable',
  },
});

export const paymentReturnStatesMessages = defineMessages({
  Initial: {
    id: 'ReturnPaymentState.Initial',
    description: 'Localized state Initial',
    defaultMessage: 'Initial',
  },
  Refunded: {
    id: 'ReturnPaymentState.Refunded',
    description: 'Localized state Refunded',
    defaultMessage: 'Refunded',
  },
  NotRefunded: {
    id: 'ReturnPaymentState.NotRefunded',
    description: 'Localized state NotRefunded',
    defaultMessage: 'NotRefunded',
  },
  NonRefundable: {
    id: 'ReturnPaymentState.NonRefundable',
    description: 'Localized state NonRefundable',
    defaultMessage: 'NonRefundable',
  },
});
