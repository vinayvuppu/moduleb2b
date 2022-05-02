import { defineMessages } from 'react-intl';

export default defineMessages({
  labelNameField: {
    id: 'Company.Form.labelNameField',
    description: 'Label for `name` form field',
    defaultMessage: 'Company name',
  },
  labelGeneralInfoTitle: {
    id: 'Company.Form.labelGeneralInfoTitle',
    description: 'Label for General Information title',
    defaultMessage: 'General Information',
  },
  labelKeyLengthError: {
    id: 'Company.Form.labelKeyLengthError',
    description: 'Label for key length error',
    defaultMessage: 'The key must have a maximum length of 256 characters',
  },
  labelKeyFormatError: {
    id: 'Company.Form.labelKeyFormatError',
    description: 'Label for key format error',
    defaultMessage:
      'Keys may only contain alphanumeric characters, underscores and hyphens',
  },
  labelKeyMinLengthError: {
    id: 'Company.Form.labelKeyMinLengthError',
    description: 'Label for key min length error',
    defaultMessage: 'Keys must have a minimum length of 2 characters',
  },
  duplicatedName: {
    id: 'Company.Form.duplicatedName',
    description: 'Error message for duplicate name',
    defaultMessage: 'There is an existing company with this name',
  },
  duplicatedKey: {
    id: 'Company.Form.duplicatedKey',
    description: 'Error message for duplicate key',
    defaultMessage: 'There is an existing company with this key',
  },
  labelAddressTitle: {
    id: 'Company.Form.labelAddressTitle',
    description: 'Label for Address title',
    defaultMessage: 'Address',
  },
  logo: {
    id: 'Company.Form.logo',
    defaultMessage: 'Logo',
  },
  columnContactName: {
    id: 'Company.Form.Addresses.columns.columnContactName',
    defaultMessage: 'Contact name',
  },
  columnAddress: {
    id: 'Company.Form.Addresses.columns.address',
    defaultMessage: 'Address',
  },
  columnCity: {
    id: 'Company.Form.Addresses.columns.city',
    defaultMessage: 'City',
  },
  columnPostalCode: {
    id: 'Company.Form.Addresses.columns.columnPostalCode',
    defaultMessage: 'Postal Code',
  },
  columnState: {
    id: 'Company.Form.Addresses.columns.columnState',
    defaultMessage: 'State',
  },
  columnRegion: {
    id: 'Company.Form.Addresses.columns.columnRegion',
    defaultMessage: 'Region',
  },
  columnCountry: {
    id: 'Company.Form.Addresses.columns.columnCountry',
    defaultMessage: 'Country',
  },
  logoSizeError: {
    id: 'Company.Form.logoSizeError',
    defaultMessage: 'Can not upload the image. Max size is 1Mb',
  },
  removeLogo: {
    id: 'Company.Form.removeLogo',
    defaultMessage: 'Remove logo',
  },
  labelPOBox: {
    id: 'Company.Form.address.labelPOBox',
    description: 'The cell label for PO box',
    defaultMessage: 'PO Box {value}',
  },
  dropImage: {
    id: 'Company.AddImagesForm.dropImage',
    defaultMessage: 'Drag and drop new image here',
  },
  requieredApprovalIsApprover: {
    id: 'Company.Form.validation.requieredApprovalIsApprover',
    defaultMessage:
      "The role {rol} can't be in 'Approver Roles' and 'Requires Approval'",
  },
  requieredApprovalHaveBudget: {
    id: 'Company.Form.validation.requieredApprovalHaveBudget',
    defaultMessage: "{rol} is approver, can't have budget",
  },
});
