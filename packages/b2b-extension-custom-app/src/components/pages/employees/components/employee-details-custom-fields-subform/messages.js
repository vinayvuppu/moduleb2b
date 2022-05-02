import { defineMessages } from 'react-intl';

export default defineMessages({
  noCustomType: {
    id: 'Employees.Details.EmployeeCustomFields.noCustomType',
    description: 'The label when there is no custom type selected',
    defaultMessage:
      'You have no custom type selected. In order to use custom fields you have to select one.',
  },
  noTypes: {
    id: 'Employees.Details.EmployeeCustomFields.noTypes',
    description:
      'The label when there is no custom type defined in the project',
    defaultMessage:
      'There are no custom types defined for employees. Please create one.',
  },
  noCustomFields: {
    id: 'Employees.Details.EmployeeCustomFields.noCustomFields',
    description: 'Message when the customer has no custom fields',
    defaultMessage: 'There are no custom fields related to this type',
  },
});
