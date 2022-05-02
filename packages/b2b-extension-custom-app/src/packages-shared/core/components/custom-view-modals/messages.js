import { defineMessages } from 'react-intl';

export default defineMessages({
  creationModalTitle: {
    id: 'CustomViews.Modals.CreateModal.creationModalTitle',
    description: 'Title for creation the modal',
    defaultMessage: 'Save as new View',
  },
  renamingModalTitle: {
    id: 'CustomViews.Modals.RenameModal.renamingModalTitle',
    description: 'Title for edition the modal',
    defaultMessage: 'Rename View',
  },
  deletionModalTitle: {
    id: 'CustomViews.Modals.DeletionModal.deletionModalTitle',
    description: 'Title for deletion the modal',
    defaultMessage: 'Delete View',
  },
  creationModalInfoMessage: {
    id: 'CustomViews.Modals.CreateModal.creationModalInfoMessage',
    description: 'Information message about custom view creation',
    defaultMessage:
      'Save your search query, filters, column manager and table sorting as a custom view ',
  },
  deletionModalInfoMessage: {
    id: 'CustomViews.Modals.DeletionModal.deletionModalInfoMessage',
    description: 'Information message about custom view deletion',
    defaultMessage: 'Are you sure you want to delete my view "{name}"?',
  },
});
