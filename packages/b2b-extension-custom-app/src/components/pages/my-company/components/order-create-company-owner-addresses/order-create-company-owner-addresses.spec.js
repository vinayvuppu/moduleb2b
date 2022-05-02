import React from 'react';
import { shallow } from 'enzyme';
import { IconButton, TextInput } from '@commercetools-frontend/ui-kit';
import { Formik } from 'formik';
import { intlMock } from '@commercetools-local/test-utils';
import SelectablePanel from '../selectable-panel';
import { OrderCreateCompanyOwnerAddresses } from './order-create-company-owner-addresses';

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
  ownerState: {
    owner: {
      type: 'COMPANY',
      company: {
        addresses: [],
        defaultAddressId: 'address-1',
        defaultShippingAddressId: 'address-1',
        defaultBillingAddressId: 'address-2',
      },
    },
    update: jest.fn(),
  },
  companyUpdater: {
    execute: jest.fn(),
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
  companiesNewPath:
    '/test-1/companies/abbc8f80-2ada-11ea-b1cc-afe2a85ea444/general',
  projectKey: 'test-1',
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
    wrapper = shallow(<OrderCreateCompanyOwnerAddresses {...props} />);
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

  describe('when the company has addresses', () => {
    let renderedWrapper;
    let formikProps;
    describe('Addresses panel', () => {
      describe('<Formik>', () => {
        beforeEach(() => {
          props = createTestProps({
            ownerState: {
              owner: {
                type: 'COMPANY',
                company: {
                  addresses: [
                    { id: 'address-1', email: 'c1@test.com' },
                    { id: 'address-2', email: 'c2@test.com' },
                  ],
                  defaultAddressId: 'address-1',
                  defaultShippingAddressId: 'address-1',
                  defaultBillingAddressId: 'address-2',
                },
              },
            },
          });
          wrapper = shallow(<OrderCreateCompanyOwnerAddresses {...props} />);
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
              ownerState: {
                owner: {
                  type: 'COMPANY',
                  company: {
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
              },
            });
            wrapper = shallow(<OrderCreateCompanyOwnerAddresses {...props} />);
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
                ownerState: {
                  owner: {
                    type: 'COMPANY',
                    company: {
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
                },
              });
              wrapper = shallow(
                <OrderCreateCompanyOwnerAddresses {...props} />
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
          describe('when is the unique address for the company', () => {
            beforeEach(() => {
              props = createTestProps({
                cartDraft: {
                  customerId: 'c1',
                  shippingAddress: { id: 'address-1' },
                  billingAddress: { id: 'address-1' },
                  customerEmail: 'c1@test.com',
                },
                ownerState: {
                  owner: {
                    type: 'COMPANY',
                    company: {
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
                },
              });
              wrapper = shallow(
                <OrderCreateCompanyOwnerAddresses {...props} />
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
          beforeEach(() => {
            props = createTestProps({
              ownerState: {
                owner: {
                  type: 'COMPANY',
                  company: {
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
              },
            });
            wrapper = shallow(<OrderCreateCompanyOwnerAddresses {...props} />);
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
          it('should have `onSelectAddress` prop', () => {
            expect(
              titleWrapper.find('OrderCreateOwnerAddressTitle')
            ).toHaveProp('onSelectAddress', expect.any(Function));
          });
        });
      });
    });
  });
  describe('when the company has no addresses', () => {
    beforeEach(() => {
      props = createTestProps({});
      wrapper = shallow(<OrderCreateCompanyOwnerAddresses {...props} />);
    });

    it('should render two messages for no addresses', () => {
      expect(wrapper).toRenderElementTimes(
        {
          id: 'Orders.Create.Step.CompanyOwner.noAddresses',
        },
        2
      );
    });
  });
});

describe('callbacks', () => {
  let props;
  let wrapper;

  describe('when user clears company selection', () => {
    beforeEach(() => {
      props = createTestProps({});
      wrapper = shallow(<OrderCreateCompanyOwnerAddresses {...props} />);
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
    beforeEach(async () => {
      props = createTestProps({
        ownerState: {
          owner: {
            type: 'COMPANY',
            company: {
              addresses: [
                {
                  id: 'some-id',
                  email: 'c1@test.com',
                },
              ],
              defaultAddressId: 'some-id',
              defaultShippingAddressId: 'some-id',
              defaultBillingAddressId: 'address-2',
            },
          },
        },
      });
      wrapper = shallow(<OrderCreateCompanyOwnerAddresses {...props} />);
      formikBag = createFormikBag();
      await wrapper
        .find(Formik)
        .at(0)
        .prop('onSubmit')({ id: 'some-id', firstName: 'foo' }, formikBag);
    });
    it('should call execute from companyUpdater', () => {
      expect(props.companyUpdater.execute).toHaveBeenCalledTimes(1);
    });
    it('should call `update` from `cartDraftState`', () => {
      expect(props.cartDraftState.update).toHaveBeenCalledTimes(1);
    });
    it('should call `update` from `cartDraftState` with parameters', () => {
      expect(props.cartDraftState.update).toHaveBeenCalledWith({
        shippingAddress: expect.objectContaining({ id: 'some-id' }),
      });
    });
    it('should call setSubmitting', () => {
      expect(formikBag.setSubmitting).toHaveBeenCalledTimes(2);
    });
  });

  describe('when user selects an address', () => {
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<OrderCreateCompanyOwnerAddresses {...props} />);
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
});

describe('interactions', () => {
  let wrapper;
  let props;
  describe('when toggling mode', () => {
    describe('shipping addresses', () => {
      beforeEach(() => {
        props = createTestProps();
        wrapper = shallow(<OrderCreateCompanyOwnerAddresses {...props} />);
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
        wrapper = shallow(<OrderCreateCompanyOwnerAddresses {...props} />);
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
