import React from 'react';
import { shallow } from 'enzyme';
import { intlMock } from '@commercetools-local/test-utils';
import OrderItemTableProductDiscount from '../order-item-table-product-discount';
import { OrderItemTableUnitPriceCell } from './order-item-table-unit-price-cell';
import OrderCreateLocalizedChannelName from '../order-create-localized-channel-name';

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
    let props;
    let wrapper;

    it('should render the `OrderItemTableProductDiscount` component', () => {
      props = createTestProps();
      wrapper = shallow(<OrderItemTableUnitPriceCell {...props} />);

      expect(wrapper).toRender(OrderItemTableProductDiscount);
    });

    it('should pass the line item to the `OrderItemTableProductDiscount` component', () => {
      props = createTestProps();
      wrapper = shallow(<OrderItemTableUnitPriceCell {...props} />);

      expect(wrapper.find(OrderItemTableProductDiscount)).toHaveProp(
        'lineItem',
        props.lineItem
      );
    });

    describe('when the item has a channel', () => {
      it('should render the channel name', () => {
        props = createTestProps({
          lineItem: {
            productId: 'product-id',
            taxRate: {
              includedInPrice: true,
            },
            distributionChannel: {
              id: '1234-5678-abcd-efgh',
              key: 'schlagenheim',
            },
          },
        });
        wrapper = shallow(<OrderItemTableUnitPriceCell {...props} />);

        expect(wrapper).toRender(OrderCreateLocalizedChannelName);
      });
    });
  });

  describe('when the item is a custom line item', () => {
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
      wrapper = shallow(<OrderItemTableUnitPriceCell {...props} />);
    });

    it('should render the formatted money value', () => {
      expect(wrapper).toHaveText('EUR15');
    });
  });
});
