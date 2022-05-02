import React from 'react';
import { shallow } from 'enzyme';

import { QuoteCreateSummary } from './quote-create-summary';

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

const createTestProps = props => ({
  quote: {
    id: 'quote-id',
    company: {
      id: 'company-id',
      name: 'company name',
    },
    employeeEmail: 'employee@company.com',
    totalPrice: {
      currencyCode: 'USD',
      centAmount: 100,
    },
    lineItems: [
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
    ],
  },
  onRemoveLineItem: jest.fn(),
  onChangeLineItemQuantity: jest.fn(),
  ...props,
});

describe('render', () => {
  let props;
  let wrapper;

  describe('when no line items', () => {
    beforeEach(() => {
      props = createTestProps({ lineItems: [] });
      wrapper = shallow(<QuoteCreateSummary {...props} />);
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('when line items', () => {
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<QuoteCreateSummary {...props} />);
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});

describe('callbacks', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<QuoteCreateSummary {...props} />);
  });

  describe('when remove line item', () => {
    beforeEach(() => {
      wrapper
        .find({ 'data-testid': 'remove-line-item-line-item-id' })
        .simulate('click');
    });

    it('should call to onRemoveLineItem', () => {
      expect(props.onRemoveLineItem).toHaveBeenCalledWith('line-item-id');
    });
  });
});
