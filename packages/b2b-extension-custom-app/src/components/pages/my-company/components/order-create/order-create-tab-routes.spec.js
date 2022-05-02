import React from 'react';
import { shallow } from 'enzyme';
import { intlMock } from '@commercetools-local/test-utils';
import { OrderCreateTabRoutes } from './order-create-tab-routes';
import OrderCreateSelectStoreAndCurrency from '../order-create-select-store-and-currency';

const createTestProps = props => ({
  projectKey: 'test',
  totalSteps: 4,
  createHandleGoToStep: jest.fn(),
  onCancel: jest.fn(),
  onSave: jest.fn(),
  routerProps: {
    pathname: '/test/orders/new/confirmation',
    path: '/test/orders/new/confirmation',
    url: '/test/orders/new/confirmation',
  },
  intl: intlMock,
  employee: { id: 'employee-id' },
  hideAllPageNotifications: jest.fn(),
  onActionError: jest.fn(),
  showNotification: jest.fn(),
  canManageOrders: false,
  cartDraftState: {
    update: jest.fn(),
    reset: jest.fn(),
    value: {
      id: 'cart-id',
      currency: 'EUR',
      shippingAddress: { id: 'address-1' },
      billingAddress: { id: 'address-2' },
      version: 1,
      customerId: 'customer-id',
      customerEmail: 'foo@bar.com',
      lineItems: [{ id: 'line-item-1' }],
      shippingInfo: { id: 'shipping-method-1' },
    },
  },
  cartUpdater: {
    isLoading: false,
    execute: jest.fn(),
  },
  storeState: {
    value: undefined,
    update: jest.fn(),
  },
  orderCreator: {
    isLoading: false,
    execute: jest.fn(),
  },
  cartCreator: {
    isLoading: false,
    execute: jest.fn(),
  },
  initialSelectionModalState: {
    isOpen: true,
    close: jest.fn(),
  },
  ownerState: {
    owner: undefined,
    update: jest.fn(),
  },
  projectCurrencies: ['USD'],
  company: {
    id: 'company-id',
    key: 'company-key',
    customerGroup: {
      id: 'customer-group-id',
    },
  },
  ...props,
});

const createRouterProps = () => ({
  match: {
    params: {
      id: 'order-id',
      projectKey: 'test',
      employeeId: 'employee-id',
    },
  },
  history: {
    push: jest.fn(),
    replace: jest.fn(),
  },
});

describe('rendering', () => {
  let props;
  let routerProps;
  let wrapper;
  let renderedWrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<OrderCreateTabRoutes {...props} />);
  });

  describe('lineItems step', () => {
    beforeEach(() => {
      routerProps = createRouterProps();
      props = createTestProps();
      wrapper = shallow(<OrderCreateTabRoutes {...props} />);
      renderedWrapper = wrapper
        .find('Route')
        .first()
        .renderProp('render')(routerProps);
    });

    it('should match snapshot', () => {
      expect(renderedWrapper).toMatchSnapshot();
    });

    it('should not render the `OrderCreateSelectStoreAndCurrency` component', () => {
      expect(renderedWrapper).not.toRender(OrderCreateSelectStoreAndCurrency);
    });
  });

  describe('employees step', () => {
    beforeEach(() => {
      routerProps = createRouterProps();
      props = createTestProps();
      wrapper = shallow(<OrderCreateTabRoutes {...props} />);
      renderedWrapper = wrapper
        .find('Route')
        .at(1)
        .renderProp('render')(routerProps);
    });

    it('should match snapshot', () => {
      expect(renderedWrapper).toMatchSnapshot();
    });
  });

  describe('shipping method step', () => {
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<OrderCreateTabRoutes {...props} />);
      renderedWrapper = wrapper
        .find('Route')
        .at(2)
        .renderProp('render')();
    });

    it('should match snapshot', () => {
      expect(renderedWrapper).toMatchSnapshot();
    });
  });
});
