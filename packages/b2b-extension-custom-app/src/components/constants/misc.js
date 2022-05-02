export const SEARCH_SLICE_NAME_ORDERS = 'application-orders/orders';
export const SEARCH_SLICE_NAME_ORDER_CREATE_CUSTOMERS =
  'application-orders/orders/new/customer';

// The Payment API has to accept uppercased and
// capitalized variations of transation state and types.
// This maps between them to render the messages accordingly.
export const TRANSACTION_TYPES = {
  AUTHORIZATION: 'Authorization',
  CANCELAUTHORIZATION: 'CancelAuthorization',
  CHARGE: 'Charge',
  REFUND: 'Refund',
  CHARGEBACK: 'Chargeback',
};

export const TRANSACTION_STATES = {
  PENDING: 'Pending',
  SUCCESS: 'Success',
  FAILURE: 'Failure',
  INITIAL: 'Initial',
};

// Shipment states for the return management tab
export const RETURN_SHIPMENT_INITIAL_STATES = {
  ADVISED: 'Advised',
  RETURNED: 'Returned',
};

export const RETURN_SHIPMENT_STATES = {
  ADVISED: 'Advised',
  RETURNED: 'Returned',
  BACK_IN_STOCK: 'BackInStock',
  UNUSABLE: 'Unusable',
};

export const RETURN_SHIPMENT_STATES_TRANSITIONS = {
  RETURNED: 'Returned',
  BACK_IN_STOCK: 'BackInStock',
  UNUSABLE: 'Unusable',
};

// Payment states for the return management tab
export const RETURN_PAYMENT_STATES = {
  INITIAL: 'Initial',
  REFUNDED: 'Refunded',
  NOT_REFUNDED: 'NotRefunded',
  NON_REFUNDABLE: 'NonRefundable',
};

export const RETURN_PAYMENT_STATES_TRANSITIONS = {
  INITIAL: 'Initial',
  REFUNDED: 'Refunded',
  NOT_REFUNDED: 'NotRefunded',
};

export const ORDER_STATES_VISIBILITY = {
  HIDE_ORDER_STATE: 'HideOrderState',
  HIDE_PAYMENT_STATE: 'HidePaymentState',
  HIDE_SHIPMENT_STATE: 'HideShipmentState',
};

// eslint-disable-next-line import/prefer-default-export
export const FIELD_TYPES = {
  Money: 'Money',
  LocalizedString: 'LocalizedString',
  Time: 'Time',
  DateTime: 'DateTime',
  Boolean: 'Boolean',
  String: 'String',
  Enum: 'Enum',
  LocalizedEnum: 'LocalizedEnum',
  Number: 'Number',
  Date: 'Date',
  Reference: 'Reference',
  Set: 'Set',
};

export const DISCOUNT_VALUE_TYPES = {
  ABSOLUTE: 'absolute',
  RELATIVE: 'relative',
};
