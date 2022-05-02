import React from 'react';
import { shallow } from 'enzyme';
import { OrderCreateOwnerPickConnector } from './order-create-owner-pick-connector';

const createEmployee = custom => ({
  id: 'some--id',
  version: 2,
  email: 'foo@bar.com',
  customerGroup: {
    id: 'cg-id',
  },
  company: 'company-id-1',
  addresses: [
    {
      id: 'address-id-1',
      country: 'ES',
    },
  ],

  ...custom,
});

const createTestProps = props => ({
  children: jest.fn(),
  projectKey: 'foo-key',
  companyId: 'company-id-1',
  searchQuery: {
    value: {
      page: 1,
      perPage: 20,
      searchText: '',
      sorting: {
        key: 'createdAt',
        order: 'desc',
      },
    },
  },
  locale: 'en',

  employeesQuery: {
    loading: false,
    refetch: jest.fn(),
    employees: {
      total: 1,
      count: 1,
      offset: 0,
      results: [createEmployee()],
    },
  },
  company: { id: 'company-id-1', customerGroup: { id: 'cg-id-1' } },
  userId: 'test-user-id',

  ...props,
});

describe('rendering', () => {
  let props;

  beforeEach(() => {
    props = createTestProps();
    shallow(<OrderCreateOwnerPickConnector {...props} />);
  });

  it('should invoke `children`', () => {
    expect(props.children).toHaveBeenCalled();
  });

  describe('employeesFetcher', () => {
    it('should invoke `children` with `isLoading`', () => {
      expect(props.children).toHaveBeenCalledWith(
        expect.objectContaining({
          employeesFetcher: expect.objectContaining({
            isLoading: props.employeesQuery.loading,
          }),
        })
      );
    });

    it('should invoke `children` with `employees`', () => {
      expect(props.children).toHaveBeenCalledWith(
        expect.objectContaining({
          employeesFetcher: expect.objectContaining({
            employees: props.employeesQuery.employees,
          }),
        })
      );
    });

    it('should invoke `children` with `searchQuery`', () => {
      expect(props.children).toHaveBeenCalledWith(
        expect.objectContaining({
          employeesFetcher: expect.objectContaining({
            searchQuery: props.searchQuery,
          }),
        })
      );
    });
  });
});
