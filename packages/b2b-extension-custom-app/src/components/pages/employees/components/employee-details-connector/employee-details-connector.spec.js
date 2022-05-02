import React from 'react';
import { shallow } from 'enzyme';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import { EmployeeDetailsConnector } from './employee-details-connector';

const ChildComponent = () => <div>{'ChildComponent'}</div>;
ChildComponent.displayName = 'ChildComponent';

const employeeId = 'employee-group-1';

const createEmployee = props => ({
  id: employeeId,
  createdAt: '20017-03-20',
  lastModifiedAt: '20017-03-20',
  version: 2,
  email: 'foo@bar.com',
  customerGroup: { id: 'cg-1', key: 'key-1' },
  stores: [{ key: 'store1' }],
  roles: ['rol1'],
  ...props,
});

const createTestProps = props => ({
  children: jest.fn(),
  projectKey: 'foo-key',
  employeeId,

  // graphql
  employeeQuery: {
    loading: false,
    error: {},
    employee: createEmployee(),
    refetch: jest.fn(),
  },
  // graphql
  deleteEmployeeMutation: jest.fn(() =>
    Promise.resolve({ data: { deleteEmployee: { employeeId } } })
  ),
  updateEmployeeMutation: jest.fn(() =>
    Promise.resolve({ data: { updateEmployee: { employeeId } } })
  ),
  employeeResetPasswordMutation: jest.fn(() =>
    Promise.resolve({
      data: { employeeResetPassword: { employeeId } },
    })
  ),
  employeeCreatePasswordResetTokenMutation: jest.fn(() =>
    Promise.resolve({
      data: {
        employeeCreatePasswordResetToken: { value: 'test' },
      },
    })
  ),
  // withPendingRequests
  pendingDeleterRequests: {
    increment: jest.fn(),
    decrement: jest.fn(),
    isLoading: false,
  },
  pendingUpdaterRequests: {
    increment: jest.fn(),
    decrement: jest.fn(),
    isLoading: false,
  },

  ...props,
});

describe('rendering', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<EmployeeDetailsConnector {...props} />);
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

    it('should invoke `children` with `data`', () => {
      expect(props.children).toHaveBeenCalledWith(
        expect.objectContaining({
          employeeFetcher: expect.objectContaining({
            employee: props.employeeQuery.employee,
          }),
        })
      );
    });
  });

  describe('employeeDeleter', () => {
    it('should invoke `children` with `isLoading`', () => {
      expect(props.children).toHaveBeenCalledWith(
        expect.objectContaining({
          employeeDeleter: expect.objectContaining({
            isLoading: props.pendingDeleterRequests.isLoading,
          }),
        })
      );
    });

    it('should invoke `children` with `execute`', () => {
      expect(props.children).toHaveBeenCalledWith(
        expect.objectContaining({
          employeeDeleter: expect.objectContaining({
            execute: wrapper.instance().handleDeleteEmployee,
          }),
        })
      );
    });
  });

  describe('employeeUpdater', () => {
    it('should invoke `children` with `isLoading`', () => {
      expect(props.children).toHaveBeenCalledWith(
        expect.objectContaining({
          employeeUpdater: expect.objectContaining({
            isLoading: props.pendingUpdaterRequests.isLoading,
          }),
        })
      );
    });

    it('should invoke `children` with `execute`', () => {
      expect(props.children).toHaveBeenCalledWith(
        expect.objectContaining({
          employeeUpdater: expect.objectContaining({
            execute: wrapper.instance().handleUpdateEmployee,
          }),
        })
      );
    });
  });

  describe('employeeDefaultAddressUpdater', () => {
    it('should invoke `children` with `isLoading`', () => {
      expect(props.children).toHaveBeenCalledWith(
        expect.objectContaining({
          employeeDefaultAddressUpdater: expect.objectContaining({
            isLoading: props.pendingUpdaterRequests.isLoading,
          }),
        })
      );
    });

    it('should invoke `children` with `execute`', () => {
      expect(props.children).toHaveBeenCalledWith(
        expect.objectContaining({
          employeeDefaultAddressUpdater: expect.objectContaining({
            execute: wrapper.instance().handleSetDefaultAddress,
          }),
        })
      );
    });
  });

  describe('employeePasswordReseter', () => {
    it('should invoke `children` with `isLoading`', () => {
      expect(props.children).toHaveBeenCalledWith(
        expect.objectContaining({
          employeePasswordReseter: expect.objectContaining({
            isLoading: props.pendingUpdaterRequests.isLoading,
          }),
        })
      );
    });

    it('should invoke `children` with `execute`', () => {
      expect(props.children).toHaveBeenCalledWith(
        expect.objectContaining({
          employeePasswordReseter: expect.objectContaining({
            execute: wrapper.instance().handleResetEmployeePassword,
          }),
        })
      );
    });
  });
});

describe('interacting', () => {
  let props;
  let wrapper;
  let result;

  describe('when updating', () => {
    describe('when resolving', () => {
      beforeEach(async () => {
        props = createTestProps();
        wrapper = shallow(<EmployeeDetailsConnector {...props} />);

        await wrapper.instance().handleUpdateEmployee(createEmployee());
      });

      it('should invoke `updateEmployeeMutation` with `id`, `version` and `actions`', () => {
        expect(props.updateEmployeeMutation).toHaveBeenCalledWith({
          variables: {
            target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
            version: props.employeeQuery.employee.version,
            id: props.employeeId,
            actions: expect.any(Array),
          },
        });
      });

      it('should invoke `increment` on `pendingUpdaterRequests`', () => {
        expect(props.pendingUpdaterRequests.increment).toHaveBeenCalled();
      });

      it('should invoke `decrement` on `pendingUpdaterRequests`', () => {
        expect(props.pendingUpdaterRequests.decrement).toHaveBeenCalled();
      });
    });

    describe('when rejecting', () => {
      beforeEach(async () => {
        props = createTestProps({
          updateEmployeeMutation: jest.fn(() =>
            Promise.reject({ graphQlErrors: ['foo'] })
          ),
        });
        wrapper = shallow(<EmployeeDetailsConnector {...props} />);
        result = wrapper.instance().handleUpdateEmployee(createEmployee());
        await result.catch(() => {});
      });

      it('should invoke `decrement` on `pendingUpdaterRequests`', () => {
        expect(props.pendingUpdaterRequests.decrement).toHaveBeenCalled();
      });
    });
  });

  describe('when updating default address', () => {
    describe('when resolving', () => {
      beforeEach(async () => {
        props = createTestProps();
        wrapper = shallow(<EmployeeDetailsConnector {...props} />);

        await wrapper.instance().handleSetDefaultAddress({});
      });

      it('should invoke `updateEmployeeMutation` with `id`, `version` and `actions`', () => {
        expect(props.updateEmployeeMutation).toHaveBeenCalledWith({
          variables: {
            target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
            version: props.employeeQuery.employee.version,
            id: props.employeeId,
            actions: expect.any(Array),
            storeKey: 'store1',
          },
        });
      });

      it('should invoke `increment` on `pendingUpdaterRequests`', () => {
        expect(props.pendingUpdaterRequests.increment).toHaveBeenCalled();
      });

      it('should invoke `decrement` on `pendingUpdaterRequests`', () => {
        expect(props.pendingUpdaterRequests.decrement).toHaveBeenCalled();
      });
    });

    describe('when rejecting', () => {
      beforeEach(async () => {
        props = createTestProps({
          updateEmployeeMutation: jest.fn(() =>
            Promise.reject({ graphQlErrors: ['foo'] })
          ),
        });
        wrapper = shallow(<EmployeeDetailsConnector {...props} />);
        result = wrapper.instance().handleSetDefaultAddress({});
        await result.catch(() => {});
      });

      it('should invoke `decrement` on `pendingUpdaterRequests`', () => {
        expect(props.pendingUpdaterRequests.decrement).toHaveBeenCalled();
      });
    });
  });

  describe('when deleting', () => {
    describe('when resolving', () => {
      beforeEach(async () => {
        props = createTestProps();
        wrapper = shallow(<EmployeeDetailsConnector {...props} />);

        await wrapper.instance().handleDeleteEmployee();
      });

      it('should invoke `deleteEmployeeMutation` with `id` and `version`', () => {
        expect(props.deleteEmployeeMutation).toHaveBeenCalledWith({
          variables: {
            target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
            version: props.employeeQuery.employee.version,
            id: props.employeeId,
            storeKey: 'store1',
          },
        });
      });

      it('should invoke `increment` on `pendingDeleterRequests`', () => {
        expect(props.pendingDeleterRequests.increment).toHaveBeenCalled();
      });

      it('should invoke `decrement` on `pendingDeleterRequests`', () => {
        expect(props.pendingDeleterRequests.decrement).toHaveBeenCalled();
      });
    });

    describe('when rejecting', () => {
      beforeEach(async () => {
        props = createTestProps({
          deleteEmployeeMutation: jest.fn(() =>
            Promise.reject({ graphQlErrors: ['foo'] })
          ),
        });
        wrapper = shallow(<EmployeeDetailsConnector {...props} />);
        result = wrapper.instance().handleDeleteEmployee();
        await result.catch(() => {});
      });

      it('should invoke `decrement` on `pendingDeleterRequests`', () => {
        expect(props.pendingDeleterRequests.decrement).toHaveBeenCalled();
      });
    });
  });

  describe('when reseting password', () => {
    const newPassword = 'newPass';
    describe('when resolving', () => {
      beforeEach(async () => {
        props = createTestProps();
        wrapper = shallow(<EmployeeDetailsConnector {...props} />);

        await wrapper.instance().handleResetEmployeePassword(newPassword);
      });

      it('should invoke `employeeCreatePasswordResetTokenMutation` with `email`', () => {
        expect(
          props.employeeCreatePasswordResetTokenMutation
        ).toHaveBeenCalledWith({
          variables: {
            target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
            email: props.employeeQuery.employee.email,
            storeKey: 'store1',
          },
        });
      });

      it('should invoke `employeeResetPasswordMutation` with `tokenValue`, `version` and `newPassword`', () => {
        expect(props.employeeResetPasswordMutation).toHaveBeenCalledWith({
          variables: {
            target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
            tokenValue: 'test',
            version: props.employeeQuery.employee.version,
            newPassword,
            storeKey: 'store1',
          },
        });
      });
    });

    describe('when rejecting create password token', () => {
      beforeEach(async () => {
        props = createTestProps({
          employeeCreatePasswordResetTokenMutation: jest.fn(() =>
            Promise.reject({ graphQlErrors: ['foo'] })
          ),
        });
        wrapper = shallow(<EmployeeDetailsConnector {...props} />);
        result = wrapper.instance().handleResetEmployeePassword(newPassword);
        await result.catch(() => {});
      });

      it('should not invoke `employeeResetPasswordMutation`', () => {
        expect(props.employeeResetPasswordMutation).not.toHaveBeenCalled();
      });

      it('should invoke `decrement` on `pendingDeleterRequests`', () => {
        expect(props.pendingDeleterRequests.decrement).toHaveBeenCalled();
      });
    });

    describe('when rejecting reset password', () => {
      beforeEach(async () => {
        props = createTestProps({
          employeeResetPasswordMutation: jest.fn(() =>
            Promise.reject({ graphQlErrors: ['foo'] })
          ),
        });
        wrapper = shallow(<EmployeeDetailsConnector {...props} />);
        result = wrapper.instance().handleResetEmployeePassword(newPassword);
        await result.catch(() => {});
      });

      it('should invoke `decrement` on `pendingDeleterRequests`', () => {
        expect(props.pendingDeleterRequests.decrement).toHaveBeenCalled();
      });
    });
  });
});
