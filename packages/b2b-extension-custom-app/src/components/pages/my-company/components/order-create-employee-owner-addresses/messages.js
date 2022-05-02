import { defineMessages } from 'react-intl';

export default defineMessages({
  titleShippingAddress: {
    id: 'Orders.Create.Step.Owner.ShippingAddress.title',
    description: 'The title for the Shipping Address panel',
    defaultMessage: 'Customer Shipping Address',
  },
  titleBillingAddress: {
    id: 'Orders.Create.Step.Owner.BillingAddress.title',
    description: 'The title for the Billing Address panel',
    defaultMessage: 'Customer Billing Address',
  },
  clearSelection: {
    id: 'Orders.Create.Step.Owner.clearSelection',
    description: 'The label for the clear selection button',
    defaultMessage: 'Clear selection',
  },
  addressUpdated: {
    id: 'Orders.Create.Step.Owner.addressUpdated',
    description: 'Notify that customer address has been updated.',
    defaultMessage: 'The address, {address}, has been successfully updated.',
  },
  noAddresses: {
    id: 'Orders.Create.Step.Owner.noAddresses',
    description: 'Message when there are no addresses',
    defaultMessage:
      'Sorry, there are no addresses associated to this customer.',
  },
  addAddress: {
    id: 'Orders.Create.Step.Owner.addAddress',
    description: 'Message for the link button of add address',
    defaultMessage: 'Add address',
  },
  removeCustomerSelection: {
    id: 'Orders.Create.Step.Owner.removeCustomerSelection',
    description: 'Label for the remove customer selection label',
    defaultMessage: 'Remove customer selection',
  },
  cancelButton: {
    id: 'Orders.Create.Step.Owner.Form.cancelButton',
    description: 'The label for the cancel button',
    defaultMessage: 'Cancel',
  },
  saveButton: {
    id: 'Orders.Create.Step.Owner.Form.saveButton',
    description: 'The label for the save button',
    defaultMessage: 'Save',
  },
  editButton: {
    id: 'Orders.Create.Step.Owner.Form.editButton',
    description: 'The label for the edit button',
    defaultMessage: 'Edit',
  },
});
