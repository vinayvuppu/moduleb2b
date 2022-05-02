import React from 'react';
import { shallow } from 'enzyme';
import OrderCreateProductsListItem, {
  getImageUrl,
  getVariantAttributes,
  getAttributeValues,
  getVariantSelectors,
  selectVariant,
} from './order-create-products-list-item';

jest.mock('react-intl', () => {
  const actual = jest.requireActual('react-intl');
  return {
    ...actual,
    useIntl: jest.fn(() => ({
      formatMessage: jest.fn(() => 'formatted message'),
      formatNumber: jest.fn(data => +data),
    })),
  };
});
jest.mock('@commercetools-frontend/application-shell-connectors', () => {
  const actual = jest.requireActual(
    '@commercetools-frontend/application-shell-connectors'
  );
  return {
    ...actual,
    useApplicationContext: jest.fn(() => ({
      dataLocale: 'en',
    })),
  };
});

const createTestProps = props => ({
  id: 'product-id-1',
  name: {
    en: 'product name',
  },
  masterVariant: {
    id: 1,
    sku: 'sku1',
    images: [{ url: 'url1' }],
    price: {
      value: {
        currencyCode: 'USD',
        centAmount: 10000,
      },
    },
    attributes: [],
  },
  variants: [],
  productType: {
    id: 'product-type-id',
    obj: {
      attributes: [],
    },
  },
  onAddVariantToCart: jest.fn(),
  isAddingVariant: false,
  ...props,
});

describe('getImageUrl', () => {
  describe('when there is not images', () => {
    it('should return undefined', () => {
      expect(getImageUrl({ images: [] })).toBeUndefined();
    });
  });

  describe('when there is images', () => {
    it('should return first image', () => {
      expect(getImageUrl({ images: [{ url: 'url1' }] })).toBe('url1');
    });
  });
});

describe('getVariantAttributes', () => {
  it('should return the attributes with constraint `CombinationUnique`', () => {
    expect(
      getVariantAttributes({
        obj: {
          attributes: [
            { attributeConstraint: 'CombinationUnique', name: 'attr1' },
            { attributeConstraint: 'none', name: 'attr2' },
          ],
        },
      })
    ).toEqual([{ attributeConstraint: 'CombinationUnique', name: 'attr1' }]);
  });
});

const createProduct = props => ({
  masterVariant: {
    id: 1,
    sku: 'sku1',
    images: [{ url: 'url1' }],
    price: {
      value: {
        currencyCode: 'USD',
        centAmount: 10000,
      },
    },
    attributes: [
      {
        name: 'size',
        value: 'S',
      },
      {
        name: 'color',
        value: { label: 'label1', key: 'key1' },
      },
    ],
  },
  variants: [
    {
      id: 2,
      sku: 'sku2',
      images: [{ url: 'url2' }],
      price: {
        value: {
          currencyCode: 'USD',
          centAmount: 10000,
        },
      },
      attributes: [
        {
          name: 'size',
          value: 'XL',
        },
        {
          name: 'color',
          value: { label: 'label2', key: 'key2' },
        },
      ],
    },
  ],
  productType: {
    obj: {
      attributes: [
        {
          attributeConstraint: 'CombinationUnique',
          name: 'color',
          type: { name: 'enum' },
          label: { en: 'color' },
        },
        {
          attributeConstraint: 'CombinationUnique',
          name: 'size',
          type: { name: 'text' },
          label: { en: 'size' },
        },
      ],
    },
  },
  ...props,
});

describe('getAttributeValues', () => {
  let product;
  let response;

  beforeEach(() => {
    product = createProduct();

    response = getAttributeValues(product, 'size');
  });

  it('should return the color attribute product values', () => {
    expect(response).toEqual(['S', 'XL']);
  });
});

describe('getVariantSelectors', () => {
  let product;
  let response;

  beforeEach(() => {
    product = createProduct();

    response = getVariantSelectors(product, 'en');
  });

  it('should return the selector for variant', () => {
    expect(response).toEqual({
      color: [
        { label: 'label1', value: 'key1' },
        { label: 'label2', value: 'key2' },
      ],
      size: [
        { label: 'S', value: 'S' },
        { label: 'XL', value: 'XL' },
      ],
    });
  });
});

describe('selectVariant', () => {
  let product;
  let attributesSelected;
  let response;

  beforeEach(() => {
    product = createProduct();
    attributesSelected = {
      color: 'key2',
      size: 'XL',
    };
    response = selectVariant(product, attributesSelected, 'en');
  });

  it('should return right variant', () => {
    expect(response).toEqual(product.variants[0]);
  });

  describe('when the combination not exists', () => {
    beforeEach(() => {
      product = createProduct();
      attributesSelected = {
        color: 'key2',
        size: 'S',
      };
      response = selectVariant(product, attributesSelected, 'en');
    });

    it('should return undefined', () => {
      expect(response).toBeUndefined();
    });
  });
});

describe.only('render', () => {
  let props;
  let wrapper;

  describe('when there is not combination unique attributes', () => {
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<OrderCreateProductsListItem {...props} />);
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should not render a selectfield', () => {
      expect(wrapper).not.toRender('SelectField');
    });
  });

  describe('when there is combination unique attributes', () => {
    beforeEach(() => {
      props = createTestProps({
        masterVariant: {
          id: 1,
          sku: 'sku1',
          images: [{ url: 'url1' }],
          price: {
            value: {
              currencyCode: 'USD',
              centAmount: 10000,
            },
          },
          attributes: [
            {
              name: 'size',
              value: 'S',
            },
          ],
        },
        variants: [
          {
            id: 2,
            sku: 'sku2',
            images: [{ url: 'url2' }],
            price: {
              value: {
                currencyCode: 'USD',
                centAmount: 10000,
              },
            },
            attributes: [
              {
                name: 'size',
                value: 'XL',
              },
            ],
          },
        ],
        productType: {
          id: 'product-type-id',
          obj: {
            attributes: [
              {
                attributeConstraint: 'CombinationUnique',
                name: 'size',
                type: { name: 'text' },
                label: { en: 'size' },
              },
            ],
          },
        },
      });
      wrapper = shallow(<OrderCreateProductsListItem {...props} />);
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should render a selectfield to select the variant attributes', () => {
      expect(wrapper).toRender('SelectField');
    });
  });
});
