import React from 'react';
import { shallow } from 'enzyme';
import { QuoteCreate } from './quote-create';
import QuoteSummarySection from '../quote-summary-section';
import QuoteCreateAddLineItems from '../quote-create-add-line-items';

const lineItems = [
  {
    id: 'line-item-id',
    productId: 'product-id',
    nameAllLocales: [
      {
        locale: 'en',
        value: 'Top Jucca black',
      },
    ],
    variant: {
      sku: 'M0E20000000EC8N',
      images: [
        {
          url: 'url-1',
        },
      ],
    },
    price: {
      id: 'price-id-1',
      value: {
        currencyCode: 'USD',
        centAmount: 100,
      },
    },
    quantity: 1,
    totalPrice: {
      currencyCode: 'USD',
      centAmount: 100,
    },
  },
];
const createTestProps = props => ({
  allLineItems: lineItems,
  quote: {
    id: 'quote-id',
    company: {
      id: 'company-id',
      name: 'company name',
    },
    customerGroup: {
      id: 'customer-group-id',
    },
    employeeEmail: 'employee@company.com',
    totalPrice: {
      currencyCode: 'USD',
      centAmount: 100,
    },
    lineItems,
  },
  createQuote: jest.fn(),
  addLineItem: jest.fn(),
  requestQuote: jest.fn(),
  removeLineItem: jest.fn(),
  changeLineItemQuantity: jest.fn(),
  employee: {
    id: 'employee-id',
    email: 'employee@company.com',
  },
  company: {
    id: 'company-id',
  },
  projectKey: 'project-key',
  showNotification: jest.fn(),
  ...props,
});

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useParams: jest.fn(() => ({
      projectKey: 'test-1',
    })),
    useHistory: jest.fn(() => ({ push: jest.fn() })),
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

jest.mock('react-intl', () => {
  const actual = jest.requireActual('react-intl');
  return {
    ...actual,
    useIntl: jest.fn(() => ({
      formatNumber: jest.fn(({ centAmount }) => ({ centAmount })),
      formatMessage: jest.fn(() => 'formatted message'),
    })),
  };
});

describe('render', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<QuoteCreate {...props} />);
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render the QuoteCreateAddLineItems', () => {
    expect(wrapper).toRender(QuoteCreateAddLineItems);
  });
  it('should render the QuoteSummarySection', () => {
    expect(wrapper).toRender(QuoteSummarySection);
  });
});
