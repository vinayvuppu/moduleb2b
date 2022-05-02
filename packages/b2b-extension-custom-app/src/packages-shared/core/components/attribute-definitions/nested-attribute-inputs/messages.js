import { defineMessages } from 'react-intl';

export default defineMessages({
  editAttributeWarning: {
    id: 'NestedAttributes.editAttributeWarning',
    description: 'Warning message shown when nested attribute cannot be edited',
    defaultMessage:
      'Please create your product first in order to be able to edit this attribute',
  },
  emptySetItem: {
    id: 'NestedAttributes.tooltip.emptySetItem',
    description: 'Empty set item',
    defaultMessage: 'New',
  },
  hideSetItems: {
    id: 'NestedAttributes.tooltip.hideSetItems',
    description: 'Hide set items bottom',
    defaultMessage: 'Hide set items ({countOfSetItem})',
  },
  showSetItems: {
    id: 'NestedAttributes.tooltip.showSetItems',
    description: 'Show set items bottom',
    defaultMessage: 'Show set items ({countOfSetItem})',
  },
  editTooltip: {
    id: 'NestedAttributes.tooltip.edit',
    description: 'NestedAttributes edit tooltip',
    defaultMessage: 'Edit Attributes',
  },
  editTooltipDisabled: {
    id: 'NestedAttributes.tooltip.editTooltipDisabled',
    description: 'NestedAttributes edit tooltip (disabled)',
    defaultMessage: 'Please update this level in order to edit this attribute',
  },
  deleteSetItemTooltip: {
    id: 'NestedAttributes.tooltip.deleteSetItem',
    description: 'NestedAttributes delete SetItem tooltip',
    defaultMessage: 'Delete set item',
  },
  addSetItemTooltip: {
    id: 'NestedAttributes.tooltip.addSetItem',
    description: 'NestedAttributes add SetItem tooltip',
    defaultMessage: 'Add set item',
  },
  addSetItemTooltipDisabled: {
    id: 'NestedAttributes.tooltip.addSetItemTooltipDisabled',
    description: 'NestedAttributes add SetItem tooltip (disabled)',
    defaultMessage: 'Multiple empty set items cannot be added',
  },
  emptyProductType: {
    id: 'NestedAttributes.emptyProductType',
    description: 'message that shows when product type is empty',
    defaultMessage:
      'The product type referenced does not contain any attribute.',
  },
  referencedProductType: {
    id: 'NestedAttributes.referencedProductType',
    description: 'Product type referenced hint',
    defaultMessage: 'Product type referenced: {productTypeName}',
  },
});
