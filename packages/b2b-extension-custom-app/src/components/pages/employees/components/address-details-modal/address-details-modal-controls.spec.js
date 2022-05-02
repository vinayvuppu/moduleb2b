import React from 'react';
import { shallow } from 'enzyme';
import { intlMock } from '@commercetools-local/test-utils';
import { IconButton } from '@commercetools-frontend/ui-kit';
import { AddressDetailsModalControls } from './address-details-modal-controls';

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
  hasUnsavedChanges: false,
  selectedAddress: {
    id: '1',
    country: 'DE',
  },
  employeeFetcher: {
    isLoading: false,
    employee: {
      id: 'c1',
    },
  },
  onConfirmSetDefaultAddress: jest.fn(),
  onConfirmDeleteAddress: jest.fn(),
  canManageEmployees: true,
  intl: intlMock,
  deletionConfirmationModal: {
    isOpen: false,
    handleOpen: jest.fn(),
    handleClose: jest.fn(),
  },
  countries: { de: 'Germany' },
  defaultAddressConfirmationModal: {
    isOpen: false,
    handleOpen: jest.fn(),
    handleClose: jest.fn(),
  },
  onCancelForm: jest.fn(),
  onSubmitForm: jest.fn(),
  ...props,
});

describe('rendering', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<AddressDetailsModalControls {...props} />);
  });

  it('should render 3 <IconButton>', () => {
    expect(wrapper).toRenderElementTimes(IconButton, 3);
  });

  describe('when there are unsaved changes', () => {
    beforeEach(() => {
      props = createTestProps({ hasUnsavedChanges: true });
      wrapper = shallow(<AddressDetailsModalControls {...props} />);
    });

    it('should render default billing and shipping buttons', () => {
      expect(wrapper).toRender({ 'data-testid': 'shipping' });
      expect(wrapper).toRender({ 'data-testid': 'billing' });
    });

    it('should have all buttons disabled', () => {
      expect(wrapper.find({ 'data-testid': 'shipping' })).toHaveProp(
        'isDisabled',
        true
      );
      expect(wrapper.find({ 'data-testid': 'billing' })).toHaveProp(
        'isDisabled',
        true
      );
    });
  });

  describe('create mode', () => {
    beforeEach(() => {
      props = createTestProps({ isCreateMode: true });
      wrapper = shallow(<AddressDetailsModalControls {...props} />);
    });

    it('should not render delete button', () => {
      expect(wrapper).not.toRender({
        id: 'Employees.Details.AddressDetailsModal.confirmDeleteTitle',
      });
    });
  });

  describe('when current address is default shipping / billing', () => {
    beforeEach(() => {
      props = createTestProps({
        selectedAddress: {
          id: '123',
          country: 'DE',
        },
        employeeFetcher: {
          isLoading: false,
          employee: {
            id: 'c1',
            defaultBillingAddressId: '123',
            defaultShippingAddressId: '123',
            addresses: [createAddress({ id: '123' })],
          },
        },
      });
      wrapper = shallow(<AddressDetailsModalControls {...props} />);
    });

    it('should have both buttons be active', () => {
      expect(wrapper.find({ 'data-testid': 'shipping' })).toHaveProp(
        'isToggled',
        true
      );
      expect(wrapper.find({ 'data-testid': 'billing' })).toHaveProp(
        'isToggled',
        true
      );
    });
  });

  describe('when current address is shipping address only', () => {
    beforeEach(() => {
      props = createTestProps({
        selectedAddress: {
          id: '123',
          country: 'DE',
        },
        employeeFetcher: {
          isLoading: false,
          employee: {
            id: 'c1',
            defaultBillingAddressId: 'some-other-id',
            defaultShippingAddressId: '123',
            addresses: [createAddress({ id: '123' })],
          },
        },
      });
      wrapper = shallow(<AddressDetailsModalControls {...props} />);
    });

    it('should untoggle default billing button', () => {
      expect(wrapper.find({ 'data-testid': 'billing' })).toHaveProp(
        'isToggled',
        false
      );
    });
    it('should enable default billing button', () => {
      expect(wrapper.find({ 'data-testid': 'billing' })).toHaveProp(
        'isDisabled',
        false
      );
    });

    it('should toggle default shipping button', () => {
      expect(wrapper.find({ 'data-testid': 'shipping' })).toHaveProp(
        'isToggled',
        true
      );
    });
    it('should disable default shipping button', () => {
      expect(wrapper.find({ 'data-testid': 'shipping' })).toHaveProp(
        'isDisabled',
        true
      );
    });
  });

  describe('when current address is billing address only', () => {
    beforeEach(() => {
      props = createTestProps({
        selectedAddress: {
          id: '123',
          country: 'DE',
        },
        employeeFetcher: {
          isLoading: false,
          employee: {
            id: 'c1',
            defaultBillingAddressId: '123',
            defaultShippingAddressId: 'some-other-id',
            addresses: [createAddress({ id: '123' })],
          },
        },
      });
      wrapper = shallow(<AddressDetailsModalControls {...props} />);
    });

    it('should toggle default billing button', () => {
      expect(wrapper.find({ 'data-testid': 'billing' })).toHaveProp(
        'isToggled',
        true
      );
    });

    it('should disable default billing button', () => {
      expect(wrapper.find({ 'data-testid': 'billing' })).toHaveProp(
        'isDisabled',
        true
      );
    });

    it('should untoggle default shipping button', () => {
      expect(wrapper.find({ 'data-testid': 'shipping' })).toHaveProp(
        'isToggled',
        false
      );
    });
    it('should enable default shipping button', () => {
      expect(wrapper.find({ 'data-testid': 'shipping' })).toHaveProp(
        'isDisabled',
        false
      );
    });
  });

  describe('when current address is not default', () => {
    beforeEach(() => {
      props = createTestProps({
        selectedAddress: {
          id: '123',
          country: 'DE',
        },
        employeeFetcher: {
          isLoading: false,
          employee: {
            id: 'c1',
            defaultBillingAddressId: 'asd',
            defaultShippingAddressId: 'asd',
            addresses: [createAddress({ id: '123' })],
          },
        },
      });
      wrapper = shallow(<AddressDetailsModalControls {...props} />);
    });

    it('should disable default billing button', () => {
      expect(wrapper.find({ 'data-testid': 'billing' })).toHaveProp(
        'isToggled',
        false
      );
    });

    it('should disable default shipping button', () => {
      expect(wrapper.find({ 'data-testid': 'shipping' })).toHaveProp(
        'isToggled',
        false
      );
    });
  });
});
