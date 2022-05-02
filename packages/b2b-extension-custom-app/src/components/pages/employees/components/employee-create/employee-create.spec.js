import React from 'react';
import { shallow } from 'enzyme';
import { Formik } from 'formik';
import { intlMock } from '@commercetools-local/test-utils';
import WarningSaveToolbar from '@commercetools-local/core/components/warning-save-toolbar';
import EmployeeCreateConnector from '../employee-create-connector';
import GeneralDetailsSubform from '../general-details-subform';
import AccountDetailsChangePasswordSubform from '../account-details-change-password-subform';
import { EmployeeCreate } from './employee-create';

const createTestProps = props => ({
  projectKey: 'test',
  goToEmployeesList: jest.fn(),
  goToEmployeeDetails: jest.fn(),
  // Action creators
  onActionError: jest.fn(),
  showNotification: jest.fn(),

  intl: intlMock,
  history: { push: jest.fn() },
  canManageEmployees: true,

  ...props,
});

const createProviderProps = props => ({
  apolloClient: {},
  ...props,
});

const createConnectorProps = props => ({
  employeeCreator: {
    isLoading: false,
    execute: jest.fn(() => Promise.resolve({ id: '123', firstName: 'John' })),
    ...props,
  },
});

const createFormikBag = custom => ({
  setSubmitting: jest.fn().mockName('setSubmitting'),
  resetForm: jest.fn().mockName('resetForm'),
  setErrors: jest.fn().mockName('setErrors'),

  ...custom,
});

const createFormikProps = props => ({
  values: {
    title: '',
    salutation: '',
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    customerNumber: '',
    externalId: '',
    customerGroup: '',
    password: '',
    confirmPassword: '',
    vatId: '',
    stores: [],
    roles: [],
    company: '',
  },
  errors: {},
  touched: {},
  handleBlur: jest.fn().mockName('handleBlur'),
  handleChange: jest.fn().mockName('handleChange'),
  handleReset: jest.fn().mockName('handleReset'),
  setFieldValue: jest.fn().mockName('setFieldValue'),
  isSubmitting: false,

  ...props,
});

const render = (baseProps, connectorProps, formikProps) =>
  shallow(<EmployeeCreate {...baseProps} />)
    .find('View')
    .childAt()
    .dive()
    .renderProp('children', createProviderProps())
    .find(EmployeeCreateConnector)
    .renderProp('children')(connectorProps)
    .find(Formik)
    .renderProp('render')(formikProps);

describe.skip('rendering', () => {
  let wrapper;
  let props;
  let formikWrapper;

  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<EmployeeCreate {...props} />);
    formikWrapper = render(props, createConnectorProps(), createFormikProps());
  });

  it('should render data-track-component', () => {
    expect(wrapper).toRender({ 'data-track-component': 'EmployeesCreate' });
  });
  it('should render a ViewHeader', () => {
    expect(wrapper).toRender('ViewHeader');
  });
  it('should render `title` in ViewHeader', () => {
    expect(wrapper.find('ViewHeader')).toHaveProp(
      'title',
      'Employees.Create.title'
    );
  });

  it('should render a details panel', () => {
    expect(formikWrapper).toRender(GeneralDetailsSubform);
  });
  it('should render AccountDetailsChangePasswordSubform', () => {
    expect(formikWrapper).toRender(AccountDetailsChangePasswordSubform);
  });

  it('should render WarningSaveToolbar', () => {
    expect(formikWrapper).toRender(WarningSaveToolbar);
  });
});

describe.skip('callbacks', () => {
  let wrapper;
  let props;
  let formikBag;
  let connectorProps;

  describe('when submitting', () => {
    beforeEach(async () => {
      props = createTestProps();
      wrapper = shallow(<EmployeeCreate {...props} />);
      formikBag = createFormikBag();
      connectorProps = createConnectorProps();
      wrapper = wrapper.find(EmployeeCreateConnector).renderProp('children')(
        connectorProps
      );
      await wrapper.find(Formik).prop('onSubmit')(
        { email: 'foo@bar.com', roles: ['role1'], customerGroup: 'key1' },
        formikBag
      );
    });
    it('should call `goToEmployeeDetails`', () => {
      expect(props.goToEmployeeDetails).toHaveBeenCalled();
    });
    it('should call `resetForm`', () => {
      expect(formikBag.resetForm).toHaveBeenCalled();
    });
    it('should call `showNotification`', () => {
      expect(props.showNotification).toHaveBeenCalled();
    });
  });

  describe('when canceling', () => {
    let formikProps;
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<EmployeeCreate {...props} />);
      formikProps = createFormikProps();
      wrapper = render(props, createConnectorProps(), formikProps);
      wrapper.find(WarningSaveToolbar).prop('onCancel')();
    });

    it('should redirect to employee list', () => {
      expect(props.goToEmployeesList).toHaveBeenCalled();
    });
  });
});
