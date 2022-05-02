import React from 'react';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';
import { intlMock } from '@commercetools-local/test-utils';
import { OrderItemTableCartDiscount } from './order-item-table-cart-discount';

const createTestProps = props => ({
  lineItem: {
    id: 'line-item-id-1',
    productId: 'prod-id-1',
    name: {
      en: 'A Product',
    },
    price: {
      value: {
        centAmount: 1000,
        currencyCode: 'EUR',
      },
    },
    quantity: 2,
    totalPrice: {
      centAmount: 2000,
      currencyCode: 'EUR',
      fractionDigits: 2,
    },
    discountedPricePerQuantity: [
      {
        quantity: 2,
        discountedPrice: {
          value: {
            centAmount: 100,
            currencyCode: 'EUR',
            fractionDigits: 2,
          },
          includedDiscounts: [
            {
              discount: { id: 'discount-id' },
              discountedAmount: {
                centAmount: 100,
                currencyCode: 'EUR',
              },
            },
          ],
        },
      },
    ],
  },
  unitPrice: {
    currencyCode: 'EUR',
    centAmount: 1000,
  },
  totalPrice: {
    centAmount: 2000,
    currencyCode: 'EUR',
  },
  intl: intlMock,
  ...props,
});

describe('rendering', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<OrderItemTableCartDiscount {...props} />);
  });

  it('should render the was price block', () => {
    expect(wrapper).toRender({ className: 'regular-price-block' });
  });
  it('should render the Formatted message component passing the total price value', () => {
    expect(wrapper.find(FormattedMessage).first()).toHaveProp('values', {
      price: 'EUR 20',
    });
  });
  it('should render the discounted price block', () => {
    expect(wrapper).toRender({ className: 'discounted-price' });
  });
  it('should render discounted price value', () => {
    expect(wrapper.find({ className: 'discounted-price' })).toHaveText(
      'EUR 20'
    );
  });
  it('should pass the total discounted value to the discounted message', () => {
    expect(wrapper.find(FormattedMessage).last()).toHaveProp('values', {
      discount: 'EUR 2',
    });
  });
});
