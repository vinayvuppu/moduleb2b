import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { OrderDetails } from './order-details';

const order = {
  orderState: 'Confirmed',
  paymentState: 'Pending',
  shipmentState: 'Pending',
  shippingInfo: {
    shippingMethodName: 'Express US',
    taxRate: {
      name: '10% incl.',
      amount: 0.1,
    },
    taxedPrice: {
      totalNet: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 909,
        fractionDigits: 2,
      },
      totalGross: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 1000,
        fractionDigits: 2,
      },
    },
  },
  taxedPrice: {
    totalNet: {
      type: 'centPrecision',
      currencyCode: 'USD',
      centAmount: 13182,
      fractionDigits: 2,
    },
    totalGross: {
      type: 'centPrecision',
      currencyCode: 'USD',
      centAmount: 14500,
      fractionDigits: 2,
    },
    taxPortions: [
      {
        name: '10% incl.',
        amount: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 1318,
          fractionDigits: 2,
        },
      },
    ],
  },
  employee: {
    id: '05502506-d831-49de-ab16-9026c319c07f',
    email: 'florian@devgurus.io',
  },
  totalPrice: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 10300,
    fractionDigits: 2,
  },
  shippingAddress: {
    additionalStreetInfo: null,
    country: 'US',
    additionalAddressInfo: null,
  },
  billingAddress: {
    additionalStreetInfo: null,
    country: 'US',
    additionalAddressInfo: null,
  },
  lineItems: [
    {
      id: '1635aa91-1b6d-489e-a3c1-4dd2cc8608c6',
      name: 'Top Jucca black',
      quantity: 1,
      custom: {
        customFieldsRaw: [
          {
            name: 'originalPrice',
            value: {
              fractionDigits: 2,
              centAmount: 13500,
              currencyCode: 'USD',
              type: 'centPrecision',
            },
          },
        ],
      },
      totalPrice: {
        centAmount: 10000,
      },
      taxRate: {
        amount: 0.1,
        subRates: [],
      },
      taxedPrice: {
        totalNet: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 9091,
          fractionDigits: 2,
        },
        totalGross: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 10000,
          fractionDigits: 2,
        },
      },
      variant: {
        sku: 'M0E20000000EC8N',
        images: [
          {
            url:
              'https://s3-eu-west-1.amazonaws.com/commercetools-maximilian/products/081138_1_large.jpg',
          },
        ],
      },
    },
  ],
};

describe('Order details component', () => {
  test('render snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <IntlProvider locale="en">
          <OrderDetails order={order} backUrl="www.foo.com" />
        </IntlProvider>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
