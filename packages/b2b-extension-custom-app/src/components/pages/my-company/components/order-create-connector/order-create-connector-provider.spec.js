import React from 'react';
import { shallow } from 'enzyme';
import { intlMock } from '@commercetools-local/test-utils';
import {
  OrderCreateConnectorProvider,
  initialCartDraft,
} from './order-create-connector-provider';

const TestComponent = () => <div>{'test'}</div>;
TestComponent.displayName = 'TestComponent';

const createCartResponse = (attribute, custom) => ({
  data: {
    [attribute]: {
      id: 'cart-id-1',
      customerId: 'some-id',
      billingAddress: { id: 'address-1' },
      shippingAddress: { id: 'address-2' },
      lineItems: [{ id: 'lineitem-1' }],
      customLineItems: [{ id: 'customlineitem-1' }],
      discountCodes: [],
      currency: 'EUR',
      customerEmail: 'some@email.com',
      deleteDaysAfterLastModification: 1,
      origin: 'Merchant',
      totalPrice: { currencyCode: 'EUR' },
      ...custom,
    },
  },
});

const createTestProps = customProps => ({
  children: <TestComponent />,
  createCartMutation: jest.fn(() =>
    Promise.resolve(createCartResponse('createCart'))
  ),
  updateCartMutation: jest.fn(() =>
    Promise.resolve(createCartResponse('updateCart'))
  ),
  createOrderMutation: jest.fn(() =>
    Promise.resolve(createCartResponse('createOrderFromCart'))
  ),
  updateOrderMutation: jest.fn(() =>
    Promise.resolve(createCartResponse('createOrder'))
  ),
  pendingCreateCartRequests: {
    isLoading: false,
    increment: jest.fn(),
    decrement: jest.fn(),
  },
  pendingUpdateRequests: {
    isLoading: false,
    increment: jest.fn(),
    decrement: jest.fn(),
  },
  pendingCreateOrderRequests: {
    isLoading: false,
    increment: jest.fn(),
    decrement: jest.fn(),
  },
  pendingUpdateOrderRequests: {
    isLoading: false,
    increment: jest.fn(),
    decrement: jest.fn(),
  },
  convertedQuote: jest.fn(),
  locale: 'en',
  // injectIntl
  intl: intlMock,
  location: {
    state: undefined,
  },
  ...customProps,
});

describe('rendering', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<OrderCreateConnectorProvider {...props} />);
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});

describe('interacting', () => {
  let props;
  let wrapper;
  let cartResponse;

  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<OrderCreateConnectorProvider {...props} />);
  });

  describe('when creating the cart', () => {
    beforeEach(async () => {
      cartResponse = createCartResponse('createCart');
      await wrapper.instance().handleCreateCart({
        storeKey: 'store-key',
        currency: 'USD',
        employeeId: 'employeeId',
      });
    });
    it('should invoke `createCartMutation`', () => {
      expect(props.createCartMutation).toHaveBeenCalledWith({
        variables: {
          draft: {
            billingAddress: undefined,
            currency: 'USD',
            customLineItems: null,
            customerEmail: null,
            customerId: 'employeeId',
            deleteDaysAfterLastModification: 1,
            discountCodes: null,
            lineItems: null,
            origin: 'Merchant',
            shippingAddress: undefined,
          },
          locale: 'en',
          storeKey: 'store-key',
          target: 'ctp',
        },
      });
    });
    it('should invoke `decrement` from `pendingCreateCartRequests`', () => {
      expect(props.pendingCreateCartRequests.decrement).toHaveBeenCalled();
    });
    it('should update state with the created cart', () => {
      expect(wrapper).toHaveState('cartDraft', cartResponse.data.createCart);
    });
  });

  describe('when updating the cart', () => {
    beforeEach(async () => {
      cartResponse = createCartResponse('updateCart');
      await wrapper.instance().handleUpdateCart([]);
    });
    it('should invoke `updateCartMutation`', () => {
      expect(props.updateCartMutation).toHaveBeenCalled();
    });
    it('should invoke `decrement` from `pendingUpdateRequests`', () => {
      expect(props.pendingUpdateRequests.decrement).toHaveBeenCalled();
    });
    it('should update state with the updated cart', () => {
      expect(wrapper).toHaveState('cartDraft', cartResponse.data.updateCart);
    });
  });

  describe('when placing the order', () => {
    beforeEach(async () => {
      await wrapper
        .instance()
        .handleCreateOrder(
          'initialOrderStateId',
          { budget: [], requiredApprovalRoles: [] },
          { roles: [] }
        );
    });
    it('should invoke `createOrderMutation`', () => {
      expect(props.createOrderMutation).toHaveBeenCalledWith({
        variables: {
          draft: { state: { id: 'initialOrderStateId', typeId: 'state' } },
          locale: 'en',
          storeKey: undefined,
          target: 'ctp',
        },
      });
    });
    it('should invoke `decrement` from `pendingCreateOrderRequests`', () => {
      expect(props.pendingCreateOrderRequests.decrement).toHaveBeenCalled();
    });
  });

  describe('when update the order', () => {
    beforeEach(async () => {
      await wrapper
        .instance()
        .handleUpdateOrder({ id: 'orderId1', version: 1 }, [
          { action: 'action1', field: 'value1' },
        ]);
    });
    it('should invoke `updateOrderMutation`', () => {
      expect(props.updateOrderMutation).toHaveBeenCalledWith({
        variables: {
          actions: [{ action1: { field: 'value1' } }],
          id: 'orderId1',
          locale: 'en',
          target: 'ctp',
          version: 1,
        },
      });
    });
    it('should invoke `decrement` from `pendingUpdateOrderRequests`', () => {
      expect(props.pendingUpdateOrderRequests.decrement).toHaveBeenCalled();
    });
  });

  describe('when updating cartDraft', () => {
    beforeEach(() => {
      wrapper.instance().handleUpdateCartDraft({
        newAttribute: 'foo',
      });
    });
    it('should update state with the new attributes', () => {
      expect(wrapper).toHaveState(
        'cartDraft',
        expect.objectContaining({ newAttribute: 'foo' })
      );
    });
  });

  describe('when reseting cartDraft', () => {
    beforeEach(() => {
      wrapper.instance().handleResetCartDraft();
    });
    it('should reset state with the initial cartDraft', () => {
      expect(wrapper).toHaveState('cartDraft', initialCartDraft);
    });
  });
});
