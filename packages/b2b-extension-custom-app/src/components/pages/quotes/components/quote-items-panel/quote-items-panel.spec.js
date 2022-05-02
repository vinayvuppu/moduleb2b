import React from 'react';
import { shallow } from 'enzyme';

import { QuoteItemsPanel } from './quote-items-panel';

jest.mock('react-intl', () => {
  const actual = jest.requireActual('react-intl');
  return {
    ...actual,
    useIntl: jest.fn(() => ({
      formatMessage: jest.fn(() => 'formatted message'),
      formatNumber: jest.fn(),
      locale: 'EN',
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
      currencies: ['USD'],
    })),
  };
});

const createTestProps = props => ({
  quote: {
    id: 'quote-id',
    employeeId: 'employee-id',
    employeeEmail: 'employee@company.com',
    company: {
      id: 'company-id',
      name: 'company-name',
    },
    totalPrice: {
      currencyCode: 'USD',
      centAmount: 1000,
    },
    lineItems: [
      {
        id: 'line-item-id',
        productId: 'product-id',
        nameAllLocales: {
          locale: 'EN',
          value: 'product-1',
        },
        variant: {
          sku: 'sku1',
          images: {
            url: 'url1',
          },
        },
        price: {
          id: 'price1',
          value: {
            currencyCode: 'USD',
            centAmount: 1000,
          },
        },
        quantity: 1,
        totalPrice: {
          currencyCode: 'USD',
          centAmount: 1000,
        },
      },
    ],
  },
  isAuthorized: true,
  updateQuoteItems: jest.fn(),
  onUpdateOriginalTotalPrice: jest.fn(),
  addAmountDiscount: jest.fn(),
  addPercentageDiscount: jest.fn(),
  showNotification: jest.fn(),
  ...props,
});

describe('rendering', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<QuoteItemsPanel {...props} />);
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
