import React from 'react';
import { shallow } from 'enzyme';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import { intlMock } from '@commercetools-local/test-utils';
import OrderItemTableProductDiscount from '../order-item-table-product-discount';
import { OrderItemTableUnitGrossPriceCell } from './order-item-table-unit-gross-price-cell';

const createTestProps = props => ({
  lineItem: {
    productId: 'product-id',
    taxRate: {
      includedInPrice: true,
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
    describe('when tax rate is included in price', () => {
      let props;
      let wrapper;
      beforeEach(() => {
        props = createTestProps();
        wrapper = shallow(<OrderItemTableUnitGrossPriceCell {...props} />);
      });

      it('should render the `OrderItemTableProductDiscount` component', () => {
        expect(wrapper).toRender(OrderItemTableProductDiscount);
      });

      it('should pass the lineItem to the `OrderItemTableProductDiscount` component', () => {
        expect(wrapper.find(OrderItemTableProductDiscount)).toHaveProp(
          'lineItem',
          props.lineItem
        );
      });
    });
    describe('when tax rate is not included in price', () => {
      let props;
      let wrapper;
      beforeEach(() => {
        props = createTestProps({
          lineItem: {
            productId: 'product-id',
            taxRate: {
              includedInPrice: false,
            },
          },
        });
        wrapper = shallow(<OrderItemTableUnitGrossPriceCell {...props} />);
      });

      it('should render the `NO_VALUE_FALLBACK` value', () => {
        expect(wrapper).toHaveText(NO_VALUE_FALLBACK);
      });
    });
  });

  describe('when item is a custom line item', () => {
    let props;
    let wrapper;
    beforeEach(() => {
      props = createTestProps({
        lineItem: {
          money: {
            currencyCode: 'EUR',
            centAmount: 1500,
          },
          taxRate: {
            includedInPrice: false,
          },
        },
        isCustomLineItem: true,
      });
      wrapper = shallow(<OrderItemTableUnitGrossPriceCell {...props} />);
    });

    it('should render the formatted money value', () => {
      expect(wrapper).toHaveText('EUR15');
    });
  });
});
