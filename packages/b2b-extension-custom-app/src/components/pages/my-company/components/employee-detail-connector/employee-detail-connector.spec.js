import React from 'react';
import { shallow } from 'enzyme';
import {
  EmployeeDetailConnector,
  getExtenralAuthId,
} from './employee-detail-connector';

const ChildComponent = () => <div>{'ChildComponent'}</div>;
ChildComponent.displayName = 'ChildComponent';

const createEmployee = custom => ({
  id: 'abc-def',
  email: 'foo@bar.com',
  firstName: 'foo',
  lastName: 'bar',
  company: { id: 'companyId1' },
  ...custom,
});

const createTestProps = customProps => ({
  children: jest.fn(() => <ChildComponent />),
  projectKey: 'foo-key',
  companyId: 'foo-key-1',
  customerEmail: 'foo@bar.com',
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

  companyEmployeeQuery: {
    loading: false,
    employees: {
      total: 1,
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
    shallow(<EmployeeDetailConnector {...props} />);
  });

  it('should invoke `children`', () => {
    expect(props.children).toHaveBeenCalled();
  });

  describe('employeeFetcher', () => {
    it('should invoke `children` with `isLoading`', () => {
      expect(props.children).toHaveBeenCalledWith(
        expect.objectContaining({
          employeeFetcher: expect.objectContaining({
            isLoading: false,
          }),
        })
      );
    });

    it('should invoke `children` with `employeeFetcher`', () => {
      expect(props.children).toHaveBeenCalledWith(
        expect.objectContaining({
          employeeFetcher: expect.objectContaining({
            employee: props.companyEmployeeQuery.employees.results[0],
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

describe('getExtenralAuthId', () => {
  describe('when encoded email', () => {
    it('should return the auth0 id', () => {
      expect(
        getExtenralAuthId(
          'aHR0cHM6Ly9jdC1iMmIuYXV0aDAuY29tLzphdXRoMHw1ZTFlMTA3OGJlNmJkYjBkYjNjMDUwNzA=@29393-340404.com'
        )
      ).toEqual('auth0|5e1e1078be6bdb0db3c05070');
    });
  });
  describe('when normal email', () => {
    it('should return undefined', () => {
      expect(getExtenralAuthId('foo@company')).toBeUndefined();
    });
  });
});
