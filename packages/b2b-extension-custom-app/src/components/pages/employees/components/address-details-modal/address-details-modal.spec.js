import React from 'react';
import { shallow } from 'enzyme';
import { intlMock } from '@commercetools-local/test-utils';
import WarnOnLeave from '@commercetools-local/core/components/warn-on-leave';
import AddressDetailsForm from '../address-details-form';
import { AddressDetailsModal } from './address-details-modal';

const createAddress = props => ({
  id: 'addressId1',
  title: 'Mr',
  salutation: null,
  firstName: 'Ben',
  lastName: 'Bennington',
  streetName: null,
  streetNumber: null,
  additionalStreetInfo: null,
  postalCode: null,
  city: 'Berlin',
  region: null,
  state: null,
  country: 'DE',
  company: 'Cool Biscuits GmbH.',
  department: null,
  building: null,
  apartment: null,
  pOBox: null,
  phone: null,
  mobile: null,
  email: null,
  fax: null,
  ...props,
});

const createTestProps = props => ({
  isCreateMode: false,
  addressId: 'addressId1',
  employeeUpdater: {
    isLoading: false,
    execute: jest.fn(() =>
      Promise.resolve({
        id: 'c1',
        firstName: 'John',
        lastName: 'Smith',
        addresses: [{ id: '1' }],
      })
    ),
  },
  employeeDefaultAddressUpdater: {
    isLoading: false,
    execute: jest.fn(() =>
      Promise.resolve({
        id: 'c1',
        firstName: 'John',
        lastName: 'Smith',
        addresses: [{ id: '1' }],
      })
    ),
  },
  employeeFetcher: {
    isLoading: false,
    employee: {
      id: '1',
      defaultBillingAddressId: createAddress().id,
      defaultShippingAddressId: createAddress().id,
      firstName: 'Foo',
      addresses: [createAddress()],
    },
  },
  user: {
    language: 'en',
  },
  projectKey: 'test-1',
  onActionError: jest.fn(),
  showNotification: jest.fn(),
  intl: intlMock,
  history: { push: jest.fn() },
  countries: {
    de: 'Deutschland',
  },
  canManageEmployees: true,

  ...props,
});

const createFormProps = customProps => ({
  form: <div />,
  handleSubmit: jest.fn(),
  handleReset: jest.fn(),
  isDirty: false,
  isSubmitting: false,
  ...customProps,
});

const createFormikBag = custom => ({
  setSubmitting: jest.fn().mockName('setSubmitting'),
  resetForm: jest.fn().mockName('resetForm'),
  setErrors: jest.fn().mockName('setErrors'),

  ...custom,
});

describe('rendering', () => {
  let props;
  let wrapper;
  let formikProps;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<AddressDetailsModal {...props} />);
  });

  it('should render AddressDetailsForm', () => {
    expect(wrapper).toRender(AddressDetailsForm);
  });

  describe('<WarnOnLeave>', () => {
    beforeEach(() => {
      formikProps = createFormProps();
      wrapper = wrapper.find(AddressDetailsForm).renderProp('children')(
        formikProps
      );
    });
    it('should render <WarnOnLeave>', () => {
      expect(wrapper).toRender(WarnOnLeave);
    });
    it('should pass shouldWarn prop', () => {
      expect(wrapper.find(WarnOnLeave)).toHaveProp(
        'shouldWarn',
        formikProps.isDirty
      );
    });
    it('should pass onConfirmLeave prop', () => {
      expect(wrapper.find(WarnOnLeave)).toHaveProp(
        'onConfirmLeave',
        formikProps.handleReset
      );
    });
  });
});

describe('callbacks', () => {
  describe('when closing the modal', () => {
    let originalConfirm;
    let props;
    let wrapper;
    beforeEach(() => {
      props = createTestProps({ hasUnsavedChanges: true });
      wrapper = shallow(<AddressDetailsModal {...props} />);
      originalConfirm = global.window.confirm;
      global.window.confirm = jest.fn(() => true);
      const ChildrenComponent = wrapper.prop('children');
      const renderedChildren = shallow(<ChildrenComponent />);

      renderedChildren.find('FormModalPage').prop('onClose')();
    });
    afterEach(() => {
      global.window.confirm = originalConfirm;
    });

    it('should redirect to addresses list', () => {
      expect(props.history.push).toHaveBeenCalledTimes(1);
      expect(props.history.push).toHaveBeenCalledWith(
        '/test-1/b2b-extension/employees/1/addresses'
      );
    });
  });

  describe('when updating default billing address', () => {
    let props;
    let wrapper;
    beforeEach(async () => {
      props = createTestProps();
      wrapper = shallow(<AddressDetailsModal {...props} />);
      await wrapper.instance().handleConfirmSetDefaultAddress('billing');
    });

    it('should invoke `execute` from `employeeDefaultAddressUpdater` ', () => {
      expect(props.employeeDefaultAddressUpdater.execute).toHaveBeenCalledTimes(
        1
      );
    });

    it('should trigger update success notification', () => {
      expect(props.showNotification).toHaveBeenCalledTimes(1);
    });
  });

  describe('when updating default shipping address', () => {
    let props;
    let wrapper;
    beforeEach(async () => {
      props = createTestProps();
      wrapper = shallow(<AddressDetailsModal {...props} />);
      await wrapper.instance().handleConfirmSetDefaultAddress('shipping');
    });

    it('should invoke `execute` from `employeeDefaultAddressUpdater` ', () => {
      expect(props.employeeDefaultAddressUpdater.execute).toHaveBeenCalledTimes(
        1
      );
    });

    it('should trigger update success notification', () => {
      expect(props.showNotification).toHaveBeenCalledTimes(1);
    });
  });

  describe.skip('when creating an address', () => {
    let props;
    let wrapper;
    let formikBag;
    beforeEach(() => {
      props = createTestProps({ isCreateMode: true });
      formikBag = createFormikBag();
      wrapper = shallow(<AddressDetailsModal {...props} />);
      wrapper.instance().handleCreateAddress(
        {
          country: 'EN',
        },
        formikBag
      );
    });

    it('should invoke `execute` from `employeeUpdater`', () => {
      expect(props.employeeUpdater.execute).toHaveBeenCalledTimes(1);
    });

    it('should call `resetForm`', () => {
      expect(formikBag.resetForm).toHaveBeenCalled();
    });

    it('should call `setSubmitting`', () => {
      expect(formikBag.setSubmitting).toHaveBeenCalled();
    });

    it('should show notification', () => {
      expect(props.showNotification).toHaveBeenCalled();
    });

    it('should redirect to address detail', () => {
      expect(props.history.push).toHaveBeenCalled();
    });
  });
});

describe.skip('when deleting an address', () => {
  let props;
  let wrapper;

  beforeEach(async () => {
    props = createTestProps();
    wrapper = shallow(<AddressDetailsModal {...props} />);
    await wrapper.instance().handleConfirmDeleteAddress();
  });

  it('should invoke `execute` from `employeeUpdater`', () => {
    expect(props.employeeUpdater.execute).toHaveBeenCalledTimes(1);
  });

  it('should dispatch success notification', () => {
    expect(props.showNotification).toHaveBeenCalled();
  });

  it('should redirect to addresses list', () => {
    expect(props.history.push).toHaveBeenCalledWith(
      '/test-1/b2b-extension/employees/1/addresses'
    );
  });
});
