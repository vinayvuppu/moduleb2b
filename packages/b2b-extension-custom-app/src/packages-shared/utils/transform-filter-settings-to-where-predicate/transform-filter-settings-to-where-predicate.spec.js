import oneLine from 'common-tags/lib/oneLine';
import {
  transformFilterSettingsToWherePredicate,
  createResourceIdTransformer,
  createVariantPredicate,
} from './transform-filter-settings-to-where-predicate';

describe('transformFilterSettingsToWherePredicate', () => {
  describe('when there are productType filter settings', () => {
    const expected = 'productType(id in ("123", "456"))';
    const actual = transformFilterSettingsToWherePredicate({
      productTypes: [{ id: '123' }, { id: '456' }],
    });
    it('should return a productType predicate', () => {
      expect(actual).toBe(expected);
    });
  });

  describe('when there are attributes filter settings', () => {
    describe('when attribute filter is text type', () => {
      const expected = createVariantPredicate(
        'attributes(name="attribute-1" and value in ("hello"))'
      );

      const actual = transformFilterSettingsToWherePredicate({
        customAttributes: [
          {
            name: 'attribute-1',
            values: ['hello'],
            type: 'text',
          },
        ],
      });
      it('should return a variants predicate', () => {
        expect(actual).toBe(expected);
      });
    });
    describe('when attribute filter is ltext type', () => {
      describe('with single value', () => {
        const expected = createVariantPredicate(
          'attributes(name="attribute-1" and value(en="hello"))'
        );
        const options = { language: 'en' };
        const actual = transformFilterSettingsToWherePredicate(
          {
            customAttributes: [
              {
                name: 'attribute-1',
                values: ['hello'],
                type: 'ltext',
              },
            ],
          },
          options
        );
        it('should return a variants predicate', () => {
          expect(actual).toBe(expected);
        });
      });
      describe('with multiple values', () => {
        describe('of single attribute', () => {
          const expected = createVariantPredicate(oneLine`
            attributes(name="attribute-1" and value(en="hello"))
            or
            attributes(name="attribute-1" and value(en="world"))
          `);
          const options = { language: 'en' };
          const actual = transformFilterSettingsToWherePredicate(
            {
              customAttributes: [
                {
                  name: 'attribute-1',
                  values: ['hello', 'world'],
                  type: 'ltext',
                },
              ],
            },
            options
          );
          it('should return a variants predicate', () => {
            expect(actual).toBe(expected);
          });
        });

        describe('of single attribute that is excluded', () => {
          const expected = createVariantPredicate(oneLine`
            not(attributes(name="attribute-1" and value(en="hello"))
            or
            attributes(name="attribute-1" and value(en="world")))
          `);
          const options = { language: 'en' };
          const actual = transformFilterSettingsToWherePredicate(
            {
              customAttributes: [
                {
                  excluded: true,
                  name: 'attribute-1',
                  values: ['hello', 'world'],
                  type: 'ltext',
                },
              ],
            },
            options
          );
          it('should return a variants predicate', () => {
            expect(actual).toBe(expected);
          });
        });
        describe('of multiple attributes', () => {
          const expected = createVariantPredicate(oneLine`
            attributes(name="attribute-1" and value(en="hello"))
            and
            attributes(name="attribute-2" and value(en="hello"))
            or
            attributes(name="attribute-2" and value(en="world"))
          `);
          const options = { language: 'en' };
          const actual = transformFilterSettingsToWherePredicate(
            {
              customAttributes: [
                {
                  name: 'attribute-1',
                  values: ['hello'],
                  type: 'ltext',
                },
                {
                  name: 'attribute-2',
                  values: ['hello', 'world'],
                  type: 'ltext',
                },
              ],
            },
            options
          );
          it('should return a variants predicate', () => {
            expect(actual).toBe(expected);
          });
        });
      });
    });
    describe('when attribute filter is boolean type', () => {
      const expected = createVariantPredicate(
        'attributes(name="attribute-1" and value in (false, true))'
      );

      const actual = transformFilterSettingsToWherePredicate({
        customAttributes: [
          {
            name: 'attribute-1',
            values: [false, true],
            type: 'boolean',
          },
        ],
      });
      it('should return a variants predicate', () => {
        expect(actual).toBe(expected);
      });
    });
    describe('when attribute filter is enum type', () => {
      const expected = createVariantPredicate(
        'attributes(name="attribute-1" and value(key in ("enum_1")))'
      );

      const actual = transformFilterSettingsToWherePredicate({
        customAttributes: [
          {
            name: 'attribute-1',
            values: [{ key: 'enum_1' }],
            type: 'enum',
          },
        ],
      });
      it('should return a variants predicate', () => {
        expect(actual).toBe(expected);
      });
    });

    describe('when attribute filter is enum type with no values selected only', () => {
      const expected = createVariantPredicate(
        'attributes(not(name="attribute-1"))'
      );

      const actual = transformFilterSettingsToWherePredicate({
        customAttributes: [
          {
            name: 'attribute-1',
            values: [],
            missing: true,
            type: 'enum',
          },
        ],
      });
      it('should return a variants predicate', () => {
        expect(actual).toBe(expected);
      });
    });
    describe('when attribute filter is date type', () => {
      const expected = createVariantPredicate(
        'attributes(name="attribute-1" and value > "2017-07-01" and value < "2017-07-17")'
      );

      const actual = transformFilterSettingsToWherePredicate({
        customAttributes: [
          {
            name: 'attribute-1',
            values: [
              {
                from: '2017-07-01',
                to: '2017-07-17',
              },
            ],
            type: 'date',
          },
        ],
      });
      it('should return a variants predicate', () => {
        expect(actual).toBe(expected);
      });
    });
    describe('when attribute filter is datetime type', () => {
      const expected = createVariantPredicate(
        'attributes(name="attribute-1" and value > "2017-07-03T12:30:11.512Z" and value < "2017-07-17T12:30:11.512Z")'
      );
      const actual = transformFilterSettingsToWherePredicate({
        customAttributes: [
          {
            name: 'attribute-1',
            values: [
              {
                from: '2017-07-03T12:30:11.512Z',
                to: '2017-07-17T12:30:11.512Z',
              },
            ],
            type: 'datetime',
          },
        ],
      });
      it('should return a variants predicate', () => {
        expect(actual).toBe(expected);
      });
    });
    describe('when attribute filter is time type', () => {
      const expected = createVariantPredicate(
        'attributes(name="attribute-1" and value > "13:00" and value < "15:00")'
      );
      const actual = transformFilterSettingsToWherePredicate({
        customAttributes: [
          {
            name: 'attribute-1',
            values: [
              {
                from: '13:00',
                to: '15:00',
              },
            ],
            type: 'time',
          },
        ],
      });
      it('should return a variants predicate', () => {
        expect(actual).toBe(expected);
      });
    });
    describe('when attribute filter is number type', () => {
      describe('with single value', () => {
        const expected = createVariantPredicate(
          'attributes(name="attribute-1" and value > 10 and value < 20)'
        );

        const actual = transformFilterSettingsToWherePredicate({
          customAttributes: [
            {
              name: 'attribute-1',
              values: [
                {
                  from: 10,
                  to: 20,
                },
              ],
              type: 'number',
            },
          ],
        });
        it('should return a variants predicate', () => {
          expect(actual).toBe(expected);
        });
      });
      describe('with multiple values', () => {
        describe('of single attribute', () => {
          const expected = createVariantPredicate(oneLine`
            attributes(name="attribute-1" and value > 10 and value < 20)
            or
            attributes(name="attribute-1" and value > 15 and value < 19)
          `);

          const actual = transformFilterSettingsToWherePredicate({
            customAttributes: [
              {
                name: 'attribute-1',
                values: [
                  {
                    from: 10,
                    to: 20,
                  },
                  {
                    from: 15,
                    to: 19,
                  },
                ],
                type: 'number',
              },
            ],
          });
          it('should return a variants predicate', () => {
            expect(actual).toBe(expected);
          });
        });
        describe('with multiple attributes', () => {
          const expected = createVariantPredicate(oneLine`
            attributes(name="attribute-1" and value > 10 and value < 20)
            and
            attributes(name="attribute-2" and value > 15 and value < 19)
          `);

          const actual = transformFilterSettingsToWherePredicate({
            customAttributes: [
              {
                name: 'attribute-1',
                values: [
                  {
                    from: 10,
                    to: 20,
                  },
                ],
                type: 'number',
              },
              {
                name: 'attribute-2',
                values: [
                  {
                    from: 15,
                    to: 19,
                  },
                ],
                type: 'number',
              },
            ],
          });
          it('should return a variants predicate', () => {
            expect(actual).toBe(expected);
          });
        });
      });
    });
    describe('when attribute filter is reference type', () => {
      describe('with single value', () => {
        const expected = createVariantPredicate(
          'attributes(name="attribute-1" and value(typeId="product" and id="product-1"))'
        );

        const actual = transformFilterSettingsToWherePredicate({
          customAttributes: [
            {
              name: 'attribute-1',
              values: ['product-1'],
              type: 'reference',
              referenceTypeId: 'product',
            },
          ],
        });
        it('should return a variants predicate', () => {
          expect(actual).toBe(expected);
        });
      });
      describe('with multiple values', () => {
        describe('of single attribute', () => {
          const expected = createVariantPredicate(oneLine`
            attributes(name="attribute-1" and value(typeId="category" and id="category-1"))
            or
            attributes(name="attribute-1" and value(typeId="category" and id="category-2"))
            `);
          const actual = transformFilterSettingsToWherePredicate({
            customAttributes: [
              {
                name: 'attribute-1',
                values: ['category-1', 'category-2'],
                type: 'reference',
                referenceTypeId: 'category',
              },
            ],
          });
          it('should return a variants predicate', () => {
            expect(actual).toBe(expected);
          });
        });
        describe('with multiple attributes', () => {
          const expected = createVariantPredicate(oneLine`
            attributes(name="attribute-1" and value(typeId="product" and id="product-1"))
            and
            attributes(name="attribute-2" and value(typeId="category" and id="category-1"))
            or
            attributes(name="attribute-2" and value(typeId="category" and id="category-2"))
          `);
          const actual = transformFilterSettingsToWherePredicate({
            customAttributes: [
              {
                name: 'attribute-1',
                values: ['product-1'],
                type: 'reference',
                referenceTypeId: 'product',
              },
              {
                name: 'attribute-2',
                values: ['category-1', 'category-2'],
                type: 'reference',
                referenceTypeId: 'category',
              },
            ],
          });
          it('should return a variants predicate', () => {
            expect(actual).toBe(expected);
          });
        });
      });
    });
    describe('when attribute filter is money type', () => {
      describe('with single value', () => {
        const expected = createVariantPredicate(
          'attributes(name="attribute-1" and value(currencyCode="EUR" and centAmount > 1200 and centAmount < 2400))'
        );

        const actual = transformFilterSettingsToWherePredicate({
          customAttributes: [
            {
              name: 'attribute-1',
              values: [
                {
                  currency: 'EUR',
                  from: 1200,
                  to: 2400,
                },
              ],
              type: 'money',
            },
          ],
        });
        it('should return a variants predicate', () => {
          expect(actual).toBe(expected);
        });
      });
      describe('with multiple values', () => {
        describe('of single attribute', () => {
          const expected = createVariantPredicate(oneLine`
            attributes(name="attribute-1" and value(currencyCode="EUR" and centAmount > 1000 and centAmount < 2000))
            or
            attributes(name="attribute-1" and value(currencyCode="EUR" and centAmount > 999 and centAmount < 1500))
          `);

          const actual = transformFilterSettingsToWherePredicate({
            customAttributes: [
              {
                name: 'attribute-1',
                values: [
                  {
                    currency: 'EUR',
                    from: 1000,
                    to: 2000,
                  },
                  {
                    currency: 'EUR',
                    from: 999,
                    to: 1500,
                  },
                ],
                type: 'money',
              },
            ],
          });
          it('should return a variants predicate', () => {
            expect(actual).toBe(expected);
          });
        });
        describe('with multiple attributes', () => {
          const expected = createVariantPredicate(oneLine`
            attributes(name="attribute-1" and value(currencyCode="EUR" and centAmount > 1000 and centAmount < 2000))
            or
            attributes(name="attribute-1" and value(currencyCode="EUR" and centAmount > 999 and centAmount < 1500))
            and
            attributes(name="attribute-2" and value(currencyCode="EUR" and centAmount > 880 and centAmount < 1500))
          `);

          const actual = transformFilterSettingsToWherePredicate({
            customAttributes: [
              {
                name: 'attribute-1',
                values: [
                  {
                    currency: 'EUR',
                    from: 1000,
                    to: 2000,
                  },
                  {
                    currency: 'EUR',
                    from: 999,
                    to: 1500,
                  },
                ],
                type: 'money',
              },
              {
                name: 'attribute-2',
                values: [
                  {
                    currency: 'EUR',
                    from: 880,
                    to: 1500,
                  },
                ],
                type: 'money',
              },
            ],
          });
          it('should return a variants predicate', () => {
            expect(actual).toBe(expected);
          });
        });
      });
    });
    describe('when attribute filter is missing', () => {
      const expected = createVariantPredicate(
        'attributes(name="attribute-1" and value(currencyCode="EUR" and centAmount > 1200 and centAmount < 2400)) or attributes(not(name="attribute-1"))'
      );

      const actual = transformFilterSettingsToWherePredicate({
        customAttributes: [
          {
            name: 'attribute-1',
            values: [
              {
                currency: 'EUR',
                from: 1200,
                to: 2400,
              },
            ],
            missing: true,
            type: 'money',
          },
        ],
      });
      it('should return a variants predicate', () => {
        expect(actual).toBe(expected);
      });
    });
  });

  describe('when there are states filter settings', () => {
    const expected = 'state(id in ("123", "456"))';
    const actual = transformFilterSettingsToWherePredicate({
      states: [{ id: '123' }, { id: '456' }],
    });
    it('should return a state predicate', () => {
      expect(actual).toBe(expected);
    });
  });

  describe('when there are categories filter settings', () => {
    const expected = 'categories(id in ("123", "456"))';
    const actual = transformFilterSettingsToWherePredicate({
      categories: [{ id: '123' }, { id: '456' }],
    });
    it('should return a categories predicate', () => {
      expect(actual).toBe(expected);
    });
  });

  describe('when there are status filter settings', () => {
    describe('when all statuses are selected', () => {
      const expected = null;
      const actual = transformFilterSettingsToWherePredicate({
        status: ['modified', 'published', 'unpublished'],
      });
      it('should return an empty status predicate', () => {
        expect(actual).toBe(expected);
      });
    });
    describe('when published and unpublished are selected', () => {
      const expected = `hasStagedChanges=false`;
      const actual = transformFilterSettingsToWherePredicate({
        status: ['published', 'unpublished'],
      });
      it('should return a hasStagedChanges=false predicate', () => {
        expect(actual).toBe(expected);
      });
    });
    describe('when published and modified are selected', () => {
      const expected = `published=true and hasStagedChanges=true`;
      const actual = transformFilterSettingsToWherePredicate({
        status: ['published', 'modified'],
      });
      it('should return a hasStagedChanges=true & published=true predicate', () => {
        expect(actual).toBe(expected);
      });
    });
    describe('when unpublished and modified are selected', () => {
      const expected = `published=false and hasStagedChanges=true`;
      const actual = transformFilterSettingsToWherePredicate({
        status: ['unpublished', 'modified'],
      });
      it('should return a hasStagedChanges=true & published=false predicate', () => {
        expect(actual).toBe(expected);
      });
    });
  });

  // `selectedProductIds` are not saved as
  // part of the `filterSettings` of products to the MC-backend.
  // For now, we add `selectedProductIds` as an opt-in key among transformers
  // and hook into `createKeyTransformer` to create the predicate for us.
  describe('when there are selected products ids', () => {
    it('should return a product id predicate', () => {
      const expected = 'id in ("123", "456")';
      const actual = transformFilterSettingsToWherePredicate({
        selectedProductIds: ['123', '456'],
      });
      expect(actual).toBe(expected);
    });
  });
});

describe('createResourceIdTransformer', () => {
  describe('for state', () => {
    let stateIdTransformer;
    beforeEach(() => {
      stateIdTransformer = createResourceIdTransformer('state');
    });
    describe('with selected states', () => {
      const stateFilterSettings = [{ id: 'state-1' }, { id: 'state-2' }];
      const expected = 'state(id in ("state-1", "state-2"))';
      it('should return a state predicate', () => {
        const actual = stateIdTransformer(stateFilterSettings);
        expect(actual).toBe(expected);
      });
    });
    describe('without selected states', () => {
      const stateFilterSettings = [];
      const expected = null;
      it('should return `null`', () => {
        const actual = stateIdTransformer(stateFilterSettings);
        expect(actual).toBe(expected);
      });
    });
    describe('when marked as `missing`', () => {
      const stateFilterSettings = [];
      const options = {
        // the `missing` key in filter settings for `state` is called `states`
        // we have to emulate it here.
        missingKeys: ['states'],
      };
      const expected = 'state(id is not defined)';
      it('should return state predicate where id is not defined', () => {
        const actual = stateIdTransformer(stateFilterSettings, options);
        expect(actual).toBe(expected);
      });
    });
  });
  describe('for categories', () => {
    let categoryIdsTransformer;
    beforeEach(() => {
      categoryIdsTransformer = createResourceIdTransformer('categories');
    });
    describe('with selected categories', () => {
      const categoriesFilterSettings = [
        { id: 'category-1' },
        { id: 'category-2' },
      ];
      const expected = 'categories(id in ("category-1", "category-2"))';
      it('should return a categories predicate', () => {
        const actual = categoryIdsTransformer(categoriesFilterSettings);
        expect(actual).toBe(expected);
      });
    });
    describe('without selected categories', () => {
      const categoriesFilterSettings = [];
      const expected = null;
      it('should return `null`', () => {
        const actual = categoryIdsTransformer(categoriesFilterSettings);
        expect(actual).toBe(expected);
      });
    });
    describe('when marked as `missing`', () => {
      const categoriesFilterSettings = [];
      const options = {
        missingKeys: ['categories'],
      };
      const expected = 'categories(id is not defined)';
      it('should return categories predicate where id is not defined', () => {
        const actual = categoryIdsTransformer(
          categoriesFilterSettings,
          options
        );
        expect(actual).toBe(expected);
      });
    });
  });
});

describe('createVariantPredicate', () => {
  let variantPredicate;
  beforeEach(() => {
    variantPredicate = createVariantPredicate('foo=bar');
  });
  it('should match snapshot', () => {
    expect(variantPredicate).toEqual(
      '(masterVariant(foo=bar) or variants(foo=bar))'
    );
  });
});
