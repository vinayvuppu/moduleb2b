import { encode } from 'qss';
import oneLineTrim from 'common-tags/lib/oneLineTrim';
import { createRequestBuilder } from '@commercetools/api-request-builder';
import pick from 'lodash.pick';
import { defaultMemoize } from 'reselect';
import { hideAllPageNotifications } from '@commercetools-frontend/actions-global';
import { actions as sdkActions } from '@commercetools-frontend/sdk';
import { MC_API_PROXY_TARGETS } from '@commercetools-frontend/constants';
import RequestCache from '@commercetools-local/utils/request-cache';
import { sortRequiresLanguage } from '@commercetools-local/utils/products';
import {
  PRODUCTS_FETCHED,
  PRODUCT_SET_CHECK_SELECTION,
  PRODUCT_SET_ALL_CHECK_SELECTION,
  PRODUCT_FETCHED,
  PRODUCT_UPDATED,
  SET_VISIBLE_PRODUCT,
  PRODUCT_STATE_TRANSITIONED,
  PRODUCT_TYPE_SETTINGS_FETCHED,
  PRODUCT_SET_DRAFT,
  SET_VIEW_MODE,
  PRODUCT_UPDATED_WITH_IMAGE_UPLOAD,
  PRODUCT_IMAGE_UPLOADED,
} from '../../constants';
import { selectCurrentProduct } from '../../reducers/products';
import {
  getProductTypesFilterQuery,
  getCategoriesFilterQuery,
  getStateQueryFilter,
  getCustomAttributesFilterQuery,
  getSortingFilters,
  getStatusFilterQueries,
} from '../../../utils/queries';

export function setViewMode(options = {}) {
  return {
    type: SET_VIEW_MODE,
    payload: options.viewMode,
  };
}

const fetchProductsCache = new RequestCache();

// The callees call fetchProducts with options containing irrelevant data
// This busts the cache when unrelated options have changed, which is bad.
// By picking omiting those unrelevant options the cache stays alive longer.
// Memoized so that the cache can return early using referential equality checks
// NOTE ideally the callees would only call us with the relevant options, but
// that seems like a bigger issue which I'm not willing to solve right now.
const filterUsedOptions = defaultMemoize(options =>
  pick(options, [
    'text',
    'productTypes',
    'missing',
    'categories',
    'exclude_subcategories',
    'states',
    'status',
    'customAttributes',
    'sorting',
    'sortBy',
    'isSortAsc',
    'page',
    'perPage',
    'language',
    'projectKey',
  ])
);

export function setFetchedProducts(payload) {
  return { type: PRODUCTS_FETCHED, payload };
}

export function fetchProducts(fullOptions = {}) {
  return dispatch => {
    const options = filterUsedOptions(fullOptions);
    const cachedResponse = fetchProductsCache.get(options);
    if (cachedResponse) return Promise.resolve(cachedResponse);

    const requestBuilder = createRequestBuilder({
      projectKey: options.projectKey,
    });
    const productProjectionsSearchService =
      requestBuilder.productProjectionsSearch;
    const productTypesService = requestBuilder.productTypes;

    // Full-text search
    if (options.text)
      productProjectionsSearchService.text(options.text, options.language);

    // Filter product type
    const productTypesFilterQuery = getProductTypesFilterQuery(
      options.productTypes
    );
    if (productTypesFilterQuery)
      productProjectionsSearchService.filterByQuery(productTypesFilterQuery);

    // Filter categories
    const categoriesFilterQuery = getCategoriesFilterQuery({
      hasMissingCategory:
        options.missing && options.missing.includes('categories'),
      categories: options.categories,
      excludeSubcategories: options.exclude_subcategories,
    });

    if (categoriesFilterQuery)
      productProjectionsSearchService.filterByQuery(categoriesFilterQuery);

    // Filter states
    const stateFilterQuery = getStateQueryFilter({
      hasMissingState: options.missing && options.missing.includes('states'),
      states: options.states,
    });
    if (stateFilterQuery)
      productProjectionsSearchService.filterByQuery(stateFilterQuery);

    // Filter status
    getStatusFilterQueries(options.status).forEach(statusFilterQuery => {
      productProjectionsSearchService.filterByQuery(statusFilterQuery);
    });

    // Filter attributes
    if (options.customAttributes)
      options.customAttributes.forEach(customAttribute => {
        const customAttributeFilterQuery = getCustomAttributesFilterQuery(
          customAttribute
        );
        if (customAttributeFilterQuery)
          productProjectionsSearchService.filterByQuery(
            customAttributeFilterQuery
          );
      });

    // Sorting
    if ('sorting' in options) {
      getSortingFilters({
        sorting: options.sorting,
        language: options.language,
      }).forEach(sorting => {
        productProjectionsSearchService.sort(sorting.path, sorting.order);
      });
    }
    // For backwards compatibility
    else
      productProjectionsSearchService.sort(
        sortRequiresLanguage.has(options.sortBy)
          ? `${options.sortBy}.${options.language}`
          : options.sortBy,
        options.isSortAsc
      );

    const productProjectionsSearchUri = productProjectionsSearchService
      .staged(true)
      // .fuzzy() // Keep it disabled for now (MC-744)
      // NOTE: keep this disabled until product search is supported in GraphQL
      // .expand('productType')
      .expand('taxCategory')
      .expand('state')
      .expand('categories[*].ancestors[*]')
      .page(options.page)
      .perPage(options.perPage)
      .build();

    const productProjectionsSearchPromise = dispatch(
      sdkActions.get({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: productProjectionsSearchUri,
      })
    )
      // NOTE: this is a workaround until the GraphQL API supports product
      // search. Until then, we try to avoid expanding product types to avoid
      // getting too much duplicate data. For that we fetch the product types
      // separately that are referenced by the returned products and merge them
      // back as reference expanded.
      .then(productsPayload => {
        const products = productsPayload.results;

        // the initial products-list result can be empty
        // depending on the filter that the user applies
        // Example is when there no products in the project with the status
        // "published" and there is no such product with that status
        if (products.length === 0) return productsPayload;

        const productTypeIds = products.map(product => product.productType.id);
        const uniqueProductTypeIds = [...new Set(productTypeIds)];
        const productTypeIdsToRequest = uniqueProductTypeIds
          .map(id => `"${id}"`)
          .join(',');
        const productTypesPredicate = `id in (${productTypeIdsToRequest})`;

        const productTypesUri = productTypesService
          // since there are at max 200 products in the product list
          // there can be at max 200 different product types for us to load
          // Note: If we do get 200 different product types the query predicate
          // might be too long and exceed the request size limit.
          // Since what we are doing here is not the "right" solution anyways
          // (because only graphql is) we decided to not improve this for now.
          .perPage(200)
          .where(productTypesPredicate)
          .build();

        return dispatch(
          sdkActions.get({
            mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
            uri: productTypesUri,
          })
        ).then(productTypesPayload => {
          const productTypes = productTypesPayload.results;
          const normalizedProductTypes = productTypes.reduce(
            (acc, productType) => ({
              ...acc,
              [productType.id]: productType,
            }),
            {}
          );
          // Merge product types back to products, as if we expanded them
          const productsWithProductType = products.map(product => ({
            ...product,
            productType: {
              ...product.productType,
              obj: normalizedProductTypes[product.productType.id],
            },
          }));
          return {
            ...productsPayload,
            results: productsWithProductType,
          };
        });
      });

    return productProjectionsSearchPromise.then(result => {
      fetchProductsCache.set(options, result);
      return result;
    });
  };
}

export function fetchProductSuggestions(projectKey, options) {
  // NOTE there doesn't seem to be a suggestions service in sdk-client,
  // so we query with the URI
  return sdkActions.get({
    mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
    uri: oneLineTrim`
      /${projectKey}
      /product-projections
      /suggest
      ?searchKeywords.${options.language}=${encodeURIComponent(options.text)}
      &limit=5
      &staged=true
    `,
  });
}

export function setProductSelectionById(id, checked) {
  return {
    type: PRODUCT_SET_CHECK_SELECTION,
    payload: { id, checked },
  };
}

export function setSelectedProductIds(ids, checked) {
  return {
    type: PRODUCT_SET_ALL_CHECK_SELECTION,
    payload: { ids, checked },
  };
}

export function setProductDraft(draft) {
  return { type: PRODUCT_SET_DRAFT, payload: draft };
}

export function setUpdatedProduct(product) {
  return { type: PRODUCT_UPDATED, payload: product };
}

export function updateProduct(options = {}) {
  return sdkActions.post({
    mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
    service: 'products',
    options: {
      id: options.id,
      expand: [
        'productType',
        'taxCategory',
        'state.transitions[*]',
        'masterData.staged.categories[*]',
        'masterData.staged.categories[*].ancestors[*]',
        'masterData.staged.masterVariant.prices[*].customerGroup',
        'masterData.staged.masterVariant.prices[*].channel',
        'masterData.staged.variants[*].prices[*].customerGroup',
        'masterData.staged.variants[*].prices[*].channel',
      ],
    },
    payload: { version: options.version, actions: options.actions },
  });
}

export function setProductImageUploaded(product) {
  return { type: PRODUCT_IMAGE_UPLOADED, payload: product };
}

// Uploads images, sends no update images
// Uploading images does not require to send update actions. Sending the file
// will automatically add it to the images of the product and update the product
export function uploadProductImages(options = {}) {
  return dispatch => {
    // service configuration
    const { productId, images, projectKey } = options;

    return dispatch(
      uploadImages({
        productId,
        projectKey,
        images,
      })
    ).then(uploadResult =>
      dispatch(
        sdkActions.get({
          mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
          service: 'productProjections',
          options: {
            id: productId,
            staged: true,
            expand: [
              'productType',
              'taxCategory',
              'state.transitions[*]',
              'categories[*]',
              'categories[*].ancestors[*]',
              'masterVariant.prices[*].customerGroup',
              'masterVariant.prices[*].channel',
              'variants[*].prices[*].customerGroup',
              'variants[*].prices[*].channel',
            ],
          },
        })
      ).then(product => ({ product, meta: uploadResult.meta }))
    );
  };
}

export function setProductAndImagesUploaded(payload) {
  return { type: PRODUCT_UPDATED_WITH_IMAGE_UPLOAD, payload };
}

// Adding external images to a product can only be done through update actions.
// We first upload images and then send update actions to add the external ones.
export function updateProductAndUploadImages(options) {
  return dispatch => {
    // service configuration
    const { id, actions, images, version, projectKey } = options;

    return dispatch(
      uploadImages({
        productId: id,
        projectKey,
        images,
      })
    ).then(uploadResult =>
      dispatch(
        sdkActions.post({
          mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
          service: 'products',
          options: {
            id,
            // in case all uploads fail (uploadResult.meta.version is null), we need
            // to fall back to the original version so we can at least add the
            // external images
            expand: [
              'productType',
              'taxCategory',
              'state.transitions[*]',
              'masterData.staged.categories[*]',
              'masterData.staged.categories[*].ancestors[*]',
              'masterData.staged.masterVariant.prices[*].customerGroup',
              'masterData.staged.masterVariant.prices[*].channel',
              'masterData.staged.variants[*].prices[*].customerGroup',
              'masterData.staged.variants[*].prices[*].channel',
            ],
          },
          payload: { version: uploadResult.meta.version || version, actions },
        })
      ).then(product => ({ product, meta: uploadResult.meta }))
    );
  };
}

export function publishProduct({ id, version, expand }) {
  return sdkActions.post({
    mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
    service: 'products',
    options: { id, expand },
    payload: { version, actions: [{ action: 'publish' }] },
  });
}

export function publishProducts(products, expand) {
  return dispatch =>
    Promise.all(
      products.map(product =>
        dispatch(
          publishProduct({ id: product.id, version: product.version, expand })
        ).then(
          response => ({
            id: product.id,
            success: true,
            product: response,
          }),
          error => ({
            id: product.id,
            success: false,
            error,
          })
        )
      )
    );
}

export function unpublishProduct({ id, version, expand }) {
  return sdkActions.post({
    mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
    service: 'products',
    options: { id, expand },
    payload: { version, actions: [{ action: 'unpublish' }] },
  });
}

export function setVisibleProduct(product) {
  return { type: SET_VISIBLE_PRODUCT, payload: product };
}

export function unpublishProducts(products, expand) {
  return dispatch =>
    Promise.all(
      products.map(product =>
        dispatch(
          unpublishProduct({ id: product.id, version: product.version, expand })
        ).then(
          response => ({
            id: product.id,
            success: true,
            product: response,
          }),
          error => ({
            id: product.id,
            success: false,
            error,
          })
        )
      )
    );
}

export function setTransitionedProductState(payload) {
  return {
    type: PRODUCT_STATE_TRANSITIONED,
    payload,
  };
}

export function transitionProductState(options = {}) {
  return (dispatch, getState) => {
    const { stateId } = options;
    const { id, version } = selectCurrentProduct(getState());
    const payload = {
      version,
      actions: [
        {
          action: 'transitionState',
          state: { id: stateId, typeId: 'state' },
        },
      ],
    };

    const expand = [
      'productType',
      'taxCategory',
      'state.transitions[*]',
      'masterData.staged.categories[*]',
      'masterData.staged.categories[*].ancestors[*]',
      'masterData.staged.masterVariant.prices[*].customerGroup',
      'masterData.staged.masterVariant.prices[*].channel',
      'masterData.staged.variants[*].prices[*].customerGroup',
      'masterData.staged.variants[*].prices[*].channel',
    ];

    return dispatch(
      sdkActions.post({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        service: 'products',
        options: { id, expand },
        payload,
      })
    );
  };
}

export function deleteProduct({ id, version }) {
  return sdkActions.del({
    mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
    service: 'products',
    options: { id, version },
  });
}

export function deleteProducts(products) {
  return dispatch =>
    Promise.all(
      products.map(product =>
        dispatch(
          deleteProduct({ id: product.id, version: product.version })
        ).then(
          () => ({ id: product.id, success: true }),
          error => ({ id: product.id, success: false, error })
        )
      )
    );
}

export function setFetchedProduct(payload) {
  return { type: PRODUCT_FETCHED, payload };
}

export function fetchProduct(productId, projectKey) {
  return sdkActions.get({
    mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
    // changed from `service` to `uri` to be able to pass the projectKey directly to the action and not
    // infer it from the request URL, this helps during tests.
    uri: oneLineTrim`
      /${projectKey}
      /product-projections
      /${productId}
      ?staged=true
      &expand=productType
      &expand=taxCategory
      &expand=state.transitions[*]
      &expand=categories[*]
      &expand=categories[*].ancestors[*]
      &expand=masterVariant.prices[*].customerGroup
      &expand=masterVariant.prices[*].channel
      &expand=variants[*].prices[*].customerGroup
      &expand=variants[*].prices[*].channel
      &expand=variants[*].prices[*].custom
    `,
  });
}

export function setFetchedProductTypeSettings(payload) {
  return { type: PRODUCT_TYPE_SETTINGS_FETCHED, payload };
}

export function resolveProductTypeSettings(options) {
  return dispatch =>
    dispatch(
      sdkActions.get({
        uri: oneLineTrim`
          /product-type-settings
          ?productTypeId=${options.productTypeSettingsId}
          &user=${options.userId}
          &expand=productDetailsBaseSettings
          &expand=productDetailsVariantSettings
        `,
      })
    ).then(productTypeSettings => {
      if (productTypeSettings && productTypeSettings.results[0])
        return mergeProductTypeSettings(productTypeSettings.results[0]);

      return dispatch(
        sdkActions.post({
          uri: oneLineTrim`
            /product-type-settings
            ?expand=productDetailsBaseSettings
            &expand=productDetailsVariantSettings
          `,
          payload: {
            user: options.userId,
            productTypeId: options.productTypeSettingsId,
          },
        })
      ).then(createdProductTypeSettings =>
        mergeProductTypeSettings(createdProductTypeSettings)
      );
    });
}

// NOTE this action creator is way too entangled
// It should only have a single concern: creating a product
// The cleaning of notifications and the creation of settings should not be
// concerns of this action creator.
export function createProduct({ draft: productDraft, userId }) {
  return dispatch => {
    dispatch(hideAllPageNotifications());

    return dispatch(
      sdkActions.post({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        service: 'products',
        options: {
          expand: [
            'productType',
            'taxCategory',
            'state.transitions[*]',
            'masterData.staged.categories[*]',
            'masterData.staged.categories[*].ancestors[*]',
            'masterData.staged.masterVariant.prices[*].customerGroup',
            'masterData.staged.masterVariant.prices[*].channel',
            'masterData.staged.variants[*].prices[*].customerGroup',
            'masterData.staged.variants[*].prices[*].channel',
          ],
        },
        payload: productDraft,
      })
    ).then(result => {
      const productTypeId = result.productType.id;
      // Ensure product type settings
      return (
        dispatch(fetchProductTypeSettings({ productTypeId, userId }))
          .then(productTypeResult => {
            const productTypes = productTypeResult.results[0];

            return (productTypes
              ? Promise.resolve(productTypes)
              : dispatch(createProductTypeSettings({ productTypeId, userId }))
            ).then(payload =>
              dispatch({
                type: PRODUCT_TYPE_SETTINGS_FETCHED,
                payload: mergeProductTypeSettings(payload),
              })
            );
          })
          // Return the product projection as a result
          .then(() => result)
      );
    });
  };
}

/**
 * Following ACTION_TYPEs can be removed in favour of this:
 * PRODUCT_UPDATED_WITH_IMAGE_UPLOAD,
 * PRODUCT_IMAGE_UPLOADED,
 * SET_VISIBLE_PRODUCT,
 * PRODUCT_MASTER_VARIANT_CHANGED,
 * PRODUCT_STATE_TRANSITIONED
 */
export function setProductUpdated(payload) {
  return {
    type: PRODUCT_UPDATED,
    payload,
  };
}

export function updateMasterVariant({ options = {}, projectKey }) {
  const service = createRequestBuilder({ projectKey }).products;
  const updateMasterVariantRequest = service
    .byId(options.id)
    .expand('productType')
    .expand('taxCategory')
    .expand('state.transitions[*]')
    .expand('masterData.staged.categories[*]')
    .expand('masterData.staged.categories[*].ancestors[*]')
    .expand('masterData.staged.masterVariant.prices[*].customerGroup')
    .expand('masterData.staged.masterVariant.prices[*].channel')
    .expand('masterData.staged.variants[*].prices[*].customerGroup')
    .expand('masterData.staged.variants[*].prices[*].channel');

  return sdkActions.post({
    mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
    uri: updateMasterVariantRequest.build(),
    payload: {
      version: options.version,
      actions: [
        {
          action: 'changeMasterVariant',
          variantId: options.variantId,
        },
      ],
    },
  });
}

// TODO this is probably converted wrong!
// this used to be service.expand().expand().create({ user, productTypeId })
// How do we translate this to sdk correctly?
function createProductTypeSettings({ userId, productTypeId }) {
  return sdkActions.post({
    uri: oneLineTrim`
      /product-type-settings
      ?expand=productDetailsBaseSetting
      &expand=productDetailsVariantSettings
    `,
    payload: { user: userId, productTypeId },
  });
}

export function fetchProductTypeSettings({ productTypeId, userId }) {
  return sdkActions.get({
    uri: oneLineTrim`
      /product-type-settings
      ?productTypeId=${productTypeId}
      &user=${userId}
      &expand=productDetailsBaseSettings
      &expand=productDetailsVariantSettings
    `,
  });
}

export function uploadImages(options) {
  return dispatch => {
    const { projectKey, productId, images } = options;

    const total = images.length;

    const uploads = images.map(image => {
      const q = encode({
        variant: image.variantId,
        filename: image.filename,
      });
      const url = `/${projectKey}/products/${productId}/images?${q}`;

      const reader = new FileReader();

      // The @commercetools/sdk-client's http-middleware expects
      // the payload to be a buffer for binaries, so we need to convert to
      // an ArrayBuffer and then use Buffer.from to convert to an actual buffer
      return new Promise(resolve => {
        reader.onload = event => {
          resolve(
            dispatch(
              sdkActions.post({
                mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
                uri: url,
                headers: {
                  'Content-Type': image.type,
                  accept: 'application/json',
                },
                payload: Buffer.from(event.target.result),
              })
            ).then(
              product => ({ success: true, version: product.version }),
              () => ({ success: false, version: 0, fileName: image.filename })
            )
          );
        };
        // TODO error handling?
        reader.readAsArrayBuffer(image.file);
      });
    });

    // Upload all images simulatenously
    // Since every upload has a catch the chain won't stop if one fails
    return Promise.all(uploads).then(summary => {
      const successfulUpdates = summary.filter(item => item.success);
      const unsuccessfulUpdates = summary.filter(item => !item.success);
      return {
        meta: {
          count: successfulUpdates.length,
          total,
          filenameFailures: unsuccessfulUpdates.map(item => item.fileName),
          version:
            successfulUpdates.length > 0
              ? Math.max(successfulUpdates.map(item => item.version))
              : null,
        },
      };
    });
  };
}

function mergeProductTypeSettings(productTypeSettings) {
  return {
    ...productTypeSettings,
    currentProductDetailsBaseSettings: {
      ...productTypeSettings.currentProductDetailsBaseSettings,
      obj: productTypeSettings.productDetailsBaseSettings.find(
        productDetailsBaseSetting =>
          productDetailsBaseSetting.id ===
          productTypeSettings.currentProductDetailsBaseSettings.id
      ),
    }.obj,
    currentProductDetailsVariantSettings: {
      ...productTypeSettings.currentProductDetailsVariantSettings,
      obj: productTypeSettings.productDetailsVariantSettings.find(
        productDetailsVariantSetting =>
          productDetailsVariantSetting.id ===
          productTypeSettings.currentProductDetailsVariantSettings.id
      ).obj,
    },
  };
}
