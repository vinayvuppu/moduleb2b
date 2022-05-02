import React from 'react';
import { shallow } from 'enzyme';
import { CheckboxInput } from '@commercetools-frontend/ui-kit';
import OrderCreateOwnerAddressDetails from './order-create-owner-address-details';

const createTestProps = props => ({
  formik: {
    handleChange: jest.fn(),
    handleBlur: jest.fn(),
    setFieldTouched: jest.fn(),
    setFieldValue: jest.fn(),
    values: {
      id: 'test-1',
      firstName: 'Jon',
      lastName: 'Snow',
      streetName: 'main-street',
      streetNumber: '1',
      city: 'Winterfell',
      region: 'North',
      postalCode: '00001',
      country: 'Westeros',
      additionalAddressInfo: '',
      additionalStreetInfo: '',
      phone: '',
      email: '',
      company: '',
    },
    errors: {},
    touched: {},
  },
  isFormEditable: false,
  onSelectSameAddress: jest.fn(),
  isSameAsBillingAddress: false,
  countries: {
    AU: 'Australia',
    FR: 'France',
    DE: 'Germany',
  },

  ...props,
});

describe('rendering base elements', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<OrderCreateOwnerAddressDetails {...props} />);
  });

  it('should have field for `firstName`', () => {
    expect(wrapper).toRender({
      name: 'firstName',
    });
  });
  it('should have field for `lastName`', () => {
    expect(wrapper).toRender({
      name: 'lastName',
    });
  });
  it('should have field for `phone`', () => {
    expect(wrapper).toRender({
      name: 'phone',
    });
  });
  it('should have field for `email`', () => {
    expect(wrapper).toRender({
      name: 'email',
    });
  });
  it('should have field for `company`', () => {
    expect(wrapper).toRender({
      name: 'company',
    });
  });
  it('should have field for `streetName`', () => {
    expect(wrapper).toRender({
      name: 'streetName',
    });
  });
  it('should have field for `streetNumber`', () => {
    expect(wrapper).toRender({
      name: 'streetNumber',
    });
  });
  it('should have field for `city`', () => {
    expect(wrapper).toRender({
      name: 'city',
    });
  });
  it('should have field for `postalCode`', () => {
    expect(wrapper).toRender({
      name: 'postalCode',
    });
  });
  it('should have field for `region`', () => {
    expect(wrapper).toRender({
      name: 'region',
    });
  });
  it('should have field for `country`', () => {
    expect(wrapper).toRender({
      name: 'country',
    });
  });
  it('should have field for `additionalAddressInfo`', () => {
    expect(wrapper).toRender({
      name: 'additionalAddressInfo',
    });
  });
  it('should have field for `additionalStreetInfo`', () => {
    expect(wrapper).toRender({
      name: 'additionalStreetInfo',
    });
  });

  describe('when is displaying values for billing addresses', () => {
    it('should not render a CheckboxInput', () => {
      expect(wrapper).not.toRender(CheckboxInput);
    });
  });
  describe('when is displaying values for shipping addresses', () => {
    beforeEach(() => {
      props = createTestProps({ type: 'shipping' });
      wrapper = shallow(<OrderCreateOwnerAddressDetails {...props} />);
    });
    it('should render a CheckboxInputField', () => {
      expect(wrapper).toRender(CheckboxInput);
    });
    it('should render an unchecked CheckboxInput', () => {
      expect(wrapper.find(CheckboxInput)).toHaveProp('isChecked', false);
    });
    describe('when is the same as the billing address', () => {
      beforeEach(() => {
        props = createTestProps({
          type: 'shipping',
          isSameAsBillingAddress: true,
        });
        wrapper = shallow(<OrderCreateOwnerAddressDetails {...props} />);
      });
      it('should render a checked CheckboxInput', () => {
        expect(wrapper.find(CheckboxInput)).toHaveProp('isChecked', true);
      });
      it('should render a disabled CheckboxInput', () => {
        expect(wrapper.find(CheckboxInput)).toHaveProp('isDisabled', true);
      });
    });
    describe('when is the unique address for the customer', () => {
      beforeEach(() => {
        props = createTestProps({
          type: 'shipping',
          isUniqueAddress: true,
        });
        wrapper = shallow(<OrderCreateOwnerAddressDetails {...props} />);
      });
      it('should render a disabled CheckboxInput', () => {
        expect(wrapper.find(CheckboxInput)).toHaveProp('isDisabled', true);
      });
    });
  });
});

describe('callbacks', () => {
  let props;
  let wrapper;

  describe('when users edits a field', () => {
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<OrderCreateOwnerAddressDetails {...props} />);
      wrapper.find({ name: 'firstName' }).prop('onChange')({
        target: { value: 'Jon' },
      });
    });

    it('should call `handleChange` from formik', () => {
      expect(props.formik.handleChange).toHaveBeenCalledTimes(1);
    });
  });
  describe('when users checks the same as billing address option', () => {
    beforeEach(() => {
      props = createTestProps({ type: 'shipping' });
      wrapper = shallow(<OrderCreateOwnerAddressDetails {...props} />);
      wrapper.find(CheckboxInput).prop('onChange')();
    });

    it('should call onSelectSameAddress', () => {
      expect(props.onSelectSameAddress).toHaveBeenCalledTimes(1);
    });
    it('should call onSelectSameAddress with parameters', () => {
      expect(props.onSelectSameAddress).toHaveBeenCalledWith(
        !props.isSameAsBillingAddress
      );
    });
  });
});
