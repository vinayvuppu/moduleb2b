import { defineMessages } from 'react-intl';

export default defineMessages({
  priceInputHint: {
    id: 'HighPrecisionInfoDialog.priceInputHint',
    description:
      'Hint text to indicate price input supports high precision prices',
    defaultMessage: 'This field supports high precision prices',
  },
  highPrecisionInfoModalDescription: {
    id: 'HighPrecisionInfoDialog.highPrecisionInfoModalDescription',
    description: 'Modal text that describes a high precision price',
    defaultMessage:
      "Product prices containing {subCents} are labeled as 'high precision'. A price of high-precision uses {amountOfFractionDigits}, than the normal cent precison for a currency allows.",
  },
  highPrecisionInfoModalUsage: {
    id: 'HighPrecisionInfoDialog.highPrecisionInfoModalUsage',
    description:
      'Modal text that explains example usage of a high precison price',
    defaultMessage:
      'This is useful especially for products with very {lowUnitPrice} (e.g EUR 0,019).',
  },
  highPrecisionInfoModalTier: {
    id: 'HighPrecisionInfoDialog.highPrecisionInfoModalTier',
    description: 'Modal text that explains high precison in tiered prices',
    defaultMessage: '{tieredPrices} can also be defined with high precision.',
  },
  subCentsText: {
    id: 'HighPrecisionInfoDialog.subCentsText',
    description: "Modal text that displays 'sub-cents'",
    defaultMessage: 'sub-cents',
  },
  fractionDigitCount: {
    id: 'HighPrecisionInfoDialog.fractionDigitCount',
    description:
      "Modal text that displays 'a higher amount of fraction digits'",
    defaultMessage: 'a higher amount of fraction digits',
  },
  lowUnitPrice: {
    id: 'HighPrecisionInfoDialog.lowUnitPrice',
    description: "Modal text that displays 'low unit prices'",
    defaultMessage: 'low unit prices',
  },
  tieredPrices: {
    id: 'HighPrecisionInfoDialog.tieredPrices',
    description: "Modal text that displays 'Tier prices'",
    defaultMessage: 'Tier prices',
  },
});
