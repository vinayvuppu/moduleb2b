import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import {
  sanitizeListColumns,
  computedProperties,
  resolveStatusType,
  splitVariantAttributesByConstraint,
} from './products';

describe('sanitizing product list columns', () => {
  it('omits some fields in the product list columns', () => {
    expect(
      sanitizeListColumns([
        { key: 'id' },
        { key: 'name' },
        { key: 'a-1', attributeDefinition: {} },
        { key: 'a-2', customType: {} },
        { key: 'a-3', customLabel: {} },
      ])
    ).toEqual([
      { key: 'id' },
      { key: 'name' },
      { key: 'a-1' },
      { key: 'a-2' },
      { key: 'a-3' },
    ]);
  });
});

describe('splitting variant attributes by constraint', () => {
  const product = {
    productType: {
      obj: {
        attributes: [
          { attributeConstraint: 'constraint1' },
          { attributeConstraint: 'constraint2' },
          { attributeConstraint: 'constraint3' },
        ],
      },
    },
  };
  const attributeDefinitions = splitVariantAttributesByConstraint(
    product,
    'constraint2'
  );
  it('contains one product attribute definition by constraint', () => {
    expect(attributeDefinitions[0]).toHaveLength(1);
  });

  it('contains two variant attribute definitions by constraint', () => {
    expect(attributeDefinitions[1]).toHaveLength(2);
  });

  it('contains the filtered constraint in the product definition', () => {
    expect(attributeDefinitions[0]).toEqual([
      {
        attributeConstraint: 'constraint2',
      },
    ]);
  });

  it('contains the non filtered constraint in the variant definition', () => {
    expect(attributeDefinitions[1]).toEqual([
      {
        attributeConstraint: 'constraint1',
      },
      {
        attributeConstraint: 'constraint3',
      },
    ]);
  });
});

describe('computing product properties', () => {
  describe('computing prices', () => {
    const product = {
      masterVariant: {
        prices: [
          { value: { centAmount: 1000, currencyCode: 'EUR' } },
          { value: { centAmount: 900, currencyCode: 'USD' } },
        ],
      },
      variants: [
        {
          prices: [
            { value: { centAmount: 2000, currencyCode: 'EUR' } },
            { value: { centAmount: 1800, currencyCode: 'USD' } },
            {
              value: {
                preciseAmount: 9712,
                currencyCode: 'USD',
                fractionDigits: 9,
                type: 'highPrecision',
              },
            },
          ],
        },
      ],
    };

    const intl = {
      formatNumber: (amount, currency) => `${currency.currency} ${amount}`,
    };
    it('gets the prices from the given product', () => {
      const pricesList = computedProperties.price({ product, intl });
      expect(pricesList).toBe('EUR 10, USD 0.000009712');
    });
  });
  describe('computing categories', () => {
    const product = {
      categories: [
        {
          id: 'cat-id-1',
          obj: {
            externalId: 500,
            name: {
              en: 'category-name-1',
              de: 'Kategori-name-1',
            },
            ancestors: [
              {
                name: {
                  en: 'category-ancestor-1',
                  de: 'Kategori-ancestor-1',
                },
              },
            ],
          },
        },
      ],
    };

    it('gets the category info from a given product', () => {
      const expected = [
        {
          id: 'cat-id-1',
          name: 'category-name-1 | ext. ID: 500',
          path: 'category-ancestor-1 > category-name-1',
          level: 1,
        },
      ];

      const actual = computedProperties.categories({
        product,
        language: 'en',
        languages: ['de', 'en', 'fr'],
      });

      expect(actual).toEqual(expected);
    });

    it('gets the number of categories contained in the product', () => {
      const totalCategories = computedProperties.totalCategories({ product });
      expect(totalCategories).toBe(1);
    });
  });

  describe('computing product type', () => {
    it('gets the product type name given a product', () => {
      const product = {
        productType: {
          obj: {
            name: 'product name',
          },
        },
      };
      const productName = computedProperties.productType({ product });

      expect(productName).toBe(product.productType.obj.name);
    });

    it('gets NO_VALUE_FALLBACK when no product type name is passed', () => {
      const product = {
        productType: {},
      };
      const productName = computedProperties.productType({ product });

      expect(productName).toBe(NO_VALUE_FALLBACK);
    });
  });

  describe('computing state', () => {
    describe('with expanded `state`', () => {
      it('should return the state name', () => {
        const product = {
          state: {
            obj: {
              name: { en: 'state' },
            },
          },
        };
        const state = computedProperties.state({
          product,
          language: 'en',
        });

        expect(state).toBe(product.state.obj.name.en);
      });
    });

    describe('without a name on the `state`', () => {
      it('gets NO_VALUE_FALLBACK when no state name is passed', () => {
        const product = {
          state: { obj: {} },
        };
        const state = computedProperties.state({
          product,
          language: 'en',
        });

        expect(state).toBe(NO_VALUE_FALLBACK);
      });
    });

    describe('with non expanded `state`', () => {
      it('should return the `NO_VALUE_FALLBACK`', () => {
        const product = {
          state: {},
        };
        const state = computedProperties.state({
          product,
          language: 'en',
        });

        expect(state).toBe(NO_VALUE_FALLBACK);
      });
    });
  });

  describe('computing tax categories', () => {
    describe('with expanded `taxCategory`', () => {
      it('should return the tax category name', () => {
        const product = {
          taxCategory: {
            obj: {
              name: 'tax category',
            },
          },
        };
        const taxCategory = computedProperties.taxCategory({ product });

        expect(taxCategory).toBe(product.taxCategory.obj.name);
      });
    });

    describe('without a name on the `taxCategory`', () => {
      it('gets NO_VALUE_FALLBACK when no tax category name is passed', () => {
        const product = {
          productType: { obj: {} },
        };
        const taxCategory = computedProperties.taxCategory({ product });

        expect(taxCategory).toBe(NO_VALUE_FALLBACK);
      });
    });

    describe('with non expanded `taxCategory`', () => {
      it('should return the `NO_VALUE_FALLBACK`', () => {
        const product = {
          productType: {},
        };
        const taxCategory = computedProperties.taxCategory({ product });

        expect(taxCategory).toBe(NO_VALUE_FALLBACK);
      });
    });
  });

  describe('computing variants', () => {
    describe('all variants have sku', () => {
      const product = {
        masterVariant: { sku: 'master-variant-sku' },
        variants: [{ sku: 'variant-1-sku' }, { sku: 'variant-2-sku' }],
      };

      it('gets the sku concatenation for all variants including master', () => {
        const skuString = computedProperties.sku({ product });
        expect(skuString).toBe(
          'master-variant-sku, variant-1-sku, variant-2-sku'
        );
      });

      it('gets the number of variants available given a product', () => {
        const totalVariants = computedProperties.totalVariants({ product });
        expect(totalVariants).toBe(3);
      });
    });

    describe('some variants are missing sku', () => {
      const product = {
        masterVariant: {},
        variants: [{ sku: 'variant-1-sku' }, {}, { sku: 'variant-3-sku' }],
      };

      it('filters out empty skus', () => {
        const skuString = computedProperties.sku({ product });
        expect(skuString).toBe('variant-1-sku, variant-3-sku');
      });
    });
  });
});

describe('resolving product status types', () => {
  it('gets a modified status type product', () => {
    const expectedModified = 'modified';
    const actualModified = resolveStatusType({
      hasStagedChanges: true,
      published: true,
    });

    expect(actualModified).toBe(expectedModified);
  });

  it('gets a published status type product', () => {
    const expectedModified = 'published';
    const actualModified = resolveStatusType({
      hasStagedChanges: false,
      published: true,
    });

    expect(actualModified).toBe(expectedModified);
  });

  it('gets an unpublished status type product', () => {
    const expectedModified = 'unpublished';
    const actualModified = resolveStatusType({
      published: false,
    });

    expect(actualModified).toBe(expectedModified);
  });
});
