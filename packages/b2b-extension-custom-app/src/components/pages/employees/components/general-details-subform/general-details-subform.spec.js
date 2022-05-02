import React from 'react';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';
import { CollapsiblePanel, WarningIcon } from '@commercetools-frontend/ui-kit';
import { intlMock } from '@commercetools-local/test-utils';
import CompanySelectField from '../company-selectfield';
import EmployeeRolesSelectField from '../employee-roles-selectfield';

import styles from '../_styles/panels.mod.css';
import { GeneralDetailsSubform } from './general-details-subform';
import messages from './messages';

const createFormikValues = customValues => ({
  salutation: '',
  title: '',
  firstName: '',
  middleName: '',
  lastName: '',
  email: '',
  isEmailVerified: false,
  dateOfBirth: '',
  customerNumber: '',
  externalId: '',
  customerGroup: 'cg-1',
  company: '',
  roles: [],
  ...customValues,
});

const createFormikProps = props => ({
  values: createFormikValues(),
  errors: {},
  touched: {},
  handleBlur: jest.fn(),
  handleChange: jest.fn(),
  setFieldValue: jest.fn(),
  ...props,
});

const createTestProps = props => ({
  canManageEmployees: true,
  formik: createFormikProps(),
  cannotChangeCustomerNumber: false,
  locale: 'en',
  intl: intlMock,
  language: 'en',
  languages: ['en'],
  ...props,
});

describe('render base elements', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<GeneralDetailsSubform {...props} />);
  });

  it('should render <CollapsiblePanel>', () => {
    expect(wrapper).toRender(CollapsiblePanel);
  });

  it('should render input (salutation)', () => {
    expect(wrapper).toRender({ name: 'salutation' });
  });
  it('should render input (title)', () => {
    expect(wrapper).toRender({ name: 'title' });
  });
  it('should render input (middleName)', () => {
    expect(wrapper).toRender({ name: 'middleName' });
  });
  it('should render input (firstName)', () => {
    expect(wrapper).toRender({ name: 'firstName' });
  });
  it('should render input (lastName)', () => {
    expect(wrapper).toRender({ name: 'lastName' });
  });
  it('should render input (email)', () => {
    expect(wrapper).toRender({ name: 'email' });
  });
  it('should render input (dateOfBirth)', () => {
    expect(wrapper).toRender({ name: 'dateOfBirth' });
  });
  it('should render input (customerNumber)', () => {
    expect(wrapper).toRender({ name: 'customerNumber' });
  });
  it('should render input (externalId)', () => {
    expect(wrapper).toRender({ name: 'externalId' });
  });
  it('should render a `CompanySelectField` component', () => {
    expect(wrapper).toRender(CompanySelectField);
  });
  it('should render a `EmployeeRolesSelectField` component', () => {
    expect(wrapper).toRender(EmployeeRolesSelectField);
  });
});

describe('when changing', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<GeneralDetailsSubform {...props} />);
    wrapper.find({ name: 'title' }).prop('onChange')({
      target: { name: 'title', value: 'Mr' },
    });
  });

  it('should invoke `handleChange`', () => {
    expect(props.formik.handleChange).toHaveBeenCalled();
  });
});

describe('when selecting a company', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<GeneralDetailsSubform {...props} />);

    wrapper.find(CompanySelectField).prop('onChange')({
      id: 'company-id1',
      store: { key: 'store-1' },
      customerGroup: { key: 'cg-1' },
    });
  });

  it('should invoke `setFieldValue` to set the company value', () => {
    expect(props.formik.setFieldValue).toHaveBeenCalledWith(
      'company',
      'company-id1'
    );
  });
  it('should invoke `setFieldValue` to set the customerGroup value', () => {
    expect(props.formik.setFieldValue).toHaveBeenCalledWith(
      'customerGroup',
      'cg-1'
    );
  });
  it('should invoke `setFieldValue` to set the stores value', () => {
    expect(props.formik.setFieldValue).toHaveBeenCalledWith('stores', [
      'store-1',
    ]);
  });
});

describe('rendering email', () => {
  let props;
  let wrapper;

  describe('when email is not verified', () => {
    beforeEach(() => {
      props = createTestProps();

      wrapper = shallow(<GeneralDetailsSubform {...props} />);
    });

    it('should render email not verified message', () => {
      expect(wrapper).toRender({
        id: 'Employees.Details.General.labelEmailNotVerified',
      });
    });
  });

  describe('when email is verified', () => {
    beforeEach(() => {
      props = createTestProps({
        formik: createFormikProps({
          values: createFormikValues({ isEmailVerified: true }),
        }),
      });

      wrapper = shallow(<GeneralDetailsSubform {...props} />);
    });

    it('should render email verified message', () => {
      expect(wrapper).toRender({
        id: 'Employees.Details.General.labelEmailVerified',
      });
    });
  });
});

describe('rendering description for employee number', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = createTestProps({
      customerNumber: undefined,
      cannotChangeCustomerNumber: false,
    });
    wrapper = shallow(<GeneralDetailsSubform {...props} />);
  });

  describe('description as warning', () => {
    it('should render warning message for customer number', () => {
      expect(wrapper).toRender({
        hint: <FormattedMessage {...messages.employeeNumberWarning} />,
      });
    });

    it('should render <WarningIcon> with correct color', () => {
      expect(wrapper.find({ name: 'customerNumber' })).toHaveProp(
        'hintIcon',
        <WarningIcon color="warning" />
      );
    });

    it('should render input field', () => {
      expect(wrapper).toRender({ name: 'customerNumber' });
    });
  });

  describe('description as warning when in edit mode', () => {
    beforeEach(() => {
      wrapper.setProps({
        customerNumber: '123',
        cannotChangeCustomerNumber: false,
      });
    });

    it('should render <WarningIcon> with correct color', () => {
      expect(wrapper.find({ name: 'customerNumber' })).toHaveProp(
        'hintIcon',
        <WarningIcon color="warning" />
      );
    });

    it('should not render read-only input field', () => {
      expect(wrapper).not.toRender({ className: styles['input-read-only'] });
    });

    it('should render input field', () => {
      expect(wrapper).toRender({ name: 'customerNumber' });
    });
  });

  describe('description as disabled when in non-edit mode', () => {
    beforeEach(() => {
      wrapper.setProps({
        customerNumber: '123',
        cannotChangeCustomerNumber: true,
      });
    });

    it('should render <WarningIcon> with correct color', () => {
      expect(wrapper.find({ name: 'customerNumber' })).toHaveProp(
        'hintIcon',
        <WarningIcon color="solid" />
      );
    });

    it('should render read-only input field', () => {
      expect(wrapper.find({ name: 'customerNumber' })).toHaveProp(
        'isReadOnly',
        true
      );
    });
  });
});
