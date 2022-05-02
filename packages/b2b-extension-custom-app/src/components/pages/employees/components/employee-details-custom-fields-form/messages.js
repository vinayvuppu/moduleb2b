import { defineMessages } from 'react-intl';

export default defineMessages({
  typesTitle: {
    id: 'Employees.DetailsEmployeeCustomFields.typesTitle',
    description: 'The title of the type selection',
    defaultMessage: 'Custom type',
  },
  customFieldsUpdated: {
    id: 'Employees.DetailsEmployeeCustomFields.customFieldsUpdated',
    description: 'Confirmation label when saving custom fields',
    defaultMessage: 'Custom fields successfully updated',
  },
  typesPlaceholder: {
    id: 'Employees.DetailsEmployeeCustomFields.typesPlaceholder',
    description: 'The placeholder for the types',
    defaultMessage: 'Select...',
  },
  customFieldsError: {
    id: 'Employees.DetailsEmployeeCustomFields.customFieldsError',
    description: 'The message when there are errors adding custom fields',
    defaultMessage:
      'Some of the custom fields that you have defined are required or not valid.',
  },
  customFieldsErrorSubtitle: {
    id: 'Employees.DetailsEmployeeCustomFields.customFieldsErrorSubtitle',
    description: 'The subtitle when there are errors adding custom fields',
    defaultMessage: 'Please check the following fields:',
  },
});
