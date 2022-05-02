import { defineMessages } from 'react-intl';

export default defineMessages({
  updateButton: {
    id: 'NestedAttributes.Details.updateButton',
    description: 'Update button label',
    defaultMessage: 'Update Attribute',
  },
  cancelButton: {
    id: 'NestedAttributes.Details.cancelButton',
    description: 'Cancel button label',
    defaultMessage: 'Cancel',
  },
  attributeUpdateSucceeded: {
    id: 'NestedAttributes.Details.attributeUpdateSucceeded',
    description: 'Message for successful notification (update)',
    defaultMessage: 'Attributes on this level have been successfully updated',
  },
  nestedAttributesConfirmLabel: {
    id: 'NestedAttributes.Details.nestedAttributesConfirmLabel',
    description: 'Text for confirmation button',
    defaultMessage: 'Proceed without updating level',
  },
  confirmationDialogTitle: {
    id: 'NestedAttributes.Details.confirmationDialogTitle',
    description: 'Title for confirmation dialog',
    defaultMessage: 'Discard changes',
  },
  confirmationDialogBody: {
    id: 'NestedAttributes.Details.confirmationDialogBody',
    description: 'Body text for confirmation dialog',
    defaultMessage:
      'By leaving this page, attributes on this level will not be updated. Would you like to proceed?',
  },
});
