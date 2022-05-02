import oneLineTrim from 'common-tags/lib/oneLineTrim';
import { actions as sdkActions } from '@commercetools-frontend/sdk';
import RequestCache from '@commercetools-local/utils/request-cache';
import { MC_API_PROXY_TARGETS } from '@commercetools-frontend/constants';
import {
  SET_VIEW_MODE,
  PRODUCTS_FETCHED,
  SET_VISIBLE_PRODUCT,
  PRODUCT_UPDATED,
  PRODUCT_FETCHED,
  PRODUCT_SET_CHECK_SELECTION,
  PRODUCT_SET_ALL_CHECK_SELECTION,
  PRODUCT_IMAGE_UPLOADED,
  PRODUCT_UPDATED_WITH_IMAGE_UPLOAD,
  PRODUCT_TYPE_SETTINGS_FETCHED,
} from '../../constants';
import {
  setViewMode,
  fetchProducts,
  setFetchedProduct,
  setFetchedProducts,
  setProductSelectionById,
  setSelectedProductIds,
  updateProduct,
  setUpdatedProduct,
  publishProduct,
  publishProducts,
  setVisibleProduct,
  unpublishProduct,
  unpublishProducts,
  transitionProductState,
  deleteProduct,
  deleteProducts,
  fetchProduct,
  createProduct,
  updateMasterVariant,
  uploadProductImages,
  setProductImageUploaded,
  updateProductAndUploadImages,
  setProductAndImagesUploaded,
  uploadImages,
  resolveProductTypeSettings,
  fetchProductTypeSettings,
  fetchProductSuggestions,
} from './products';

jest.mock('../../../utils/request-cache');

const createProductTypeSettings = custom => ({
  id: 'product-type-settings-id',
  currentProductDetailsBaseSettings: {
    id: 'product-details-settings-1',
    typeId: 'product-details-base-settings',
  },
  productDetailsBaseSettings: [
    {
      id: 'product-details-settings-1',
      typeId: 'product-details-base-settings',
      obj: {
        id: 'product-details-settings-1',
        some_setting: true,
      },
    },
    {
      id: 'product-details-settings-2',
      typeId: 'product-details-base-settings',
      obj: {
        id: 'product-details-settings-2',
        some_setting: false,
      },
    },
  ],
  currentProductDetailsVariantSettings: {
    id: 'product-details-variant-settings-1',
    typeId: 'product-details-variant-settings',
  },
  productDetailsVariantSettings: [
    {
      id: 'product-details-variant-settings-1',
      typeId: 'product-details-variant-settings',
      obj: {
        id: 'product-details-variant-settings-1',
        some_setting: true,
      },
    },
    {
      id: 'product-details-variant-settings-1',
      typeId: 'product-details-variant-settings',
      obj: {
        id: 'product-details-variant-settings-1',
        some_setting: false,
      },
    },
  ],
  ...custom,
});

function createPluginState(custom) {
  return {
    products: {
      currentVisible: {
        id: 'current-visible-product',
        version: 1,
        productType: { id: '1' },
      },
      ...custom,
    },
  };
}

describe('setViewMode', () => {
  it('should dispatch a SET_VIEW_MODE action with the viewMode as payload', () => {
    expect(setViewMode({ viewMode: 'test' })).toEqual({
      type: SET_VIEW_MODE,
      payload: 'test',
    });
  });
});

describe('setFetchedProducts', () => {
  const payload = { foo: true };
  it('should return an action', () => {
    expect(setFetchedProducts(payload)).toEqual({
      type: PRODUCTS_FETCHED,
      payload,
    });
  });
});

describe('fetchProducts', () => {
  let dispatch;

  beforeEach(() => {
    dispatch = jest
      .fn()
      .mockReturnValueOnce(
        Promise.resolve({
          total: 3,
          results: [
            { id: 'p-1', productType: { id: 'pt-1' } },
            { id: 'p-2', productType: { id: 'pt-2' } },
            { id: 'p-3', productType: { id: 'pt-1' } },
          ],
        })
      )
      .mockReturnValueOnce(
        Promise.resolve({
          results: [
            { id: 'pt-1', name: 'PT-1' },
            { id: 'pt-2', name: 'PT-2' },
          ],
        })
      );
  });

  describe('when the cache is empty', () => {
    let result;
    beforeEach(async () => {
      RequestCache.prototype.clear.mockClear();
      RequestCache.prototype.get.mockClear().mockImplementation(() => null);
      result = fetchProducts({
        page: 1,
        perPage: 10,
        sorting: [{ key: 'createdAt', order: 'desc' }],
        projectKey: 'test',
        language: 'en',
      })(dispatch, createPluginState);
      await result;
    });
    it('should check the cache', () => {
      expect(RequestCache.prototype.get).toHaveBeenCalledTimes(1);
    });
    it('should resolve with results', async () => {
      await expect(result).resolves.toEqual({
        total: 3,
        results: [
          {
            id: 'p-1',
            productType: { id: 'pt-1', obj: { id: 'pt-1', name: 'PT-1' } },
          },
          {
            id: 'p-2',
            productType: { id: 'pt-2', obj: { id: 'pt-2', name: 'PT-2' } },
          },
          {
            id: 'p-3',
            productType: { id: 'pt-1', obj: { id: 'pt-1', name: 'PT-1' } },
          },
        ],
      });
    });
    it('should fetch product projections', () => {
      expect(dispatch).toHaveBeenCalledWith(
        sdkActions.get({
          mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
          uri: oneLineTrim`
            /test
            /product-projections
            /search
            ?staged=true
            &expand=taxCategory
            &expand=state&expand=categories%5B*%5D.ancestors%5B*%5D
            &limit=10
            &offset=0
            &sort=createdAt%20desc
            &markMatchingVariants=false
          `,
        })
      );
    });
    it('should fetch product types', () => {
      expect(dispatch).toHaveBeenCalledWith(
        sdkActions.get({
          mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
          uri: oneLineTrim`
            /test
            /product-types
            ?where=${encodeURIComponent('id in ("pt-1","pt-2")')}
            &limit=200
          `,
        })
      );
    });

    describe('when the query includes the subtree', () => {
      beforeEach(async () => {
        dispatch = jest
          .fn()
          .mockReturnValueOnce(
            Promise.resolve({
              total: 3,
              results: [
                { id: 'p-1', productType: { id: 'pt-1' } },
                { id: 'p-2', productType: { id: 'pt-2' } },
                { id: 'p-3', productType: { id: 'pt-1' } },
              ],
            })
          )
          .mockReturnValueOnce(
            Promise.resolve({
              results: [
                { id: 'pt-1', name: 'PT-1' },
                { id: 'pt-2', name: 'PT-2' },
              ],
            })
          );
        RequestCache.prototype.clear.mockClear();
        RequestCache.prototype.get.mockClear().mockImplementation(() => null);
        result = fetchProducts({
          page: 1,
          perPage: 10,
          sorting: [{ key: 'createdAt', order: 'desc' }],
          text: 'Foo',
          status: ['published', 'modified'],
          productTypes: [{ id: '111' }],
          categories: [{ id: '222' }],
          states: [{ id: '333' }],
          projectKey: 'test',
          language: 'en',
        })(dispatch, createPluginState);
        await result;
      });
      it('should fetch product projections', () => {
        expect(dispatch).toHaveBeenCalledWith(
          sdkActions.get({
            mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
            uri: oneLineTrim`
              /test
              /product-projections
              /search
              ?staged=true
              &expand=taxCategory
              &expand=state
              &expand=${encodeURIComponent('categories[*].ancestors[*]')}
              &limit=10
              &offset=0
              &sort=${encodeURIComponent('createdAt desc')}
              &text.en=Foo
              &markMatchingVariants=false
              &filter.query=${encodeURIComponent('productType.id:"111"')}
              &filter.query=${encodeURIComponent(
                'categories.id:subtree("222")'
              )}
              &filter.query=${encodeURIComponent('state.id:"333"')}
              &filter.query=${encodeURIComponent('published:true')}
              &filter.query=${encodeURIComponent(
                'hasStagedChanges:false,true'
              )}`,
          })
        );
      });
      it('should fetch product types', () => {
        expect(dispatch).toHaveBeenCalledWith(
          sdkActions.get({
            mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
            uri: oneLineTrim`
              /test
              /product-types
              ?where=${encodeURIComponent('id in ("pt-1","pt-2")')}
              &limit=200
            `,
          })
        );
      });
    });

    describe('when the query excludes the subtree', () => {
      beforeEach(async () => {
        dispatch = jest
          .fn()
          .mockReturnValueOnce(
            Promise.resolve({
              total: 3,
              results: [
                { id: 'p-1', productType: { id: 'pt-1' } },
                { id: 'p-2', productType: { id: 'pt-2' } },
                { id: 'p-3', productType: { id: 'pt-1' } },
              ],
            })
          )
          .mockReturnValueOnce(
            Promise.resolve({
              results: [
                { id: 'pt-1', name: 'PT-1' },
                { id: 'pt-2', name: 'PT-2' },
              ],
            })
          );
        RequestCache.prototype.clear.mockClear();
        RequestCache.prototype.get.mockClear().mockImplementation(() => null);
        result = fetchProducts({
          page: 1,
          perPage: 10,
          sorting: [{ key: 'createdAt', order: 'desc' }],
          text: 'Foo',
          status: ['published', 'modified'],
          productTypes: [{ id: '111' }],
          categories: [{ id: '222' }],
          states: [{ id: '333' }],
          exclude_subcategories: true,
          projectKey: 'test',
          language: 'en',
        })(dispatch, createPluginState);
        await result;
      });
      it('should fetch product projections', () => {
        expect(dispatch).toHaveBeenCalledWith(
          sdkActions.get({
            mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
            uri: oneLineTrim`
              /test
              /product-projections
              /search
              ?staged=true
              &expand=taxCategory
              &expand=state
              &expand=${encodeURIComponent('categories[*].ancestors[*]')}
              &limit=10
              &offset=0
              &sort=${encodeURIComponent('createdAt desc')}
              &text.en=Foo
              &markMatchingVariants=false
              &filter.query=${encodeURIComponent('productType.id:"111"')}
              &filter.query=${encodeURIComponent('categories.id:"222"')}
              &filter.query=${encodeURIComponent('state.id:"333"')}
              &filter.query=${encodeURIComponent('published:true')}
              &filter.query=${encodeURIComponent(
                'hasStagedChanges:false,true'
              )}`,
          })
        );
      });
      it('should fetch product types', () => {
        expect(dispatch).toHaveBeenCalledWith(
          sdkActions.get({
            mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
            uri: oneLineTrim`
              /test
              /product-types
              ?where=${encodeURIComponent('id in ("pt-1","pt-2")')}
              &limit=200
            `,
          })
        );
      });
    });

    describe('when the query should be missing', () => {
      beforeEach(async () => {
        dispatch = jest
          .fn()
          .mockReturnValueOnce(
            Promise.resolve({
              total: 3,
              results: [
                { id: 'p-1', productType: { id: 'pt-1' } },
                { id: 'p-2', productType: { id: 'pt-2' } },
                { id: 'p-3', productType: { id: 'pt-1' } },
              ],
            })
          )
          .mockReturnValueOnce(
            Promise.resolve({
              results: [
                { id: 'pt-1', name: 'PT-1' },
                { id: 'pt-2', name: 'PT-2' },
              ],
            })
          );
        RequestCache.prototype.clear.mockClear();
        RequestCache.prototype.get.mockClear().mockImplementation(() => null);
        result = fetchProducts({
          page: 1,
          perPage: 10,
          sorting: [{ key: 'createdAt', order: 'desc' }],
          missing: ['categories', 'states'],
          projectKey: 'test',
          language: 'en',
        })(dispatch, createPluginState);
        await result;
      });
      it('should fetch product projections', () => {
        expect(dispatch).toHaveBeenCalledWith(
          sdkActions.get({
            mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
            uri: oneLineTrim`
              /test
              /product-projections
              /search
              ?staged=true
              &expand=taxCategory
              &expand=state
              &expand=${encodeURIComponent('categories[*].ancestors[*]')}
              &limit=10
              &offset=0
              &sort=${encodeURIComponent('createdAt desc')}
              &markMatchingVariants=false
              &filter.query=${encodeURIComponent('categories:missing')}
              &filter.query=${encodeURIComponent('state:missing')}
            `,
          })
        );
      });
      it('should fetch product types', () => {
        expect(dispatch).toHaveBeenCalledWith(
          sdkActions.get({
            mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
            uri: oneLineTrim`
              /test
              /product-types
              ?where=${encodeURIComponent('id in ("pt-1","pt-2")')}
              &limit=200
            `,
          })
        );
      });
    });
  });

  describe('when the cache is filled', () => {
    const cachedResult = { cachedResult: true };
    const options = {
      text: 'foo',
      irrelevantKey: 'bar',
      projectKey: 'test',
      language: 'en',
    };
    let result;
    beforeEach(async () => {
      dispatch = jest.fn();
      RequestCache.prototype.get
        .mockClear()
        .mockImplementation(() => cachedResult);
      result = fetchProducts(options)(dispatch, createPluginState);
      await result;
    });
    it('should check the cache with provided, filtered options', () => {
      expect(RequestCache.prototype.get).toHaveBeenCalledTimes(1);
      expect(RequestCache.prototype.get).toHaveBeenCalledWith({
        text: 'foo',
        projectKey: 'test',
        language: 'en',
      });
    });
    it('should not pass along irrelevant options', () => {
      expect(RequestCache.prototype.get).not.toHaveBeenCalledWith(options);
    });
    it('should resolve the promise with the cached value', async () => {
      await expect(result).resolves.toBe(cachedResult);
    });
  });

  describe('when there are no results', () => {
    let result;
    beforeEach(async () => {
      dispatch = jest
        .fn()
        .mockReturnValueOnce(
          Promise.resolve({
            total: 0,
            results: [],
          })
        )
        .mockReturnValueOnce(
          Promise.resolve({
            results: [],
          })
        );
      RequestCache.prototype.clear.mockClear();
      RequestCache.prototype.get.mockClear().mockImplementation(() => null);
      result = fetchProducts({
        page: 1,
        perPage: 10,
        sorting: [{ key: 'createdAt', order: 'desc' }],
        projectKey: 'test',
        language: 'en',
      })(dispatch, createPluginState);
      await result;
    });
    it('should not fetch productTypes', () => {
      expect(dispatch).toHaveBeenCalledTimes(1);
    });
    it('should fetch products', () => {
      expect(dispatch).toHaveBeenCalledWith(
        sdkActions.get({
          mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
          uri: oneLineTrim`
            /test
            /product-projections
            /search
            ?staged=true
            &expand=taxCategory
            &expand=state
            &expand=${encodeURIComponent('categories[*].ancestors[*]')}
            &limit=10
            &offset=0
            &sort=${encodeURIComponent('createdAt desc')}
            &markMatchingVariants=false
          `,
        })
      );
    });
    it('should resolve', async () => {
      await expect(result).resolves.toEqual({ results: [], total: 0 });
    });
  });
});

describe('fetchProductSuggestions', () => {
  const projectKey = 'foo-project';
  it('should return an action', () => {
    const options = { language: 'en', text: 'foo' };
    expect(fetchProductSuggestions(projectKey, options)).toEqual(
      sdkActions.get({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: oneLineTrim`
          /${projectKey}
          /product-projections
          /suggest
          ?searchKeywords.${options.language}=${options.text}
          &limit=5
          &staged=true
        `,
      })
    );
  });
  it('should encode the text', () => {
    expect(
      fetchProductSuggestions(projectKey, { language: 'en', text: 'a b' })
    ).toEqual(
      sdkActions.get({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: oneLineTrim`
          /${projectKey}
          /product-projections
          /suggest
          ?searchKeywords.en=a%20b
          &limit=5
          &staged=true
        `,
      })
    );
  });
});

describe('setVisibleProduct', () => {
  const product = { id: 'foo', version: 2 };
  it('should return an action', () => {
    expect(setVisibleProduct(product)).toEqual({
      type: SET_VISIBLE_PRODUCT,
      payload: product,
    });
  });
});

describe('publishProduct', () => {
  const id = 'foo';
  const version = 3;
  const expand = ['foo', 'bar', 'baz'];
  it('should return an action', () => {
    expect(publishProduct({ id, version, expand })).toEqual(
      sdkActions.post({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        service: 'products',
        options: { id, expand },
        payload: { version, actions: [{ action: 'publish' }] },
      })
    );
  });
});

describe('unpublishProduct', () => {
  const id = 'foo';
  const version = 3;
  const expand = ['foo', 'bar', 'baz'];
  it('should return an action', () => {
    expect(unpublishProduct({ id, version, expand })).toEqual(
      sdkActions.post({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        service: 'products',
        options: { id, expand },
        payload: { version, actions: [{ action: 'unpublish' }] },
      })
    );
  });
});

describe('publishProducts', () => {
  const products = [
    { id: 'product-id-1', version: 1 },
    { id: 'product-id-2', version: 2 },
  ];
  const expand = ['foo', 'bar', 'baz'];
  let dispatch;
  let promise;
  describe('when all publications succeed', () => {
    beforeEach(() => {
      dispatch = jest.fn(() => Promise.resolve({}));
      promise = publishProducts(products, expand)(dispatch);
      return promise;
    });
    it('should unpublish each product', () => {
      expect(dispatch).toHaveBeenCalledTimes(products.length);
      expect(dispatch).toHaveBeenCalledWith(
        publishProduct({
          id: products[0].id,
          version: products[0].version,
          expand,
        })
      );
      expect(dispatch).toHaveBeenCalledWith(
        publishProduct({
          id: products[1].id,
          version: products[1].version,
          expand,
        })
      );
    });
  });
  describe('when all publications fail', () => {
    const error = new Error('foo');
    beforeEach(() => {
      dispatch = jest.fn(() => Promise.reject(error));
      promise = publishProducts(products, expand)(dispatch);
      return promise;
    });
    it('should attempt to publish each product', () => {
      expect(dispatch).toHaveBeenCalledTimes(products.length);
      expect(dispatch).toHaveBeenCalledWith(
        publishProduct({
          id: products[0].id,
          version: products[0].version,
          expand,
        })
      );
      expect(dispatch).toHaveBeenCalledWith(
        publishProduct({
          id: products[1].id,
          version: products[1].version,
          expand,
        })
      );
    });
    it('should resolve with a summary', async () => {
      expect(await promise).toEqual([
        { id: products[0].id, success: false, error },
        { id: products[1].id, success: false, error },
      ]);
    });
  });
});

describe('unpublishProducts', () => {
  const products = [
    { id: 'product-id-1', version: 1 },
    { id: 'product-id-2', version: 2 },
  ];
  const expand = ['foo', 'bar', 'baz'];
  let dispatch;
  let promise;
  describe('when all unpublications succeed', () => {
    beforeEach(() => {
      dispatch = jest.fn(() => Promise.resolve({}));
      promise = unpublishProducts(products, expand)(dispatch);
      return promise;
    });
    it('should unpublish each product', () => {
      expect(dispatch).toHaveBeenCalledTimes(products.length);
      expect(dispatch).toHaveBeenCalledWith(
        unpublishProduct({
          id: products[0].id,
          version: products[0].version,
          expand,
        })
      );
      expect(dispatch).toHaveBeenCalledWith(
        unpublishProduct({
          id: products[1].id,
          version: products[1].version,
          expand,
        })
      );
    });
  });
  describe('when all unpublications fail', () => {
    const error = new Error('foo');
    beforeEach(() => {
      dispatch = jest.fn(() => Promise.reject(error));
      promise = unpublishProducts(products, expand)(dispatch);
      return promise;
    });
    it('should attempt to unpublish each product', () => {
      expect(dispatch).toHaveBeenCalledTimes(products.length);
      expect(dispatch).toHaveBeenCalledWith(
        unpublishProduct({
          id: products[0].id,
          version: products[0].version,
          expand,
        })
      );
      expect(dispatch).toHaveBeenCalledWith(
        unpublishProduct({
          id: products[1].id,
          version: products[1].version,
          expand,
        })
      );
    });
    it('should resolve with a summary', async () => {
      expect(await promise).toEqual([
        { id: products[0].id, success: false, error },
        { id: products[1].id, success: false, error },
      ]);
    });
  });
});

describe('deleteProduct', () => {
  const id = 'foo';
  const version = 3;
  it('should return an action', () => {
    expect(deleteProduct({ id, version })).toEqual(
      sdkActions.del({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        service: 'products',
        options: { id, version },
      })
    );
  });
});

describe('deleteProducts', () => {
  const products = [
    { id: 'product-id-1', version: 1 },
    { id: 'product-id-2', version: 2 },
  ];
  let dispatch;
  let promise;
  describe('when all deletions succeed', () => {
    beforeEach(() => {
      dispatch = jest.fn(() => Promise.resolve({}));
      promise = deleteProducts(products)(dispatch);
      return promise;
    });
    it('should delete each product', () => {
      expect(dispatch).toHaveBeenCalledTimes(products.length);
      expect(dispatch).toHaveBeenCalledWith(
        deleteProduct({ id: products[0].id, version: products[0].version })
      );
      expect(dispatch).toHaveBeenCalledWith(
        deleteProduct({ id: products[1].id, version: products[1].version })
      );
    });
  });
  describe('when all deletions fail', () => {
    const error = new Error('foo');
    beforeEach(() => {
      dispatch = jest.fn(() => Promise.reject(error));
      promise = deleteProducts(products)(dispatch);
      return promise;
    });
    it('should attempt to delete each product', () => {
      expect(dispatch).toHaveBeenCalledTimes(products.length);
      expect(dispatch).toHaveBeenCalledWith(
        deleteProduct({ id: products[0].id, version: products[0].version })
      );
      expect(dispatch).toHaveBeenCalledWith(
        deleteProduct({ id: products[1].id, version: products[1].version })
      );
    });
    it('should resolve with a summary', async () => {
      expect(await promise).toEqual([
        { id: products[0].id, success: false, error },
        { id: products[1].id, success: false, error },
      ]);
    });
  });
});

describe('fetchProduct', () => {
  const productId = 'product-id-1';
  it('should return `sdkActions.get', () => {
    expect(fetchProduct(productId, 'test-1')).toEqual(
      sdkActions.get({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: oneLineTrim`
          /test-1
          /product-projections
          /product-id-1
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
          &expand=variants[*].prices[*].custom`,
      })
    );
  });
});

describe('setFetchedProduct', () => {
  it('should return action', () => {
    expect(setFetchedProduct()).toEqual(
      expect.objectContaining({
        type: PRODUCT_FETCHED,
      })
    );
  });
});

describe('resolveProductTypeSettings', () => {
  let dispatch;
  let result;
  const productTypeSettings = createProductTypeSettings();
  describe('when `productTypeSettings` exists', () => {
    beforeEach(async () => {
      dispatch = jest.fn(() =>
        Promise.resolve({ results: [productTypeSettings] })
      );
      result = resolveProductTypeSettings({
        productTypeSettingsId: 'product-type-settings-id-1',
        userId: 'user-id-1',
      })(dispatch);
      await result;
    });
    it('should fetch product type settings', () => {
      expect(dispatch).toHaveBeenCalledWith(
        sdkActions.get({
          uri: oneLineTrim`
            /product-type-settings
            ?productTypeId=product-type-settings-id-1
            &user=user-id-1
            &expand=productDetailsBaseSettings
            &expand=productDetailsVariantSettings
          `,
        })
      );
    });
    it('should return a mutated productTypeSettings response', async () => {
      await expect(result).resolves.toEqual({
        ...productTypeSettings,
        currentProductDetailsBaseSettings: {
          ...productTypeSettings.productDetailsBaseSettings[0],
        },
        currentProductDetailsVariantSettings: {
          ...productTypeSettings.productDetailsVariantSettings[0],
        },
      });
    });
  });
});

describe('createProduct', () => {
  const productDetailsBaseSetting = { foo: 'bar' };
  const productTypeSettingsResponse = {
    results: [
      {
        id: '1',
        currentProductDetailsBaseSettings: { id: '12' },
        productDetailsBaseSettings: [
          {
            id: '12',
            obj: productDetailsBaseSetting,
          },
        ],
        currentProductDetailsVariantSettings: { id: '12' },
        productDetailsVariantSettings: [
          {
            id: '12',
            obj: productDetailsBaseSetting,
          },
        ],
      },
    ],
  };
  const formValues = {
    name: { en: 'product name' },
    productType: { typeId: 'product-type', id: 'pt-id' },
    slug: { en: 'product_name' },
    masterVariant: { attributes: [], images: [], prices: [] },
    variants: [],
  };
  const productCreatedResponse = {
    id: '123',
    productType: formValues.productType,
    masterData: {
      staged: { ...formValues, productType: null },
      current: { ...formValues, productType: null },
    },
  };

  let dispatch;
  let result;
  beforeEach(async () => {
    dispatch = jest
      .fn()
      // hideAllPageNotifications
      .mockReturnValueOnce(null)
      // create
      .mockReturnValueOnce(Promise.resolve(productCreatedResponse))
      // ensure settings
      .mockReturnValueOnce(Promise.resolve(productTypeSettingsResponse));

    result = createProduct({ draft: formValues, userId: 'user-1' })(
      dispatch,
      createPluginState
    );
    await result;
  });

  it('should create the product', () => {
    expect(dispatch).toHaveBeenCalledWith(
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
        payload: formValues,
      })
    );
  });

  it('should fetch product type settings', () => {
    expect(dispatch).toHaveBeenCalledWith(
      fetchProductTypeSettings({
        productTypeId: formValues.productType.id,
        userId: 'user-1',
      })
    );
  });

  it('should dispatch the fetched product type settings', () => {
    expect(dispatch).toHaveBeenCalledWith({
      type: PRODUCT_TYPE_SETTINGS_FETCHED,
      payload: {
        id: '1',
        currentProductDetailsBaseSettings: {
          id: '12',
          obj: productDetailsBaseSetting,
        },
        productDetailsBaseSettings: [
          {
            id: '12',
            obj: productDetailsBaseSetting,
          },
        ],
        currentProductDetailsVariantSettings: {
          id: '12',
          obj: productDetailsBaseSetting,
        },
        productDetailsVariantSettings: [
          {
            id: '12',
            obj: productDetailsBaseSetting,
          },
        ],
      },
    });
  });

  it('should resolve with results', async () => {
    await expect(result).resolves.toEqual(productCreatedResponse);
  });
});

describe('updateMasterVariant', () => {
  let options;
  let action;
  const projectKey = 'project-key';
  beforeEach(() => {
    options = {
      version: 1,
      variantId: 'variant-id-1',
      id: 'product-id-1',
    };
    action = updateMasterVariant({ options, projectKey });
  });
  it('should call `sdkActions.post`', () => {
    expect(action).toEqual(
      sdkActions.post({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: oneLineTrim`
          /project-key/products/product-id-1
          ?expand=productType
          &expand=taxCategory
          &expand=${encodeURIComponent('state.transitions[*]')}
          &expand=${encodeURIComponent('masterData.staged.categories[*]')}
          &expand=${encodeURIComponent(
            'masterData.staged.categories[*].ancestors[*]'
          )}
          &expand=${encodeURIComponent(
            'masterData.staged.masterVariant.prices[*].customerGroup'
          )}
          &expand=${encodeURIComponent(
            'masterData.staged.masterVariant.prices[*].channel'
          )}
          &expand=${encodeURIComponent(
            'masterData.staged.variants[*].prices[*].customerGroup'
          )}
          &expand=${encodeURIComponent(
            'masterData.staged.variants[*].prices[*].channel'
          )}
        `,
        payload: {
          version: 1,
          actions: [
            {
              action: 'changeMasterVariant',
              variantId: 'variant-id-1',
            },
          ],
        },
      })
    );
  });
});

describe('transitionProductState', () => {
  const dispatch = jest.fn(() => Promise.resolve());

  const productExpansion = [
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

  it('should dispatch the `SDK` type action to transitionate the product', () => {
    transitionProductState({
      id: 'current-visible-product',
      version: 1,
      stateId: '321',
    })(dispatch, createPluginState);

    expect(dispatch).toHaveBeenCalledWith(
      sdkActions.post({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        service: 'products',
        options: {
          id: 'current-visible-product',
          expand: productExpansion,
        },
        payload: {
          version: 1,
          actions: [
            {
              action: 'transitionState',
              state: { id: '321', typeId: 'state' },
            },
          ],
        },
      })
    );
  });
});

describe('setProductSelectionById', () => {
  it('dispatches the correct action', () => {
    expect(setProductSelectionById('1', true)).toEqual({
      type: PRODUCT_SET_CHECK_SELECTION,
      payload: { id: '1', checked: true },
    });
  });
});

describe('setSelectedProductIds', () => {
  it('dispatches the correct action', () => {
    expect(setSelectedProductIds(['1', '2'], true)).toEqual({
      type: PRODUCT_SET_ALL_CHECK_SELECTION,
      payload: { ids: ['1', '2'], checked: true },
    });
  });
});

describe('setUpdatedProduct', () => {
  const product = { id: 1, foo: true };
  it('should return an action', () => {
    expect(setUpdatedProduct(product)).toEqual({
      type: PRODUCT_UPDATED,
      payload: product,
    });
  });
});

describe('updateProduct', () => {
  const options = {
    id: '123',
    version: 1,
    actions: [{ action: 'publish' }],
  };
  it('should return an action', () => {
    expect(updateProduct(options)).toEqual(
      sdkActions.post({
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
      })
    );
  });
});

describe('setProductImageUploaded', () => {
  const product = { foo: true };
  it('should return an action', () => {
    expect(setProductImageUploaded(product)).toEqual({
      type: PRODUCT_IMAGE_UPLOADED,
      payload: product,
    });
  });
});

describe('uploadProductImages', () => {
  let result;
  let dispatch;
  const product = { foo: 'bar' };
  beforeEach(async () => {
    dispatch = jest
      .fn()
      // uploadImages
      .mockReturnValueOnce(
        Promise.resolve({
          meta: { count: 0, total: 0, filenameFailures: [], version: null },
        })
      )
      // fetch product-projections
      .mockReturnValue(Promise.resolve(product));
    result = uploadProductImages({ productId: '123', images: [] })(
      dispatch,
      createPluginState
    );
    await result;
  });
  it('should fetch the product', () => {
    expect(dispatch).toHaveBeenCalledWith(
      sdkActions.get({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        service: 'productProjections',
        options: {
          id: '123',
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
    );
  });
  it('should resolve with a product', async () => {
    await expect(result).resolves.toEqual({
      product,
      meta: { version: null, count: 0, total: 0, filenameFailures: [] },
    });
  });
});

describe('setProductAndImagesUploaded', () => {
  const payload = { foo: true };
  it('should return an action', () => {
    expect(setProductAndImagesUploaded(payload)).toEqual({
      type: PRODUCT_UPDATED_WITH_IMAGE_UPLOAD,
      payload,
    });
  });
});

describe('updateProductAndUploadImages', () => {
  let result;
  let dispatch;
  const productId = '123';
  const version = 2;
  const actions = [{ action: 'publish' }];
  const product = { foo: 'bar' };
  const projectKey = 'test-project';
  beforeEach(async () => {
    dispatch = jest
      .fn()
      .mockReturnValueOnce(
        Promise.resolve({
          meta: { count: 0, total: 0, filenameFailures: [], version: null },
        })
      )
      .mockReturnValue(Promise.resolve(product));
    result = updateProductAndUploadImages({
      id: productId,
      actions,
      version,
      projectKey,
      images: [],
    })(dispatch, createPluginState);
    await result;
  });

  it('should update the product', () => {
    expect(dispatch).toHaveBeenCalledWith(
      sdkActions.post({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        service: 'products',
        options: {
          id: productId,
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
        payload: { version, actions },
      })
    );
  });

  it('should resolve with ', async () => {
    await expect(result).resolves.toEqual({
      product,
      meta: { version: null, count: 0, total: 0, filenameFailures: [] },
    });
  });
});

describe('uploadImages', () => {
  describe('when upload of all images fails', () => {
    it('should return null as the version', async () => {
      const options = {
        projectKey: 'test',
        productId: 'product-id-1',
        images: [
          {
            variantId: 'variant-id-1',
            filename: 'foo.png',
            type: 'image/png',
            file: new File(['foo'], 'foo.png'),
          },
        ],
      };
      const dispatch = jest.fn(() => Promise.reject());
      await expect(uploadImages(options)(dispatch)).resolves.toEqual({
        meta: {
          count: 0,
          filenameFailures: ['foo.png'],
          total: 1,
          version: null,
        },
      });
    });
  });
});
