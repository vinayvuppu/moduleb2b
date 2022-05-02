import PropTypes from 'prop-types';
import React from 'react';
import { shallow } from 'enzyme';
import {
  PaperBillInvertedIcon,
  TruckIcon,
  SecondaryButton,
} from '@commercetools-frontend/ui-kit';
import { intlMock } from '@commercetools-local/test-utils';
import TabContentLayout from '@commercetools-local/core/components/tab-content-layout';
import { AddressesList } from './addresses-list';

const createTestAddress = props => ({
  city: 'Fihaflir',
  company: 'hamha',
  country: 'YT',
  email: 'isabi@had.er',
  firstName: 'Gregory',
  id: 'XytTwaUh',
  lastName: 'Morris',
  mobile: '07624 492965',
  phone: '(331) 452-3943',
  postalCode: '79298',
  region: 'Newfoundland and Labrador',
  state: 'Pennsylvania',
  streetName: 'Miwa Path',
  streetNumber: '33',
  title: 'Dr.',
  ...props,
});

const createTestEmployee = customProps => ({
  id: '1',
  addresses: [],
  defaultShippingAddressId: null,
  defaultBillingAddressId: null,
  ...customProps,
});

const createEmployeeFetcher = customProps => ({
  isLoading: false,
  employee: createTestEmployee(),
  ...customProps,
});

const createTestProps = props => ({
  goToAddressDetails: jest.fn(),
  goToAddressNew: jest.fn(),
  addressListPath: '/project/b2b-extension/employees/someid1/addresses',
  employeeFetcher: createEmployeeFetcher(),
  intl: intlMock,
  canManageEmployees: true,
  ...props,
});

const TestRowItem = ({ children }) => <div>{children}</div>;
TestRowItem.propTypes = {
  children: PropTypes.any.isRequired,
};

describe('when addresses list is empty', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<AddressesList {...props} />);
  });
  it('should not render Table', () => {
    expect(wrapper).not.toRender('Table');
  });
  it('should render empty message', () => {
    expect(wrapper).toRender({
      id: 'Employees.Details.AddressesForm.noAddressesTitle',
    });
  });
  it('should render LinkButton', () => {
    expect(wrapper).toRender('LinkButton');
  });
});

describe('when there are addresses', () => {
  let props;
  let wrapper;
  let createWrapperRow;
  beforeEach(() => {
    props = createTestProps({
      employeeFetcher: createEmployeeFetcher({
        employee: createTestEmployee({
          addresses: [createTestAddress()],
        }),
      }),
      intl: intlMock,
    });
    wrapper = shallow(<AddressesList {...props} />);
    const instance = wrapper.instance();
    createWrapperRow = (columnKey, rowIndex = 0) =>
      shallow(
        <TestRowItem>
          {instance.renderAddressesRow({ rowIndex, columnKey })}
        </TestRowItem>
      );
  });
  it('should pass column definition', () => {
    expect(
      wrapper
        .find('Table')
        .prop('columns')
        .map(_ => _.key)
    ).toEqual([
      'addressTypes',
      'contactName',
      'companyName',
      'address',
      'city',
      'postalCode',
      'state',
      'region',
      'country',
    ]);
  });

  describe('columns', () => {
    describe('addressTypes', () => {
      const key = 'addressTypes';
      describe('with two rows, each containg default billing and shipping addresses', () => {
        let wrapperRow;
        beforeEach(() => {
          wrapper.setProps({
            employeeFetcher: createEmployeeFetcher({
              employee: createTestEmployee({
                addresses: [
                  createTestAddress({ id: 'id-of-default-billing-address' }),
                  createTestAddress({ id: 'id-of-default-shipping-address' }),
                ],
                defaultBillingAddressId: 'id-of-default-billing-address',
                defaultShippingAddressId: 'id-of-default-shipping-address',
              }),
            }),
          });
        });
        describe('first row', () => {
          beforeEach(() => {
            wrapperRow = createWrapperRow(key, 0);
          });
          it('should render a billing icon', () => {
            expect(wrapperRow).toRender(PaperBillInvertedIcon);
          });
        });
        describe('second row', () => {
          beforeEach(() => {
            wrapperRow = createWrapperRow(key, 1);
          });
          it('should render shipping icon', () => {
            expect(wrapperRow).toRender(TruckIcon);
          });
        });
      });

      describe('with one row being both default shipping and billing address', () => {
        let wrapperRow;
        beforeAll(() => {
          wrapper.setProps({
            employeeFetcher: createEmployeeFetcher({
              employee: createTestEmployee({
                addresses: [
                  createTestAddress({
                    id: 'id-of-default-billing-and-shipping-address',
                  }),
                ],
                defaultBillingAddressId:
                  'id-of-default-billing-and-shipping-address',
                defaultShippingAddressId:
                  'id-of-default-billing-and-shipping-address',
              }),
            }),
          });
          wrapperRow = createWrapperRow(key);
        });
        it('should render a shipping icon', () => {
          expect(wrapperRow).toRender(TruckIcon);
        });
        it('should render a billing icon', () => {
          expect(wrapperRow).toRender(PaperBillInvertedIcon);
        });
      });
    });
    describe('contactName', () => {
      let wrapperRow;
      beforeAll(() => {
        wrapperRow = createWrapperRow('contactName');
      });
      it('should render contactName', () => {
        expect(wrapperRow.text()).toBe('Gregory Morris');
      });
    });
    describe('companyName', () => {
      let wrapperRow;
      beforeAll(() => {
        wrapperRow = createWrapperRow('companyName');
      });
      it('should render companyName', () => {
        expect(wrapperRow.text()).toBe('hamha');
      });
    });
    describe('address (street)', () => {
      let wrapperRow;
      beforeAll(() => {
        wrapperRow = createWrapperRow('address');
      });
      it('should render address', () => {
        expect(wrapperRow.text()).toBe('Miwa Path 33');
      });
    });
    describe('city', () => {
      let wrapperRow;
      beforeAll(() => {
        wrapperRow = createWrapperRow('city');
      });
      it('should render city', () => {
        expect(wrapperRow.text()).toBe('Fihaflir');
      });
    });
    describe('postalCode', () => {
      let wrapperRow;
      beforeAll(() => {
        wrapperRow = createWrapperRow('postalCode');
      });
      it('should render postalCode', () => {
        expect(wrapperRow.text()).toBe('79298');
      });
    });

    describe('state', () => {
      let wrapperRow;
      beforeAll(() => {
        wrapperRow = createWrapperRow('state');
      });
      it('should render state', () => {
        expect(wrapperRow.text()).toBe('Pennsylvania');
      });
    });

    describe('region', () => {
      let wrapperRow;
      beforeAll(() => {
        wrapperRow = createWrapperRow('region');
      });
      it('should render region', () => {
        expect(wrapperRow.text()).toBe('Newfoundland and Labrador');
      });
    });

    describe('country', () => {
      let wrapperRow;
      beforeAll(() => {
        wrapperRow = createWrapperRow('country');
      });
      it('should render country', () => {
        expect(wrapperRow.text()).toBe('YT');
      });
    });

    describe('when there is a PO Box', () => {
      beforeEach(() => {
        // Update the address with a pOBox
        wrapper.setProps({
          employeeFetcher: createEmployeeFetcher({
            employee: createTestEmployee({
              addresses: [
                {
                  ...props.employeeFetcher.employee.addresses[0],
                  pOBox: '12345',
                },
              ],
            }),
          }),
        });
      });
      describe('column address (pOBox)', () => {
        beforeEach(() => {
          shallow(
            <TestRowItem>
              {wrapper.instance().renderAddressesRow({
                rowIndex: 0,
                columnKey: 'address',
              })}
            </TestRowItem>
          );
        });
        it('should render pOBox label message', () => {
          expect(props.intl.formatMessage).toHaveBeenLastCalledWith(
            expect.objectContaining({
              id: 'Employees.Details.AddressesForm.labelPOBox',
            }),
            { value: '12345' }
          );
        });
      });
    });
  });
});

describe('rendering', () => {
  let props;
  let wrapper;
  describe('content header', () => {
    let headerWrapper;
    describe('add button', () => {
      beforeEach(() => {
        props = createTestProps({
          employeeFetcher: createEmployeeFetcher({
            employee: createTestEmployee({
              addresses: [createTestAddress(), createTestAddress()],
            }),
          }),
          projectKey: 'project',
          employeeId: 'someid1',
        });
        wrapper = shallow(<AddressesList {...props} />);
        headerWrapper = shallow(
          <div>{wrapper.find(TabContentLayout).prop('header')}</div>
        );
      });
      it('should link to new address url', () => {
        expect(headerWrapper.find(SecondaryButton)).toHaveProp(
          'linkTo',
          `${props.addressListPath}/new`
        );
      });
    });
  });
});

describe('callbacks', () => {
  let props;
  let wrapper;
  describe('when clicking a row', () => {
    beforeEach(() => {
      props = createTestProps({
        employeeFetcher: createEmployeeFetcher({
          employee: createTestEmployee({
            addresses: [createTestAddress(), createTestAddress()],
          }),
        }),
        projectKey: 'project',
        employeeId: 'someid1',
      });
      wrapper = shallow(<AddressesList {...props} />);
      wrapper.find('Table').prop('onRowClick')(null, 0);
    });
    it('should redirect to address detail view', () => {
      expect(props.goToAddressDetails).toHaveBeenCalled();
    });
  });
});
