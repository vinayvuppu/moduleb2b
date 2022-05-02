import React from 'react';
import { shallow } from 'enzyme';
import { DOMAINS } from '@commercetools-frontend/constants';
import { intlMock } from '@commercetools-local/test-utils';
import { QuoteCreateAddLineItems } from './quote-create-add-line-items';

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
  renderSaveToolbarStep: jest.fn(),
  allLineItems: lineItems,
  company: {
    customerGroup: {
      id: 'customer-group-id',
    },
  },
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
  addLineItem: jest.fn(),
  showNotification: jest.fn(),
  onActionError: jest.fn(),
  fetchProducts: jest.fn(),
  projectKey: 'test-project',
  intl: intlMock,
  // withApplicationContext
  dataLocale: 'en',
  ...props,
});

describe('render', () => {
  describe('when loading', () => {
    let props;
    let wrapper;
    beforeEach(() => {
      props = createTestProps({ fetchProducts: jest.fn() });
      wrapper = shallow(<QuoteCreateAddLineItems {...props} />);
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should render the LoadingSpinner', () => {
      expect(wrapper).toRender('LoadingSpinner');
    });
  });
  describe('when the quote is empty', () => {
    let props;
    let wrapper;
    beforeEach(() => {
      props = createTestProps({ allLineItems: [] });
      wrapper = shallow(<QuoteCreateAddLineItems {...props} />);
      wrapper.setState({ totals: 1, products: [{ id: 'product-id-1' }] });
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
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
        addLineItem: jest.fn().mockResolvedValue(),
      });
      wrapper = shallow(<QuoteCreateAddLineItems {...props} />);
      await wrapper.instance().handleAddVariantToCart({
        sku: '123',
        quantity: 1,
      });
    });
    it('should call `addLineItem`', () => {
      expect(props.addLineItem).toHaveBeenCalledTimes(1);
    });
    it('should call showNotification', () => {
      expect(props.showNotification).toHaveBeenCalledTimes(1);
    });
    it('should call showNotification with parameters', () => {
      expect(props.showNotification).toHaveBeenCalledWith({
        kind: 'success',
        domain: DOMAINS.SIDE,
        text: 'Quote.Create.Step.LineItems.search.addVariantSuccess',
      });
    });
  });

  describe('when there is an error with adding a variant to the cart', () => {
    let props;
    let wrapper;

    beforeEach(async () => {
      props = createTestProps({
        addLineItem: jest
          .fn()
          .mockRejectedValue(new Error('Something went wrong')),
      });
      wrapper = shallow(<QuoteCreateAddLineItems {...props} />);
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

  describe('setSearchTerm', () => {
    let wrapper;
    let props;
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<QuoteCreateAddLineItems {...props} />);
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
      wrapper = shallow(<QuoteCreateAddLineItems {...props} />);
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
      wrapper = shallow(<QuoteCreateAddLineItems {...props} />);
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
        wrapper = shallow(<QuoteCreateAddLineItems {...props} />);
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
          priceCurrency: 'USD',
          priceCustomerGroup: 'customer-group-id',
          sort: [{ by: 'id', direction: 'asc' }],
        });
      });
    });
    describe('when there is a search term', () => {
      beforeEach(async () => {
        props = createTestProps();
        wrapper = shallow(<QuoteCreateAddLineItems {...props} />);
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
          priceCurrency: 'USD',
          priceCustomerGroup: 'customer-group-id',
          text: { language: 'en', value: 'testing' },
        });
      });
    });
  });
});
