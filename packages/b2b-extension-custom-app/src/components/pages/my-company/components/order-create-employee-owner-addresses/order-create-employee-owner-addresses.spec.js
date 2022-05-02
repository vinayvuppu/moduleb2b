import React from 'react';
import { shallow } from 'enzyme';
import { IconButton, TextInput } from '@commercetools-frontend/ui-kit';
import { Formik } from 'formik';
import { intlMock } from '@commercetools-local/test-utils';
import SelectablePanel from '../selectable-panel';
import { OrderCreateEmployeeOwnerAddresses } from './order-create-employee-owner-addresses';

const createConnectorProps = props => ({
  employeeFetcher: {
    isLoading: false,
    employee: {
      id: 'c1',
      addresses: [],
      defaultAddressId: 'address-1',
      defaultShippingAddressId: 'address-1',
      defaultBillingAddressId: 'address-2',
      email: 'c1@test.com',
    },
  },
  employeeUpdater: {
    isLoading: false,
    execute: jest.fn(() =>
      Promise.resolve({ id: 'some-id', firstName: 'bar' })
    ),
  },
  ownerState: {
    update: jest.fn(),
    owner: {
      type: undefined,
      company: undefined,
    },
  },
  ...props,
});

const createTestProps = props => ({
  cartDraftState: {
    value: {
      customerId: 'c1',
      shippingAddress: { id: 'address-1' },
      billingAddress: { id: 'address-1' },
      customerEmail: 'c1@test.com',
    },
    update: jest.fn(),
  },
  showNotification: jest.fn(),
  countries: {
    AU: 'Australia',
    FR: 'France',
    DE: 'Germany',
  },
  // HoC
  intl: intlMock,
  goToOwnerSelection: jest.fn(),
  goToFirstStep: jest.fn(),
  employeesNewPath: '/test-1/customers/id-1/addresses/new',
  projectKey: 'test-1',
  canManageEmployees: true,
  ...createConnectorProps(),
  ...props,
});

const createFormikProps = props => ({
  values: {
    id: 'address-1',
  },
  errors: {},
  touched: {},
  handleBlur: jest.fn(),
  handleChange: jest.fn(),
  handleSubmit: jest.fn(),
  isSubmitting: false,
  setFieldValue: jest.fn(),
  setFieldTouched: jest.fn(),
  resetForm: jest.fn(),
  dirty: false,
  ...props,
});

const createFormikBag = custom => ({
  setSubmitting: jest.fn(),
  ...custom,
});

describe('rendering base elements', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<OrderCreateEmployeeOwnerAddresses {...props} />);
  });

  it('should render a ThrottledField', () => {
    expect(wrapper).toRender(TextInput);
  });

  it('should render an IconButton', () => {
    expect(wrapper).toRender(IconButton);
  });

  it('should render two CollapsiblePanel for addresses', () => {
    expect(wrapper).toRenderElementTimes('CollapsiblePanel', 2);
  });

  describe('when the employee has addresses', () => {
    let renderedWrapper;
    let formikProps;
    describe('Addresses panel', () => {
      describe('<Formik>', () => {
        beforeEach(() => {
          props = createTestProps({
            ...createConnectorProps({
              employeeFetcher: {
                isLoading: false,
                employee: {
                  id: 'c1',
                  email: 'c1@test.com',
                  addresses: [
                    { id: 'address-1', email: 'c1@test.com' },
                    { id: 'address-2', email: 'c2@test.com' },
                  ],
                  defaultAddressId: 'address-1',
                  defaultShippingAddressId: 'address-1',
                  defaultBillingAddressId: 'address-2',
                },
              },
            }),
          });
          wrapper = shallow(<OrderCreateEmployeeOwnerAddresses {...props} />);
        });
        it('should render two <Formik>', () => {
          expect(wrapper.find('CollapsiblePanel').at(0)).toRenderElementTimes(
            Formik,
            2
          );
        });
        describe('when the address is the default one', () => {
          beforeEach(() => {
            formikProps = createFormikProps();
            renderedWrapper = wrapper
              .find(Formik)
              .at(0)
              .renderProp('render')(formikProps);
          });
          it('should have `isOpen` prop to true', () => {
            expect(renderedWrapper.find(SelectablePanel)).toHaveProp(
              'isOpen',
              true
            );
          });
        });
        describe('when the address is not the default one', () => {
          beforeEach(() => {
            formikProps = createFormikProps();
            renderedWrapper = wrapper
              .find(Formik)
              .at(1)
              .renderProp('render')(formikProps);
          });
          it('should have `isOpen` prop to false', () => {
            expect(renderedWrapper.find(SelectablePanel)).toHaveProp(
              'isOpen',
              false
            );
          });
        });
        it('should have `initialValues` prop', () => {
          expect(wrapper.find(Formik).at(0)).toHaveProp(
            'initialValues',
            expect.objectContaining({
              id: 'address-1',
            })
          );
        });
        describe('rendered component', () => {
          beforeEach(() => {
            props = createTestProps({
              ...createConnectorProps({
                employeeFetcher: {
                  isLoading: false,
                  employee: {
                    id: 'c1',
                    email: 'c1@test.com',
                    addresses: [
                      {
                        id: 'address-1',
                        email: 'c1@test.com',
                      },
                      {
                        id: 'address-2',
                        email: 'c2@test.com',
                      },
                    ],
                    defaultAddressId: 'address-1',
                    defaultShippingAddressId: 'address-1',
                    defaultBillingAddressId: 'address-2',
                  },
                },
              }),
            });
            wrapper = shallow(<OrderCreateEmployeeOwnerAddresses {...props} />);
            renderedWrapper = wrapper
              .find(Formik)
              .at(0)
              .renderProp('render')(formikProps);
          });
          it('should render OrderCreateOwnerAddressDetails', () => {
            expect(renderedWrapper).toRender('OrderCreateOwnerAddressDetails');
          });
          it('should have `type` prop', () => {
            expect(
              renderedWrapper.find('OrderCreateOwnerAddressDetails')
            ).toHaveProp('type', 'shipping');
          });
          it('should have `countries` prop', () => {
            expect(
              renderedWrapper.find('OrderCreateOwnerAddressDetails')
            ).toHaveProp('countries', props.countries);
          });
          describe('when shipping and billing addresses are the same', () => {
            it('should have `isSameAsBillingAddress` prop', () => {
              expect(
                renderedWrapper.find('OrderCreateOwnerAddressDetails')
              ).toHaveProp('isSameAsBillingAddress', true);
            });
          });
          describe('when shipping and billing addresses are not the same', () => {
            beforeEach(() => {
              props = createTestProps({
                cartDraftState: {
                  value: {
                    customerId: 'c1',
                    shippingAddress: { id: 'address-1' },
                    billingAddress: { id: 'address-2' },
                    customerEmail: 'c1@test.com',
                  },
                  update: jest.fn(),
                },
                ...createConnectorProps({
                  employeeFetcher: {
                    isLoading: false,
                    employee: {
                      id: 'c1',
                      email: 'c1@test.com',
                      addresses: [
                        {
                          id: 'address-1',
                          email: 'c1@test.com',
                        },
                        {
                          id: 'address-2',
                          email: 'c2@test.com',
                        },
                      ],
                      defaultAddressId: 'address-1',
                      defaultShippingAddressId: 'address-1',
                      defaultBillingAddressId: 'address-2',
                    },
                  },
                }),
              });
              wrapper = shallow(
                <OrderCreateEmployeeOwnerAddresses {...props} />
              );
              renderedWrapper = wrapper
                .find(Formik)
                .at(0)
                .renderProp('render')(formikProps);
            });
            it('should have `isSameAsBillingAddress` prop', () => {
              expect(
                renderedWrapper.find('OrderCreateOwnerAddressDetails')
              ).toHaveProp('isSameAsBillingAddress', false);
            });
          });
          describe('when is the unique address for the employee', () => {
            beforeEach(() => {
              props = createTestProps({
                cartDraft: {
                  customerId: 'c1',
                  shippingAddress: { id: 'address-1' },
                  billingAddress: { id: 'address-1' },
                  customerEmail: 'c1@test.com',
                },
                ...createConnectorProps({
                  employeeFetcher: {
                    isLoading: false,
                    employee: {
                      id: 'c1',
                      email: 'c1@test.com',
                      addresses: [
                        {
                          id: 'address-1',
                          email: 'c1@test.com',
                        },
                      ],
                      defaultAddressId: 'address-1',
                      defaultShippingAddressId: 'address-1',
                      defaultBillingAddressId: 'address-2',
                    },
                  },
                }),
              });
              wrapper = shallow(
                <OrderCreateEmployeeOwnerAddresses {...props} />
              );
              renderedWrapper = wrapper
                .find(Formik)
                .at(0)
                .renderProp('render')(formikProps);
            });
            it('should have `isUniqueAddress` prop to true', () => {
              expect(
                renderedWrapper.find('OrderCreateOwnerAddressDetails')
              ).toHaveProp('isUniqueAddress', true);
            });
          });
        });
        describe('title', () => {
          let titleWrapper;
          let connectorProps;
          beforeEach(() => {
            connectorProps = createConnectorProps({
              employeeFetcher: {
                isLoading: false,
                employee: {
                  id: 'c1',
                  email: 'c1@test.com',
                  addresses: [
                    {
                      id: 'address-1',
                      email: 'c1@test.com',
                    },
                    {
                      id: 'address-2',
                      email: 'c2@test.com',
                    },
                  ],
                  defaultAddressId: 'address-1',
                  defaultShippingAddressId: 'address-1',
                  defaultBillingAddressId: 'address-1',
                },
              },
            });
            props = createTestProps({
              ...connectorProps,
            });
            wrapper = shallow(<OrderCreateEmployeeOwnerAddresses {...props} />);
            renderedWrapper = wrapper
              .find(Formik)
              .at(0)
              .renderProp('render')(formikProps);
            titleWrapper = shallow(
              <div>{renderedWrapper.find(SelectablePanel).prop('header')}</div>
            );
          });
          it('should render OrderCreateOwnerAddressTitle', () => {
            expect(titleWrapper).toRender('OrderCreateOwnerAddressTitle');
          });
          it('should have `cartDraft` prop', () => {
            expect(
              titleWrapper.find('OrderCreateOwnerAddressTitle')
            ).toHaveProp('cartDraft', props.cartDraftState.value);
          });
          it('should have `employee` prop', () => {
            expect(
              titleWrapper.find('OrderCreateOwnerAddressTitle')
            ).toHaveProp('employee', connectorProps.employeeFetcher.employee);
          });
          it('should have `address` prop', () => {
            expect(
              titleWrapper.find('OrderCreateOwnerAddressTitle')
            ).toHaveProp(
              'address',
              connectorProps.employeeFetcher.employee.addresses[0]
            );
          });
          it('should have `onSelectAddress` prop', () => {
            expect(
              titleWrapper.find('OrderCreateOwnerAddressTitle')
            ).toHaveProp('onSelectAddress', expect.any(Function));
          });
        });
      });
    });
  });
  describe('when the employee has no addresses', () => {
    beforeEach(() => {
      props = createTestProps({
        ...createConnectorProps({
          employeeFetcher: {
            isLoading: false,
            employee: {
              id: 'c1',
              email: 'c1@test.com',
              addresses: [],
              defaultAddressId: 'address-1',
              defaultShippingAddressId: 'address-1',
              defaultBillingAddressId: 'address-2',
            },
          },
        }),
      });
      wrapper = shallow(<OrderCreateEmployeeOwnerAddresses {...props} />);
    });

    it('should render two messages for no addresses', () => {
      expect(wrapper).toRenderElementTimes(
        {
          id: 'Orders.Create.Step.Owner.noAddresses',
        },
        2
      );
    });
    describe('LinkButton', () => {
      it('should render two LinkButton for creating addresses', () => {
        expect(wrapper).toRenderElementTimes('LinkButton', 2);
      });
      it('should have `to` prop', () => {
        expect(wrapper.find('LinkButton').first()).toHaveProp(
          'to',
          '/test-1/customers/id-1/addresses/new'
        );
      });
    });
  });
});

describe('callbacks', () => {
  let props;
  let wrapper;

  describe('when user clears employee selection', () => {
    beforeEach(() => {
      props = createTestProps({
        ...createConnectorProps({
          employeeFetcher: {
            isLoading: false,
            employee: {
              id: 'c1',
              email: 'c1@test.com',
              addresses: [
                {
                  id: 'address-1',
                  email: 'c1@test.com',
                },
              ],
              defaultAddressId: 'address-1',
              defaultShippingAddressId: 'address-1',
              defaultBillingAddressId: 'address-2',
            },
          },
        }),
      });
      wrapper = shallow(<OrderCreateEmployeeOwnerAddresses {...props} />);
      wrapper.find(IconButton).prop('onClick')();
    });
    it('should call goToOwnerSelection', () => {
      expect(props.goToOwnerSelection).toHaveBeenCalledTimes(1);
    });
    it('should call `update` from `cartDraftState`', () => {
      expect(props.cartDraftState.update).toHaveBeenCalledTimes(1);
    });
    it('should call `update` from `ownerState`', () => {
      expect(props.ownerState.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('when submitting', () => {
    let formikBag;
    let connectorProps;
    beforeEach(async () => {
      connectorProps = createConnectorProps({
        employeeFetcher: {
          isLoading: false,
          employee: {
            id: 'c1',
            email: 'c1@test.com',
            addresses: [
              {
                id: 'address-1',
                email: 'c1@test.com',
              },
            ],
            defaultAddressId: 'address-1',
            defaultShippingAddressId: 'address-1',
            defaultBillingAddressId: 'address-2',
          },
        },
      });
      props = createTestProps({
        ...connectorProps,
      });
      wrapper = shallow(<OrderCreateEmployeeOwnerAddresses {...props} />);
      formikBag = createFormikBag();
      await wrapper
        .find(Formik)
        .at(0)
        .prop('onSubmit')({ id: 'some-id', firstName: 'foo' }, formikBag);
    });
    it('should call execute from employeeUpdater', () => {
      expect(connectorProps.employeeUpdater.execute).toHaveBeenCalledTimes(1);
    });
    it('should call `update` from `cartDraftState`', () => {
      expect(props.cartDraftState.update).toHaveBeenCalledTimes(1);
    });
    it('should call `update` from `cartDraftState` with parameters', () => {
      expect(props.cartDraftState.update).toHaveBeenCalledWith({
        shippingAddress: expect.objectContaining({ id: 'address-1' }),
        billingAddress: expect.objectContaining({ id: 'address-1' }),
      });
    });
    it('should call setSubmitting', () => {
      expect(formikBag.setSubmitting).toHaveBeenCalledTimes(2);
    });
  });

  describe('when user selects an address', () => {
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<OrderCreateEmployeeOwnerAddresses {...props} />);
      wrapper.instance().handleSelectAddress('shipping', 'address-2', {
        addresses: [
          {
            id: 'address-2',
            email: 'c2@test.com',
          },
        ],
      });
    });
    it('should call `update` from `cartDraftState`', () => {
      expect(props.cartDraftState.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('when the user checks the same as billing address option', () => {
    let renderedWrapper;
    let formikProps;
    beforeEach(() => {
      props = createTestProps({
        cartDraft: {
          customerId: 'c1',
          shippingAddress: { id: 'address-1' },
          billingAddress: { id: 'address-2' },
          customerEmail: 'c1@test.com',
        },
        ...createConnectorProps({
          employeeFetcher: {
            isLoading: false,
            employee: {
              email: 'c1@test.com',
              addresses: [
                { id: 'address-1' },
                { id: 'address-2' },
              ],
              defaultBillingAddressId: 'address-2',
            },
          },
        }),
      });
      formikProps = createFormikProps();
      wrapper = shallow(<OrderCreateEmployeeOwnerAddresses {...props} />);
      renderedWrapper = wrapper
        .find(Formik)
        .at(0)
        .renderProp('render')(formikProps);
    });
    describe('when the option is checked', () => {
      beforeEach(() => {
        renderedWrapper
          .find('OrderCreateOwnerAddressDetails')
          .prop('onSelectSameAddress')(true);
      });
      it('should call `update` from `cartDraftState`', () => {
        expect(props.cartDraftState.update).toHaveBeenCalledTimes(1);
      });
    });
    describe('when the option is unchecked', () => {
      beforeEach(() => {
        renderedWrapper
          .find('OrderCreateOwnerAddressDetails')
          .prop('onSelectSameAddress')(false);
      });
      it('should call `update` from `cartDraftState`', () => {
        expect(props.cartDraftState.update).toHaveBeenCalledTimes(1);
      });
    });
  });
});

describe('interactions', () => {
  let wrapper;
  let props;
  describe('when toggling mode', () => {
    describe('shipping addresses', () => {
      beforeEach(() => {
        props = createTestProps();
        wrapper = shallow(<OrderCreateEmployeeOwnerAddresses {...props} />);
        wrapper.instance().enterEditMode('address1', 'shipping');
      });
      it('should have the shipping address id in the state', () => {
        expect(wrapper).toHaveState(
          'idOfShippingAddressInEditMode',
          'address1'
        );
      });
      it('should have `null` billing address in the state', () => {
        expect(wrapper).toHaveState('idOfBillingAddressInEditMode', null);
      });
    });
    describe('billing addresses', () => {
      beforeEach(() => {
        props = createTestProps();
        wrapper = shallow(<OrderCreateEmployeeOwnerAddresses {...props} />);
        wrapper.instance().enterEditMode('address1', 'billing');
      });
      it('should have the shipping address id in the state', () => {
        expect(wrapper).toHaveState('idOfBillingAddressInEditMode', 'address1');
      });
      it('should have `null` billing address in the state', () => {
        expect(wrapper).toHaveState('idOfShippingAddressInEditMode', null);
      });
    });
  });
});
