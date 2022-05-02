import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import ButtonTyped from './button-typed';

const messages = defineMessages({
  cancel: {
    id: 'Button.cancel',
    description: 'Label for the cancel button',
    defaultMessage: 'Cancel',
  },
  confirm: {
    id: 'Button.confirm',
    description: 'Label for the confirm button',
    defaultMessage: 'Confirm',
  },
  save: {
    id: 'Button.save',
    description: 'Label for the save button',
    defaultMessage: 'Save',
  },
});

export const ButtonCancel = ButtonTyped('ButtonCancel', {
  type: 'cancel',
  defaultLabel: <FormattedMessage {...messages.cancel} />,
  hasAlternativeStyle: true,
});

export const ButtonConfirm = ButtonTyped('ButtonConfirm', {
  type: 'confirm',
  defaultLabel: <FormattedMessage {...messages.confirm} />,
  hasAlternativeStyle: true,
});

export const ButtonSave = ButtonTyped('ButtonSave', {
  type: 'save',
  defaultLabel: <FormattedMessage {...messages.save} />,
  hasAlternativeStyle: true,
});

export { default as Button } from './button';
export { default as ButtonClose } from './button-close';
export { default as ButtonToggleValue } from './button-toggle-value';
export { default as ButtonTyped } from './button-typed';
