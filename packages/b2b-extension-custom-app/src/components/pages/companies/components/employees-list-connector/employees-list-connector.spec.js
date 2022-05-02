import React from 'react';
import { shallow } from 'enzyme';
import { EmployeesListConnector } from './employees-list-connector';

const ChildComponent = () => <div>{'ChildComponent'}</div>;
ChildComponent.displayName = 'ChildComponent';

const createEmployee = custom => ({
  id: 'abc-def',
  email: 'foo@bar.com',
  firstName: 'foo',
  lastName: 'bar',
  employeeNumber: '1234',
  ...custom,
});

const createTestProps = customProps => ({
  children: jest.fn(() => <ChildComponent />),
  projectKey: 'foo-key',
  companyId: 'foo-key-1',

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

  companyEmployeesListQuery: {
    loading: false,
    employees: {
      total: 1,
      count: 1,
      offset: 0,
      results: [createEmployee()],
    },
  },

  userId: 'test-user-id',

  ...customProps,
});

describe('rendering', () => {
  let props;

  beforeEach(() => {
    props = createTestProps();
    shallow(<EmployeesListConnector {...props} />);
  });

  it('should invoke `children`', () => {
    expect(props.children).toHaveBeenCalled();
  });

  describe('employeesFetcher', () => {
    it('should invoke `children` with `isLoading`', () => {
      expect(props.children).toHaveBeenCalledWith(
        expect.objectContaining({
          employeesFetcher: expect.objectContaining({
            isLoading: false,
          }),
        })
      );
    });

    it('should invoke `children` with `employeesFetcher`', () => {
      expect(props.children).toHaveBeenCalledWith(
        expect.objectContaining({
          employeesFetcher: expect.objectContaining({
            employees: props.companyEmployeesListQuery.employees,
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
