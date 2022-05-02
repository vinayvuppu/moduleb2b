import { defineMessages } from 'react-intl';

export default defineMessages({
  columnFirstNameBilling: {
    id: 'CompanyOrders.ListView.column.firstNameBilling',
    description: 'Title of the table column (firstNameBilling)',
    defaultMessage: 'First name (billing)',
  },
  columnLastNameBilling: {
    id: 'CompanyOrders.ListView.column.lastNameBilling',
    description: 'Title of the table column (lastNameBilling)',
    defaultMessage: 'Last name (billing)',
  },
  columnFirstNameShipping: {
    id: 'CompanyOrders.ListView.column.firstNameShipping',
    description: 'Title of the table column (firstNameShipping)',
    defaultMessage: 'First name (shipping)',
  },
  columnLastNameShipping: {
    id: 'CompanyOrders.ListView.column.lastNameShipping',
    description: 'Title of the table column (lastNameShipping)',
    defaultMessage: 'Last name (shipping)',
  },
  columnOrderNumber: {
    id: 'CompanyOrders.ListView.column.orderNumber',
    description: 'Title of the table column (orderNumber)',
    defaultMessage: 'Order number',
  },
  columnStore: {
    id: 'CompanyOrders.ListView.column.store',
    description: 'Title of the table column (store)',
    defaultMessage: 'Placed in store',
  },
  columnOrderTotal: {
    id: 'CompanyOrders.ListView.column.orderTotal',
    description: 'Title of the table column (orderTotal)',
    defaultMessage: 'Order total',
  },
  columnTotalLineItemCount: {
    id: 'CompanyOrders.ListView.column.totalLineItemCount',
    description: 'Title of the table column (totalLineItemCount)',
    defaultMessage: 'No. of items',
  },
  columnState: {
    id: 'CompanyOrders.ListView.column.state',
    description: 'Title of the table column (state)',
    defaultMessage: 'Order workflow state',
  },
  columnOrderState: {
    id: 'CompanyOrders.ListView.column.orderState',
    description: 'Title of the table column (orderState)',
    defaultMessage: 'Order status',
  },
  columnPaymentState: {
    id: 'CompanyOrders.ListView.column.paymentState',
    description: 'Title of the table column (paymentState)',
    defaultMessage: 'Payment status',
  },
  columnShipmentState: {
    id: 'CompanyOrders.ListView.column.shipmentState',
    description: 'Title of the table column (shipmentState)',
    defaultMessage: 'Shipment status',
  },
  columnEmailOrder: {
    id: 'CompanyOrders.ListView.column.emailOrder',
    description: 'Title of the table column (emailOrder)',
    defaultMessage: 'Email (order)',
  },
  columnEmailShipping: {
    id: 'CompanyOrders.ListView.column.emailShipping',
    description: 'Title of the table column (emailShipping)',
    defaultMessage: 'Email (shipping)',
  },
  columnEmailBilling: {
    id: 'CompanyOrders.ListView.column.emailBilling',
    description: 'Title of the table column (emailBilling)',
    defaultMessage: 'Email (billing)',
  },
  columnCreatedAt: {
    id: 'CompanyOrders.ListView.column.createdAt',
    description: 'Title of the table column (createdAt)',
    defaultMessage: 'Date created',
  },
  columnLastModifiedAt: {
    id: 'CompanyOrders.ListView.column.lastModifiedAt',
    description: 'Title of the table column (lastModifiedAt)',
    defaultMessage: 'Date modified',
  },
  noOrdersTitle: {
    id: 'CompanyOrders.ListView.noOrdersTitle',
    description: 'Title for no orders found.',
    defaultMessage: 'Sorry, there are no orders associated to this project.',
  },
  noResultsTitle: {
    id: 'CompanyOrders.ListView.noResultsTitle',
    description: 'Title for no (search) results found.',
    defaultMessage: 'No orders match these settings.',
  },
  noResultsDescription: {
    id: 'CompanyOrders.ListView.noResultsDescription',
    description: 'What to tell the user when no (search) results are found.',
    defaultMessage: 'Try changing the search settings.',
  },
  labelLoading: {
    id: 'CompanyOrders.ListView.labelLoading',
    description: 'Displayed while orders are loading',
    defaultMessage: 'Loading orders...',
  },
  searchPlaceholder: {
    id: 'CompanyOrders.SearchByOrder.searchPlaceholder',
    description: 'Placeholder label for the search input',
    defaultMessage:
      'Enter Order number, employee email, item SKU, billing / shipping last name or city',
  },
  lineItemStateFilter: {
    id: 'CompanyOrders.ListView.filter.lineItemState',
    description: 'Label for the lineItemState filter option',
    defaultMessage: 'Line item state',
  },
  orderPredicateFilter: {
    id: 'CompanyOrders.ListView.filter.predicate',
    description: 'Label for the predicate filter option',
    defaultMessage: 'Order predicate',
  },
  customerFirstNameLabel: {
    id: 'CompanyOrders.SearchByOrder.customerFirstNameLabel',
    description: 'Label for the customer first name',
    defaultMessage: 'Employee first name',
  },
  customerLastNameLabel: {
    id: 'CompanyOrders.SearchByOrder.customerLastNameLabel',
    description: 'Label for the Employee last name',
    defaultMessage: 'Employee last name',
  },
  paymentPredicateFilter: {
    id: 'CompanyOrders.ListView.filter.paymentPredicate',
    description: 'Label for the payment predicate filter option',
    defaultMessage: 'Payment predicate',
  },
  paymentTransactionIdFilter: {
    id: 'CompanyOrders.ListView.filter.paymentTransactionIdFilter',
    description: 'Label for the payment transaction ID filter option',
    defaultMessage: 'Payment Transaction ID',
  },
  paymentInteractionIdFilter: {
    id: 'CompanyOrders.ListView.filter.paymentInteractionIdFilter',
    description: 'Label for the payment interaction ID filter option',
    defaultMessage: 'Payment Interaction ID',
  },
  copyButton: {
    id: 'CompanyOrders.ListView.column.copyButton',
    description: 'Label copy button column',
    defaultMessage: 'Copy',
  },
  skuFilter: {
    id: 'CompanyOrders.ListView.column.skuFilter',
    description: 'Label SKU filter option',
    defaultMessage: 'SKU',
  },
  billingAddressCityFilter: {
    id: 'CompanyOrders.ListView.column.billingAddressCityFilter',
    description: 'Label billing address city filter option',
    defaultMessage: 'Billing Address City',
  },
  billingAddressPostalCodeFilter: {
    id: 'CompanyOrders.ListView.column.billingAddressPostalCodeFilter',
    description: 'Label billing address postal code filter option',
    defaultMessage: 'Billing Address Postal Code',
  },
  shippingAddressCityFilter: {
    id: 'CompanyOrders.ListView.column.shippingAddressCityFilter',
    description: 'Label shipping address city filter option',
    defaultMessage: 'Shipping Address City',
  },
  shippingAddressPostalCodeFilter: {
    id: 'CompanyOrders.ListView.column.shippingAddressPostalCodeFilter',
    description: 'Label shipping address postal code filter option',
    defaultMessage: 'Shipping Address Postal Code',
  },
  orderCustomFieldFilter: {
    id: 'CompanyOrders.ListView.column.orderCustomFieldFilter',
    description: 'Label order custom field filter option',
    defaultMessage: 'Order Custom Field',
  },
  paymentCustomFieldFilter: {
    id: 'CompanyOrders.ListView.column.paymentCustomFieldFilter',
    description: 'Label payment custom field filter option',
    defaultMessage: 'Payment Custom Field',
  },
  copyButtonColumn: {
    id: 'CompanyOrders.ListView.column.copyButtonColumn',
    description: 'Title of the table column (copyButton)',
    defaultMessage: 'Copy order',
  },
  actions: {
    id: 'CompanyOrders.ListView.column.actions',
    defaultMessage: 'Actions',
  },
  orderNumberFilterPlaceholder: {
    id: 'CompanyOrders.Filters.orderNumberFilterPlaceholder',
    description: 'Placeholder for the order number filter',
    defaultMessage: 'Type any order number',
  },
  storeKeyValueFallback: {
    id: 'CompanyOrders.ListView.column.value.storeKeyValueFallback',
    description: 'Fallback value for store key',
    defaultMessage: '{key} (key)',
  },
  approvalButton: {
    id: 'CompanyOrders.ListView.column.actions.approvalButton',
    defaultMessage: 'Approve Order',
  },
  rejectButton: {
    id: 'CompanyOrders.ListView.column.actions.rejectButton',
    defaultMessage: 'Reject Order',
  },
  confirmApprovalTittle: {
    id: 'CompanyOrders.ListView.column.actions.confirmApprovalTittle',
    defaultMessage: 'Approve order',
  },
  confirmRejectTittle: {
    id: 'CompanyOrders.ListView.column.actions.confirmRejectTittle',
    defaultMessage: 'Reject order',
  },
  confirmApproval: {
    id: 'CompanyOrders.ListView.column.actions.confirmApproval',
    defaultMessage: 'Do you want to confirm the {orderId} order?',
  },
  confirmReject: {
    id: 'CompanyOrders.ListView.column.actions.confirmReject',
    defaultMessage: 'Do you want to cancel the {orderId} order?',
  },
  orderApprovedSuccess: {
    id: 'CompanyOrders.ListView.column.actions.orderApprovedSuccess',
    defaultMessage: 'Order has been approved',
  },
  orderRejectedSuccess: {
    id: 'CompanyOrders.ListView.column.actions.orderRejectedSuccess',
    defaultMessage: 'Order has been cancelled',
  },
  orderUpdatedError: {
    id: 'CompanyOrders.ListView.column.actions.orderUpdatedError',
    defaultMessage: 'Order has been approved',
  },
});
