import React from 'react';
import { shallow } from 'enzyme';
import { EmployeesListConnector } from './employees-list-connector';

const ChildComponent = () => <div>{'ChildComponent'}</div>;
ChildComponent.displayName = 'ChildComponent';

const createEmployee = props => ({
  id: 'abc-def',
  createdAt: '2018-04-08',
  lastModifiedAt: '2018-07-22',
  version: 11,
  customerNumber: 'abd0sdds',
  email: 'john.test@commercetools.de',
  customerGroup: {
    id: 'abc-def',
    version: 2,
    name: 'test-group',
  },
  middleName: 'de bour',

  ...props,
});

const createTestProps = props => ({
  children: jest.fn(() => <ChildComponent />),
  projectKey: 'foo-key',

  searchQuery: {
    page: 1,
    perPage: 20,
    searchText: '',
    sorting: {
      key: 'createdAt',
      order: 'desc',
    },
    filters: {},
  },
  locale: 'de',
  location: {},

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

  ...props,
});

describe('rendering', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<EmployeesListConnector {...props} />);
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
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

    describe('when `employees` are not present in the query result', () => {
      beforeEach(() => {
        props = createTestProps({
          employeesQuery: {
            loading: false,
            refetch: jest.fn(),
            employees: null,
          },
        });
        wrapper = shallow(<EmployeesListConnector {...props} />);
      });

      it('should call `children` with `employeesFetcher` and an empty result', () => {
        expect(props.children).toHaveBeenCalledWith(
          expect.objectContaining({
            employeesFetcher: expect.objectContaining({
              employees: {
                count: 0,
                total: 0,
                results: [],
              },
            }),
          })
        );
      });
    });

    it('should invoke `children` with `refetch`', () => {
      expect(props.children).toHaveBeenCalledWith(
        expect.objectContaining({
          employeesFetcher: expect.objectContaining({
            refetch: props.employeesQuery.refetch,
          }),
        })
      );
    });

    describe('with `inStore`', () => {
      const inStores = {
        employees: {
          total: 1,
          count: 1,
          offset: 0,
          results: [createEmployee()],
        },
      };
      beforeEach(() => {
        props = createTestProps({
          employeesQuery: {
            loading: false,
            refetch: jest.fn(),
            inStores,
            employees: null,
          },
        });
        wrapper = shallow(<EmployeesListConnector {...props} />);
      });
      it('should invoke `children` with `employees` from `inStore`', () => {
        expect(props.children).toHaveBeenCalledWith(
          expect.objectContaining({
            employeesFetcher: expect.objectContaining({
              employees: inStores.employees,
            }),
          })
        );
      });
    });
    describe('without `inStore`', () => {
      const employees = {
        total: 1,
        count: 1,
        offset: 0,
        results: [createEmployee()],
      };
      beforeEach(() => {
        props = createTestProps({
          employeesQuery: {
            loading: false,
            refetch: jest.fn(),
            inStores: null,
            employees,
          },
        });
        wrapper = shallow(<EmployeesListConnector {...props} />);
      });
      it('should invoke `children` with `employees` from `inStore`', () => {
        expect(props.children).toHaveBeenCalledWith(
          expect.objectContaining({
            employeesFetcher: expect.objectContaining({
              employees,
            }),
          })
        );
      });
    });
  });
});
