import PropTypes from 'prop-types';
import React from 'react';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';
import { LoadingSpinner } from '@commercetools-frontend/ui-kit';
import { intlMock } from '@commercetools-local/test-utils';
import EmployeesListConnector from '../employees-list-connector';
import { EmployeesList } from './employees-list';
import B2BApolloClientContext from '../../../../common/b2b-apollo-client-context';

jest.mock('@commercetools-local/utils/formats/date');

const createTestEmployee = props => ({
  id: 'abc-def',
  email: 'foo@bar.com',
  firstName: 'foo',
  lastName: 'bar',
  customerNumber: '1234',
  ...props,
});

const createTestProps = props => ({
  projectKey: 'test-project',
  company: {
    id: 'company-id-foo-123',
    customerGroup: { id: 'customer-group-id1' },
  },
  isActive: true,
  intl: intlMock,
  goToEmployeeDetails: jest.fn(),

  ...props,
});

const createConnectorProps = props => ({
  employeesFetcher: {
    isLoading: false,
    employees: {
      total: 1,
      count: 1,
      offset: 0,
      results: [createTestEmployee()],
    },
  },
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
  ...props,
});
const createB2BApolloClientContextProps = () => ({ apolloClient: {} });

const TestRowItem = ({ children }) => <div>{children}</div>;
TestRowItem.propTypes = {
  children: PropTypes.any.isRequired,
};

describe('rendering', () => {
  let props;
  let wrapper;
  describe('when loading', () => {
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<EmployeesList {...props} />);
      wrapper = wrapper
        .find(B2BApolloClientContext.Consumer)
        .renderProp('children')(createB2BApolloClientContextProps())
        .find(EmployeesListConnector)
        .renderProp('children')(
        createConnectorProps({
          employeesFetcher: {
            isLoading: true,
            employees: {
              total: 1,
              count: 1,
              offset: 0,
              results: [createTestEmployee()],
            },
          },
        })
      );
    });

    it('should render the loading spinner', () => {
      expect(wrapper).toRender(LoadingSpinner);
    });
  });

  describe('without employees', () => {
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<EmployeesList {...props} />);
      wrapper = wrapper
        .find(B2BApolloClientContext.Consumer)
        .renderProp('children')(createB2BApolloClientContextProps())
        .find(EmployeesListConnector)
        .renderProp('children')(
        createConnectorProps({
          employeesFetcher: {
            isLoading: true,
            employees: {
              total: 0,
              count: 0,
              offset: 0,
              results: [],
            },
          },
        })
      );
    });
    it('outputs correct tree', () => {
      expect(wrapper).toMatchSnapshot();
    });
    it('should render base elements', () => {
      expect(wrapper).toRender(FormattedMessage);
    });
  });

  describe('with employees', () => {
    const employees = [createTestEmployee()];
    let contentWrapper;
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<EmployeesList {...props} />);
      contentWrapper = wrapper
        .find(B2BApolloClientContext.Consumer)
        .renderProp('children')(createB2BApolloClientContextProps())
        .find(EmployeesListConnector)
        .renderProp('children')(createConnectorProps());
    });
    it('outputs correct tree', () => {
      expect(wrapper).toMatchSnapshot();
    });

    describe('rendering the table', () => {
      it('should render table with employees', () => {
        expect(
          contentWrapper
            .find('Table')
            .prop('columns')
            .map(_ => _.key)
        ).toEqual([
          'email',
          'firstName',
          'lastName',
          'roles',
          'amountExpended',
        ]);
      });
      describe('columns rendering', () => {
        const index = 0;
        it('should render column email', () => {
          const key = 'email';
          const wrapperRow = shallow(
            <TestRowItem>
              {wrapper
                .instance()
                .renderEmployeeRow(
                  { rowIndex: index, columnKey: key },
                  employees
                )}
            </TestRowItem>
          );
          expect(wrapperRow).toHaveText('foo@bar.com');
        });
        it('should render column firstName', () => {
          const key = 'firstName';
          const wrapperRow = shallow(
            <TestRowItem>
              {wrapper
                .instance()
                .renderEmployeeRow(
                  { rowIndex: index, columnKey: key },
                  employees
                )}
            </TestRowItem>
          );
          expect(wrapperRow).toHaveText('foo');
        });
        it('should render column lastName', () => {
          const key = 'lastName';
          const wrapperRow = shallow(
            <TestRowItem>
              {wrapper
                .instance()
                .renderEmployeeRow(
                  { rowIndex: index, columnKey: key },
                  employees
                )}
            </TestRowItem>
          );
          expect(wrapperRow).toHaveText('bar');
        });
        it('should render column customerNumber', () => {
          const key = 'customerNumber';
          const wrapperRow = shallow(
            <TestRowItem>
              {wrapper
                .instance()
                .renderEmployeeRow(
                  { rowIndex: index, columnKey: key },
                  employees
                )}
            </TestRowItem>
          );
          expect(wrapperRow).toHaveText('1234');
        });
      });
    });
  });
  describe('callbacks', () => {
    describe('when a row is clicked', () => {
      beforeAll(() => {
        props = createTestProps();
        wrapper = shallow(<EmployeesList {...props} />);
        wrapper = wrapper
          .find(B2BApolloClientContext.Consumer)
          .renderProp('children')(createB2BApolloClientContextProps())
          .find(EmployeesListConnector)
          .renderProp('children')(createConnectorProps());
        wrapper.find('Table').prop('onRowClick')(null, 0);
      });

      it('should call `goToEmployeeDetails`', () => {
        expect(props.goToEmployeeDetails).toHaveBeenCalled();
      });
    });
  });
});
