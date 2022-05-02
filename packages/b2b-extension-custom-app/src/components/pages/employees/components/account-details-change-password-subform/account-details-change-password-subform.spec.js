import React from 'react';
import { shallow } from 'enzyme';
import { CollapsiblePanel } from '@commercetools-frontend/ui-kit';
import { AccountDetailsChangePasswordSubform } from './account-details-change-password-subform';
import AccountDetailsChangePasswordPasswordField from './account-details-change-password-password-field';
import AccountDetailsChangePasswordPasswordConfirmationField from './account-details-change-password-password-confirmation-field';

const createTestProps = props => ({
  formik: {
    values: {
      password: '123',
      confirmedPassword: '123',
    },
    errors: {},
    touched: {},
    handleBlur: jest.fn(),
    handleChange: jest.fn(),
  },
  ...props,
});

describe('rendering base elements', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<AccountDetailsChangePasswordSubform {...props} />);
  });

  it('should render a collapsible panel', () => {
    expect(wrapper).toRender(CollapsiblePanel);
  });

  it('should render a password input', () => {
    expect(wrapper).toRender(AccountDetailsChangePasswordPasswordField);
  });

  it('should render a confirm password input', () => {
    expect(wrapper).toRender(
      AccountDetailsChangePasswordPasswordConfirmationField
    );
  });
});

describe('when changing password inputs', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = createTestProps({
      renderError: jest.fn(),
    });
    wrapper = shallow(<AccountDetailsChangePasswordPasswordField {...props} />);
    wrapper.find({ name: 'password' }).prop('onChange')({
      target: { name: 'password', value: '12345' },
    });
  });

  it('should invoke `handleChange`', () => {
    expect(props.formik.handleChange).toHaveBeenCalled();
  });
});
