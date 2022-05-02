import React from 'react';
import { shallow } from 'enzyme';
import { intlMock } from '@commercetools-local/test-utils';
import { OrderCreateCartSummary } from './order-create-cart-summary';

const createTestProps = props => ({
  cartDraft: {
    shippingInfo: undefined,
    totalPrice: {
      fractionDigits: 2,
    },
  },
  allLineItems: [],
  discounts: [],
  totalGross: {
    centAmount: 0,
    currencyCode: 'EUR',
  },
  subtotal: {
    centAmount: 0,
    currencyCode: 'EUR',
  },
  taxPortions: [],
  onRemoveDiscountCode: jest.fn(),
  onRemoveLineItem: jest.fn(),
  onChangeLineItemQuantity: jest.fn(),
  intl: intlMock,
  // withApplicationContext
  language: 'en',
  languages: ['en'],
  dataLocale: 'en',
  discountCodesQuery: {
    loading: false,
    discountCodes: {
      results: [],
    },
  },
  ...props,
});

describe('render', () => {
  describe('when the cart is empty', () => {
    let props;
    let wrapper;
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<OrderCreateCartSummary {...props} />);
    });
    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
  describe('when the cart is not empty', () => {
    describe('when no cart discounts are set to the cart', () => {
      let props;
      let wrapper;
      beforeEach(() => {
        props = createTestProps({
          cartDraft: {
            shippingInfo: {
              shippingMethodName: 'DHL',
            },
            totalPrice: {
              fractionDigits: 2,
            },
          },
          shippingPrice: {
            centAmount: 100,
            currencyCode: 'EUR',
          },
          totalGross: {
            centAmount: 2000,
            currencyCode: 'EUR',
          },
          subtotal: {
            centAmount: 1800,
            currencyCode: 'EUR',
          },
          taxPortions: [
            {
              name: 'tax portion',
              amount: {
                centAmount: 200,
                currencyCode: 'EUR',
              },
              rate: 0.12,
            },
          ],
          allLineItems: [
            {
              id: 'line-item-id',
              name: {
                en: 'item name',
              },
              quantity: 1,
              price: {
                value: {
                  centAmount: 1800,
                  currencyCode: 'EUR',
                },
              },
              totalPrice: {
                centAmount: 1800,
                currencyCode: 'EUR',
              },
              discountedPricePerQuantity: [],
              variant: { attributesRaw: [] },
            },
          ],
        });
        wrapper = shallow(<OrderCreateCartSummary {...props} />);
      });
      it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
      });
    });
    describe('when cart discounts are set to the cart', () => {
      let props;
      let wrapper;
      beforeEach(() => {
        props = createTestProps({
          cartDraft: {
            shippingInfo: {
              shippingMethodName: 'DHL',
            },
            totalPrice: {
              fractionDigits: 2,
            },
          },
          shippingPrice: {
            centAmount: 100,
            currencyCode: 'EUR',
          },
          totalGross: {
            centAmount: 2000,
            currencyCode: 'EUR',
          },
          subtotal: {
            centAmount: 1800,
            currencyCode: 'EUR',
          },
          taxPortions: [
            {
              name: 'tax portion',
              amount: {
                centAmount: 200,
                currencyCode: 'EUR',
              },
              rate: 0.12,
            },
          ],
          allLineItems: [
            {
              id: 'line-item-id',
              name: {
                en: 'item name',
              },
              quantity: 1,
              price: {
                value: {
                  centAmount: 1800,
                  currencyCode: 'EUR',
                },
              },
              totalPrice: {
                centAmount: 1800,
                currencyCode: 'EUR',
              },
              discountedPricePerQuantity: [],
              variant: { attributesRaw: [] },
            },
          ],
          discounts: [
            {
              id: 'cart-discount-id',
              amount: {
                centAmount: 500,
                currencyCode: 'EUR',
              },
              name: { en: 'cart-discount-name' },
            },
          ],
          discountCodesQuery: {
            loading: false,
            discountCodes: {
              results: [{ id: 'discount-code-id', code: 'code-1' }],
            },
          },
        });
        wrapper = shallow(<OrderCreateCartSummary {...props} />);
      });
      it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
      });
    });

    describe('when the change quantity modal is open', () => {
      let props;
      let wrapper;
      beforeEach(() => {
        props = createTestProps({
          cartDraft: {
            shippingInfo: {
              shippingMethodName: 'DHL',
            },
            totalPrice: {
              fractionDigits: 2,
            },
          },
          shippingPrice: {
            centAmount: 100,
            currencyCode: 'EUR',
          },
          totalGross: {
            centAmount: 2000,
            currencyCode: 'EUR',
          },
          subtotal: {
            centAmount: 1800,
            currencyCode: 'EUR',
          },
          taxPortions: [
            {
              name: 'tax portion',
              amount: {
                centAmount: 200,
                currencyCode: 'EUR',
              },
              rate: 0.12,
            },
          ],
          allLineItems: [
            {
              id: 'line-item-id',
              name: {
                en: 'item name',
              },
              quantity: 1,
              price: {
                value: {
                  centAmount: 1800,
                  currencyCode: 'EUR',
                },
              },
              totalPrice: {
                centAmount: 1800,
                currencyCode: 'EUR',
              },
              discountedPricePerQuantity: [],
              variant: { attributesRaw: [] },
            },
          ],
        });
        wrapper = shallow(<OrderCreateCartSummary {...props} />);
        wrapper.setState({
          isChangeQuantityModalOpen: true,
          changeQuantityLineItem: {
            id: 'id-1',
            quantity: 1,
            name: 'product-name',
          },
        });
      });
      it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
      });
    });
  });
});

describe('callbacks', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = createTestProps({
      cartDraft: {
        shippingInfo: {
          shippingMethodName: 'DHL',
        },
        totalPrice: {
          fractionDigits: 2,
        },
      },
      shippingPrice: {
        centAmount: 100,
        currencyCode: 'EUR',
      },
      totalGross: {
        centAmount: 2000,
        currencyCode: 'EUR',
      },
      subtotal: {
        centAmount: 1800,
        currencyCode: 'EUR',
      },
      taxPortions: [
        {
          name: 'tax portion',
          amount: {
            centAmount: 200,
            currencyCode: 'EUR',
          },
          rate: 0.12,
        },
      ],
      allLineItems: [
        {
          id: 'line-item-id',
          name: {
            en: 'item name',
          },
          quantity: 1,
          price: {
            value: {
              centAmount: 1800,
              currencyCode: 'EUR',
            },
          },
          totalPrice: {
            centAmount: 1800,
            currencyCode: 'EUR',
          },
          discountedPricePerQuantity: [],
          variant: { attributesRaw: [] },
        },
      ],
      discounts: [
        {
          id: 'cart-discount-id',
          amount: {
            centAmount: 500,
            currencyCode: 'EUR',
          },
          name: { en: 'cart-discount-name' },
        },
      ],
      discountCodesQuery: {
        loading: false,
        discountCodes: {
          results: [{ id: 'discount-code-id', code: 'code-1' }],
        },
      },
    });
    wrapper = shallow(<OrderCreateCartSummary {...props} />);
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
  describe('when remove discount', () => {
    beforeEach(() => {
      wrapper
        .find({ 'data-testid': 'remove-discount-discount-code-id' })
        .simulate('click');
    });

    it('should call to onRemoveDiscountCode', () => {
      expect(props.onRemoveDiscountCode).toHaveBeenCalledWith(
        'discount-code-id'
      );
    });
  });

  describe('handleSelectLineItemToChangeQuantity', () => {
    beforeEach(() => {
      wrapper
        .instance()
        .handleSelectLineItemToChangeQuantity({ id: 'lineItemId' });
    });

    it('should change the isChangeQuantityModalOpen state', () => {
      expect(wrapper.state('isChangeQuantityModalOpen')).toEqual(true);
    });

    it('should change the changeQuantityLineItem state', () => {
      expect(wrapper.state('changeQuantityLineItem')).toEqual({
        id: 'lineItemId',
      });
    });
  });
  describe('handleCloseModal', () => {
    beforeEach(() => {
      wrapper.instance().handleCloseModal();
    });

    it('should change the isChangeQuantityModalOpen state', () => {
      expect(wrapper.state('isChangeQuantityModalOpen')).toEqual(false);
    });

    it('should change the changeQuantityLineItem state', () => {
      expect(wrapper.state('changeQuantityLineItem')).toEqual(undefined);
    });
  });

  describe('handleChangeQuantity', () => {
    let instance;
    beforeEach(() => {
      instance = wrapper.instance();
      instance.handleSelectLineItemToChangeQuantity({
        id: 'lineItemId',
        quantity: 10,
      });

      instance.handleChangeQuantity(29);
    });

    it('should call to onChangeLineItemQuantity', () => {
      expect(props.onChangeLineItemQuantity).toHaveBeenCalledWith(
        'lineItemId',
        29
      );
    });

    it('should change the isChangeQuantityModalOpen state', () => {
      expect(wrapper.state('isChangeQuantityModalOpen')).toEqual(false);
    });

    it('should change the changeQuantityLineItem state', () => {
      expect(wrapper.state('changeQuantityLineItem')).toEqual(undefined);
    });
  });
});
