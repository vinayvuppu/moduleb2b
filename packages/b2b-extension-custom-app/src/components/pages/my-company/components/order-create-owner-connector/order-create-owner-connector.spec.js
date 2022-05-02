import React from 'react';
import { shallow } from 'enzyme';
import { OrderCreateOwnerConnector } from './order-create-owner-connector';

const ChildComponent = () => <div>{'ChildComponent'}</div>;
ChildComponent.displayName = 'ChildComponent';

const createEmployee = props => ({
  id: 'some--id',
  version: 2,
  email: 'foo@bar.com',
  company: {
    id: 'cg-id',
  },
  addresses: [
    {
      id: 'address-id-1',
      country: 'ES',
    },
  ],

  ...props,
});

const createTestProps = props => ({
  projectKey: 'test-projectKey',
  employeeId: 'test-employeeId',
  children: jest.fn(() => <ChildComponent />),

  // Apollo
  updateEmployeeMutation: jest.fn(() => Promise.resolve({ id: 'foo-id' })),

  employeeQuery: {
    loading: false,
    employee: createEmployee(),
  },

  // with-pending-requests
  pendingUpdaterRequests: {
    isLoading: false,
    increment: jest.fn(),
    decrement: jest.fn(),
  },

  ...props,
});

const updateAction = {
  action: 'changeAddress',
  addressId: 'address-id-1',
  address: { phone: '123' },
};

describe('rendering', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<OrderCreateOwnerConnector {...props} />);
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should invoke `children`', () => {
    expect(props.children).toHaveBeenCalled();
  });

  describe('employeeFetcher', () => {
    it('should invoke `children` with `isLoading`', () => {
      expect(props.children).toHaveBeenCalledWith(
        expect.objectContaining({
          employeeFetcher: expect.objectContaining({
            isLoading: props.employeeQuery.loading,
          }),
        })
      );
    });

    it('should invoke `children` with `employee`', () => {
      expect(props.children).toHaveBeenCalledWith(
        expect.objectContaining({
          employeeFetcher: expect.objectContaining({
            employee: props.employeeQuery.employee,
          }),
        })
      );
    });
  });
});

describe('interactions', () => {
  let props;
  let wrapper;
  let result;

  describe('when updating', () => {
    beforeEach(async () => {
      props = createTestProps();
      wrapper = shallow(<OrderCreateOwnerConnector {...props} />);

      result = wrapper.instance().handleUpdateEmployee([updateAction]);

      await result;
    });

    it('should invoke `increment` on `pendingUpdaterRequests`', () => {
      expect(props.pendingUpdaterRequests.increment).toHaveBeenCalled();
    });

    it('should invoke `updateEmployeeMutation`', () => {
      expect(props.updateEmployeeMutation).toHaveBeenCalled();
    });

    describe('when resolving', () => {
      it('should invoke `decrement` on `pendingUpdaterRequests`', () => {
        expect(props.pendingUpdaterRequests.decrement).toHaveBeenCalled();
      });

      it('should resolve with the `id` of the updated employee', async () => {
        await expect(result).resolves.toEqual(
          expect.objectContaining({
            id: 'foo-id',
          })
        );
      });
    });

    describe('when rejecting', () => {
      beforeEach(async () => {
        props = createTestProps({
          updateEmployeeMutation: jest.fn(() =>
            Promise.reject({ graphQlErrors: ['foo'] })
          ),
        });
        wrapper = shallow(<OrderCreateOwnerConnector {...props} />);

        result = wrapper.instance().handleUpdateEmployee([updateAction]);

        await result.catch(() => {});
      });

      it('should invoke `decrement` on `pendingUpdaterRequests`', () => {
        expect(props.pendingUpdaterRequests.decrement).toHaveBeenCalled();
      });
    });
  });
});
