import React from 'react';
import { shallow } from 'enzyme';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import { LoadingSpinner, Table } from '@commercetools-frontend/ui-kit';
import { intlMock } from '@commercetools-local/test-utils';
import Pagination from '@commercetools-local/core/components/search/pagination';
import SearchViewControlledContainer from '@commercetools-local/core/components/search/search-view-controlled-container';
import ColumnManager from '@commercetools-local/core/components/column-manager';
import CustomFieldDefinitionsConnector from '@commercetools-local/core/components/custom-field-definitions-connector';
import FormattedDateTime from '@commercetools-local/core/components/formatted-date-time';
import ProjectExtensionOrderStatesVisibilityConnector from '../project-extension-order-states-visibility-connector';
import { ORDER_STATES_VISIBILITY } from '../../../../constants/misc';
import CompanyOrdersListCustomViewsConnector from '../company-orders-list-custom-views-connector';
import CompanyOrdersListConnector from '../company-orders-list-connector';
import {
  CompanyOrdersList,
  isApproverEmployee,
  getColumns,
} from './company-orders-list';
import EmployeeDetailWrapper from '../employee-detail-wrapper';

jest.mock('@commercetools-local/utils/formats/date');

const crateRestrictToState = () => ({
  restrictToState: {
    id: 'state-id',
    nameAllLocales: [
      {
        locale: 'en',
        value: 'pending',
      },
    ],
  },
});

const createOrder = custom => ({
  id: 'abc',
  orderNumber: 'OR-1234',
  customerId: '394b693b-47ea-4b5a-bf31-fcc254983958',
  customerEmail: 'jane.doe@123456.org',
  totalPrice: { currencyCode: 'EUR', centAmount: 800 },
  orderState: 'Confirmed',
  shipmentState: 'Backorder',
  paymentState: 'Pending',
  createdAt: '2016-08-10T16:26:09.045Z',
  lastModifiedAt: '2016-08-10T16:26:09.045Z',
  lineItems: [
    {
      productId: '6863483b-7a34-44dd-900b-df15d206b754',
      name: { de: 'Hundefutter', en: 'dog food' },
      variant: { id: 1 },
      price: {
        value: { currencyCode: 'EUR', centAmount: 800 },
      },
      quantity: 4,
      taxRate: {
        name: 'tax rate',
        amount: 0.16,
        includedInPrice: true,
        country: 'DE',
      },
      createdAt: '2016-08-11T16:26:09.045Z',
      lastModifiedAt: '2016-08-11T16:26:09.045Z',
    },
    {
      productId: 'some-other-id',
      name: { de: 'Katzenfutter', en: 'cat food' },
      variant: { id: 1 },
      price: {
        value: { currencyCode: 'EUR', centAmount: 800 },
      },
      quantity: 1,
      taxRate: {
        name: 'tax rate',
        amount: 0.16,
        includedInPrice: true,
        country: 'DE',
      },
      createdAt: '2016-08-11T16:26:09.045Z',
      lastModifiedAt: '2016-08-11T16:26:09.045Z',
    },
  ],
  customLineItems: [],
  custom: null,
  ...custom,
});

const createOrders = custom => ({
  count: 1,
  total: 1,
  results: [createOrder()],

  ...custom,
});

const createOrderState = custom => ({
  id: '1',
  version: 1,
  key: 'order_state_test2',
  type: 'OrderState',
  roles: [],
  builtIn: false,
  initial: true,
  createdAt: '2017-05-16T09:22:15.290Z',
  lastModifiedAt: '2017-05-16T09:22:15.290Z',
  ...custom,
});

const createTestProps = props => ({
  projectKey: 'test',
  location: {},
  canViewAllOrders: true,
  showNotification: jest.fn(),
  // withApplicationContext
  userId: 'foo-user',
  language: 'en',
  languages: ['de', 'en'],
  locale: 'en',
  // withRouter
  history: { push: jest.fn(), replace: jest.fn() },
  // injectIntl
  intl: intlMock, // injectTracking
  tracking: {
    trackGoToOrderDetails: jest.fn(),
  },
  // match: {
  //   url: 'url'
  // },
  orderSpecificStores: [],
  quickFilterDefinitions: [],
  ...props,
});

const createActiveView = custom => ({
  page: 1,
  perPage: 20,
  searchText: '',
  sorting: {
    key: 'createdAt',
    order: 'desc',
  },
  filters: {},

  ...custom,
});

const createOrdersFetcher = custom => ({
  isLoading: false,
  orders: createOrders(),

  ...custom,
});

const createCustomFieldDefinitionsFetcher = custom => ({
  isLoading: false,
  customFieldDefinitions: [],

  ...custom,
});

const createStatesFetcher = custom => ({
  isLoading: false,
  hasOrderStates: true,
  ...custom,
});

const createListConnectorProps = custom => ({
  ordersFetcher: createOrdersFetcher(),
  statesFetcher: createStatesFetcher(),
  ...custom,
});

const createCustomViewsConnectorProps = custom => ({
  activeView: createActiveView(),
  setActiveView: jest.fn().mockName('setActiveView'),

  ...custom,
});

const createSearchViewProps = custom => ({
  rowCount: 2,
  results: ['1', '2'],
  sorting: { key: 'rank', order: 'asc' },
  onSortChange: jest.fn(),
  measurementResetter: jest.fn(),
  footer: (
    <Pagination
      totalItems={2}
      perPage={20}
      page={1}
      onPerPageChange={jest.fn()}
      onPageChange={jest.fn()}
    />
  ),

  ...custom,
});

const createOrderStatesVisibilityConnectorProps = custom => ({
  isLoading: false,
  orderStatesVisibility: [
    ORDER_STATES_VISIBILITY.HIDE_ORDER_STATE,
    ORDER_STATES_VISIBILITY.HIDE_PAYMENT_STATE,
    ORDER_STATES_VISIBILITY.HIDE_SHIPMENT_STATE,
  ],
  ...custom,
});

const createEmployeeDetailWrapper = custom => ({
  company: {
    id: 'companyId1',
    key: 'company-store-key',
    name: 'company-name',
    customerGroup: {
      id: 'company-key-1',
    },
    store: {
      key: 'company-key-1',
    },
  },
  ...custom,
});

describe('rendering', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<CompanyOrdersList {...props} />);
  });

  describe('when loading order states visibility settings', () => {
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<CompanyOrdersList {...props} />)
        .find(EmployeeDetailWrapper)
        .renderProp('children')(createEmployeeDetailWrapper())
        .find(CompanyOrdersListCustomViewsConnector.Consumer)
        .renderProp('children')(createCustomViewsConnectorProps())
        .find(CompanyOrdersListConnector)
        .renderProp('children')(createListConnectorProps())
        .find(ProjectExtensionOrderStatesVisibilityConnector)
        .renderProp('children')(
          createOrderStatesVisibilityConnectorProps({ isLoading: true })
        )
        // connector with orders resource
        .find(CustomFieldDefinitionsConnector)
        .renderProp('children')({
          customFieldDefinitionsFetcher: createCustomFieldDefinitionsFetcher(),
        })
        // connector with payments resource
        .find(CustomFieldDefinitionsConnector)
        .renderProp('children')({
          customFieldDefinitionsFetcher: createCustomFieldDefinitionsFetcher(),
        })
        .find(SearchViewControlledContainer)
        .renderProp('children')(createSearchViewProps());
    });

    it('should render `<LoadingSpinner>', () => {
      expect(wrapper).toRender(LoadingSpinner);
    });
  });

  describe('when loading custom field definitions', () => {
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<CompanyOrdersList {...props} />)
        .find(EmployeeDetailWrapper)
        .renderProp('children')(createEmployeeDetailWrapper())
        .find(CompanyOrdersListCustomViewsConnector.Consumer)
        .renderProp('children')(createCustomViewsConnectorProps())
        .find(CompanyOrdersListConnector)
        .renderProp('children')(createListConnectorProps())
        .find(ProjectExtensionOrderStatesVisibilityConnector)
        .renderProp('children')(createOrderStatesVisibilityConnectorProps())
        // connector with orders resource
        .find(CustomFieldDefinitionsConnector)
        .renderProp('children')({
          customFieldDefinitionsFetcher: createCustomFieldDefinitionsFetcher({
            isLoading: true,
          }),
        })
        // connector with payments resource
        .find(CustomFieldDefinitionsConnector)
        .renderProp('children')({
          customFieldDefinitionsFetcher: createCustomFieldDefinitionsFetcher({
            isLoading: true,
          }),
        })
        .find(SearchViewControlledContainer)
        .renderProp('children')(createSearchViewProps());
    });

    it('should render `<LoadingSpinner>', () => {
      expect(wrapper).toRender(LoadingSpinner);
    });
  });

  describe('when loaded', () => {
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<CompanyOrdersList {...props} />)
        .find(EmployeeDetailWrapper)
        .renderProp('children')(createEmployeeDetailWrapper())
        .find(CompanyOrdersListCustomViewsConnector.Consumer)
        .renderProp('children')(createCustomViewsConnectorProps())
        .find(CompanyOrdersListConnector)
        .renderProp('children')(createListConnectorProps())
        .find(ProjectExtensionOrderStatesVisibilityConnector)
        .renderProp('children')(createOrderStatesVisibilityConnectorProps())
        // connector with orders resource
        .find(CustomFieldDefinitionsConnector)
        .renderProp('children')({
          customFieldDefinitionsFetcher: createCustomFieldDefinitionsFetcher(),
        })
        // connector with payments resource
        .find(CustomFieldDefinitionsConnector)
        .renderProp('children')({
        customFieldDefinitionsFetcher: createCustomFieldDefinitionsFetcher(),
      });
    });

    it('should not render `<LoadingSpinner>', () => {
      expect(wrapper).not.toRender(LoadingSpinner);
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    describe('<Table>', () => {
      beforeEach(() => {
        wrapper = wrapper
          .find(SearchViewControlledContainer)
          .renderProp('children')(createSearchViewProps());
      });

      it('should render `<Table>`', () => {
        expect(wrapper).toRender(Table);
      });

      it('should render `<ColumnManager>`', () => {
        expect(wrapper).toRender(ColumnManager);
      });
    });

    describe('with `visibleColumns` on `activeView`', () => {
      beforeEach(() => {
        props = createTestProps();
        const activeView = createActiveView({
          visibleColumns: ['lastNameBilling', 'firstNameShipping', 'foo'],
        });
        wrapper = shallow(<CompanyOrdersList {...props} />)
          .find(EmployeeDetailWrapper)
          .renderProp('children')(createEmployeeDetailWrapper())
          .find(CompanyOrdersListCustomViewsConnector.Consumer)
          .renderProp('children')(
            createCustomViewsConnectorProps({
              activeView,
            })
          )
          .find(CompanyOrdersListConnector)
          .renderProp('children')(createListConnectorProps())
          .find(ProjectExtensionOrderStatesVisibilityConnector)
          .renderProp('children')(createOrderStatesVisibilityConnectorProps())
          // connector with orders resource
          .find(CustomFieldDefinitionsConnector)
          .renderProp('children')({
            customFieldDefinitionsFetcher: createCustomFieldDefinitionsFetcher(),
          })
          // connector with payments resource
          .find(CustomFieldDefinitionsConnector)
          .renderProp('children')({
            customFieldDefinitionsFetcher: createCustomFieldDefinitionsFetcher(),
          })
          .find(SearchViewControlledContainer)
          .renderProp('children')(createSearchViewProps());
      });

      it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
      });

      describe('<Table>', () => {
        it('should receive `visibleColumns`', () => {
          expect(wrapper.find(Table)).toHaveProp(
            'columns',
            expect.arrayContaining([
              expect.objectContaining({
                key: 'lastNameBilling',
              }),
              expect.objectContaining({
                key: 'firstNameShipping',
              }),
            ])
          );
        });

        it('should remove unknown `visibleColumns`', () => {
          expect(wrapper.find(Table)).toHaveProp(
            'columns',
            expect.not.arrayContaining([
              expect.objectContaining({
                key: 'foo',
              }),
            ])
          );
        });
      });
    });
  });
});

describe('interacting', () => {
  let props;
  let wrapper;

  describe('`generateSearchQuery`', () => {
    let searchQuery;

    describe('when the view is restricted to single state', () => {
      beforeEach(() => {
        props = createTestProps(crateRestrictToState());
        wrapper = shallow(<CompanyOrdersList {...props} />);
        searchQuery = wrapper
          .instance()
          .generateSearchQuery(createActiveView(), 'company-store-key');
      });

      it('should add the `company` and `state`filter to the search', () => {
        expect(searchQuery).toEqual({
          filters: {
            'store.key': [{ type: 'equalTo', value: ['company-store-key'] }],
            'state.id': [{ type: 'equalTo', value: ['state-id'] }],
          },
          page: 1,
          perPage: 20,
          searchText: '',
          sorting: { key: 'createdAt', order: 'desc' },
        });
      });
    });

    describe('when the view is not restricted to single state', () => {
      beforeEach(() => {
        props = createTestProps();
        wrapper = shallow(<CompanyOrdersList {...props} />);
        searchQuery = wrapper
          .instance()
          .generateSearchQuery(createActiveView(), 'company-store-key');
      });

      it('should add the `company` filter to the search', () => {
        expect(searchQuery).toEqual({
          filters: {
            'store.key': [{ type: 'equalTo', value: ['company-store-key'] }],
          },
          page: 1,
          perPage: 20,
          searchText: '',
          sorting: { key: 'createdAt', order: 'desc' },
        });
      });
    });
  });

  describe('`renderItem`', () => {
    let value;

    it('should render orderNumber', () => {
      value = wrapper.instance().renderItem([createOrder()], {
        rowIndex: 0,
        columnKey: 'orderNumber',
      });
      expect(value).toBe('OR-1234');
    });

    it('should render with custom string fields', () => {
      value = wrapper.instance().renderItem(
        [
          createOrder({
            custom: {
              customFieldsRaw: [
                {
                  name: 'customField1',
                  value: 'Custom Field 1',
                },
              ],
            },
          }),
        ],
        {
          rowIndex: 0,
          columnKey: 'customField1',
        },
        [{ name: 'customField1', type: { name: 'String' } }]
      );
      expect(value).toBe('Custom Field 1');
    });

    it('should render with missing custom field definition', () => {
      value = wrapper.instance().renderItem(
        [
          createOrder({
            custom: {
              customFieldsRaw: [],
            },
          }),
        ],
        {
          rowIndex: 0,
          columnKey: 'customField1',
        }
      );
      expect(value).toBe(NO_VALUE_FALLBACK);
    });

    it('should render with a missing custom field', () => {
      value = wrapper.instance().renderItem(
        [
          createOrder({
            custom: {
              customFieldsRaw: [],
            },
          }),
        ],
        {
          rowIndex: 0,
          columnKey: 'customField2',
        }
      );
      expect(value).toBe(NO_VALUE_FALLBACK);
    });

    it('should render customerEmail', () => {
      value = wrapper.instance().renderItem([createOrder()], {
        rowIndex: 0,
        columnKey: 'customerEmail',
      });
      expect(value).toBe('jane.doe@123456.org');
    });

    it('should render totalLineItemCount', () => {
      value = wrapper.instance().renderItem([createOrder()], {
        rowIndex: 0,
        columnKey: 'totalLineItemCount',
      });
      expect(value).toBe(2);
    });

    it('should render orderState', () => {
      value = wrapper.instance().renderItem([createOrder()], {
        rowIndex: 0,
        columnKey: 'orderState',
      });
      expect(value).toBe('OrderState.Confirmed');
    });

    it('should render shipmentState', () => {
      value = wrapper.instance().renderItem([createOrder()], {
        rowIndex: 0,
        columnKey: 'shipmentState',
      });
      expect(value).toBe('ShipmentState.Backorder');
    });

    it('should render paymentState', () => {
      value = wrapper.instance().renderItem([createOrder()], {
        rowIndex: 0,
        columnKey: 'paymentState',
      });
      expect(value).toBe('PaymentState.Pending');
    });

    it('should render createdAt', () => {
      value = shallow(
        <div>
          {wrapper.instance().renderItem([createOrder()], {
            rowIndex: 0,
            columnKey: 'createdAt',
          })}
        </div>
      );
      expect(value.find(FormattedDateTime)).toHaveProp(
        'value',
        '2016-08-10T16:26:09.045Z'
      );
    });

    it('should render lastModifiedAt', () => {
      value = shallow(
        <div>
          {wrapper.instance().renderItem([createOrder()], {
            rowIndex: 0,
            columnKey: 'createdAt',
          })}
        </div>
      );
      expect(value.find(FormattedDateTime)).toHaveProp(
        'value',
        '2016-08-10T16:26:09.045Z'
      );
    });

    describe('render Order Workflow state', () => {
      describe('without state name', () => {
        beforeEach(() => {
          props = createTestProps();
          wrapper = shallow(<CompanyOrdersList {...props} />);
          value = wrapper.instance().renderItem(
            [
              createOrder({
                state: createOrderState(),
              }),
            ],
            {
              rowIndex: 0,
              columnKey: 'state',
            }
          );
        });
        it('should render the state key', () => {
          expect(value).toBe('order_state_test2');
        });
      });
      describe('with state name', () => {
        describe('with requested translation', () => {
          beforeEach(() => {
            props = createTestProps();
            wrapper = shallow(<CompanyOrdersList {...props} />);
            value = wrapper.instance().renderItem(
              [
                createOrder({
                  state: createOrderState({
                    nameAllLocales: [{ locale: 'en', value: 'name1' }],
                  }),
                }),
              ],
              {
                rowIndex: 0,
                columnKey: 'state',
              }
            );
          });
          it('should render the state name', () => {
            expect(value).toBe('name1');
          });
        });
        describe('without requested translation', () => {
          beforeEach(() => {
            props = createTestProps();
            wrapper = shallow(<CompanyOrdersList {...props} />);
            value = wrapper.instance().renderItem(
              [
                createOrder({
                  state: createOrderState({
                    nameAllLocales: [{ locale: 'fr', value: 'name1' }],
                  }),
                }),
              ],
              {
                rowIndex: 0,
                columnKey: 'state',
              }
            );
          });
          it('should render the translation', () => {
            expect(value).toBe('name1 (FR)');
          });
        });
      });
    });
  });
});

describe('callbacks', () => {
  let wrapper;
  let props;
  let customViewConnectorProps;

  beforeEach(() => {
    props = createTestProps();
    customViewConnectorProps = createCustomViewsConnectorProps();
    wrapper = shallow(<CompanyOrdersList {...props} />)
      .find(EmployeeDetailWrapper)
      .renderProp('children')(createEmployeeDetailWrapper())
      .find(CompanyOrdersListCustomViewsConnector.Consumer)
      .renderProp('children')(customViewConnectorProps)
      .find(CompanyOrdersListConnector)
      .renderProp('children')(createListConnectorProps())
      .find(ProjectExtensionOrderStatesVisibilityConnector)
      .renderProp('children')(createOrderStatesVisibilityConnectorProps())
      // connector with orders resource
      .find(CustomFieldDefinitionsConnector)
      .renderProp('children')({
        customFieldDefinitionsFetcher: createCustomFieldDefinitionsFetcher(),
      })
      // connector with payments resource
      .find(CustomFieldDefinitionsConnector)
      .renderProp('children')({
        customFieldDefinitionsFetcher: createCustomFieldDefinitionsFetcher(),
      })
      .find(SearchViewControlledContainer)
      .renderProp('children')(createSearchViewProps());
  });

  describe('<ColumnManager>', () => {
    describe('`onUpdateColumns`', () => {
      beforeEach(() => {
        const nextVisibleColumns = [{ key: 'foo-next-column' }];

        wrapper.find(ColumnManager).prop('onUpdateColumns')(nextVisibleColumns);
      });

      it('should invoke `setActiveView` on the `<CompanyCompanyOrdersListCustomViewsConnector>`', () => {
        expect(customViewConnectorProps.setActiveView).toHaveBeenCalled();
      });

      it('should invoke `setActiveView` on `<CompanyCompanyOrdersListCustomViewsConnector>` with keys of the next visible columns', () => {
        expect(customViewConnectorProps.setActiveView).toHaveBeenCalledWith(
          expect.objectContaining({
            visibleColumns: expect.arrayContaining(['foo-next-column']),
          })
        );
      });
    });
  });
});

describe('functions', () => {
  describe('getColumns', () => {
    let columns;
    describe('when does not include actions column', () => {
      beforeEach(() => {
        columns = getColumns(false, [], null, [], 'en', ['en'], false)
          .available;
      });
      it('should not return the actions column', () => {
        expect(columns[columns.length - 1]).not.toEqual(
          expect.objectContaining({
            flexGrow: 0,
            key: 'actions',
          })
        );
      });
    });
    describe('when includes actions column', () => {
      beforeEach(() => {
        columns = getColumns(false, [], null, [], 'en', ['en'], true).available;
      });
      it('should not return the actions column', () => {
        expect(columns[columns.length - 1]).toEqual(
          expect.objectContaining({
            flexGrow: 0,
            key: 'actions',
          })
        );
      });
    });
  });
  describe('isApproverEmployee', () => {
    let employee;
    const company = {
      approverRoles: ['b2b-company-admin'],
    };
    describe('when the employee has approver role', () => {
      beforeEach(() => {
        employee = {
          roles: ['b2b-company-admin'],
        };
      });
      it('should return true', () => {
        expect(isApproverEmployee(employee, company)).toEqual(true);
      });
    });
    describe('when the employee has not approver role', () => {
      beforeEach(() => {
        employee = {
          roles: ['b2b-company-employee'],
        };
      });
      it('should return false', () => {
        expect(isApproverEmployee(employee, company)).toEqual(false);
      });
    });
    describe('when the employee has not roles', () => {
      beforeEach(() => {
        employee = {
          roles: [],
        };
      });
      it('should return false', () => {
        expect(isApproverEmployee(employee, company)).toEqual(false);
      });
    });
  });
});
