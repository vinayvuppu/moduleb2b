import React from 'react';
import { shallow } from 'enzyme';
import { intlMock } from '@commercetools-local/test-utils';
import CartSummarySection from '../cart-summary-section';
import OrderCreateConnector from '../order-create-connector';
import { OrderCreate, OrderCreateWithState } from './order-create';
import { ORDER_CREATE_TAB_NAMES } from './constants';

jest.mock('@commercetools-local/hooks', () => {
  return {
    useStateFetcher: () => ({
      isLoading: false,
      state: {
        id: 'state-id-1',
      },
    }),
  };
});

const createTestProps = (props, { tabName = 'owner' } = {}) => ({
  initialOrderStateId: 'order-state-id-1',
  children: jest.fn(),
  history: { push: jest.fn() },
  match: {
    path: '/test/b2b-extension/my-company/orders/new/owner',
    url: '/test/b2b-extension/my-company/orders/new/owner',
    params: {
      projectKey: 'test-1',
    },
  },
  location: {
    pathname: `/test-1/b2b-extension/my-company/orders/new/${tabName}`,
  },
  company: {
    id: 'company-id',
  },
  employee: {
    id: 'employee-id',
  },
  onActionError: jest.fn(),
  showNotification: jest.fn(),
  intl: intlMock,
  ...props,
});

const createCartDraftState = custom => ({
  update: jest.fn(),
  reset: jest.fn(),
  value: {
    customerId: 'c1',
    id: 'cart-1',
    billingAddress: {},
    shippingAddress: {},
    lineItems: [],
    currency: 'EUR',
  },
  ...custom,
});

const createContextProps = customProps => ({
  cartDraftState: createCartDraftState(),
  orderCreator: {
    isLoading: false,
    execute: jest.fn(() => Promise.resolve()),
  },
  cartCreator: {
    isLoading: false,
    execute: jest.fn(() => Promise.resolve()),
  },
  storeState: {
    value: {
      id: 'store-1',
      key: 'store-1',
      nameAllLocales: [
        {
          locale: 'de',
          value: 'deutschland',
        },
      ],
    },
    update: jest.fn(),
  },
  initialSelectionModalState: {
    isOpen: true,
    close: jest.fn(),
  },
  cartUpdater: {
    isLoading: false,
    execute: jest.fn(),
  },
  ownerState: {
    owner: undefined,
    update: jest.fn(),
  },
  ...customProps,
});

describe('Tab names', () => {
  it('should have correct tab names', () => {
    expect(ORDER_CREATE_TAB_NAMES).toMatchSnapshot();
  });
});

describe('tabs', () => {
  let wrapper;
  describe('owner', () => {
    it('should match snapshot', () => {
      const props = createTestProps({}, { tabName: 'owner' });
      wrapper = shallow(<OrderCreate {...props} />);
      wrapper.find(OrderCreateConnector.Consumer).renderProp('children')(
        createContextProps()
      );
      expect(wrapper).toMatchSnapshot();
    });
  });
  describe('lineitems', () => {
    it('should match snapshot', () => {
      const props = createTestProps({}, { tabName: 'lineitems' });
      wrapper = shallow(<OrderCreate {...props} />);
      wrapper.find(OrderCreateConnector.Consumer).renderProp('children')(
        createContextProps()
      );
      expect(wrapper).toMatchSnapshot();
    });
  });
  describe('shipping-method', () => {
    it('should match snapshot', () => {
      const props = createTestProps({}, { tabName: 'shipping-method' });
      wrapper = shallow(<OrderCreate {...props} />);
      wrapper.find(OrderCreateConnector.Consumer).renderProp('children')(
        createContextProps()
      );
      expect(wrapper).toMatchSnapshot();
    });
  });
  describe('confirmation', () => {
    it('should match snapshot', () => {
      const props = createTestProps({}, { tabName: 'confirmation' });
      wrapper = shallow(<OrderCreate {...props} />);
      wrapper.find(OrderCreateConnector.Consumer).renderProp('children')(
        createContextProps()
      );
      expect(wrapper).toMatchSnapshot();
    });
  });
});

describe('CartSummarySection', () => {
  describe('when there is no currency selected for the order', () => {
    let props;
    let wrapper;
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<OrderCreate {...props} />);
      wrapper = wrapper
        .find(OrderCreateConnector.Consumer)
        .renderProp('children')(
        createContextProps({
          cartDraftState: createCartDraftState({
            value: { currency: null },
          }),
        })
      );
    });
    it('should not render CartSummarySection', () => {
      expect(wrapper).not.toRender(CartSummarySection);
    });
  });
  describe('when the is a currency selected for the order', () => {
    let props;
    let wrapper;
    beforeEach(() => {
      props = createTestProps({}, { tabName: 'confirmation' });
      wrapper = shallow(<OrderCreate {...props} />);
      wrapper = wrapper
        .find(OrderCreateConnector.Consumer)
        .renderProp('children')(createContextProps());
    });
    it('should render CartSummarySection', () => {
      expect(wrapper).toRender(CartSummarySection);
    });
  });
});

describe('callbacks', () => {
  describe('when creating the order', () => {
    let contextProps;
    describe('when submitting', () => {
      let props;
      let wrapper;

      beforeEach(async () => {
        props = createTestProps({}, { tabName: 'confirmation' });
        wrapper = shallow(<OrderCreate {...props} />);
        contextProps = createContextProps();
        await wrapper.instance().handleSave(contextProps.orderCreator.execute);
      });
      it('should call the `execute` from `orderCreator`', () => {
        expect(contextProps.orderCreator.execute).toHaveBeenCalledTimes(1);
      });

      it('should call the `execute` from `orderCreator` with initial state id', () => {
        expect(contextProps.orderCreator.execute).toHaveBeenCalledWith(
          'order-state-id-1'
        );
      });

      it('should call the showNotification function', () => {
        expect(props.showNotification).toHaveBeenCalledTimes(1);
      });
      it('should call the showNotification function passing the order created message', () => {
        expect(props.showNotification).toHaveBeenCalledWith({
          domain: 'side',
          kind: 'success',
          text: 'Orders.Create.orderCreated',
        });
      });
      it('should call the router push function', () => {
        expect(props.history.push).toHaveBeenCalledTimes(1);
      });
      it('should call the router push function with the order list route', () => {
        expect(props.history.push).toHaveBeenCalledWith(
          '/test-1/b2b-extension/my-company/orders'
        );
      });
      it('should not call the onActionError function', () => {
        expect(props.onActionError).not.toHaveBeenCalled();
      });
    });
    describe('when rejecting', () => {
      let props;
      let wrapper;
      beforeEach(async () => {
        props = createTestProps(
          {
            createOrder: jest.fn(() =>
              Promise.reject(new Error('something went wrong'))
            ),
          },
          { tabName: 'confirmation' }
        );
        wrapper = shallow(<OrderCreate {...props} />);
        contextProps = createContextProps({
          orderCreator: {
            isLoading: false,
            execute: jest.fn(() =>
              Promise.reject(new Error('something went wrong'))
            ),
          },
        });
        await wrapper.instance().handleSave(contextProps.orderCreator.execute);
      });
      it('should call the `execute` from `orderCreator`', () => {
        expect(contextProps.orderCreator.execute).toHaveBeenCalledTimes(1);
      });
      it('should not call the showNotification function', () => {
        expect(props.showNotification).not.toHaveBeenCalled();
      });
      it('should not call the router push function', () => {
        expect(props.history.push).not.toHaveBeenCalled();
      });
      it('should call the onActionError function', () => {
        expect(props.onActionError).toHaveBeenCalledTimes(1);
      });
    });
  });
});

describe('OrderCreateWithState', () => {
  describe('rendering', () => {
    let props;
    let wrapper;
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<OrderCreateWithState {...props} />);
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should have `OrderCreate` with  initialOrderStateId prop', () => {
      expect(wrapper.find(OrderCreate).prop('initialOrderStateId')).toEqual(
        'state-id-1'
      );
    });
  });
});
