import { injectElementTypeValuesTransformedLocalizedFields } from './product-type-details-connector';

describe('injectElementTypeValuesTransformedLocalizedFields', () => {
  describe('with empty `elementTypeValues`', () => {
    it('should return empty values', () => {
      expect(injectElementTypeValuesTransformedLocalizedFields([])).toEqual([]);
    });
  });
  describe('with `elementTypeValues`', () => {
    it('should return values with labels', () => {
      expect(
        injectElementTypeValuesTransformedLocalizedFields([
          {
            key: 'line-item-custom-field-boolean',
            label: 'Line item custom field boolean',
          },
          {
            key: 'line-item-custom-field-string',
            label: 'Line item custom field string',
          },
        ])
      ).toMatchObject([
        {
          label: 'Line item custom field boolean',
          key: 'line-item-custom-field-boolean',
        },
        {
          label: 'Line item custom field string',
          key: 'line-item-custom-field-string',
        },
      ]);
    });
  });
  describe('with localized `elementTypeValues`', () => {
    it('should return values with localized labels', () => {
      expect(
        injectElementTypeValuesTransformedLocalizedFields([
          {
            key: 'line-item-custom-field-boolean',
            labelAllLocales: [
              {
                locale: 'en',
                value: 'Line item custom field boolean',
              },
            ],
          },
          {
            key: 'line-item-custom-field-string',
            labelAllLocales: [
              {
                locale: 'en',
                value: 'Line item custom field boolean String',
              },
            ],
          },
        ])
      ).toMatchObject([
        {
          label: { en: 'Line item custom field boolean' },
          key: 'line-item-custom-field-boolean',
        },
        {
          label: { en: 'Line item custom field boolean String' },
          key: 'line-item-custom-field-string',
        },
      ]);
    });
  });
});
