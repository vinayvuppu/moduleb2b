import PropTypes from 'prop-types';
import React from 'react';
import { shallow } from 'enzyme';
import { Text, Card } from '@commercetools-frontend/ui-kit';
import { intlMock } from '@commercetools-local/test-utils';
import { OrderCreateOwnerPick } from './order-create-owner-pick';
import { OWNER_TYPES } from './constants';

const createConnectorProps = custom => ({
  isLoading: false,
  employees: {
    results: [],
    total: 0,
  },
  searchQuery: {
    set: jest.fn(),
    value: {
      perPage: 20,
      page: 1,
      searchText: '',
    },
  },
  ...custom,
});

const createTestProps = props => ({
  title: 'Customer',
  onActionError: jest.fn(),
  cartDraft: {},
  employeesFetcher: createConnectorProps(),
  cartDraftState: {
    value: {},
    update: jest.fn(),
  },
  storeState: {
    value: {
      id: 'store-1',
      key: 'store-1',
      nameAllLocales: [
        {
          locale: 'de',
          value: 'deutschland',
        },
      ],
    },
    update: jest.fn(),
  },
  ownerState: {
    owner: {
      type: undefined,
      company: undefined,
    },
    update: jest.fn(),
  },
  initialSelectionModalState: {
    isOpen: true,
    close: jest.fn(),
  },
  company: {
    id: 'companyId1',
    key: 'company-key-1',
    addresses: [],
  },
  employee: {
    id: 'employee-id-1',
    email: 'foo@bar.com',
    defaultBillingAddress: '1',
    defaultShippingAddress: '2',
    stores: [
      {
        key: 'store-key-1',
      },
    ],
    addresses: [
      {
        id: '1',
      },
      {
        id: '2',
      },
    ],
  },
  goToAddressSelection: jest.fn(),
  projectKey: 'test-1',
  // Connected
  showNotification: jest.fn(),
  // HoC
  intl: intlMock,

  ...props,
});

const TestRowItem = ({ children }) => <div>{children}</div>;
TestRowItem.propTypes = {
  children: PropTypes.any.isRequired,
};

describe('rendering base elements', () => {
  let props;
  let wrapper;

  describe('when no owner is selected', () => {
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<OrderCreateOwnerPick {...props} />);
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should render the three option cards', () => {
      expect(wrapper.find(Card)).toHaveLength(3);
    });
  });
  describe('when owner is selected', () => {
    beforeEach(() => {
      props = createTestProps({
        ownerState: {
          owner: {
            type: OWNER_TYPES.OWNER_EMPLOYEE,
            company: undefined,
          },
          update: jest.fn(),
        },
      });
      wrapper = shallow(<OrderCreateOwnerPick {...props} />);
    });

    it('should render title', () => {
      expect(wrapper.find(Text.Headline)).toHaveProp('children', 'Customer');
    });

    it('should render SearchInput', () => {
      expect(wrapper).toRender('SearchInput');
    });

    describe('when employee search has no results', () => {
      it('should not render Table', () => {
        expect(wrapper).not.toRender('Table');
      });
      it('should render message for no results', () => {
        expect(wrapper.find('TextBody').children()).toHaveText(
          'Orders.Create.Step.Owner.noSearchResults'
        );
      });
    });

    describe('when employee search has results', () => {
      beforeEach(() => {
        props = createTestProps({
          ownerState: {
            owner: {
              type: OWNER_TYPES.OWNER_EMPLOYEE,
              company: undefined,
            },
            update: jest.fn(),
          },
          employeesFetcher: createConnectorProps({
            employees: {
              results: [
                {
                  id: '1',
                  customerNumber: 'test-1',
                  firstName: 'Jon',
                  lastName: 'Snow',
                  companyName: 'House Stark',
                  email: 'jon.snow@got.com',
                },
              ],
              total: 0,
            },
          }),
        });
        wrapper = shallow(<OrderCreateOwnerPick {...props} />);
      });

      it('should render Table', () => {
        expect(wrapper).toRender('Table');
      });

      it('should pass columns map', () => {
        expect(
          wrapper
            .find('Table')
            .prop('columns')
            .map(_ => _.key)
        ).toEqual(['employeeNumber', 'firstName', 'lastName', 'email']);
      });

      describe('should render table rows', () => {
        let instance;
        let wrapperRow;
        beforeEach(() => {
          instance = wrapper.instance();
        });

        it('should render customerNumber', () => {
          wrapperRow = shallow(
            <TestRowItem>
              {instance.renderItem({
                rowIndex: 0,
                columnKey: 'customerNumber',
              })}
            </TestRowItem>
          );
          expect(wrapperRow.text()).toBe('test-1');
        });
        it('should render firstName', () => {
          wrapperRow = shallow(
            <TestRowItem>
              {instance.renderItem({ rowIndex: 0, columnKey: 'firstName' })}
            </TestRowItem>
          );
          expect(wrapperRow.text()).toBe('Jon');
        });
        it('should render lastName', () => {
          wrapperRow = shallow(
            <TestRowItem>
              {instance.renderItem({ rowIndex: 0, columnKey: 'lastName' })}
            </TestRowItem>
          );
          expect(wrapperRow.text()).toBe('Snow');
        });
        it('should render companyName', () => {
          wrapperRow = shallow(
            <TestRowItem>
              {instance.renderItem({ rowIndex: 0, columnKey: 'companyName' })}
            </TestRowItem>
          );
          expect(wrapperRow.text()).toBe('House Stark');
        });
        it('should render email', () => {
          wrapperRow = shallow(
            <TestRowItem>
              {instance.renderItem({ rowIndex: 0, columnKey: 'email' })}
            </TestRowItem>
          );
          expect(wrapperRow.text()).toBe('jon.snow@got.com');
        });
      });
      describe('Pagination', () => {
        it('should render Pagination component', () => {
          expect(wrapper).toRender('Pagination');
        });
        it('should have `page` prop', () => {
          expect(wrapper.find('Pagination')).toHaveProp('page', 1);
        });
        it('should have `perPage` prop', () => {
          expect(wrapper.find('Pagination')).toHaveProp('perPage', 20);
        });
        it('should have `totalItems` prop', () => {
          expect(wrapper.find('Pagination')).toHaveProp(
            'totalItems',
            props.employeesFetcher.employees.total
          );
        });
      });
    });
  });
});

describe('callbacks', () => {
  let props;
  let wrapper;

  describe('when select owner type', () => {
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<OrderCreateOwnerPick {...props} />);
    });

    describe('when select OWNER_ME', () => {
      beforeEach(() => {
        wrapper.find({ 'data-testid': 'ownerMeButton' }).simulate('click');
      });

      it('should call `goToAddressSelection` prop with the employee id', () => {
        expect(props.goToAddressSelection).toHaveBeenCalledWith(
          'employee-id-1'
        );
      });

      it('should call to update the owner state', () => {
        expect(props.ownerState.update).toHaveBeenCalledWith({
          type: OWNER_TYPES.OWNER_ME,
          company: undefined,
          employeeId: 'employee-id-1',
        });
      });

      it('should call to update the cart state', () => {
        expect(props.cartDraftState.update).toHaveBeenCalledWith({
          billingAddress: { id: '1' },
          customerEmail: 'foo@bar.com',
          customerId: 'employee-id-1',
          shippingAddress: { id: '2' },
          store: {
            key: 'store-key-1',
            typeId: 'store',
          },
        });
      });
    });

    describe('when select OWNER_EMPLOYEE', () => {
      beforeEach(() => {
        wrapper
          .find({ 'data-testid': 'ownerEmployeeButton' })
          .simulate('click');
      });

      it('should call to update the owner state', () => {
        expect(props.ownerState.update).toHaveBeenCalledWith({
          type: OWNER_TYPES.OWNER_EMPLOYEE,
          company: undefined,
        });
      });
    });

    describe('when select OWNER_COMPANY', () => {
      beforeEach(() => {
        wrapper.find({ 'data-testid': 'ownerCompanyButton' }).simulate('click');
      });

      it('should call to update the owner state', () => {
        expect(props.ownerState.update).toHaveBeenCalledWith({
          type: OWNER_TYPES.OWNER_COMPANY,
          company: props.company,
        });
      });

      it('should call to cartDraftState to update the store', () => {
        expect(props.cartDraftState.update).toHaveBeenCalledWith({
          store: { key: 'store-key-1', typeId: 'store' },
          customerEmail: 'foo@bar.com',
          customerId: 'employee-id-1',
          billingAddress: {},
          shippingAddress: {},
        });
      });

      it('should call to goToAddressSelection', () => {
        expect(props.goToAddressSelection).toHaveBeenCalled();
      });
    });
  });

  describe('when user searchs for a employee', () => {
    beforeEach(() => {
      props = createTestProps({
        ownerState: {
          owner: {
            type: OWNER_TYPES.OWNER_EMPLOYEE,
            company: undefined,
          },
          update: jest.fn(),
        },
      });
      wrapper = shallow(<OrderCreateOwnerPick {...props} />);
      return wrapper.find('SearchInput').prop('onSubmit')('foo');
    });

    it('should call `set` from `searchQuery`', () => {
      expect(props.employeesFetcher.searchQuery.set).toHaveBeenCalled();
    });
  });
  describe('when user clicks in a row', () => {
    describe('when employee has addresses', () => {
      beforeEach(() => {
        props = createTestProps({
          ownerState: {
            owner: {
              type: OWNER_TYPES.OWNER_EMPLOYEE,
              company: undefined,
            },
            update: jest.fn(),
          },
          employeesFetcher: createConnectorProps({
            employees: {
              total: 1,
              results: [
                {
                  id: 'id-1',
                  email: 'foo@bar.com',
                  defaultBillingAddressId: '1',
                  defaultShippingAddressId: '2',
                  stores: [
                    {
                      key: 'store-key-1',
                    },
                  ],
                  addresses: [
                    {
                      id: '1',
                    },
                    {
                      id: '2',
                    },
                  ],
                },
              ],
            },
          }),
        });
        wrapper = shallow(<OrderCreateOwnerPick {...props} />);
        wrapper.instance().handleRowClick(0);
      });
      it('should call `update` from `cartDraftState`', () => {
        expect(props.cartDraftState.update).toHaveBeenCalledTimes(1);
      });
      it('should call goToAddressSelection', () => {
        expect(props.goToAddressSelection).toHaveBeenCalledTimes(1);
      });
    });
    describe('when employee has no addresses', () => {
      beforeEach(() => {
        props = createTestProps({
          ownerState: {
            owner: {
              type: OWNER_TYPES.OWNER_EMPLOYEE,
              company: undefined,
            },
            update: jest.fn(),
          },
          employeesFetcher: createConnectorProps({
            employees: {
              total: 1,
              results: [
                {
                  id: 'id-1',
                  email: 'foo@bar.com',
                  defaultBillingAddressId: '1',
                  defaultShippingAddressId: '2',
                  stores: [
                    {
                      key: 'store-key-1',
                    },
                  ],
                  addresses: [],
                },
              ],
            },
          }),
        });
        wrapper = shallow(<OrderCreateOwnerPick {...props} />);
        wrapper.instance().handleRowClick(0);
      });
      it('should call `update` from `cartDraftState`', () => {
        expect(props.cartDraftState.update).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('when user changes page', () => {
    beforeEach(() => {
      props = createTestProps({
        ownerState: {
          owner: {
            type: OWNER_TYPES.OWNER_EMPLOYEE,
            company: undefined,
          },
          update: jest.fn(),
        },
        employeesFetcher: createConnectorProps({
          employees: {
            results: [
              {
                id: '1',
                customerNumber: 'test-1',
                firstName: 'Jon',
                lastName: 'Snow',
                companyName: 'House Stark',
                email: 'jon.snow@got.com',
                stores: [
                  {
                    key: 'store-key-1',
                  },
                ],
              },
            ],
            total: 0,
          },
        }),
      });
      wrapper = shallow(<OrderCreateOwnerPick {...props} />);
      wrapper.find('Pagination').prop('onPageChange')(2);
    });
    it('should call `set` from `searchQuery`', () => {
      expect(props.employeesFetcher.searchQuery.set).toHaveBeenCalled();
    });
  });
  describe('when user changes items per page', () => {
    beforeEach(() => {
      props = createTestProps({
        ownerState: {
          owner: {
            type: OWNER_TYPES.OWNER_EMPLOYEE,
            company: undefined,
          },
          update: jest.fn(),
        },
        employeesFetcher: createConnectorProps({
          employees: {
            results: [
              {
                id: '1',
                customerNumber: 'test-1',
                firstName: 'Jon',
                lastName: 'Snow',
                companyName: 'House Stark',
                email: 'jon.snow@got.com',
                stores: [
                  {
                    key: 'store-key-1',
                  },
                ],
              },
            ],
            total: 0,
          },
        }),
      });
      wrapper = shallow(<OrderCreateOwnerPick {...props} />);
      wrapper.find('Pagination').prop('onPerPageChange')(50);
    });

    it('should call `set` from `searchQuery`', () => {
      expect(props.employeesFetcher.searchQuery.set).toHaveBeenCalled();
    });
  });
});
