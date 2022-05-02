import React from 'react';
import { shallow } from 'enzyme';
import { EmployeeCreateConnector } from './employee-create-connector';

const ChildComponent = () => <div>{'ChildComponent'}</div>;
ChildComponent.displayName = 'ChildComponent';

const createEmployeeDraft = props => ({
  email: 'foo@bar.com',
  ...props,
});

const createdEmployee = props => ({
  id: 'foo-id',
  email: 'foo@bar.com',
  ...props,
});

const createTestProps = props => ({
  children: jest.fn(),
  // graphql
  createEmployeeMutation: jest.fn(() =>
    Promise.resolve({
      data: { employeeSignUp: createdEmployee() },
    })
  ),
  // with-pending-requests
  pendingCreatorRequests: {
    isLoading: false,
    increment: jest.fn(),
    decrement: jest.fn(),
  },

  ...props,
});

describe('rendering', () => {
  let props;

  beforeEach(() => {
    props = createTestProps();
    shallow(<EmployeeCreateConnector {...props} />);
  });

  it('should invoke `children`', () => {
    expect(props.children).toHaveBeenCalled();
  });

  describe('employeeCreator', () => {
    it('should invoke `children` with `isLoading`', () => {
      expect(props.children).toHaveBeenCalledWith(
        expect.objectContaining({
          employeeCreator: expect.objectContaining({
            isLoading: props.pendingCreatorRequests.isLoading,
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

  describe('when creating', () => {
    let draft;
    beforeEach(async () => {
      draft = createEmployeeDraft();
      props = createTestProps();
      wrapper = shallow(<EmployeeCreateConnector {...props} />);

      result = wrapper.instance().handleCreateEmployee(draft);

      await result;
    });

    it('should invoke `increment` on `pendingCreatorRequests`', () => {
      expect(props.pendingCreatorRequests.increment).toHaveBeenCalled();
    });

    it('should invoke `createEmployeeMutation`', () => {
      expect(props.createEmployeeMutation).toHaveBeenCalled();
    });

    it('should invoke `createEmployeeMutation` with `draft`', () => {
      expect(props.createEmployeeMutation).toHaveBeenCalledWith({
        variables: expect.objectContaining({
          draft: {
            email: 'foo@bar.com',
          },
        }),
      });
    });

    describe('when resolving', () => {
      it('should invoke `decrement` on `pendingCreatorRequests`', () => {
        expect(props.pendingCreatorRequests.decrement).toHaveBeenCalled();
      });
    });

    describe('when rejecting', () => {
      beforeEach(async () => {
        props = createTestProps({
          createOAuthClientMutation: jest.fn(() =>
            Promise.reject({ graphQlErrors: ['foo'] })
          ),
        });
        wrapper = shallow(<EmployeeCreateConnector {...props} />);

        result = wrapper.instance().handleCreateEmployee(draft);

        await result.catch(() => {});
      });

      it('should invoke `decrement` on `pendingCreatorRequests`', () => {
        expect(props.pendingCreatorRequests.decrement).toHaveBeenCalled();
      });
    });
  });
});
