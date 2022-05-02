import { defineMessages } from 'react-intl';

export default defineMessages({
  version1: {
    id: 'UnsavedChanges.version1',
    description:
      'A message shown when the user tries to exit the page in any way with unsaved changes.',
    defaultMessage:
      'There are unsaved changes. By leaving this page, the changes will not be saved.',
  },
  version2: {
    id: 'UnsavedChanges.version2',
    description:
      'A message shown when the user tries to exit the page in any way with unsaved changes.',
    defaultMessage:
      'There are unsaved changes. By leaving this page, the changes will not be saved. Would you like to continue?',
  },
});
