import { defineMessages } from 'react-intl';

const messages = defineMessages({
  cancel: {
    id: 'Search.Filters.cancel',
    description: 'Label for the filters form button (cancel)',
    defaultMessage: 'Cancel',
  },
  apply: {
    id: 'Search.Filters.apply',
    description: 'Label for the filters form button (apply)',
    defaultMessage: 'Apply',
  },
  applyAndClose: {
    id: 'Search.Filters.applyAndClose',
    description: 'Label for the filters form button (apply and close)',
    defaultMessage: 'Apply and close',
  },
  removeAllLabel: {
    id: 'Search.Filters.removeAllLabel',
    description: 'Label for the button for removing all filters',
    defaultMessage: 'Remove all filters',
  },
  noMoreAvailableFields: {
    id: 'Search.Filters.noMoreAvailableFields',
    description: 'Message for the select dropdown if there are no more fields',
    defaultMessage: 'No more available filters',
  },
  addFilter: {
    id: 'Search.Filters.addFilter',
    description: 'Message for the select dropdown',
    defaultMessage: 'Add filter',
  },
});

export default messages;
