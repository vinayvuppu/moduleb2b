import PropTypes from 'prop-types';
import React from 'react';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';
import { LoadingSpinner } from '@commercetools-frontend/ui-kit';
import { intlMock } from '@commercetools-local/test-utils';
import FormattedDateTime from '@commercetools-local/core/components/formatted-date-time';
import OrdersListConnector from '../orders-list-connector';
import { OrdersList } from './orders-list';

jest.mock('@commercetools-local/utils/formats/date');

const createTestOrder = props => ({
  id: 'order-id-adf-asdf-adf',
  orderNumber: '123',
  orderState: 'Open',
  createdAt: '2016-11-15T16:41:27.167Z',
  totalPrice: {
    centAmount: '154619494463987360',
    currencyCode: 'GBP',
  },
  ...props,
});

const createTestProps = props => ({
  projectKey: 'test-project',
  employeeId: 'employee-id-foo-123',
  isActive: true,
  intl: intlMock,
  goToOrderDetails: jest.fn(),
  ...props,
});

const createConnectorProps = props => ({
  ordersFetcher: {
    isLoading: false,
    orders: {
      total: 1,
      count: 1,
      offset: 0,
      results: [createTestOrder()],
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
      wrapper = shallow(<OrdersList {...props} />);
      wrapper = wrapper.find(OrdersListConnector).renderProp('children')(
        createConnectorProps({
          ordersFetcher: {
            isLoading: true,
            orders: {
              total: 1,
              count: 1,
              offset: 0,
              results: [createTestOrder()],
            },
          },
        })
      );
    });

    it('should render the loading spinner', () => {
      expect(wrapper).toRender(LoadingSpinner);
    });
  });

  describe('without orders', () => {
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<OrdersList {...props} />);
      wrapper = wrapper.find(OrdersListConnector).renderProp('children')(
        createConnectorProps({
          ordersFetcher: {
            isLoading: true,
            orders: {
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

  describe('with orders', () => {
    const orders = [createTestOrder()];
    let contentWrapper;
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<OrdersList {...props} />);
      contentWrapper = wrapper.find(OrdersListConnector).renderProp('children')(
        createConnectorProps()
      );
    });
    it('outputs correct tree', () => {
      expect(wrapper).toMatchSnapshot();
    });

    describe('rendering the table', () => {
      it('should render table with orders', () => {
        expect(
          contentWrapper
            .find('Table')
            .prop('columns')
            .map(_ => _.key)
        ).toEqual([
          'orderNumber',
          'orderState',
          'paymentState',
          'shipmentState',
          'totalPrice',
          'createdAt',
        ]);
      });
      describe('columns rendering', () => {
        const index = 0;
        it('should render column orderNumber', () => {
          const key = 'orderNumber';
          const wrapperRow = shallow(
            <TestRowItem>
              {wrapper
                .instance()
                .renderOrdersRow({ rowIndex: index, columnKey: key }, orders)}
            </TestRowItem>
          );
          expect(wrapperRow).toHaveText('123');
        });
        it('should render column orderState', () => {
          const key = 'orderState';
          const wrapperRow = shallow(
            <TestRowItem>
              {wrapper
                .instance()
                .renderOrdersRow({ rowIndex: index, columnKey: key }, orders)}
            </TestRowItem>
          );
          expect(wrapperRow).toRender({ id: 'OrderState.Open' });
        });
        it('should render column createdAt', () => {
          const key = 'createdAt';
          const wrapperRow = shallow(
            <TestRowItem>
              {wrapper
                .instance()
                .renderOrdersRow({ rowIndex: index, columnKey: key }, orders)}
            </TestRowItem>
          );
          expect(wrapperRow.find(FormattedDateTime)).toHaveProp(
            'value',
            '2016-11-15T16:41:27.167Z'
          );
        });
        it('should render column totalPrice', () => {
          const key = 'totalPrice';
          const wrapperRow = shallow(
            <TestRowItem>
              {wrapper
                .instance()
                .renderOrdersRow({ rowIndex: index, columnKey: key }, orders)}
            </TestRowItem>
          );
          expect(wrapperRow).toHaveText('GBP 1546194944639873.5');
        });
      });
    });
  });
  describe('callbacks', () => {
    describe('when a row is clicked', () => {
      beforeAll(() => {
        props = createTestProps();
        wrapper = shallow(<OrdersList {...props} />);
        wrapper = wrapper.find(OrdersListConnector).renderProp('children')(
          createConnectorProps()
        );
        wrapper.find('Table').prop('onRowClick')(null, 0);
      });

      it('should call `goToOrderDetails`', () => {
        expect(props.goToOrderDetails).toHaveBeenCalled();
      });
    });
  });
});
