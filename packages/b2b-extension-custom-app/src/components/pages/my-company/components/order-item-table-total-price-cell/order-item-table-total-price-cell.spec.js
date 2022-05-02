import React from 'react';
import { shallow } from 'enzyme';
import { intlMock } from '@commercetools-local/test-utils';
import OrderItemTableCartDiscount from '../order-item-table-cart-discount';
import { OrderItemTableTotalPriceCell } from './order-item-table-total-price-cell';

const createTestProps = props => ({
  lineItem: {
    productId: 'product-id',
    quantity: 2,
    price: {
      value: {
        currencyCode: 'EUR',
        centAmount: 1000,
      },
    },
    discountedPricePerQuantity: [],
    taxRate: {
      includedInPrice: false,
      amount: 0.25,
    },
    totalPrice: {
      currencyCode: 'EUR',
      centAmount: 2000,
      fractionDigits: 2,
    },
  },
  isCustomLineItem: false,
  intl: {
    ...intlMock,
    formatNumber: (amount, { currency }) => `${currency}${amount}`,
  },
  ...props,
});

describe('rendering', () => {
  describe('when the item is a line item', () => {
    describe('when tax rate not included in price', () => {
      let props;
      let wrapper;
      beforeEach(() => {
        props = createTestProps();
        wrapper = shallow(<OrderItemTableTotalPriceCell {...props} />);
      });

      it('should render the total net price', () => {
        expect(wrapper).toHaveText('EUR20');
      });
    });
    describe('when tax rate included in price', () => {
      let props;
      let wrapper;
      beforeEach(() => {
        props = createTestProps({
          lineItem: {
            productId: 'product-id',
            quantity: 2,
            price: {
              value: {
                currencyCode: 'EUR',
                centAmount: 1000,
              },
            },
            discountedPricePerQuantity: [],
            taxRate: {
              includedInPrice: true,
              amount: 0.25,
            },
            totalPrice: {
              currencyCode: 'EUR',
              centAmount: 2000,
            },
          },
        });
        wrapper = shallow(<OrderItemTableTotalPriceCell {...props} />);
      });

      it('should render the `OrderItemTableCartDiscount` component', () => {
        expect(wrapper).toRender(OrderItemTableCartDiscount);
      });

      it('should pass the line item to the `OrderItemTableCartDiscount` component', () => {
        expect(wrapper.find(OrderItemTableCartDiscount)).toHaveProp(
          'lineItem',
          props.lineItem
        );
      });

      it('should pass the unit price to the `OrderItemTableCartDiscount` component', () => {
        expect(wrapper.find(OrderItemTableCartDiscount)).toHaveProp(
          'unitPrice',
          { currencyCode: 'EUR', centAmount: 1000 }
        );
      });

      it('should pass the total price to the `OrderItemTableCartDiscount` component', () => {
        expect(
          wrapper.find(OrderItemTableCartDiscount)
        ).toHaveProp('totalPrice', { currencyCode: 'EUR', centAmount: 2000 });
      });
    });
  });

  describe('when the item is a custom line item', () => {
    describe('when tax rate not included in price', () => {
      let props;
      let wrapper;
      beforeEach(() => {
        props = createTestProps({
          lineItem: {
            quantity: 2,
            money: {
              currencyCode: 'EUR',
              centAmount: 1000,
            },
            taxRate: {
              includedInPrice: false,
              amount: 0.25,
            },
            discountedPricePerQuantity: [],
            totalPrice: {
              currencyCode: 'EUR',
              centAmount: 2000,
            },
          },
          isCustomLineItem: true,
        });
        wrapper = shallow(<OrderItemTableTotalPriceCell {...props} />);
      });

      it('should render the total net price', () => {
        expect(wrapper).toHaveText('EUR20');
      });
    });
    describe('when tax rate included in price', () => {
      let props;
      let wrapper;
      beforeEach(() => {
        props = createTestProps({
          lineItem: {
            quantity: 2,
            money: {
              currencyCode: 'EUR',
              centAmount: 1000,
            },
            discountedPricePerQuantity: [],
            taxRate: {
              includedInPrice: true,
              amount: 0.25,
            },
            taxedPrice: {
              totalNet: {
                currencyCode: 'EUR',
                centAmount: 1600,
              },
              totalGross: {
                currencyCode: 'EUR',
                centAmount: 2000,
              },
            },
            totalPrice: {
              currencyCode: 'EUR',
              centAmount: 2000,
              fractionDigits: 2,
            },
          },
          isCustomLineItem: true,
        });
        wrapper = shallow(<OrderItemTableTotalPriceCell {...props} />);
      });

      it('should render the `OrderItemTableCartDiscount` component', () => {
        expect(wrapper).toRender(OrderItemTableCartDiscount);
      });

      it('should pass the line item to the `OrderItemTableCartDiscount` component', () => {
        expect(wrapper.find(OrderItemTableCartDiscount)).toHaveProp(
          'lineItem',
          props.lineItem
        );
      });

      it('should pass the unit price to the `OrderItemTableCartDiscount` component', () => {
        expect(wrapper.find(OrderItemTableCartDiscount)).toHaveProp(
          'unitPrice',
          { currencyCode: 'EUR', centAmount: 1000 }
        );
      });

      it('should pass the total price to the `OrderItemTableCartDiscount` component', () => {
        expect(
          wrapper.find(OrderItemTableCartDiscount)
        ).toHaveProp('totalPrice', { currencyCode: 'EUR', centAmount: 2000 });
      });
    });
  });
});
