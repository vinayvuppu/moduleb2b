import React from 'react';
import { shallow } from 'enzyme';
import { Formik } from 'formik';
import GeneralDetailsSubform from '../general-details-subform';
import AccountDetailsResetPasswordPanel from '../account-details-reset-password-panel';
import { GeneralInfoForm } from './general-info-form';

const createEmployee = customValues => ({
  title: 'Doctor',
  firstName: 'Stephen',
  middleName: 'Jay',
  lastName: 'Strange',
  email: 'strange@avengers.com',
  dateOfBirth: '1983-02-01',
  customerNumber: '9999',
  externalId: 'aaa',
  password: 'asdasd123',
  companyName: 'Avengers',
  vatId: '123',
  customerGroup: 'cg-1',
  company: '',
  roles: [],
  ...customValues,
});

const createFormikProps = props => ({
  values: createEmployee(),
  errors: {},
  touched: {},
  handleBlur: jest.fn().mockName('handleBlur'),
  handleChange: jest.fn().mockName('handleChange'),
  isSubmitting: false,

  ...props,
});

const createTestProps = props => ({
  children: jest.fn(),
  onSubmit: jest.fn(),
  onPasswordReset: jest.fn(),
  employee: createEmployee(),
  canManageEmployees: true,
  ...props,
});

describe('rendering', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<GeneralInfoForm {...props} />);
    wrapper.find(Formik).renderProp('render')(createFormikProps());
    const formComponent = props.children.mock.calls[0][0].form;
    wrapper = shallow(<div>{formComponent}</div>);
  });

  it('should output correct tree', () => {
    expect(wrapper).toMatchSnapshot();
  });
  it('should render <GeneralDetailsSubform>', () => {
    expect(wrapper).toRender(GeneralDetailsSubform);
  });
  it('should render <AccountDetailsResetPasswordPanel>', () => {
    expect(wrapper).toRender(AccountDetailsResetPasswordPanel);
  });
});
