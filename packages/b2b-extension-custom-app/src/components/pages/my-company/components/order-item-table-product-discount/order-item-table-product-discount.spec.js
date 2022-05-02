import React from 'react';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';
import { Tooltip } from '@commercetools-frontend/ui-kit';
import { intlMock } from '@commercetools-local/test-utils';
import { OrderItemTableProductDiscount } from './order-item-table-product-discount';

const createTestProps = props => ({
  lineItem: {
    productId: 'line-item-product-id',
    price: {
      value: {
        currencyCode: 'EUR',
        centAmount: 1000,
      },
      discounted: {
        discount: {
          id: 'discount-id',
          name: {
            en: 'discount-name',
          },
          value: {
            type: 'relative',
            permyriad: 1000,
          },
        },
        value: {
          currencyCode: 'EUR',
          centAmount: 100,
        },
      },
    },
  },
  language: 'en',
  languages: ['de', 'en'],
  intl: intlMock,
  ...props,
});

describe('rendering', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<OrderItemTableProductDiscount {...props} />);
  });

  it('should render the was price block', () => {
    expect(wrapper).toRender({ className: 'regular-price-block' });
  });
  it('should render the Formatted message component passing the price value', () => {
    expect(wrapper.find(FormattedMessage).first()).toHaveProp('values', {
      price: 'EUR 10',
    });
  });
  it('should render the discounted price block', () => {
    expect(wrapper).toRender({ className: 'discounted-price' });
  });
  it('should render discounted price value', () => {
    expect(wrapper.find({ className: 'discounted-price' })).toHaveText('EUR 1');
  });
  it('should render a Tooltip', () => {
    expect(wrapper).toRender(Tooltip);
  });
  describe('Tooltip discount message', () => {
    describe('when discount obj expansion available', () => {
      it('should render the discount Tooltip with the discount message (discount name and value)', () => {
        expect(wrapper.find(Tooltip)).toHaveProp('title', 'discount-name(10%)');
      });
    });
    describe('when no discount obj expansion available', () => {
      beforeEach(() => {
        props = createTestProps({
          lineItem: {
            productId: 'line-item-product-id',
            price: {
              value: {
                currencyCode: 'EUR',
                centAmount: 1000,
              },
              discounted: {
                discount: {
                  id: 'discount-id',
                },
                value: {
                  currencyCode: 'EUR',
                  centAmount: 100,
                },
              },
            },
          },
        });
        wrapper = shallow(<OrderItemTableProductDiscount {...props} />);
      });
      it('should render the discount Tooltip with the discount message (discount id)', () => {
        expect(wrapper.find(Tooltip)).toHaveProp('title', 'discount-id');
      });
    });
  });
  it('should pass the discounted price value to the discounted message', () => {
    expect(wrapper.find(FormattedMessage).last()).toHaveProp('values', {
      discount: 'EUR 9',
    });
  });
});
