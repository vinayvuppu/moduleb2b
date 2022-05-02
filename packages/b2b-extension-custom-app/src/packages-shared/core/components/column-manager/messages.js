import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'ColumnManager.title',
    description: 'Title for the column manager component.',
    defaultMessage: 'Column Manager',
  },
  visibleColumns: {
    id: 'ColumnSelectorGroups.visible',
    description: 'Message for the visible columns section.',
    defaultMessage: 'Visible columns',
  },
  hiddenColumns: {
    id: 'ColumnManager.hiddenColumns',
    description: 'Message for the hidden columns section',
    defaultMessage: 'Hidden columns',
  },
  expandColumnManagerButtonLabel: {
    id: 'ColumnManager.expandColumnManagerButtonLabel',
    description: 'Label for the expand column manager button',
    defaultMessage: 'Expand column manager',
  },
  collapseColumnManagerButtonLabel: {
    id: 'ColumnManager.collapseColumnManagerLabel',
    description: 'Label for the collapse column manager button',
    defaultMessage: 'Collapse column manager',
  },
  noSelectedColumnsToShow: {
    id: 'ColumnManager.noSelectedColumnsToShow',
    description: 'Label when there are no selected columns to show',
    defaultMessage: 'There are no selected columns to show.',
  },
  noHiddenColumnsToShow: {
    id: 'ColumnManager.noHiddenColumnsToShow',
    description: 'Label when there are no hidden columns to show',
    defaultMessage: 'There are no hidden columns to show.',
  },
});
