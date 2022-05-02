import { defineMessages } from 'react-intl';

export default defineMessages({
  editAttributeWarning: {
    id: 'attributeInputByType.nestedAttributes.editAttributeWarning',
    description: 'Warning message shown when nested attribute cannot be edited',
    defaultMessage:
      'Please create your product first in order to be able to edit this attribute',
  },
  aboveFifthLevelWarning: {
    id: 'attributeInputByType.nestedAttributes.aboveFifthLevelWarning',
    description:
      'Warning message shown when nested attribute are above the fifth level',
    defaultMessage:
      'The Merchant Center currently supports the edition of nested attributes up to five levels only.',
  },
});
