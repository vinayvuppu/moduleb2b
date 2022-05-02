import React from 'react';
import { shallow } from 'enzyme';
import { OrdersListConnector } from './orders-list-connector';

const ChildComponent = () => <div>{'ChildComponent'}</div>;
ChildComponent.displayName = 'ChildComponent';

const createOrder = custom => ({
  id: 'abc-def',
  createdAt: '2018-04-08',
  lastModifiedAt: '2018-07-22',
  orderNumber: '1234',
  ...custom,
});

const createTestProps = customProps => ({
  children: jest.fn(() => <ChildComponent />),
  projectKey: 'foo-key',
  employeeId: 'foo-key-1',

  searchQuery: {
    get: jest.fn(),
    set: jest.fn(),
    value: {
      page: 1,
      perPage: 20,
      sorting: {
        key: 'createdAt',
        order: 'desc',
      },
    },
  },

  employeeOrdersListQuery: {
    loading: false,
    orders: {
      total: 1,
      count: 1,
      offset: 0,
      results: [createOrder()],
    },
  },

  userId: 'test-user-id',

  ...customProps,
});

describe('rendering', () => {
  let props;

  beforeEach(() => {
    props = createTestProps();
    shallow(<OrdersListConnector {...props} />);
  });

  it('should invoke `children`', () => {
    expect(props.children).toHaveBeenCalled();
  });

  describe('ordersFetcher', () => {
    it('should invoke `children` with `isLoading`', () => {
      expect(props.children).toHaveBeenCalledWith(
        expect.objectContaining({
          ordersFetcher: expect.objectContaining({
            isLoading: false,
          }),
        })
      );
    });

    it('should invoke `children` with `ordersFetcher`', () => {
      expect(props.children).toHaveBeenCalledWith(
        expect.objectContaining({
          ordersFetcher: expect.objectContaining({
            orders: props.employeeOrdersListQuery.orders,
          }),
        })
      );
    });
  });

  describe('searchQuery', () => {
    it('should invoke `children` with `value`', () => {
      expect(props.children).toHaveBeenCalledWith(
        expect.objectContaining({
          searchQuery: expect.objectContaining({
            value: props.searchQuery.value,
          }),
        })
      );
    });
    it('should invoke `children` with `set`', () => {
      expect(props.children).toHaveBeenCalledWith(
        expect.objectContaining({
          searchQuery: expect.objectContaining({
            set: props.searchQuery.set,
          }),
        })
      );
    });
    it('should invoke `children` with `get`', () => {
      expect(props.children).toHaveBeenCalledWith(
        expect.objectContaining({
          searchQuery: expect.objectContaining({
            get: props.searchQuery.get,
          }),
        })
      );
    });
  });
});
