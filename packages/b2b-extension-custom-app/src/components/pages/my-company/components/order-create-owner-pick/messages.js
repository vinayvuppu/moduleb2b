import { defineMessages } from 'react-intl';

export default defineMessages({
  subTitle: {
    id: 'Orders.Create.Step.Owner.subTitle',
    description: 'A subtitle for the customer step',
    defaultMessage: 'Create order for',
  },
  columnCustomerNumber: {
    id: 'Orders.Create.Step.Owner.table.customerNumber',
    description: 'Title of the table column (customerNumber)',
    defaultMessage: 'Employee number',
  },
  columnFirstName: {
    id: 'Orders.Create.Step.Owner.table.firstName',
    description: 'Title of the table column (firstName)',
    defaultMessage: 'First name',
  },
  columnLastName: {
    id: 'Orders.Create.Step.Owner.table.lastName',
    description: 'Title of the table column (lastName)',
    defaultMessage: 'Last name',
  },
  columnCompanyName: {
    id: 'Orders.Create.Step.Owner.table.companyName',
    description: 'Title of the table column (companyName)',
    defaultMessage: 'Company',
  },
  columnEmail: {
    id: 'Orders.Create.Step.Owner.table.email',
    description: 'Title of the table column (email)',
    defaultMessage: 'Email',
  },
  noCustomersText: {
    id: 'Orders.Create.Step.Owner.table.noCustomersText',
    description: 'No customers',
    defaultMessage:
      'There are no Employees that matched with the given input text',
  },
  searchPlaceholder: {
    id: 'Orders.Create.Step.Owner.searchPlaceholder',
    description: 'A searchPlaceholder for the customer search',
    defaultMessage: 'Search by Employee number or Email',
  },
  noSearchResults: {
    id: 'Orders.Create.Step.Owner.noSearchResults',
    description: 'A text when the search results are zero',
    defaultMessage: 'There are no results matching your search criteria.',
  },
  ownerMe: {
    id: 'Orders.Create.Step.Owner.ownerMe',
    defaultMessage: 'Me',
  },
  ownerEmployee: {
    id: 'Orders.Create.Step.Owner.ownerEmployee',
    defaultMessage: 'Company employee',
  },
  ownerCompany: {
    id: 'Orders.Create.Step.Owner.ownerCompany',
    defaultMessage: 'Company',
  },
  ownerSelectButton: {
    id: 'Orders.Create.Step.Owner.ownerSelectButton',
    defaultMessage: 'Select',
  },
  userWithoutStore: {
    id: 'Orders.Create.Step.Owner.userWithoutStore',
    defaultMessage: 'User without store',
  },
});
