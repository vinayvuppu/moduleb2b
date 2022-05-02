import React from 'react';
import { shallow } from 'enzyme';
import { DOMAINS } from '@commercetools-frontend/constants';
import { intlMock } from '@commercetools-local/test-utils';
import { OrderCreateAddLineItems } from './order-create-add-line-items';
import OrderCreateSelectStoreAndCurrency from '../order-create-select-store-and-currency';

const createTestProps = props => ({
  renderSaveToolbarStep: jest.fn(),
  cartDraftState: {
    value: {
      id: 'cart-id',
      customerId: '123',
      version: 1,
      currency: 'EUR',
      customerGroup: {
        id: 'customer-group-id',
      },
    },
    update: jest.fn(),
  },
  cartUpdater: {
    isLoading: false,
    execute: jest.fn(() => Promise.resolve({ id: 'cart-id-1', version: 2 })),
  },

  discounts: [],
  shippingDiscounts: [],
  discountCodes: [],
  allLineItems: [],
  showNotification: jest.fn(),
  onActionError: jest.fn(),
  fetchProducts: jest.fn(),
  projectKey: 'test-project',
  updateStore: jest.fn(),
  goToOrdersList: jest.fn(),
  hideInitialSelectionModal: jest.fn(),
  intl: intlMock,
  countrySelected: false,
  // withApplicationContext
  dataLocale: 'en',
  ...props,
});

describe('render', () => {
  describe('when there is not currency selected', () => {
    let props;
    let wrapper;
    beforeEach(() => {
      props = createTestProps({
        fetchProducts: jest.fn(),
        cartDraftState: {
          value: { id: undefined, currency: undefined },
          update: jest.fn(),
        },
      });
      wrapper = shallow(<OrderCreateAddLineItems {...props} />);
      wrapper.setState({
        totals: 1,
        products: [{ id: 'product-id-1', name: { en: 'test' } }],
      });
    });

    it('should render the OrderCreateSelectStoreAndCurrency', () => {
      expect(wrapper).toRender(OrderCreateSelectStoreAndCurrency);
    });
  });
  describe('when loading', () => {
    let props;
    let wrapper;
    beforeEach(() => {
      props = createTestProps({ fetchProducts: jest.fn() });
      wrapper = shallow(<OrderCreateAddLineItems {...props} />);
    });

    it('should render the LoadingSpinner', () => {
      expect(wrapper).toRender('LoadingSpinner');
    });
  });
  describe('when the shopping cart is empty', () => {
    let props;
    let wrapper;
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<OrderCreateAddLineItems {...props} />);
      wrapper.setState({ totals: 1, products: [{ id: 'product-id-1' }] });
    });
    it('should render the title', () => {
      expect(wrapper).toRender('TextHeadline');
    });
  });
});

describe('callbacks', () => {
  describe('when adding a variant to the cart successfully', () => {
    let props;
    let wrapper;

    beforeEach(async () => {
      props = createTestProps({
        updateCart: jest.fn(() =>
          Promise.resolve({
            id: 'cart-1',
            version: 2,
          })
        ),
        cartDraft: { id: 'cart-1', version: 1, currency: 'EUR' },
      });
      wrapper = shallow(<OrderCreateAddLineItems {...props} />);
      await wrapper.instance().handleAddVariantToCart({
        sku: '123',
        quantity: 1,
      });
    });
    it('should call `execute` from `cartUpdater`', () => {
      expect(props.cartUpdater.execute).toHaveBeenCalledTimes(1);
    });
    it('should call showNotification', () => {
      expect(props.showNotification).toHaveBeenCalledTimes(1);
    });
    it('should call showNotification with parameters', () => {
      expect(props.showNotification).toHaveBeenCalledWith({
        kind: 'success',
        domain: DOMAINS.SIDE,
        text: 'Orders.Create.Step.LineItems.search.addVariantSuccess',
      });
    });
  });

  describe('when there is an error with adding a variant to the cart', () => {
    let props;
    let wrapper;

    describe('when there is an unknown error', () => {
      beforeEach(async () => {
        props = createTestProps({
          cartUpdater: {
            isLoading: false,
            execute: jest.fn(() =>
              Promise.reject(new Error('Something went wrong'))
            ),
          },
          cartDraft: { id: 'cart-1', version: 1, currency: 'EUR' },
        });
        wrapper = shallow(<OrderCreateAddLineItems {...props} />);
        await wrapper
          .instance()
          .handleAddVariantToCart({
            sku: '123',
            quantity: 1,
          })
          .then(
            () => {},
            () => {}
          );
      });
      it('should call onActionError', () => {
        expect(props.onActionError).toHaveBeenCalledTimes(1);
      });
    });

    describe('when there is a `MatchingPriceNotFound` error', () => {
      beforeEach(async () => {
        props = createTestProps({
          cartUpdater: {
            isLoading: false,
            execute: jest.fn(() =>
              Promise.reject([{ code: 'MatchingPriceNotFound' }])
            ),
          },
          cartDraft: { id: 'cart-1', version: 1, currency: 'EUR' },
        });
        wrapper = shallow(<OrderCreateAddLineItems {...props} />);
        await wrapper
          .instance()
          .handleAddVariantToCart({
            sku: '123',
            quantity: 1,
          })
          .then(
            () => {},
            () => {}
          );
      });
      it('should show message for `MatchingPriceNotFound` error', () => {
        expect(props.showNotification).toHaveBeenCalledWith({
          domain: 'side',
          kind: 'error',
          text: 'Orders.Create.Step.LineItems.search.addVariantFailure',
        });
      });
    });

    describe('when there is a `MissingTaxRateForCountry` error', () => {
      beforeEach(async () => {
        props = createTestProps({
          cartUpdater: {
            isLoading: false,
            execute: jest.fn(() =>
              Promise.reject([{ code: 'MissingTaxRateForCountry' }])
            ),
          },
          cartDraft: { id: 'cart-1', version: 1, currency: 'EUR' },
        });
        wrapper = shallow(<OrderCreateAddLineItems {...props} />);
        await wrapper
          .instance()
          .handleAddVariantToCart({
            sku: '123',
            quantity: 1,
          })
          .then(
            () => {},
            () => {}
          );
      });
      it('should show message for `MissingTaxRateForCountry` error', () => {
        expect(props.showNotification).toHaveBeenCalledWith({
          domain: 'side',
          kind: 'error',
          text: 'Orders.Create.Step.LineItems.search.addVariantFailureTaxRate',
        });
      });
    });
  });

  describe('setSearchTerm', () => {
    let wrapper;
    let props;
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<OrderCreateAddLineItems {...props} />);
      wrapper = wrapper.setState({
        totals: 1,
        products: [{ id: 'product-id-1' }],
      });
      wrapper.instance().setSearchTerm('testing');
    });

    it('should change the state', () => {
      expect(wrapper).toHaveState('searchTerm', 'testing');
    });
  });

  describe('handlePagechange', () => {
    let wrapper;
    let props;
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<OrderCreateAddLineItems {...props} />);
      wrapper = wrapper.setState({
        totals: 1,
        products: [{ id: 'product-id-1' }],
      });
      wrapper.instance().handlePageChange(10);
    });

    it('should change the state', () => {
      expect(wrapper).toHaveState('page', 10);
    });
  });

  describe('handlePerPageChange', () => {
    let wrapper;
    let props;
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<OrderCreateAddLineItems {...props} />);
      wrapper = wrapper.setState({
        totals: 1,
        products: [{ id: 'product-id-1' }],
      });
      wrapper.instance().handlePerPageChange(10);
    });

    it('should change the state', () => {
      expect(wrapper).toHaveState('perPage', 10);
    });
  });

  describe('searchProducts', () => {
    let wrapper;
    let props;

    describe('when there is not a search term', () => {
      beforeEach(async () => {
        props = createTestProps();
        wrapper = shallow(<OrderCreateAddLineItems {...props} />);
        wrapper = wrapper.setState({
          totals: 1,
          products: [{ id: 'product-id-1' }],
        });
        await wrapper.instance().searchProducts();
      });

      it('should call to fetchProducts with sort id', () => {
        expect(props.fetchProducts).toHaveBeenCalledWith({
          filter: ['variants.scopedPrice:exists'],
          page: 1,
          perPage: 20,
          priceCountry: undefined,
          priceCurrency: 'EUR',
          priceCustomerGroup: 'customer-group-id',
          sort: [{ by: 'id', direction: 'asc' }],
        });
      });
    });
    describe('when there is a search term', () => {
      beforeEach(async () => {
        props = createTestProps();
        wrapper = shallow(<OrderCreateAddLineItems {...props} />);
        wrapper = wrapper.setState({
          searchTerm: 'testing',
          totals: 1,
          products: [{ id: 'product-id-1' }],
        });
        await wrapper.instance().searchProducts();
      });

      it('should call to fetchProducts with text filter', () => {
        expect(props.fetchProducts).toHaveBeenCalledWith({
          filter: ['variants.scopedPrice:exists'],
          page: 1,
          perPage: 20,
          priceCountry: undefined,
          priceCurrency: 'EUR',
          priceCustomerGroup: 'customer-group-id',
          text: { language: 'en', value: 'testing' },
        });
      });
    });
  });
});
