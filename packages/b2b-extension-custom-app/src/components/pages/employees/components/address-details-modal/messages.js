import { defineMessages } from 'react-intl';

export default defineMessages({
  address: {
    id: 'Employees.Details.AddressDetailsModal.address',
    defaultMessage: 'Address',
  },
  makeDefaultAddress: {
    id: 'Employees.Details.AddressDetailsModal.makeDefaultAddress',
    description:
      'Text of default address button if current address is not ' +
      'the default address',
    defaultMessage:
      'Set to default {type, select, billing {Billing} shipping' +
      '{Shipping}} address',
  },
  isDefaultAddress: {
    id: 'Employees.Details.AddressDetailsModal.isDefaultAddress',
    description:
      'Text of default address button if current address is the ' +
      'default address',
    defaultMessage:
      'Default {type, select, billing {Billing} shipping' +
      '{Shipping}} address',
  },
  backToAddressList: {
    id: 'Employees.Details.AddressDetailsModal.backToAddressList',
    description: 'link text to return to address list',
    defaultMessage: 'To Addresses list',
  },
  editAddress: {
    id: 'Employees.Details.AddressDetailsModal.editAddress',
    description: 'text to show that this is an address edit, not create',
    defaultMessage: 'Edit Address',
  },
  createAddress: {
    id: 'Employees.Details.AddressDetailsModal.createAddress',
    description:
      'text to show that this is a new address create, not an ' +
      'edit of an existing address',
    defaultMessage: 'Create a new address',
  },
  defaultButtonDisabledTooltip: {
    id: 'Employees.Details.AddressDetailsModal.defaultButtonDisabledTooltip',
    description:
      'Text to show in tooltip when a default address button is disabled',
    defaultMessage:
      'Please save your changes before setting this as a ' +
      'default {type, select, billing {Billing} shipping {Shipping}} address.',
  },
  confirmDefaultAddressSet: {
    id: 'Employees.Details.AddressDetailsModal.confirmDefaultAddressSet',
    description: 'notification text when a default address is set',
    defaultMessage:
      'Are you sure you want to make this address the default ' +
      '{type, select, billing {Billing} shipping {Shipping}} address?',
  },
  confirmDefaultAddressSetTitle: {
    id: 'Employees.Details.AddressDetailsModal.confirmDefaultAddressSetTitle',
    description: 'notification title when a default address is set',
    defaultMessage:
      'New default {type, select, billing {Billing} shipping ' +
      '{Shipping}} address',
  },
  defaultAddressSet: {
    id: 'Employees.Details.AddressDetailsModal.defaultAddressSet',
    description: 'notification text when a default address is set',
    defaultMessage:
      'A new default {type, select, billing {Billing} shipping ' +
      '{Shipping}} address has been set for {employeeName}.',
  },
  employeeAddressDeleted: {
    id: 'Employees.Details.AddressDetailsModal.employeeAddressDeleted',
    description: 'Successful message when deleting an address',
    defaultMessage: 'The address of {name} has been successfully deleted.',
  },
  confirmDeleteTitle: {
    id: 'Employees.Details.AddressDetailsModal.confirmDeleteTitle',
    description: 'Text for the title of confirmation dialog',
    defaultMessage: 'Delete address',
  },
  confirmDeleteDialogMessage: {
    id: 'Employees.Details.AddressDetailsModal.confirmDeleteDialogMessage',
    description: 'Message for the confirmation to delete the address',
    defaultMessage:
      "Are you sure you want to delete {name}'s address? This action cannot be undone.",
  },
  confirmDeleteAddressButton: {
    id: 'Employees.Details.AddressDetailsModal.confirmDeleteAddressButton',
    description: 'Label for confirm button for deleting an address',
    defaultMessage: 'Delete address',
  },
  subtitle: {
    id: 'Employees.Details.AddressDetailsForm.description',
    description: 'description of the form',
    defaultMessage: 'Manage address details for this employee.',
  },
  subtitleNewAddress: {
    id: 'Employees.Details.AddressDetailsForm.descriptionNewAddress',
    description: 'description of the form',
    defaultMessage: 'Add new employee details.',
  },
});
