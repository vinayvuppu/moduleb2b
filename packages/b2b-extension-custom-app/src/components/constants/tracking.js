// eslint-disable-next-line import/prefer-default-export
export const trackingEvents = {
  goToOrderDetails: {
    action: 'click',
    category: 'Orders List',
    label: 'Go to order details',
  },
  addDelivery: {
    action: 'click',
    category: 'Order Details-Shipping And Delivery',
    label: 'Add delivery',
  },
  changeOrderWorkflowStatus: {
    action: 'select',
    category: 'Order Details-General',
    label: 'Order workflow status',
  },
  changeOrderStatus: {
    action: 'select',
    category: 'Order Details-General',
    label: 'Order status',
  },
  changeOrderPaymentStatus: {
    action: 'select',
    category: 'Order Details-General',
    label: 'Payment status',
  },
  changeOrderShipmentStatus: {
    action: 'select',
    category: 'Order Details-General',
    label: 'Shipment status',
  },
  selectCustomTypeDefinition: {
    action: 'select',
    category: 'Order Details-Custom Fields',
    label: 'Custom type',
  },
  selectLineItemState: {
    action: 'select',
    category: 'Order Details-General',
    label: 'Line item state',
  },
  splitLineItem: {
    action: 'click',
    category: 'Order Details-General',
    label: 'Split line item',
  },
  saveReturn: {
    action: 'click',
    category: 'Order Details-Returns',
    label: 'Save-Create return',
  },
  addParcel: {
    action: 'click',
    category: 'Order Details-Shipping And Delivery',
    label: 'Add parcel',
  },
  selectCurrency: {
    action: 'select',
    category: 'Add Order',
    label: 'Select currency',
  },
  addCustomLineItem: {
    action: 'click',
    category: 'Add Order',
    label: 'Add custom line item',
  },
  addLineItem: {
    action: 'click',
    category: 'Add Order',
    label: 'Add line item',
  },
  selectProductDistributionChannel: {
    action: 'select',
    category: 'Add Order',
    label: 'Product distribution channel',
  },
  setCountrySpecificPricing: {
    action: 'click',
    category: 'Add Order',
    label: 'Country specific pricing set to',
  },
  applyDiscountCode: {
    action: 'click',
    category: 'Add Order',
    label: 'Apply discount code',
  },
  deleteLineItem: {
    action: 'click',
    category: 'Add Order',
    label: 'Delete line item',
  },
  placeOrder: {
    action: 'click',
    category: 'Add Order',
    label: 'Place order',
  },
};
