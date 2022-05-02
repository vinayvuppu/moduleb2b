import {
  transformLocalizedStringToField,
  transformLocalizedFieldsForCategory,
  mapShippingRateTierToGraphQL,
  createGraphQlUpdateActions,
  createAttributeTypeValue,
  transformLocalizedFieldToString,
  injectTransformedLocalizedFields,
  transformCustomFieldsRawToCustomFields,
  extractErrorFromGraphQlResponse,
} from './graphql';
import { PRECISION_TYPES } from '../constants';

describe('transformCustomFieldsRawToCustomFields', () => {
  let result;
  describe('when raw custom fields are not defined', () => {
    beforeEach(() => {
      result = transformCustomFieldsRawToCustomFields();
    });
    it('should return null', () => {
      expect(result).toBe(null);
    });
  });
  describe('when raw custom fields are empty', () => {
    beforeEach(() => {
      result = transformCustomFieldsRawToCustomFields([]);
    });
    it('should return null', () => {
      expect(result).toBe(null);
    });
  });
  describe('when raw custom fields are non empty and defined', () => {
    beforeEach(() => {
      result = transformCustomFieldsRawToCustomFields([
        { name: 'fieldA', value: 'Hello' },
        { name: 'fieldB', value: 'Ciao' },
      ]);
    });
    it('should return a CustomField object', () => {
      expect(result).toEqual({ fieldA: 'Hello', fieldB: 'Ciao' });
    });
  });
});

describe('transformLocalizedFieldToString', () => {
  let result;
  describe('when array is not defined', () => {
    beforeEach(() => {
      result = transformLocalizedFieldToString();
    });
    it('should return null', () => {
      expect(result).toBe(null);
    });
  });
  describe('when array is empty', () => {
    beforeEach(() => {
      result = transformLocalizedFieldToString([]);
    });
    it('should return null', () => {
      expect(result).toBe(null);
    });
  });
  describe('when array is defined', () => {
    beforeEach(() => {
      result = transformLocalizedFieldToString([
        { locale: 'en', value: 'Hello' },
        { locale: 'it', value: 'Ciao' },
      ]);
    });
    it('should return LocalizedString object', () => {
      expect(result).toEqual({ en: 'Hello', it: 'Ciao' });
    });
  });
});
describe('injectTransformedLocalizedFields', () => {
  describe('when entity contains list of locale fields', () => {
    it('should inject localized string object field and remove outdated key', () => {
      expect(
        injectTransformedLocalizedFields(
          {
            id: '1',
            nameAllLocales: [
              { locale: 'en', value: 'CD' },
              { locale: 'de', value: 'CD' },
            ],
          },
          [{ from: 'nameAllLocales', to: 'name' }]
        )
      ).toEqual({ id: '1', name: { en: 'CD', de: 'CD' } });
    });
  });
  describe('when entity does not contain list of locale fields', () => {
    it('should inject localized string object field as null and remove outdated key', () => {
      expect(
        injectTransformedLocalizedFields({ id: '1' }, [
          { from: 'nameAllLocales', to: 'name' },
        ])
      ).toEqual({ id: '1', name: null });
    });
  });

  describe('when array of locale fields is empty', () => {
    it('should not change entity shape', () => {
      expect(
        injectTransformedLocalizedFields({ id: '1', version: 2 }, [])
      ).toEqual({ id: '1', version: 2 });
    });
  });
});

describe('transformLocalizedFieldsForCategory', () => {
  describe('no parent and no ancestors', () => {
    const expected = {
      id: '1',
      name: {
        en: 'name',
        de: 'name',
      },
      slug: {
        en: 'slug',
        de: 'slug',
      },
      externalId: 'xxx',
    };

    const mapped = transformLocalizedFieldsForCategory(
      {
        id: '1',
        nameAllLocales: [
          {
            locale: 'en',
            value: 'name',
          },
          {
            locale: 'de',
            value: 'name',
          },
        ],
        slugAllLocales: [
          {
            locale: 'en',
            value: 'slug',
          },
          {
            locale: 'de',
            value: 'slug',
          },
        ],
        externalId: 'xxx',
      },
      [
        {
          from: 'nameAllLocales',
          to: 'name',
        },
        {
          from: 'slugAllLocales',
          to: 'slug',
        },
      ]
    );

    it('map correctly to category representation', () => {
      expect(mapped).toEqual(expected);
    });
  });
  describe('with parent', () => {
    const expected = {
      id: '1',
      name: { en: 'name' },
      parent: { id: '2', name: { en: 'name' } },
    };

    const mapped = transformLocalizedFieldsForCategory({
      id: '1',
      nameAllLocales: [{ locale: 'en', value: 'name' }],
      parent: { id: '2', nameAllLocales: [{ locale: 'en', value: 'name' }] },
    });

    it('map correctly to category representation', () => {
      expect(mapped).toEqual(expected);
    });
  });
  describe('with ancestors', () => {
    const expected = {
      id: '1',
      name: { en: 'name' },
      ancestors: [
        { id: '2', name: { en: 'name' } },
        { id: '3', name: { en: 'name' } },
      ],
    };

    const mapped = transformLocalizedFieldsForCategory({
      id: '1',
      nameAllLocales: [{ locale: 'en', value: 'name' }],
      ancestors: [
        { id: '2', nameAllLocales: [{ locale: 'en', value: 'name' }] },
        { id: '3', nameAllLocales: [{ locale: 'en', value: 'name' }] },
      ],
    });

    it('map correctly to category representation', () => {
      expect(mapped).toEqual(expected);
    });
  });
});

describe('mapShippingRateTierToGraphQL', () => {
  const expected = [
    {
      CartValue: {
        score: 10,
      },
    },
  ];

  const mapped = mapShippingRateTierToGraphQL([
    {
      type: 'CartValue',
      price: undefined,
      minimumCentAmount: undefined,
      value: undefined,
      priceFunction: null,
      score: 10,
    },
  ]);

  it('correctly transform and omit shipping rate tier fields', () => {
    expect(mapped).toEqual(expected);
  });
});

describe('createGraphQlUpdateActions', () => {
  let syncActions;
  describe('with actions', () => {
    beforeEach(() => {
      syncActions = [{ action: 'fooAction', payload: { foo: 'bar' } }];
    });
    it('should map `action` names to the object key', () => {
      expect(createGraphQlUpdateActions(syncActions)).toEqual([
        { [syncActions[0].action]: expect.any(Object) },
      ]);
    });

    it('should map `action` payload to the object value', () => {
      expect(createGraphQlUpdateActions(syncActions)[0].fooAction).toEqual({
        payload: { foo: 'bar' },
      });
    });

    describe('with `setCustomField` action', () => {
      const customFieldActions = [
        {
          action: 'setCustomField',
          name: 'String-149-84-6976',
          value: 'bhss',
        },
      ];

      it('should stringify the `action` payload as the object value', () => {
        expect(
          createGraphQlUpdateActions(customFieldActions)[0].setCustomField.value
        ).toEqual(JSON.stringify(customFieldActions[0].value));
      });
    });

    describe('with `removeLocation` action', () => {
      const zoneActions = [
        {
          action: 'removeLocation',
          location: { country: 'ES' },
        },
      ];

      it('should build the graphql action with only the country', () => {
        expect(createGraphQlUpdateActions(zoneActions)[0]).toEqual({
          removeLocation: { location: { country: 'ES' } },
        });
      });
    });

    describe('with `addLocation` action', () => {
      const zoneActions = [
        {
          action: 'addLocation',
          location: { country: 'ES' },
        },
      ];

      it('should build the graphql action with only the country', () => {
        expect(createGraphQlUpdateActions(zoneActions)[0]).toEqual({
          addLocation: { location: { country: 'ES' } },
        });
      });
    });

    describe('with `replaceTaxRate` action', () => {
      const taxCategoryActions = [
        {
          action: 'replaceTaxRate',
          taxRate: { id: 'some-id', name: 'Test', country: 'ES', amount: 1 },
          taxRateId: 'some-id',
        },
      ];

      it('should build the graphql action taxRate without the id', () => {
        expect(createGraphQlUpdateActions(taxCategoryActions)[0]).toEqual({
          replaceTaxRate: {
            taxRateId: 'some-id',
            taxRate: { name: 'Test', country: 'ES', amount: 1 },
          },
        });
      });
    });

    describe('with `addZone` action', () => {
      const shippingMethodActions = [
        {
          action: 'addZone',
          zone: {
            id: 'z1',
            typeId: 'zone',
          },
          typename: 'shippingMethod',
        },
      ];

      it('should build the graphql action shippingMethod without the other props', () => {
        expect(createGraphQlUpdateActions(shippingMethodActions)[0]).toEqual({
          addZone: {
            zone: {
              id: 'z1',
              typeId: 'zone',
            },
          },
        });
      });
    });

    describe('with `removeZone` action', () => {
      const shippingMethodActions = [
        {
          action: 'removeZone',
          zone: {
            id: 'z1',
            name: 'Zone 1',
            typeId: 'zone',
          },
          typename: 'shippingMethod',
        },
      ];

      it('should build the graphql action shippingMethod without the other props', () => {
        expect(createGraphQlUpdateActions(shippingMethodActions)[0]).toEqual({
          removeZone: {
            zone: {
              id: 'z1',
              typeId: 'zone',
            },
          },
        });
      });
    });

    describe('with `changeTaxCategory` action', () => {
      const shippingMethodActions = [
        {
          action: 'changeTaxCategory',
          taxCategory: {
            id: 'tc1',
            name: 'Tax 1',
            typeId: 'tax-category',
          },
          typename: 'shippingMethod',
        },
      ];

      it('should build the graphql action shippingMethod without the other props', () => {
        expect(createGraphQlUpdateActions(shippingMethodActions)[0]).toEqual({
          changeTaxCategory: {
            taxCategory: {
              id: 'tc1',
              typeId: 'tax-category',
            },
          },
        });
      });
    });

    describe('with `addShippingRate` action', () => {
      const shippingMethodActions = [
        {
          action: 'addShippingRate',
          zone: {
            id: 'z1',
            typeId: 'zone',
          },
          typename: 'shippingMethod',
          shippingRate: {
            price: {
              centAmount: 10,
              currencyCode: 'EUR',
            },
            freeAbove: null,
            tiers: null,
          },
        },
      ];

      it('should build the graphql action shippingMethod without the other props', () => {
        expect(createGraphQlUpdateActions(shippingMethodActions)[0]).toEqual({
          addShippingRate: {
            zone: {
              id: 'z1',
              typeId: 'zone',
            },
            shippingRate: {
              price: {
                centAmount: 10,
                currencyCode: 'EUR',
              },
            },
          },
        });
      });
    });

    describe('with `removeShippingRate` action', () => {
      const shippingMethodActions = [
        {
          action: 'removeShippingRate',
          zone: {
            id: 'z1',
            typeId: 'zone',
          },
          typename: 'shippingMethod',
          shippingRate: {
            price: {
              centAmount: 10,
              currencyCode: 'EUR',
            },
            freeAbove: null,
            tiers: null,
          },
        },
      ];

      it('should build the graphql action shippingMethod without the other props', () => {
        expect(createGraphQlUpdateActions(shippingMethodActions)[0]).toEqual({
          removeShippingRate: {
            zone: {
              id: 'z1',
              typeId: 'zone',
            },
            shippingRate: {
              price: {
                centAmount: 10,
                currencyCode: 'EUR',
              },
            },
          },
        });
      });
    });

    describe('with `changeValue` action', () => {
      const changeValueActions = [
        {
          action: 'changeValue',
          value: {
            type: 'relative',
            permyriad: '1200',
          },
        },
      ];

      it('should build the graphql action changeValue', () => {
        expect(createGraphQlUpdateActions(changeValueActions)).toEqual([
          {
            changeValue: {
              value: {
                relative: {
                  permyriad: '1200',
                },
              },
            },
          },
        ]);
      });
    });

    describe('with `changeLabel`', () => {
      beforeEach(() => {
        syncActions = [
          {
            action: 'changeLabel',
            attributeName: 'foo',
            label: { en: 'bar', de: 'baz' },
          },
        ];
      });
      it('should return attribute-type name as action and transform label', () => {
        expect(createGraphQlUpdateActions(syncActions)).toEqual([
          {
            changeLabel: {
              attributeName: 'foo',
              label: [
                { locale: 'de', value: 'baz' },
                { locale: 'en', value: 'bar' },
              ],
            },
          },
        ]);
      });
    });
    describe('with `changeLocalizedEnumValueLabel`', () => {
      beforeEach(() => {
        syncActions = [
          {
            action: 'changeLocalizedEnumValueLabel',
            attributeName: 'foo',
            newValue: {
              key: 'bar',
              label: { en: 'bar', de: 'baz' },
            },
          },
        ];
      });
      it('should return attribute-type name as action and transform label', () => {
        expect(createGraphQlUpdateActions(syncActions)).toEqual([
          {
            changeLocalizedEnumValueLabel: {
              attributeName: 'foo',
              newValue: {
                key: 'bar',
                label: [
                  { locale: 'de', value: 'baz' },
                  { locale: 'en', value: 'bar' },
                ],
              },
            },
          },
        ]);
      });
    });
    describe('with `addLocalizedEnumValue`', () => {
      beforeEach(() => {
        syncActions = [
          {
            action: 'addLocalizedEnumValue',
            attributeName: 'foo',
            value: {
              key: 'bar',
              label: { de: 'baz', en: 'bar' },
            },
          },
        ];
      });
      it('should return attribute-type name as action and transform label', () => {
        expect(createGraphQlUpdateActions(syncActions)).toEqual([
          {
            addLocalizedEnumValue: {
              attributeName: 'foo',
              value: {
                key: 'bar',
                label: [
                  { locale: 'de', value: 'baz' },
                  { locale: 'en', value: 'bar' },
                ],
              },
            },
          },
        ]);
      });
    });

    describe('with `setInputTip`', () => {
      beforeEach(() => {
        syncActions = [
          {
            action: 'setInputTip',
            attributeName: 'foo',
            inputTip: { en: 'bar', de: 'baz' },
          },
        ];
      });
      it('should return attribute-type name as action and transform inputTip', () => {
        expect(createGraphQlUpdateActions(syncActions)).toEqual([
          {
            setInputTip: {
              attributeName: 'foo',
              inputTip: [
                { locale: 'de', value: 'baz' },
                { locale: 'en', value: 'bar' },
              ],
            },
          },
        ]);
      });
    });

    describe('with `addAttributeDefinition`', () => {
      const createAddAttributeAction = custom => ({
        action: 'addAttributeDefinition',
        attribute: {
          label: { en: 'foo' },
          inputTip: { en: 'foo' },
          type: { name: 'text' },
        },
        ...custom,
      });
      describe('with text', () => {
        beforeEach(() => {
          syncActions = [createAddAttributeAction()];
        });
        it('should match snapshot', () => {
          expect(createGraphQlUpdateActions(syncActions)).toMatchSnapshot();
        });
        it('should return attribute-type name as action', () => {
          expect(createGraphQlUpdateActions(syncActions)).toEqual([
            {
              addAttributeDefinition: {
                attributeDefinition: expect.objectContaining({
                  type: {
                    text: {},
                  },
                }),
              },
            },
          ]);
        });
        it('should convert localized fields', () => {
          expect(createGraphQlUpdateActions(syncActions)).toEqual([
            {
              addAttributeDefinition: {
                attributeDefinition: expect.objectContaining({
                  label: [{ locale: 'en', value: 'foo' }],
                  inputTip: [{ locale: 'en', value: 'foo' }],
                }),
              },
            },
          ]);
        });
      });
      describe('with reference', () => {
        beforeEach(() => {
          syncActions = [
            createAddAttributeAction({
              attribute: {
                type: {
                  name: 'reference',
                  referenceTypeId: 'product',
                },
              },
            }),
          ];
        });
        it('should match snapshot', () => {
          expect(createGraphQlUpdateActions(syncActions)).toMatchSnapshot();
        });
        it('should return attribute-type name as action', () => {
          expect(createGraphQlUpdateActions(syncActions)).toEqual([
            {
              addAttributeDefinition: {
                attributeDefinition: expect.objectContaining({
                  type: {
                    reference: {
                      referenceTypeId: 'product',
                    },
                  },
                }),
              },
            },
          ]);
        });
      });
    });

    describe('with `setShippingRateInputType`', () => {
      describe('when `type` is `CartClassification`', () => {
        beforeEach(() => {
          syncActions = [
            {
              action: 'setShippingRateInputType',
              shippingRateInputType: {
                type: 'CartClassification',
                values: [
                  {
                    key: 'foo',
                    allLocaleLabels: [{ locale: 'en', value: 'Foo' }],
                  },
                ],
              },
            },
          ];
        });
        it('should return `type` and `values` on `setShippingRateInputType`', () => {
          expect(createGraphQlUpdateActions(syncActions)).toEqual([
            {
              setShippingRateInputType: {
                shippingRateInputType: {
                  [syncActions[0].shippingRateInputType.type]: {
                    values: [
                      {
                        key: 'foo',
                        label: [{ locale: 'en', value: 'Foo' }],
                      },
                    ],
                  },
                },
              },
            },
          ]);
        });
      });
      describe('when `type` is `CartScore`', () => {
        beforeEach(() => {
          syncActions = [
            {
              action: 'setShippingRateInputType',
              shippingRateInputType: {
                type: 'CartScore',
                values: null,
              },
            },
          ];
        });
        it('should return `type` and unset `values` on `setShippingRateInputType`', () => {
          expect(createGraphQlUpdateActions(syncActions)).toEqual([
            {
              setShippingRateInputType: {
                shippingRateInputType: {
                  [syncActions[0].shippingRateInputType.type]: {},
                },
              },
            },
          ]);
        });
      });
      describe('when `type` is `CartValue`', () => {
        beforeEach(() => {
          syncActions = [
            {
              action: 'setShippingRateInputType',
              shippingRateInputType: {
                type: 'CartValue',
                values: null,
              },
            },
          ];
        });
        it('should return `type` and unset `values` on `setShippingRateInputType`', () => {
          expect(createGraphQlUpdateActions(syncActions)).toEqual([
            {
              setShippingRateInputType: {
                shippingRateInputType: {
                  [syncActions[0].shippingRateInputType.type]: {},
                },
              },
            },
          ]);
        });
      });
    });

    describe('with `addCustomLineItem` action', () => {
      describe('with high-precision money type', () => {
        const cartUpdateActions = [
          {
            action: 'addCustomLineItem',
            slug: 'slug',
            quantity: 2,
            name: { en: 'foo' },
            taxCategory: 'tax-1',
            money: {
              type: PRECISION_TYPES.highPrecision,
              fractionDigits: 2,
              centAmount: 100,
              currencyCode: 'EUR',
            },
          },
        ];
        it('should build the graphql action `addCustomLineItem`', () => {
          expect(createGraphQlUpdateActions(cartUpdateActions)[0]).toEqual({
            addCustomLineItem: {
              name: [{ locale: 'en', value: 'foo' }],
              slug: 'slug',
              quantity: 2,
              taxCategory: 'tax-1',
              money: {
                [PRECISION_TYPES.highPrecision]: {
                  centAmount: 100,
                  currencyCode: 'EUR',
                  fractionDigits: 2,
                },
              },
            },
          });
        });
      });
      describe('with cent-precision money type', () => {
        const cartUpdateActions = [
          {
            action: 'addCustomLineItem',
            slug: 'slug',
            quantity: 2,
            name: { en: 'foo' },
            taxCategory: 'tax-1',
            money: {
              type: PRECISION_TYPES.centPrecision,
              fractionDigits: 2,
              centAmount: 100,
              currencyCode: 'EUR',
            },
          },
        ];

        it('should build the graphql action `addCustomLineItem`', () => {
          expect(createGraphQlUpdateActions(cartUpdateActions)[0]).toEqual({
            addCustomLineItem: {
              name: [{ locale: 'en', value: 'foo' }],
              slug: 'slug',
              quantity: 2,
              taxCategory: 'tax-1',
              money: {
                [PRECISION_TYPES.centPrecision]: {
                  centAmount: 100,
                  currencyCode: 'EUR',
                },
              },
            },
          });
        });
      });
    });

    describe('with `setCustomType` action', () => {
      const cartUpdateActions = [
        {
          action: 'setCustomType',
          type: {
            id: 'type-id',
          },
          fields: {
            field1: 'foo',
            field2: 'bar',
          },
        },
      ];

      it('should build the graphql action `addCustomLineItem`', () => {
        expect(createGraphQlUpdateActions(cartUpdateActions)[0]).toEqual({
          setCustomType: {
            typeId: 'type-id',
            fields: [
              {
                name: 'field1',
                value: '"foo"',
              },
              {
                name: 'field2',
                value: '"bar"',
              },
            ],
          },
        });
      });
    });
  });

  describe('without actions', () => {
    it('should return an empty `Array`', () => {
      expect(createGraphQlUpdateActions([])).toEqual([]);
    });
  });

  describe('utils', () => {
    describe('createAttributeTypeValue', () => {
      let attribute;
      describe('with text', () => {
        beforeEach(() => {
          attribute = {
            type: { name: 'text' },
          };
        });
        it('should return attribute type with name', () => {
          expect(createAttributeTypeValue(attribute)).toEqual({
            text: {},
          });
        });
      });
      describe('with ltext', () => {
        beforeEach(() => {
          attribute = {
            type: { name: 'ltext' },
          };
        });
        it('should return attribute type with name', () => {
          expect(createAttributeTypeValue(attribute)).toEqual({
            ltext: {},
          });
        });
      });
      describe('with boolean', () => {
        beforeEach(() => {
          attribute = {
            type: { name: 'boolean' },
          };
        });
        it('should return attribute type with name', () => {
          expect(createAttributeTypeValue(attribute)).toEqual({
            boolean: {},
          });
        });
      });
      describe('with date', () => {
        beforeEach(() => {
          attribute = {
            type: { name: 'date' },
          };
        });
        it('should return attribute type with name', () => {
          expect(createAttributeTypeValue(attribute)).toEqual({
            date: {},
          });
        });
      });
      describe('with time', () => {
        beforeEach(() => {
          attribute = {
            type: { name: 'time' },
          };
        });
        it('should return attribute type with name', () => {
          expect(createAttributeTypeValue(attribute)).toEqual({
            time: {},
          });
        });
      });
      describe('with datetime', () => {
        beforeEach(() => {
          attribute = {
            type: { name: 'datetime' },
          };
        });
        it('should return attribute type with name', () => {
          expect(createAttributeTypeValue(attribute)).toEqual({
            datetime: {},
          });
        });
      });
      describe('with number', () => {
        beforeEach(() => {
          attribute = {
            type: { name: 'number' },
          };
        });
        it('should return attribute type with name', () => {
          expect(createAttributeTypeValue(attribute)).toEqual({
            number: {},
          });
        });
      });
      describe('with money', () => {
        beforeEach(() => {
          attribute = {
            type: { name: 'money' },
          };
        });
        it('should return attribute type with name', () => {
          expect(createAttributeTypeValue(attribute)).toEqual({
            money: {},
          });
        });
      });
      describe('with reference', () => {
        beforeEach(() => {
          attribute = {
            type: { name: 'reference', referenceTypeId: 'product' },
          };
        });
        it('should return attribute type with name and referenceTypeId', () => {
          expect(createAttributeTypeValue(attribute)).toEqual({
            reference: {
              referenceTypeId: 'product',
            },
          });
        });
      });
    });
  });
});

describe('transformLocalizedStringToField', () => {
  let result;
  describe('when object is not defined', () => {
    beforeEach(() => {
      result = transformLocalizedStringToField();
    });
    it('should return empty array', () => {
      expect(result).toEqual([]);
    });
  });
  describe('when object is empty', () => {
    beforeEach(() => {
      result = transformLocalizedStringToField({});
    });
    it('should return empty array', () => {
      expect(result).toEqual([]);
    });
  });
  describe('when object is defined', () => {
    beforeEach(() => {
      result = transformLocalizedStringToField({ en: 'Hello', it: 'Ciao' });
    });
    it('should return LocalizedString object', () => {
      expect(result).toEqual([
        { locale: 'en', value: 'Hello' },
        { locale: 'it', value: 'Ciao' },
      ]);
    });
  });
});

describe('extractErrorFromGraphQlResponse', () => {
  describe('given a `networkError` with errors exists', () => {
    const graphQlResponseWithNetworkErrors = {
      networkError: {
        result: {
          errors: [
            {
              code: 'a network error',
            },
          ],
        },
      },
    };

    it('should rethrow the network errors', () => {
      expect(
        extractErrorFromGraphQlResponse(graphQlResponseWithNetworkErrors)
      ).toEqual(graphQlResponseWithNetworkErrors.networkError.result.errors);
    });
  });

  describe('given a `graphQLErrors` exists', () => {
    const graphQlResponseWithGraphQLErrors = {
      graphQLErrors: [
        {
          code: 'a graphql error',
        },
      ],
    };

    it('should rethrow the network errors', () => {
      expect(
        extractErrorFromGraphQlResponse(graphQlResponseWithGraphQLErrors)
      ).toEqual(graphQlResponseWithGraphQLErrors.graphQLErrors);
    });
  });

  describe('given no `graphqlErrors` and no `networkErrors` exist', () => {
    const graphQlResponseWithoutGraphQLErrorsAndNetworkErrors = {
      graphQLErrors: [],
      networkError: {},
    };

    it('should rethrow the response', () => {
      expect(
        extractErrorFromGraphQlResponse(
          graphQlResponseWithoutGraphQLErrorsAndNetworkErrors
        )
      ).toEqual(graphQlResponseWithoutGraphQLErrorsAndNetworkErrors);
    });
  });
});
