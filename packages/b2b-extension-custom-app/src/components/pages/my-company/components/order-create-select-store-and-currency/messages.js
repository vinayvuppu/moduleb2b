import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'Orders.Create.Select.Currency.title',
    description: 'A title: for the store and currency selection',
    defaultMessage: 'Select store and currency',
  },
  titleNoStore: {
    id: 'Orders.Create.Select.Currency.title.noStore',
    description: 'A title: for the currency selection',
    defaultMessage: 'Select currency',
  },
  subTitle1: {
    id: 'Orders.Create.Select.Currency.subTitle1',
    description: 'A subtitle for the currency selection',
    defaultMessage:
      'It is not possible to change the store or currency at a later step. if the currency or the store are incorrects after this step, you have to abandon the order and start a new one.',
  },
  subTitleNoStore: {
    id: 'Orders.Create.Select.Currency.subTitle1.noStore',
    description: 'A subtitle for the currency selection',
    defaultMessage:
      'It is not possible to change the  currency at a later step. if the currency is incorrect after this step, you have to abandon the order and start a new one.',
  },
  currencyLabel: {
    id: 'Orders.Create.Select.Currency.currencyLabel',
    description: 'Label for the currency field',
    defaultMessage: 'Currency',
  },
  storeLabel: {
    id: 'Orders.Create.Select.Currency.storeLabel',
    description: 'Label for the store field',
    defaultMessage: 'Store',
  },
  storePlaceholder: {
    id: 'Orders.Create.Select.Currency.storePlaceholder',
    description: 'storePlaceholder for the store input',
    defaultMessage: 'No store selected',
  },
  noStoresPlaceholder: {
    id: 'Orders.Create.Select.Currency.noStoresPlaceholder',
    description:
      'placeholder for the store input when there are no stores in the project',
    defaultMessage: 'This project does not contain any stores',
  },
  saveButton: {
    id: 'Orders.Create.Select.Currency.saveButton',
    description: 'Label for the save button',
    defaultMessage: 'Save',
  },
  cancelButton: {
    id: 'Orders.Create.Select.Currency.cancelButton',
    description: 'Label for the cancel button',
    defaultMessage: 'Cancel',
  },
});
