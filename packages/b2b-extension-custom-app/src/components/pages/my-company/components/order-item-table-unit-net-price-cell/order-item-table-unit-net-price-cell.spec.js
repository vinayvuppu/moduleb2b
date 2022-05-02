import React from 'react';
import { shallow } from 'enzyme';
import { intlMock } from '@commercetools-local/test-utils';
import { OrderItemTableUnitNetPriceCell } from './order-item-table-unit-net-price-cell';

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
    taxRate: {
      includedInPrice: true,
      amount: 0.25,
    },
    totalPrice: {
      currencyCode: 'EUR',
      centAmount: 3000,
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
  describe('when item is a line item', () => {
    let props;
    let wrapper;
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<OrderItemTableUnitNetPriceCell {...props} />);
    });

    it('should render the formatted net unit price', () => {
      expect(wrapper).toHaveText('EUR8');
    });
  });

  describe('when the item is a custom line item', () => {
    let props;
    let wrapper;
    beforeEach(() => {
      props = createTestProps({
        lineItem: {
          quantity: 2,
          money: {
            currencyCode: 'EUR',
            centAmount: 1500,
          },
          totalPrice: {
            currencyCode: 'EUR',
            centAmount: 3000,
          },
        },
        isCustomLineItem: true,
      });
      wrapper = shallow(<OrderItemTableUnitNetPriceCell {...props} />);
    });

    it('should render the formatted money value as net unit price', () => {
      expect(wrapper).toHaveText('EUR15');
    });
  });
});
