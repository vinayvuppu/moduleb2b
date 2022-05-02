import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'Orders.Create.Select.Country.title',
    description: 'Title for the country selection',
    defaultMessage: 'Select country',
  },
  changeTitle: {
    id: 'Orders.Create.Select.Country.changeTitle',
    description: 'Title for the country change',
    defaultMessage: 'Change country',
  },
  confirmTitle: {
    id: 'Orders.Create.Select.Country.confirmTitle',
    description: 'Title for the confirm country selection',
    defaultMessage: 'Change country confirmation',
  },
  changeSubtitle1: {
    id: 'Orders.Create.Select.Country.changeSubTitle1',
    description: 'A subtitle for the change country selection',
    defaultMessage: 'Change country for country specific pricing',
  },
  confirmSubtitle1: {
    id: 'Orders.Create.Select.Country.confirmSubTitle1',
    description: 'A subtitle for the confirm change country selection',
    defaultMessage:
      "The following line items inside your cart have different price values for the order's combination of channel, country, customer group and currency",
  },
  subTitle1: {
    id: 'Orders.Create.Select.Country.subTitle1',
    description: 'A subtitle for the country selection',
    defaultMessage:
      'This variant contains multiple options for country specific pricing. Select one country as a basis',
  },
  confirmSubtitle2: {
    id: 'Orders.Create.Select.Country.confirmSubTitle2',
    description: 'A second subtitle for the confirm change country selection',
    defaultMessage:
      'Revert changes to go back to your initial country selection or confirm the change of country to accept that these items will be removed from your cart',
  },
  subTitle2: {
    id: 'Orders.Create.Select.Country.subTitle2',
    description: 'A second subtitle for the country selection',
    defaultMessage:
      'The pricing of all selected variants will adhere to this country. The country selection can be edited within the order summary.',
  },
  countryLabel: {
    id: 'Orders.Create.Select.Country.label',
    description: 'Label for the country select box',
    defaultMessage: 'Country',
  },
  confirmButton: {
    id: 'Orders.Create.Select.Country.confirmButton',
    description: 'Label for the confirm button',
    defaultMessage: 'Confirm changes',
  },
  saveButton: {
    id: 'Orders.Create.Select.Country.saveButton',
    description: 'Label for the save button',
    defaultMessage: 'Apply',
  },
});
