import { reportErrorToSentry } from '@commercetools-frontend/sentry';
import { initialState as bulkInitialState } from '../bulk';
import {
  SET_VISIBLE_PRODUCT,
  PRODUCT_MASTER_VARIANT_CHANGED,
  PRODUCT_STATE_TRANSITIONED,
  INITIAL_PRODUCT_STATES_FETCHED,
  RECOMMENDED_CATEGORIES_FETCHED,
  PRODUCT_TYPES_FOR_FILTER_FETCHED,
  PRODUCT_TYPES_FOR_ATTRIBUTES_FETCHED,
  RECOMMENDED_CATEGORIES_SEARCH_PROPERTIES,

  // Product List View Settings
  SET_ACTIVE_PRODUCT_LIST_VIEW_SETTINGS,
  REMOVE_PRODUCT_LIST_VIEW_SETTINGS_FROM_LIST,

  // Bulk edit
  SET_VIEW_MODE,
  VIEW_MODES,

  // Filter keys
  PRODUCT_SEARCH_TEXT,
  PRODUCT_SEARCH_SORTING,
  PRODUCT_SEARCH_FILTER_PRODUCT_TYPE,
  PRODUCT_SEARCH_FILTER_ATTRIBUTES,
  PRODUCT_SEARCH_FILTER_CATEGORIES,
  PRODUCT_SEARCH_FILTER_MISSING,
  PRODUCT_SEARCH_FILTER_STATUS,
  PRODUCT_SEARCH_FILTER_STATES,
} from '../../constants';
import reducer, {
  defaultClearedSettings,
  selectCurrentProduct,
  selectProductStates,
  selectTotalProductStates,
  selectRecommendedCategories,
  selectProductTypesForAttributes,
  selectProductTypesForFilter,
  selectTotalProductTypesForFilter,
  selectProductListViewSettings,
  selectDraft,
  // selectAllProductSettings,
  selectTransformedFilterSettings,
  selectTransformedFilterSettingsWithSelectedProducts,
  selectInitialProductStates,
  selectProductTypeOfCurrentProduct,
  selectCheckSelectionIds,
  selectMonitoredCategoriesRecommendationAttribute,
  selectCanClearSettings,
  selectHasActiveProductFilters,
  selectUniqueProductTypesOfSearchResults,
  selectUniqueAttributesOfSearchResults,
  selectProductListColumns,
  selectSetAttributeValuesOfSelectedProducts,
  selectProductListViewSettingsList,

  // Bulk edit
  selectCheckedProducts,
  selectProductTypesOfCheckedProducts,
  selectViewMode,
  selectHasNestedAttribute,
} from './products';

jest.mock('@commercetools-frontend/sentry');

const mergeActionsTypes = [
  PRODUCT_MASTER_VARIANT_CHANGED,
  PRODUCT_STATE_TRANSITIONED,
];

const createProductsState = custom => ({
  products: {
    currentVisible: { id: 'current-visible', categories: [] },
    recommendedCategories: {
      categories: [],
    },
    productListViewSettingsList: [],
    ...custom,
    view: {
      mode: VIEW_MODES.PRODUCTS_LIST,
    },
    bulk: {
      numberOfProductsToUpdate: 0,
      successfulUpdates: [],
      failedUpdates: [],
    },
  },
});

describe('reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      productListViewSettingsList: [],
      currentQueryResult: { count: 0, offset: 0, results: [], total: 0 },
      currentVisible: null,
      selectedIds: [],
      productTypesForFilter: {
        total: 0,
        results: [],
      },
      productTypesForAttributes: {
        total: 0,
        results: [],
      },
      recommendedCategories: {
        categories: {},
      },
      recommendedCategoriesStatus: null,
      bulk: bulkInitialState,
      view: {
        mode: VIEW_MODES.PRODUCTS_LIST,
      },
    });
  });

  mergeActionsTypes.forEach(actionType => {
    describe(`actionType: ${actionType}`, () => {
      const action = {
        type: actionType,
        payload: {
          id: '1',
          key: 'unique-key-1',
          version: 1,
          createdAt: '2016',
          lastModifiedAt: '2016',
          productType: { id: '1', typeId: 'product-type' },
          taxCategory: { id: '1', typeId: 'tax-category' },
          state: { id: '1', typeId: 'state' },
          masterData: {
            published: true,
            hasStagedChanges: false,
            staged: { name: { en: 'Foo' } },
          },
        },
      };
      it('should merge projection', () => {
        expect(reducer({}, action).currentVisible).toEqual({
          id: '1',
          key: 'unique-key-1',
          version: 1,
          createdAt: '2016',
          lastModifiedAt: '2016',
          productType: { id: '1', typeId: 'product-type' },
          taxCategory: { id: '1', typeId: 'tax-category' },
          state: { id: '1', typeId: 'state' },
          published: true,
          hasStagedChanges: false,
          name: { en: 'Foo' },
        });
      });
    });
  });

  describe('SET_VISIBLE_PRODUCT', () => {
    const action = {
      type: SET_VISIBLE_PRODUCT,
      payload: {
        id: '1',
        key: 'unique-key-1',
        version: 1,
        createdAt: '2016',
        lastModifiedAt: '2016',
        productType: { id: '1', typeId: 'product-type' },
        taxCategory: { id: '1', typeId: 'tax-category' },
        state: { id: '1', typeId: 'state' },
        masterData: {
          published: true,
          hasStagedChanges: false,
          staged: { name: { en: 'Foo' } },
        },
      },
    };
    it('should merge projection', () => {
      expect(reducer({}, action).currentVisible).toEqual({
        id: '1',
        key: 'unique-key-1',
        version: 1,
        createdAt: '2016',
        lastModifiedAt: '2016',
        productType: { id: '1', typeId: 'product-type' },
        taxCategory: { id: '1', typeId: 'tax-category' },
        state: { id: '1', typeId: 'state' },
        published: true,
        hasStagedChanges: false,
        name: { en: 'Foo' },
      });
    });
  });

  describe('PRODUCT_TYPES_FOR_FILTER_FETCHED', () => {
    const expectedPayload = { results: [{ id: '1' }], total: 100 };
    const action = {
      type: PRODUCT_TYPES_FOR_FILTER_FETCHED,
      payload: expectedPayload,
    };
    it('should save product types for filter', () => {
      expect(reducer(undefined, action).productTypesForFilter).toEqual(
        expectedPayload
      );
    });
  });

  describe('PRODUCT_TYPES_FOR_ATTRIBUTES_FETCHED', () => {
    const expectedPayload = { results: [{ id: '1' }], total: 100 };
    const action = {
      type: PRODUCT_TYPES_FOR_ATTRIBUTES_FETCHED,
      payload: expectedPayload,
    };
    it('should save product types for attributes', () => {
      expect(reducer(undefined, action).productTypesForAttributes).toEqual(
        expectedPayload
      );
    });
  });

  describe('INITIAL_PRODUCT_STATES_FETCHED', () => {
    const payload = { count: 1, results: [{ id: '1', name: { en: 'Foo' } }] };
    const action = {
      type: INITIAL_PRODUCT_STATES_FETCHED,
      payload,
    };
    it('should set the initial product states', () => {
      expect(reducer({}, action).initialProductStates).toEqual(payload);
    });
  });

  describe('RECOMMENDED_CATEGORIES_FETCHED', () => {
    it('should add new product slice', () => {
      const recommendedCategories = [{ id: 'cat-1' }, { id: 'cat-2' }];
      const action = {
        type: RECOMMENDED_CATEGORIES_FETCHED,
        payload: { id: 'prod-1', recommendedCategories },
      };
      expect(reducer(undefined, action).recommendedCategories).toEqual({
        categories: { 'prod-1': recommendedCategories },
      });
    });

    it('should keep existing product slices', () => {
      const recommendedCategories = [{ id: 'cat-1' }, { id: 'cat-2' }];
      const action = {
        type: RECOMMENDED_CATEGORIES_FETCHED,
        payload: { id: 'prod-1', recommendedCategories },
      };
      const existingState = {
        recommendedCategories: {
          categories: {
            'prod-2': [{ id: 'cat-x' }],
          },
        },
      };
      const newState = reducer(existingState, action).recommendedCategories;
      expect(newState.categories).toEqual({
        'prod-2': [{ id: 'cat-x' }],
        'prod-1': recommendedCategories,
      });
    });
  });

  describe('SET_VIEW_MODE', () => {
    it('should allow setting the view mode to bulk-update', () => {
      const action = {
        type: SET_VIEW_MODE,
        payload: VIEW_MODES.BULK_UPDATE,
      };
      expect(reducer(undefined, action).view).toEqual({
        mode: VIEW_MODES.BULK_UPDATE,
      });
    });

    describe('when setting the view mode to an unsupported value', () => {
      let nextState;
      const action = {
        type: SET_VIEW_MODE,
        payload: 'invalid-view-mode',
      };
      beforeEach(() => {
        reportErrorToSentry.mockReset();
        nextState = reducer(undefined, action);
      });
      it('should not set the view mode', () => {
        expect(nextState).toEqual(
          expect.objectContaining({ view: { mode: VIEW_MODES.PRODUCTS_LIST } })
        );
      });
      it('should report the error to sentry', () => {
        expect(reportErrorToSentry).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('SET_ACTIVE_PRODUCT_LIST_VIEW_SETTINGS', () => {
    it('should update productListViewSettings', () => {
      const action = {
        type: SET_ACTIVE_PRODUCT_LIST_VIEW_SETTINGS,
        payload: { foo: 'bar' },
      };
      expect(reducer(undefined, action).productListViewSettings).toEqual({
        foo: 'bar',
      });
    });
  });

  describe('REMOVE_PRODUCT_LIST_VIEW_SETTINGS_FROM_LIST', () => {
    let action;
    let initialState;
    beforeEach(() => {
      action = {
        type: REMOVE_PRODUCT_LIST_VIEW_SETTINGS_FROM_LIST,
        payload: 'product-list-view-settings-removed-id',
      };
      initialState = {
        productListViewSettingsList: [
          {
            id: 'product-list-view-settings-removed-id',
          },
          {
            id: 'product-list-view-settings-id',
          },
        ],
      };
    });
    it('should remove productListViewSettings from list', () => {
      expect(reducer(initialState, action).productListViewSettingsList).toEqual(
        [
          {
            id: 'product-list-view-settings-id',
          },
        ]
      );
    });
  });
});

describe('selectProductTypeOfCurrentProduct', () => {
  const state = createProductsState({
    currentVisible: {
      productType: {
        obj: {
          id: 'product-type-id',
        },
      },
    },
  });

  it('should select the product-type of the current visible product', () => {
    expect(selectProductTypeOfCurrentProduct(state)).toEqual({
      id: 'product-type-id',
    });
  });
});

describe('selectCurrentProduct', () => {
  it('should return the current product', () => {
    const { products } = createProductsState({
      currentVisible: { id: 'p1' },
    });

    expect(selectCurrentProduct.resultFunc(products)).toEqual({
      id: 'p1',
    });
  });
});

describe('selectProductListViewSettings', () => {
  const productsState = {
    productListViewSettings: {
      foo: 'bar',
      list_columns: [
        {
          key: 'name',
          visible: true,
          position: 0,
        },
        {
          key: 'id',
          visible: false,
          position: 1,
        },
        {
          key: 'color',
          isCustom: true,
          visible: true,
          position: 2,
        },
        {
          key: 'size',
          isCustom: true,
          visible: false,
          position: 3,
        },
      ],
    },
  };
  const attributeDefinitions = {
    'a-1': { name: 'a-1' },
    'a-2': { name: 'a-2' },
  };

  // enhance the settings with the attributes from the current search results
  it('should return the current product settings', () => {
    expect(
      selectProductListViewSettings.resultFunc(
        productsState,
        attributeDefinitions
      )
    ).toEqual({
      foo: 'bar', // <-- just to ensure we are merging correctly
      list_columns: [
        { key: 'name', visible: true, position: 0 },
        { key: 'id', visible: false, position: 1 },
        { key: 'color', isCustom: true, visible: true, position: 2 },
        { key: 'size', isCustom: true, visible: false, position: 3 },
        { key: 'a-1', isCustom: true, visible: false, position: 4 },
        { key: 'a-2', isCustom: true, visible: false, position: 5 },
      ],
    });
  });
});

describe('selectTransformedFilterSettings', () => {
  const options = {
    language: 'en',
  };
  describe('with normalized product settings', () => {
    let productListViewSettingsList;

    beforeEach(() => {
      productListViewSettingsList = {
        foo: 'bar',
        status: ['published'],
        customAttributes: [
          {
            label: {
              en: 'foo-label',
            },
            name: 'foo-name',
            type: 'enum',
            values: [
              {
                key: 'three',
                label: 'foo-attribute-label',
              },
            ],
          },
        ],
      };
    });

    it('should return the current product settings as where predicates', () => {
      const attributePredicates =
        'attributes(name="foo-name" and value(key in ("three")))';
      expect(
        selectTransformedFilterSettings.resultFunc(
          options,
          productListViewSettingsList
        )
      ).toEqual(
        `(masterVariant(${attributePredicates}) or variants(${attributePredicates})) and published=true`
      );
    });
  });

  describe('with empty product settings', () => {
    it('should return `null`', () => {
      expect(selectTransformedFilterSettings.resultFunc(options, {})).toBe(
        null
      );
    });
  });
});

describe('selectTransformedFilterSettingsWithSelectedProducts', () => {
  const options = {
    language: 'en',
  };
  const productListViewSettingsList = {};
  let selectedProductIds;
  describe('with selected product ids', () => {
    beforeEach(() => {
      selectedProductIds = ['1', '2'];
    });
    it('should return a `where` predicate with the ids', () => {
      expect(
        selectTransformedFilterSettingsWithSelectedProducts.resultFunc(
          options,
          productListViewSettingsList,
          selectedProductIds
        )
      ).toBe(`id in ("1", "2")`);
    });
  });
  describe('without selected product ids', () => {
    beforeEach(() => {
      selectedProductIds = [];
    });
    it('should not return a `where` predicate', () => {
      expect(
        selectTransformedFilterSettingsWithSelectedProducts.resultFunc(
          options,
          productListViewSettingsList,
          selectedProductIds
        )
      ).toBe(null);
    });
  });
});

describe('selectHasNestedAttribute', () => {
  let productListViewSettings;
  let hasNestedAttribute;
  const createListViewSettings = (customAttributes = []) => ({
    filter_customAttributes: customAttributes,
  });
  describe('with attribute filter of type `nested` applied', () => {
    beforeEach(() => {
      productListViewSettings = createListViewSettings([
        {
          type: 'nested',
          name: 'attribute-type-nested',
        },
      ]);
      hasNestedAttribute = selectHasNestedAttribute.resultFunc(
        productListViewSettings
      );
    });
    it('should return `true`', () => {
      expect(hasNestedAttribute).toBe(true);
    });
  });
  describe('with any other type', () => {
    beforeEach(() => {
      const customAttributes = [
        'number',
        'boolean',
        'money',
        'text',
        'ltext',
        'enum',
        'lenum',
        'reference',
      ].map(type => ({ type, name: type }));
      productListViewSettings = createListViewSettings(customAttributes);
      hasNestedAttribute = selectHasNestedAttribute.resultFunc(
        productListViewSettings
      );
    });
    it('should return `false`', () => {
      expect(hasNestedAttribute).toBe(false);
    });
  });

  describe('without customAttribtues', () => {
    beforeEach(() => {
      productListViewSettings = createListViewSettings(undefined);
      hasNestedAttribute = selectHasNestedAttribute.resultFunc(
        productListViewSettings
      );
    });
    it('should return false', () => {
      expect(hasNestedAttribute).toBe(false);
    });
  });
});

describe('selectInitialProductStates', () => {
  it('should select initial product states (empty)', () => {
    const withoutProductStates = { initialProductStates: undefined };
    expect(selectInitialProductStates.resultFunc(withoutProductStates)).toEqual(
      []
    );
  });

  it('should select initial product states', () => {
    const withProductStates = {
      initialProductStates: { count: 1, results: [{ id: '1' }] },
    };
    expect(selectInitialProductStates.resultFunc(withProductStates)).toEqual([
      { id: '1' },
    ]);
  });
});

describe('selectProductStates', () => {
  describe('with product states', () => {
    const productStates = { count: 1, results: [{ id: '1' }] };
    const products = { productStates };

    it('should select the results of the product states', () => {
      expect(selectProductStates.resultFunc(products)).toEqual(
        productStates.results
      );
    });
  });

  describe('without product states', () => {
    const products = { productStates: null };

    it('should return an empty array', () => {
      expect(selectProductStates.resultFunc(products)).toEqual([]);
    });
  });
});

describe('selectTotalProductStates', () => {
  describe('with product states', () => {
    const productStates = { count: 1, results: [{ id: '1' }], total: 13 };
    const products = { productStates };

    it('should select the total of the product states', () => {
      expect(selectTotalProductStates.resultFunc(products)).toEqual(
        productStates.total
      );
    });
  });

  describe('without product states', () => {
    const products = { productStates: null };

    it('should return zero', () => {
      expect(selectTotalProductStates.resultFunc(products)).toEqual(0);
    });
  });
});

describe('selectRecommendedCategories', () => {
  it('should return the recommended categories', () => {
    const recommendedCategories = [{ id: 'cat-1' }, { id: 'cat-2' }];
    const currentProduct = { id: recommendedCategories[0].id };
    const { products } = createProductsState({
      recommendedCategories: {
        categories: {
          [currentProduct.id]: recommendedCategories,
        },
      },
    });

    expect(
      selectRecommendedCategories.resultFunc(products, currentProduct)
    ).toEqual(recommendedCategories);
  });
});

describe('selectProductTypesForAttributes', () => {
  const { products } = createProductsState({
    productTypesForAttributes: { results: [{ id: '1' }] },
  });
  it('should return list of product types', () => {
    expect(selectProductTypesForAttributes.resultFunc(products)).toEqual([
      { id: '1' },
    ]);
  });
});

describe('selectProductTypesForFilter', () => {
  const state = createProductsState({
    productTypesForFilter: { results: [{ id: '1' }] },
  });
  it('should return list of product types', () => {
    expect(selectProductTypesForFilter(state)).toEqual([{ id: '1' }]);
  });
});

describe('selectDraft', () => {
  const { products } = createProductsState({
    draft: { a: 'foo' },
  });
  it('should return the draft of products', () => {
    expect(selectDraft.resultFunc(products)).toEqual(products.draft);
  });
});

describe('selectTotalProductTypesForFilter', () => {
  const { products } = createProductsState({
    productTypesForFilter: { results: [{ id: '1' }], total: 23 },
  });
  it('should return total of product types', () => {
    expect(selectTotalProductTypesForFilter.resultFunc(products)).toEqual(
      products.productTypesForFilter.total
    );
  });
});

describe('selectCheckedProducts', () => {
  const state = createProductsState({
    selectedIds: ['2', '4'],
    currentQueryResult: {
      results: [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }],
    },
  });
  it('should return the list of checked products', () => {
    expect(selectCheckedProducts(state)).toEqual([{ id: '2' }, { id: '4' }]);
  });
});

describe('selectSetAttributeValuesOfSelectedProducts', () => {
  const state = createProductsState({
    selectedIds: ['1', '2'],
    currentQueryResult: {
      results: [
        {
          id: '1',
          name: {
            en: 'Pillow',
          },
          masterVariant: {
            attributes: [
              {
                name: 'theme',
                value: 'German flag',
              },
              {
                name: 'material',
                value: ['foam', 'tissue', 'metal'],
              },
              {
                name: 'color',
                value: ['black', 'yellow', 'red'],
              },
            ],
          },
          variants: [
            {
              attributes: [
                {
                  name: 'theme',
                  value: 'Brazil flag',
                },
                {
                  name: 'material',
                  value: ['foam', 'tissue', 'metal'],
                },
                {
                  name: 'color',
                  value: ['green', 'yellow', 'blue'],
                },
              ],
            },
          ],
        },
        {
          id: '2',
          name: {
            en: 'Fork',
          },
          masterVariant: {
            attributes: [
              {
                name: 'material',
                value: ['metal', 'plastic'],
              },
              {
                name: 'color',
                value: ['white'],
              },
            ],
          },
          variants: [
            {
              attributes: [
                {
                  name: 'material',
                  value: ['metal', 'plastic'],
                },
                {
                  name: 'color',
                  value: ['gray', 'white', 'pink', 'blue'],
                },
              ],
            },
          ],
        },
      ],
    },
  });

  const attributeNames = ['material'];

  it('should return the list of set attributes SameForAll values', () => {
    expect(
      selectSetAttributeValuesOfSelectedProducts(state, attributeNames)
    ).toEqual({ material: ['foam', 'tissue', 'metal', 'plastic'] });
  });
});

describe('selectViewMode', () => {
  const state = createProductsState();
  it('should return the current view mode', () => {
    expect(selectViewMode(state)).toBe(VIEW_MODES.PRODUCTS_LIST);
  });
});

describe('selectProductTypesOfCheckedProducts', () => {
  const products = [
    { id: '1', productType: { obj: { id: '1' } } },
    { id: '2', productType: { obj: { id: '2' } } },
    { id: '3', productType: { obj: { id: '3' } } },
    { id: '4', productType: { obj: { id: '1' } } },
    { id: '5', productType: { obj: { id: '2' } } },
    { id: '6', productType: { obj: { id: '3' } } },
  ];
  const state = createProductsState({
    currentQueryResult: {
      results: products,
    },
    selectedIds: ['1', '2', '3', '4', '5', '6'],
  });
  it('should return product types without duplicates', () => {
    expect(selectProductTypesOfCheckedProducts(state)).toEqual([
      { id: '1' },
      { id: '2' },
      { id: '3' },
    ]);
  });
});

describe('selectCheckSelectionIds', () => {
  const state = createProductsState({
    selectedIds: ['1', '2'],
  });
  it('should return list of selected IDs', () => {
    expect(selectCheckSelectionIds(state)).toEqual(['1', '2']);
  });
});

describe('selectMonitoredCategoriesRecommendationAttribute', () => {
  const attribute = { name: 'foo', value: 'bar' };
  const state = createProductsState({
    currentVisible: {
      masterVariant: {
        attributes: [attribute],
      },
    },
  });

  it('should return monitored attribute', () => {
    const categoryRecommendationSettings = {
      searchProperty: RECOMMENDED_CATEGORIES_SEARCH_PROPERTIES.Attribute,
      attributeName: attribute.name,
    };
    expect(
      selectMonitoredCategoriesRecommendationAttribute(
        state,
        categoryRecommendationSettings
      )
    ).toBe(attribute);
  });

  it('should return undefined because no attribute was found', () => {
    expect(selectMonitoredCategoriesRecommendationAttribute(state)).toBe(
      undefined
    );
  });

  it('should return undefined because the attribute did not match', () => {
    const categoryRecommendationSettings = {
      searchProperty: RECOMMENDED_CATEGORIES_SEARCH_PROPERTIES.Attribute,
      attributeName: 'wrong',
    };
    expect(
      selectMonitoredCategoriesRecommendationAttribute(
        state,
        categoryRecommendationSettings
      )
    ).toBe(undefined);
  });
});

describe('selectCanClearSettings', () => {
  it('should return true when settings differ', () => {
    expect(
      selectCanClearSettings.resultFunc({
        [PRODUCT_SEARCH_SORTING]: [{ key: 'lastModifiedAt', order: 'asc' }],
        [PRODUCT_SEARCH_TEXT]: 'hello world',
      })
    ).toBe(true);
  });

  it('should return false when settings are equal', () => {
    expect(
      selectCanClearSettings.resultFunc({
        // Just to make sure it's a different reference
        ...defaultClearedSettings,
      })
    ).toBe(false);
  });
});

describe('selectHasActiveProductFilters', () => {
  const filtersToCheck = [
    PRODUCT_SEARCH_FILTER_PRODUCT_TYPE,
    PRODUCT_SEARCH_FILTER_MISSING,
    PRODUCT_SEARCH_FILTER_CATEGORIES,
    PRODUCT_SEARCH_FILTER_STATUS,
    PRODUCT_SEARCH_FILTER_STATES,
    PRODUCT_SEARCH_FILTER_ATTRIBUTES,
  ];

  filtersToCheck.forEach(key => {
    describe(`${key}`, () => {
      describe('when there is an active filter', () => {
        it(`should return true`, () => {
          expect(
            selectHasActiveProductFilters.resultFunc({
              // The value itself does not matter, we just want to know
              // if the array is empty or not
              [key]: [{ foo: 'bar' }],
            })
          ).toBe(true);
        });
      });

      describe('when there is no active product filter', () => {
        it('should have return false', () => {
          expect(selectHasActiveProductFilters.resultFunc({ [key]: [] })).toBe(
            false
          );
        });
      });

      describe('when there are no filters', () => {
        it('should return false', () => {
          expect(
            selectHasActiveProductFilters.resultFunc({ [key]: null })
          ).toBe(false);
        });
      });
    });
  });
});

describe('selectUniqueProductTypesOfSearchResults', () => {
  it('should return a unique list of product types', () => {
    expect(
      selectUniqueProductTypesOfSearchResults.resultFunc([
        { productType: { obj: { id: '1' } } },
        { productType: { obj: { id: '1' } } },
        { productType: { obj: { id: '2' } } },
        { productType: { obj: { id: '2' } } },
        { productType: { obj: { id: '3' } } },
      ])
    ).toEqual([{ id: '1' }, { id: '2' }, { id: '3' }]);
  });
  it('should filter out empty product types', () => {
    expect(
      selectUniqueProductTypesOfSearchResults.resultFunc([
        { productType: { obj: { id: '1' } } },
        { productType: { obj: undefined } },
        { productType: { obj: { id: '2' } } },
      ])
    ).toEqual([{ id: '1' }, { id: '2' }]);
  });
});

describe('selectUniqueAttributesOfSearchResults', () => {
  it('should return a map of unique attributes by name', () => {
    expect(
      selectUniqueAttributesOfSearchResults.resultFunc([
        {
          id: '1',
          attributes: [{ name: 'a-1' }, { name: 'a-2' }, { name: 'a-3' }],
        },
        {
          id: '2',
          attributes: [{ name: 'a-1' }],
        },
        {
          id: '3',
          attributes: [{ name: 'a-1' }, { name: 'a-2' }, { name: 'a-3' }],
        },
      ])
    ).toEqual({
      'a-1': { name: 'a-1' },
      'a-2': { name: 'a-2' },
      'a-3': { name: 'a-3' },
    });
  });
});

describe('selectProductListColumns', () => {
  it('should return a list of visible columns', () => {
    expect(
      selectProductListColumns.resultFunc(
        {
          'a-1': { name: 'a-1' },
          'a-2': { name: 'a-2' },
          'a-3': { name: 'a-3' },
        },
        {
          list_columns: [
            { key: 'name' },
            { key: 'a-1', isCustom: true },
            { key: 'description' },
            { key: 'a-2', isCustom: true },
            { key: 'a-3', isCustom: true },
            { key: 'a-4', isCustom: true },
            { key: 'a-5', isCustom: true },
          ],
        }
      )
    ).toEqual([
      { key: 'name' },
      { key: 'a-1', isCustom: true, attributeDefinition: { name: 'a-1' } },
      { key: 'description' },
      { key: 'a-2', isCustom: true, attributeDefinition: { name: 'a-2' } },
      { key: 'a-3', isCustom: true, attributeDefinition: { name: 'a-3' } },
    ]);
  });
});

describe('selectProductListViewSettingsList', () => {
  const state = createProductsState({
    productListViewSettingsList: [{ id: 'product-setting-1' }],
  });

  it('should select productListViewSettingsList', () => {
    expect(selectProductListViewSettingsList(state)).toEqual([
      { id: 'product-setting-1' },
    ]);
  });
});
