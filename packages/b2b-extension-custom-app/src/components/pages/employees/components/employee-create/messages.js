import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'Employees.Create.title',
    description: 'The page title for the employee creation form',
    defaultMessage: 'Create an employee',
  },
  subtitle: {
    id: 'Employees.Create.subtitle',
    description: 'The page subtitle for the employee creation form',
    defaultMessage: 'Enter and manage employee details.',
  },
  employeeCreated: {
    id: 'Employees.Create.employeeCreated',
    description: 'Notify that employee has been created.',
    defaultMessage: 'The employee, {name}, has been created successfully.',
  },
});
