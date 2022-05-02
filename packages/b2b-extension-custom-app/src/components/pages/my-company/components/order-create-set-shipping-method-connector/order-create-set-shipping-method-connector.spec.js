import React from 'react';
import { shallow } from 'enzyme';
import {
  OrderCreateSetShippingMethodConnector,
  mapShippingMethodsWithMatchingRate,
} from './order-create-set-shipping-method-connector';

const shippingMethods = [
  {
    id: 'shipping-method-1',
    isDefault: true,
    zoneRates: [
      {
        shippingRates: [
          {
            isMatching: true,
            price: {
              currencyCode: 'EUR',
              centAmount: 200,
            },
            freeAbove: {
              currencyCode: 'EUR',
              centAmount: 100,
            },
          },
          {
            isMatching: false,
            price: {
              currencyCode: 'EUR',
              centAmount: 400,
            },
            freeAbove: {
              currencyCode: 'EUR',
              centAmount: 200,
            },
          },
          {
            isMatching: false,
            price: {
              currencyCode: 'EUR',
              centAmount: 800,
            },
            freeAbove: {
              currencyCode: 'EUR',
              centAmount: 600,
            },
          },
        ],
      },
    ],
  },
  {
    id: 'shipping-method-2',
    zoneRates: [
      {
        shippingRates: [
          {
            isMatching: false,
            price: {
              currencyCode: 'EUR',
              centAmount: 200,
            },
            freeAbove: {
              currencyCode: 'EUR',
              centAmount: 100,
            },
          },
          {
            isMatching: true,
            price: {
              currencyCode: 'EUR',
              centAmount: 400,
            },
          },
          {
            isMatching: false,
            price: {
              currencyCode: 'EUR',
              centAmount: 800,
            },
            freeAbove: {
              currencyCode: 'EUR',
              centAmount: 600,
            },
          },
        ],
      },
    ],
  },
];

const createTestProps = props => ({
  cartId: 'test-cart-id',
  children: jest.fn(),
  shippingMethodsByCartQuery: {
    loading: false,
    shippingMethodsByCart: shippingMethods,
  },
  hasGeneralPermissions: true,
  ...props,
});

describe('rendering', () => {
  let props;

  beforeEach(() => {
    props = createTestProps();
    shallow(<OrderCreateSetShippingMethodConnector {...props} />);
  });

  it('should invoke `children`', () => {
    expect(props.children).toHaveBeenCalled();
  });

  describe('shippingMethodsByCartFetcher', () => {
    it('should invoke `children` with `isLoading`', () => {
      expect(props.children).toHaveBeenCalledWith(
        expect.objectContaining({
          shippingMethodsByCartFetcher: expect.objectContaining({
            isLoading: props.shippingMethodsByCartQuery.loading,
          }),
        })
      );
    });

    it('should invoke `children` with `shippingMethodsByCart`', () => {
      expect(props.children).toHaveBeenCalledWith(
        expect.objectContaining({
          shippingMethodsByCartFetcher: expect.objectContaining({
            shippingMethodsByCart:
              props.shippingMethodsByCartQuery.shippingMethodsByCart,
          }),
        })
      );
    });

    it('should invoke `children` with `defaultShippingMethod`', () => {
      expect(props.children).toHaveBeenCalledWith(
        expect.objectContaining({
          shippingMethodsByCartFetcher: expect.objectContaining({
            defaultShippingMethod: shippingMethods[0],
          }),
        })
      );
    });
  });
});

describe('getShippingMethodsWithMatchingRate', () => {
  const data = {
    shippingMethodsByCartQuery: {
      loading: false,
      shippingMethodsByCart: shippingMethods,
    },
  };
  it('should return the matching rate for the shipping methods', () => {
    expect(mapShippingMethodsWithMatchingRate(data)).toEqual(
      expect.objectContaining({
        shippingMethodsByCartQuery: expect.objectContaining({
          shippingMethodsByCart: [
            {
              id: 'shipping-method-1',
              isDefault: true,
              rate: {
                freeAbove: { centAmount: 100, currencyCode: 'EUR' },
                isMatching: true,
                price: { centAmount: 200, currencyCode: 'EUR' },
              },
            },
            {
              id: 'shipping-method-2',
              rate: {
                isMatching: true,
                price: { centAmount: 400, currencyCode: 'EUR' },
              },
            },
          ],
        }),
      })
    );
  });
});
