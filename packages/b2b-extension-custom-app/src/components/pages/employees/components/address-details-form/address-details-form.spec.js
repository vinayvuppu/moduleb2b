import React from 'react';
import { shallow } from 'enzyme';
import { Formik } from 'formik';
import { AddressDetailsForm } from './address-details-form';

const addressFields = [
  'streetNumber',
  'streetName',
  'apartment',
  'building',
  'pOBox',
  'city',
  'postalCode',
  'region',
  'state',
  'country',
  'additionalStreetInfo',
  'additionalAddressInfo',
];

const contactFields = [
  'firstName',
  'lastName',
  'salutation',
  'title',
  'company',
  'department',
  'email',
  'phone',
  'mobile',
  'fax',
];

const defaultValues = addressFields
  .concat(contactFields)
  .reduce((acc, currentValue) => {
    // eslint-disable -next-line no-return-assign
    acc[currentValue] = '';
    return acc;
  }, {});

const createFormikProps = props => ({
  values: {
    ...defaultValues,
    name: '',
    country: 'DE',
  },
  errors: {},
  touched: {},
  handleBlur: jest.fn().mockName('handleBlur'),
  handleChange: jest.fn().mockName('handleChange'),
  isSubmitting: false,

  ...props,
});

const createTestProps = (props = {}) => ({
  children: jest.fn(),
  onSubmit: jest.fn(),
  address: {
    name: '',
    country: 'DE',
  },
  countries: {
    AU: 'Australia',
    FR: 'France',
    DE: 'Germany',
  },
  isCreateMode: false,
  canManageEmployees: true,
  canManageCustomers: true,
  ...props,
});

describe('rendering base elements', () => {
  let props;
  let wrapper;
  let addressDetails;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<AddressDetailsForm {...props} />);
    wrapper = wrapper.find(Formik).renderProp('render')(createFormikProps());
    wrapper = shallow(props.children.mock.calls[0][0].form);
    addressDetails = wrapper.find({ id: 'address-details' });
  });

  it('should render address details section', () => {
    expect(wrapper).toRender({ id: 'address-details' });
  });

  addressFields.forEach(field => {
    it(`should render address details field: ${field}`, () => {
      expect(addressDetails).toRender({ name: field });
    });
  });

  describe('when the address details are closed', () => {
    let contactDetails;
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<AddressDetailsForm {...props} />);
      wrapper = wrapper.find(Formik).renderProp('render')(createFormikProps());
      wrapper = shallow(props.children.mock.calls[0][0].form);
      contactDetails = wrapper.find({ id: 'contact-details' });
    });

    it('should render contact details section', () => {
      expect(wrapper).toRender({ id: 'contact-details' });
    });

    contactFields.forEach(field => {
      it(`should render contact details field: ${field}`, () => {
        expect(contactDetails).toRender({ name: field });
      });
    });
  });
});

describe('callbacks', () => {
  let props;
  let wrapper;
  let formikProps;
  beforeEach(() => {
    formikProps = createFormikProps();
    props = createTestProps();
    wrapper = shallow(<AddressDetailsForm {...props} />);
    wrapper = wrapper.find(Formik).renderProp('render')(formikProps);
    wrapper = shallow(props.children.mock.calls[0][0].form);
  });

  describe('when changing', () => {
    beforeEach(() => {
      wrapper.find({ name: 'firstName' }).prop('onChange')({
        target: { value: 'New Name', name: 'firstName' },
      });
    });
    it('should update firstName', () => {
      expect(formikProps.handleChange).toHaveBeenCalledTimes(1);
    });
  });
});
