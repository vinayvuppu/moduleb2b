import { defineMessages } from 'react-intl';

export default defineMessages({
  columnOrderNumber: {
    id: 'Employees.Details.OrdersForm.columnOrderNumber',
    description: 'The column label (Order number)',
    defaultMessage: 'Order number',
  },
  columnCreatedAt: {
    id: 'Employees.Details.OrdersForm.columnCreatedAt',
    description: 'The column label (Created at)',
    defaultMessage: 'Created on',
  },
  columnOrderStatus: {
    id: 'Employees.Details.OrdersForm.columnOrderStatus',
    description: 'The column label (Order state)',
    defaultMessage: 'Order Status',
  },
  columnPaymentState: {
    id: 'Employees.Details.OrdersForm.paymentState',
    description: 'Title of the table column (paymentState)',
    defaultMessage: 'Payment Status',
  },
  columnShipmentState: {
    id: 'Employees.Details.OrdersForm.shipmentState',
    description: 'Title of the table column (shipmentState)',
    defaultMessage: 'Shipment Status',
  },
  columnOrderTotal: {
    id: 'Employees.Details.OrdersForm.columnOrderTotal',
    description: 'The column label (Order total)',
    defaultMessage: 'Order total',
  },

  noOrdersTitle: {
    id: 'Employees.Details.OrdersForm.noOrdersTitle',
    description: 'Title for no orders found.',
    defaultMessage: 'There are no orders related to this employee.',
  },

  fetchingOrdersTitle: {
    id: 'Employees.Details.OrdersForm.fetchingOrdersTitle',
    description: 'Title shown while fetching orders.',
    defaultMessage: 'Loading orders...',
  },
});
