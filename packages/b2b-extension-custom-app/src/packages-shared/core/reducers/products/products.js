import flatMap from 'lodash.flatmap';
import uniqBy from 'lodash.uniqby';
import uniqWith from 'lodash.uniqwith';
import { deepEqual } from 'fast-equals';
import { createSelector } from 'reselect';
import { createSyncProducts } from '@commercetools/sync-actions';
import { reportErrorToSentry } from '@commercetools-frontend/sentry';
import createResourceReducer from '../../../utils/create-resource-reducer';
import shallowEqual from '../../../utils/shallow-equal';
import {
  splitVariantAttributesByConstraint,
  normalizeProductSettings,
} from '../../../utils/products';
import { transformFilterSettingsToWherePredicate } from '../../../utils/transform-filter-settings-to-where-predicate';
import {
  SET_VISIBLE_PRODUCT,
  PRODUCT_MASTER_VARIANT_CHANGED,
  PRODUCT_STATE_TRANSITIONED,
  INITIAL_PRODUCT_STATES_FETCHED,
  PRODUCT_STATES_FETCHED,
  PRODUCT_SET_DRAFT,
  RECOMMENDED_CATEGORIES_FETCHED,
  RECOMMENDED_CATEGORIES_STATUS,
  PRODUCT_TYPES_FOR_FILTER_FETCHED,
  PRODUCT_TYPES_FOR_ATTRIBUTES_FETCHED,
  SET_ACTIVE_PRODUCT_LIST_VIEW_SETTINGS,
  SET_VIEW_MODE,
  VIEW_MODES,
  PRODUCT_SET_CHECK_SELECTION,
  PRODUCT_SET_ALL_CHECK_SELECTION,
  PRODUCT_UPDATED_WITH_IMAGE_UPLOAD,
  PRODUCT_IMAGE_UPLOADED,
  RECOMMENDED_CATEGORIES_SEARCH_PROPERTIES as SEARCH_PROPERTIES,

  // Filter keys
  PRODUCT_SEARCH_TEXT,
  PRODUCT_SEARCH_SORTING,
  PRODUCT_SEARCH_PAGE,
  PRODUCT_SEARCH_FILTER_PRODUCT_TYPE,
  PRODUCT_SEARCH_FILTER_ATTRIBUTES,
  PRODUCT_SEARCH_FILTER_CATEGORIES,
  PRODUCT_SEARCH_FILTER_MISSING,
  PRODUCT_SEARCH_FILTER_STATUS,
  PRODUCT_SEARCH_FILTER_STATES,

  // Product settings
  SET_PRODUCT_LIST_VIEW_SETTINGS_LIST,
  ADD_PRODUCT_LIST_VIEW_SETTINGS_TO_LIST,
  REMOVE_PRODUCT_LIST_VIEW_SETTINGS_FROM_LIST,

  // Attribute constraints
  ATTRIBUTE_CONSTRAINTS,
} from '../../constants';

export const defaultSorting = {
  key: 'createdAt',
  order: 'desc',
};
export const defaultClearedSettings = {
  [PRODUCT_SEARCH_FILTER_CATEGORIES]: [],
  [PRODUCT_SEARCH_FILTER_ATTRIBUTES]: [],
  [PRODUCT_SEARCH_FILTER_MISSING]: [],
  [PRODUCT_SEARCH_FILTER_PRODUCT_TYPE]: [],
  [PRODUCT_SEARCH_FILTER_STATUS]: [],
  [PRODUCT_SEARCH_FILTER_STATES]: [],
  [PRODUCT_SEARCH_TEXT]: '',
  [PRODUCT_SEARCH_PAGE]: 1,
  [PRODUCT_SEARCH_SORTING]: [defaultSorting],
};

// Utility functions

export const canClearSettings = settings =>
  !deepEqual(defaultClearedSettings, settings);

const hasFilterValue = (object, key) =>
  object && Array.isArray(object[key]) && object[key].length > 0;

export const hasActiveProductFilters = settings =>
  Boolean(
    hasFilterValue(settings, PRODUCT_SEARCH_FILTER_PRODUCT_TYPE) ||
      hasFilterValue(settings, PRODUCT_SEARCH_FILTER_MISSING) ||
      hasFilterValue(settings, PRODUCT_SEARCH_FILTER_CATEGORIES) ||
      hasFilterValue(settings, PRODUCT_SEARCH_FILTER_STATUS) ||
      hasFilterValue(settings, PRODUCT_SEARCH_FILTER_STATES) ||
      hasFilterValue(settings, PRODUCT_SEARCH_FILTER_ATTRIBUTES)
  );

function mergeProductWithProjection(payload) {
  // We need to manually merge those because the API doesn't return
  // the projection after a create / update.
  // See https://sphere.atlassian.net/browse/CTP-191
  const {
    id,
    key,
    version,
    createdAt,
    lastModifiedAt,
    productType,
    taxCategory,
    state,
    masterData: { published, hasStagedChanges, staged },
  } = payload;

  return {
    id,
    key,
    version,
    createdAt,
    lastModifiedAt,
    productType,
    taxCategory,
    state,
    published,
    hasStagedChanges,
    ...staged,
  };
}

// Reducer

const productsReducer = createResourceReducer({
  constantsPrefix: {
    plural: 'PRODUCTS',
    single: 'PRODUCT',
  },
  mergeData: mergeProductWithProjection,
  customHandlers: {
    [PRODUCT_SET_DRAFT]: (state, { payload }) => ({ draft: payload }),

    [PRODUCT_IMAGE_UPLOADED]: (_, { payload }) => ({
      currentVisible: payload.product,
    }),

    [PRODUCT_UPDATED_WITH_IMAGE_UPLOAD]: (_, { payload }) => ({
      currentVisible: mergeProductWithProjection(payload.product),
    }),

    [SET_VISIBLE_PRODUCT]: (_, { payload }) => ({
      currentVisible: mergeProductWithProjection(payload),
    }),

    [PRODUCT_MASTER_VARIANT_CHANGED]: (_, { payload }) => ({
      currentVisible: mergeProductWithProjection(payload),
    }),

    [PRODUCT_STATE_TRANSITIONED]: (_, { payload }) => ({
      currentVisible: mergeProductWithProjection(payload),
    }),

    [INITIAL_PRODUCT_STATES_FETCHED]: (_, { payload }) => ({
      initialProductStates: payload,
    }),

    [PRODUCT_STATES_FETCHED]: (_, { payload }) => ({ productStates: payload }),

    [PRODUCT_TYPES_FOR_FILTER_FETCHED]: (_, { payload }) => ({
      productTypesForFilter: payload,
    }),

    [PRODUCT_TYPES_FOR_ATTRIBUTES_FETCHED]: (_, { payload }) => ({
      productTypesForAttributes: payload,
    }),

    [RECOMMENDED_CATEGORIES_FETCHED]: (state, { payload }) => ({
      recommendedCategories: {
        categories: {
          ...state.recommendedCategories.categories,
          [payload.id]: payload.recommendedCategories,
        },
      },
    }),
    [RECOMMENDED_CATEGORIES_STATUS]: (state, { payload }) => ({
      recommendedCategoriesStatus: payload,
    }),
    [SET_ACTIVE_PRODUCT_LIST_VIEW_SETTINGS]: (state, { payload }) => ({
      productListViewSettings: payload,
    }),
    [SET_VIEW_MODE]: (state, { payload }) => {
      if (Object.values(VIEW_MODES).includes(payload))
        return { view: { ...state.view, mode: payload } };
      reportErrorToSentry(new Error('Unsupported view mode'), {
        extra: payload,
      });
      return state;
    },

    [PRODUCT_SET_CHECK_SELECTION]: (state, { payload }) => {
      const { id, checked } = payload;
      return {
        selectedIds: checked
          ? [...state.selectedIds, id]
          : state.selectedIds.filter(existingId => existingId !== id),
      };
    },
    [PRODUCT_SET_ALL_CHECK_SELECTION]: (state, { payload }) => {
      const { ids, checked } = payload;
      return {
        selectedIds: checked ? ids : [],
      };
    },

    [SET_PRODUCT_LIST_VIEW_SETTINGS_LIST]: (_, action) => ({
      productListViewSettingsList: action.payload,
    }),

    [ADD_PRODUCT_LIST_VIEW_SETTINGS_TO_LIST]: (state, action) => ({
      productListViewSettingsList: [
        ...state.productListViewSettingsList,
        {
          id: action.payload.id,
          obj: action.payload,
        },
      ],
    }),

    [REMOVE_PRODUCT_LIST_VIEW_SETTINGS_FROM_LIST]: (state, action) => ({
      productListViewSettingsList: state.productListViewSettingsList.filter(
        productListViewSettings => productListViewSettings.id !== action.payload
      ),
    }),
  },
  initialState: {
    productListViewSettingsList: [],
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
    view: {
      mode: VIEW_MODES.PRODUCTS_LIST,
    },
  },
});

export default function(state, action) {
  const newState = {
    ...productsReducer(state, action),
    // Since both files are importing from each other, there is a concurrency
    // issue, causing the first one to import nothing as the other one did not
    // export anything yet. For now just import the file on runtime.
    // eslint-disable-next-line global-require
    bulk: require('../bulk').default(state && state.bulk, action),
  };

  // In case state didn't change after applying reducers, return previouse one
  if (state && newState && shallowEqual(state, newState)) return state;

  return newState;
}

// Selectors

// TODO: remove it once we migrate to plugin
const selectProductSlice = state => state.products;

export const selectCurrentProduct = createSelector(
  selectProductSlice,
  products => products.currentVisible
);

export const selectRecommendedCategories = createSelector(
  selectProductSlice,
  selectCurrentProduct,
  (products, currentProduct) =>
    products.recommendedCategories.categories[currentProduct.id] || []
);

export function selectSkuByVariantIndex(state, variantIndex) {
  const product = selectCurrentProduct(state);

  if (variantIndex === 0) return null;

  if (variantIndex === 1) return product.masterVariant.sku;

  const realVariantIndex = variantIndex - 2;
  const variant = product.variants[realVariantIndex];

  if (!variant) return null;

  return variant.sku;
}

export const selectTotalProducts = state =>
  state.products.currentQueryResult.total;

export const selectProductsCount = state =>
  state.products.currentQueryResult.count;

export const selectProducts = state =>
  state.products.currentQueryResult.results;

export const selectProductIds = createSelector(selectProducts, products =>
  products.map(product => product.id)
);

export const selectUniqueProductTypesOfSearchResults = createSelector(
  selectProducts,
  products =>
    uniqBy(
      products.map(product => product.productType.obj),
      'id'
    )
      // Whenever a product and its corresponding product type is deleted we can
      // get to this situation where the product is still returned from ES
      // but the product type is not returned anymore from the API.
      .filter(Boolean)
);

export const selectUniqueAttributesOfSearchResults = createSelector(
  selectUniqueProductTypesOfSearchResults,
  productTypes => {
    const allAttributes = flatMap(
      productTypes,
      productType => productType.attributes
    );

    return allAttributes.reduce(
      (acc, attribute) => ({
        ...acc,
        [attribute.name]: attribute,
      }),
      {}
    );
  }
);

// Note: this is a quick workaround to make this work (MC-1828).
// In the column selector, if there are no attributes in the settings yet,
// no attributes will be shown. Instead, attribute from the current search
// results should be listed, even if they are not in the settings yet.
//
// The workaround here is to do the following:
// - get all the attributes from currently visible product types
// - get all the attributes from the settings
// - filter out from the first list of attributes the one already
// present in the settings
// - merge the "missing" attributes into the settings list
// - return the updated settings list
export const selectProductListViewSettings = createSelector(
  selectProductSlice,
  selectUniqueAttributesOfSearchResults,
  (products, attributeDefinitions) => {
    const { productListViewSettings } = products;
    if (!productListViewSettings) return undefined;

    const incompleteListColumns = productListViewSettings.list_columns;
    // Get a list of the attribute names currently present in the settings
    const attributesNamesInColumns = incompleteListColumns
      .filter(col => col.isCustom)
      .map(col => col.key);
    // Get a list of the attribute names from the product's search results
    const attributeNames = Object.keys(attributeDefinitions);
    // Filter out attributes from the product's search results that are
    // already present in the settings
    const missingAttributeNames = attributeNames.filter(
      attributeName => !attributesNamesInColumns.includes(attributeName)
    );
    // Append the missing attributes to the list from current settings
    const completeListColumns = incompleteListColumns.concat(
      // Return a correct `column` shape for the missing attributes
      missingAttributeNames.map((attributeName, index) => ({
        key: attributeName,
        isCustom: true,
        visible: false,
        position: incompleteListColumns.length + index,
      }))
    );
    return {
      ...productListViewSettings,
      list_columns: completeListColumns,
    };
  }
);

export const selectHasNestedAttribute = createSelector(
  selectProductListViewSettings,
  productListViewSettings => {
    const normalizedProductSettings = normalizeProductSettings(
      productListViewSettings
    );
    return normalizedProductSettings.customAttributes
      ? normalizedProductSettings.customAttributes.some(
          attributeFilter => attributeFilter.type === 'nested'
        )
      : false;
  }
);

export const selectTransformedFilterSettings = createSelector(
  (_, language) => language,
  selectProductListViewSettings,
  (language, productSettings) =>
    transformFilterSettingsToWherePredicate(
      normalizeProductSettings(productSettings),
      {
        language,
      }
    )
);

export const selectTransformedFilterSettingsWithSelectedProducts = createSelector(
  (_, language) => language,
  selectProductListViewSettings,
  selectCheckSelectionIds,
  (language, productSettings, selectedProductIds) =>
    transformFilterSettingsToWherePredicate(
      {
        selectedProductIds,
      },
      {
        language,
      }
    )
);

export const selectProductListColumns = createSelector(
  selectUniqueAttributesOfSearchResults,
  selectProductListViewSettings,
  (attributeDefinitions, settings) => {
    const attributeNames = Object.keys(attributeDefinitions);
    if (!settings) return [];
    return (
      settings.list_columns
        // Filter out only attributes that are not in the search results
        .filter(column =>
          column.isCustom ? attributeNames.includes(column.key) : true
        )
        // Enhance the column setting with the attribute definition
        .map(column => ({
          ...column,
          ...(column.isCustom
            ? { attributeDefinition: attributeDefinitions[column.key] }
            : {}),
        }))
    );
  }
);

export const selectCanClearSettings = createSelector(
  selectProductListViewSettings,
  settings => canClearSettings(settings)
);

export const selectHasActiveProductFilters = createSelector(
  selectProductListViewSettings,
  settings => hasActiveProductFilters(settings)
);

export const selectInitialProductStates = createSelector(
  selectProductSlice,
  products =>
    products.initialProductStates ? products.initialProductStates.results : []
);

export const selectProductStates = createSelector(
  selectProductSlice,
  products => (products.productStates ? products.productStates.results : [])
);

export const selectTotalProductStates = createSelector(
  selectProductSlice,
  products => (products.productStates ? products.productStates.total : 0)
);

export const selectProductTypesForAttributes = createSelector(
  selectProductSlice,
  products => products.productTypesForAttributes.results
);

export const selectProductTypesForFilter = createSelector(
  selectProductSlice,
  products => products.productTypesForFilter.results
);

export const selectTotalProductTypesForFilter = createSelector(
  selectProductSlice,
  products => products.productTypesForFilter.total
);

export const selectDraft = createSelector(
  selectProductSlice,
  products => products.draft
);

export const selectAttributeDefinitons = createSelector(
  selectCurrentProduct,
  selectDraft,
  (product, draft) =>
    splitVariantAttributesByConstraint(
      draft,
      ATTRIBUTE_CONSTRAINTS.SAME_FOR_ALL
    )
);

export const selectProductAttributeDefinitions = createSelector(
  selectAttributeDefinitons,
  ([productAttributeDefinitions]) => productAttributeDefinitions
);

export const selectVariantAttributeDefinitions = createSelector(
  selectAttributeDefinitons,
  ([, /* ignore */ variantAttributeDefinitions]) => variantAttributeDefinitions
);

export const selectProductTypeOfCurrentProduct = createSelector(
  selectCurrentProduct,
  currentProduct => currentProduct.productType.obj
);

const sync = createSyncProducts();
const isDraftMatchingProduct = (draft, product) =>
  draft && product && draft.id === product.id;
export const selectUpdateActions = createSelector(
  selectCurrentProduct,
  selectDraft,
  selectProductAttributeDefinitions,
  (product, draft, productAttributeDefinitions) =>
    // Update actions should only be computed for a matching
    // draft and visible product.
    isDraftMatchingProduct(draft, product)
      ? sync.buildActions(draft, product, {
          sameForAllAttributeNames: productAttributeDefinitions.map(
            productAttributeDefinition => productAttributeDefinition.name
          ),
        })
      : []
);

export const selectCheckedProducts = createSelector(
  selectProducts,
  selectCheckSelectionIds,
  (products, selectedIds) =>
    products.filter(product => selectedIds.includes(product.id))
);

export function selectViewMode(state) {
  return state.products.view.mode;
}

export const selectProductTypesOfCheckedProducts = createSelector(
  selectCheckedProducts,
  products =>
    uniqBy(
      products.map(product => product.productType.obj),
      'id'
    )
);

export function selectCheckSelectionIds(state) {
  return selectProductSlice(state).selectedIds;
}

export const selectProductListViewSettingsList = createSelector(
  selectProductSlice,
  products => products.productListViewSettingsList
);

export const selectMonitoredCategoriesRecommendationAttribute = createSelector(
  selectCurrentProduct,
  (state, categoryRecommendationSettings) => categoryRecommendationSettings,
  (currentProduct, categoryRecommendationSettings) => {
    // Select from the current product (not draft!) the attribute that
    // matches the one configured for the recommended categories setting.
    // If no setting is defined or the setting type is not `attribute`,
    // leave the `monitoried` attribute empty.
    // If there is an attribute to monitor, and the attribute changes
    // (after saving the product), notify `RecommendedCategories` component
    // to force a refetch of the recommended categories.
    let monitoredRecommendationAttribute;
    if (
      categoryRecommendationSettings &&
      categoryRecommendationSettings.searchProperty ===
        SEARCH_PROPERTIES.Attribute
    ) {
      const categoryRecommendationSettingsAttributeName =
        categoryRecommendationSettings.attributeName;

      monitoredRecommendationAttribute = categoryRecommendationSettingsAttributeName
        ? currentProduct.masterVariant.attributes.find(
            ({ name }) => name === categoryRecommendationSettingsAttributeName
          )
        : undefined;
    }

    return monitoredRecommendationAttribute;
  }
);

// selectSetAttributeValuesOfSelectedProducts
//
// Collect values that can be removed from the products that were selected
// for bulk updating.
// We need to iterate over all the selected products and collect the current
// values for the given attributeNames
//
// Example:
// You only sell super leightweight shoes and you really want to let
// people now that your shoes are super leightweight. That's why you have
// "super leightweight" this as one of the product highlights for each of
// your shoes.
// But now you notice that you misspelled "super leightweigth".
// You need to remove this hightlight from all your shoes and add it again
// afterwards without any typos:
// - You select three shoes to bulk update.
// - You want to remove a the highlight text "super leightweigth" from all
//   three shoes since you misspelled leightweight
// - When bulk updating the highlight attribute you want to have a list of
//   all current highlights to choose from.
// - You can select "super leightweigth" in that list as a value of the
//   highlight attribute you want to remove from the selected shoes.
export const selectSetAttributeValuesOfSelectedProducts = createSelector(
  selectCheckedProducts,
  (state, attributeNames) => attributeNames,
  (selectedProducts, attributeNames) => {
    const attributeValues = attributeNames.reduce(
      (valuesMap, attributeName) => ({ ...valuesMap, [attributeName]: [] }),
      {}
    );

    selectedProducts.forEach(product => {
      product.masterVariant.attributes.forEach(attribute => {
        if (attributeNames.includes(attribute.name))
          attributeValues[attribute.name] = attributeValues[
            attribute.name
          ].concat(attribute.value);
      });
    });

    return Object.keys(attributeValues).reduce(
      (valuesByName, key) => ({
        ...valuesByName,
        [key]: uniqWith(attributeValues[key], deepEqual),
      }),
      {}
    );
  }
);

export const selectVisibleProductListColumns = createSelector(
  selectProductListViewSettings,
  productListViewSettings =>
    productListViewSettings
      ? productListViewSettings.list_columns.filter(column => column.visible)
      : []
);
