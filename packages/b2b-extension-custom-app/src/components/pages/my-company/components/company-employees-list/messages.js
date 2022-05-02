import { defineMessages } from 'react-intl';

export default defineMessages({
  columnEmployeeNumber: {
    id: 'CompanyEmployees.ListView.column.customerNumber',
    description: 'Title of the table column (customerNumber)',
    defaultMessage: 'Employee number',
  },
  columnExternalId: {
    id: 'CompanyEmployees.ListView.column.externalId',
    description: 'Title of the table column (externalId)',
    defaultMessage: 'External ID',
  },
  columnEmail: {
    id: 'CompanyEmployees.ListView.column.email',
    description: 'Title of the table column (email)',
    defaultMessage: 'Email',
  },
  columnFirstName: {
    id: 'CompanyEmployees.ListView.column.firstName',
    description: 'Title of the table column (firstName)',
    defaultMessage: 'First name',
  },
  columnLastName: {
    id: 'CompanyEmployees.ListView.column.lastName',
    description: 'Title of the table column (lastName)',
    defaultMessage: 'Last name',
  },
  columnCreatedAt: {
    id: 'CompanyEmployees.ListView.column.createdAt',
    description: 'Title of the table column (createdAt)',
    defaultMessage: 'Created on',
  },
  columnLastModifiedAt: {
    id: 'CompanyEmployees.ListView.column.lastModifiedAt',
    description: 'Title of the table column (lastModifiedAt)',
    defaultMessage: 'Modified on',
  },
  columnVatId: {
    id: 'CompanyEmployees.ListView.column.vatId',
    description: 'Title of the table column (vatId)',
    defaultMessage: 'VAT ID',
  },
  storeKeyValueFallback: {
    id: 'CompanyEmployees.ListView.column.value.storeKeyValueFallback',
    description: 'Fallback value for store column values',
    defaultMessage: '{key} (key)',
  },
  noEmployeesTitle: {
    id: 'CompanyEmployees.ListView.noEmployeesTitle',
    description: 'Title for no employees found.',
    defaultMessage: 'There are no employees in this project.',
  },
  noEmployeesDescriptionLink: {
    id: 'CompanyEmployees.ListView.noEmployeesDescriptionLink',
    description: 'What to tell the user when no employees found.',
    defaultMessage: 'Add a employee.',
  },
  noResultsTitle: {
    id: 'CompanyEmployees.ListView.noResultsTitle',
    description: 'Title for no (search) results found.',
    defaultMessage: 'No employees match these settings.',
  },
  noResultsDescription: {
    id: 'CompanyEmployees.ListView.noResultsDescription',
    description: 'What to tell the user when no (search) results are found.',
    defaultMessage: 'Try changing the search settings.',
  },
  searchPlaceholder: {
    id: 'CompanyEmployees.SearchByCompanyEmployees.searchPlaceholder',
    description: 'Placeholder label for the search input',
    defaultMessage: 'Search by email',
  },
  companyFilter: {
    id: 'CompanyEmployees.ListView.filter.company',
    description: 'Label for the company filter option',
    defaultMessage: 'Employee company',
  },
  firstNameFilter: {
    id: 'CompanyEmployees.ListView.filter.firstNameFilter',
    description: 'Label for the firstName filter option',
    defaultMessage: 'First name',
  },
  lastNameFilter: {
    id: 'CompanyEmployees.ListView.filter.lastNameFilter',
    description: 'Label for the lastName filter option',
    defaultMessage: 'Last name',
  },
  middleNameFilter: {
    id: 'CompanyEmployees.ListView.filter.middleNameFilter',
    description: 'Label for the middleName filter option',
    defaultMessage: 'Middle name',
  },
  vatIdFilter: {
    id: 'CompanyEmployees.ListView.filter.vatIdFilter',
    description: 'Label for the vatId filter option',
    defaultMessage: 'VAT ID',
  },
  createdAtFilter: {
    id: 'CompanyEmployees.ListView.filter.createdAtFilter',
    description: 'Label for the createdAt filter option',
    defaultMessage: 'Created',
  },
  lastModifiedAtFilter: {
    id: 'CompanyEmployees.ListView.filter.lastModifiedAtFilter',
    description: 'Label for the lastModifiedAt filter option',
    defaultMessage: 'Modified',
  },
  roles: {
    id: 'CompanyEmployees.ListView.column.roles',
    defaultMessage: 'Roles',
  },
  budgetConsumed: {
    id: 'CompanyEmployees.ListView.column.budgetConsumed',
    defaultMessage: 'Budget consumed',
  },
});
