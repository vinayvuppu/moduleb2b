import React from 'react';
import { shallow } from 'enzyme';
import {
  CollapsiblePanel,
  CheckboxInput,
  PrimaryButton,
} from '@commercetools-frontend/ui-kit';
import { intlMock } from '@commercetools-local/test-utils';
import { DOMAINS } from '@commercetools-frontend/constants';
import { ConfirmationDialog } from '@commercetools-frontend/application-components';
import { AccountDetailsResetPasswordPanel } from './account-details-reset-password-panel';

const createTestProps = props => ({
  firstName: 'John',
  lastName: 'Doe',
  onPasswordReset: jest.fn(() =>
    Promise.resolve({ firstName: 'John', lastName: 'Doe' })
  ),
  showNotification: jest.fn(),
  onActionError: jest.fn(),
  intl: intlMock,
  canManageEmployees: true,
  ...props,
});

describe('rendering base elements', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<AccountDetailsResetPasswordPanel {...props} />);
  });

  it('should have initial state', () => {
    expect(wrapper.state()).toEqual({
      isConfirmationDialogOpen: false,
      newPassword: null,
      useRandomGeneratedPassword: false,
      randomGeneratedPassword: null,
    });
  });

  it('should render collapsible panel', () => {
    expect(wrapper).toRender(CollapsiblePanel);
  });

  it('should render input as plain text field (new password)', () => {
    expect(wrapper).toRender({ name: 'newPassword' });
  });
  it('should render <CheckboxInput> for generating random password', () => {
    expect(wrapper).toRender(CheckboxInput);
  });
  it('should have "reset button" disabled by default', () => {
    expect(wrapper.find(PrimaryButton)).toHaveProp('isDisabled', true);
  });
});

describe('when changing', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<AccountDetailsResetPasswordPanel {...props} />);
    wrapper.find({ name: 'newPassword' }).prop('onChange')({
      target: { value: '12345' },
    });
  });

  it('should update state with new password', () => {
    expect(wrapper).toHaveState('newPassword', '12345');
  });
});

describe('generating a random password', () => {
  let props;
  let wrapper;

  describe('by default', () => {
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<AccountDetailsResetPasswordPanel {...props} />);
    });
    it('should disable the confirm button', () => {
      expect(wrapper.find(PrimaryButton)).toHaveProp('isDisabled', true);
    });
  });

  describe('when there is a password', () => {
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<AccountDetailsResetPasswordPanel {...props} />);
      wrapper.setState({ newPassword: '12345' });
    });
    it('can be clicked', () => {
      expect(wrapper.find(PrimaryButton)).toHaveProp('isDisabled', false);
    });
  });

  describe('when the "use random generated password option" is enabled', () => {
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<AccountDetailsResetPasswordPanel {...props} />);
      wrapper.find(CheckboxInput).prop('onChange')();
    });
    it('should mark it as being used in the state', () => {
      expect(wrapper).toHaveState('useRandomGeneratedPassword', true);
    });
    it('should use a generated password of 8 chars', () => {
      expect(wrapper.state('randomGeneratedPassword')).toHaveLength(8);
    });
    it('should have the reset button enabled', () => {
      expect(wrapper.find(PrimaryButton)).toHaveProp('isDisabled', false);
    });
    it('should show generated password in plain text', () => {
      expect(wrapper.find({ name: 'newPassword' })).toHaveProp(
        'isReadOnly',
        true
      );
    });
  });

  describe('when "generated random password" is disabled', () => {
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<AccountDetailsResetPasswordPanel {...props} />);
      wrapper.setState({
        useRandomGeneratedPassword: true,
        randomGeneratedPassword: '12345678',
      });
      wrapper.find(CheckboxInput).prop('onChange')();
    });

    it('should mark the option as not used in state', () => {
      expect(wrapper).toHaveState('useRandomGeneratedPassword', false);
    });

    it('should have no random password in the state', () => {
      expect(wrapper).toHaveState('randomGeneratedPassword', null);
    });

    it('should reset the password', () => {
      expect(wrapper).toHaveState('newPassword', null);
    });

    it('should disable the submit button', () => {
      expect(wrapper.find(PrimaryButton)).toHaveProp('isDisabled', true);
    });
  });
});

describe('when resetting the password', () => {
  let wrapper;
  let props;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<AccountDetailsResetPasswordPanel {...props} />);
    wrapper.find({ name: 'newPassword' }).prop('onChange')({
      target: { value: '12345' },
    });
  });

  it('should have the password in the state', () => {
    expect(wrapper).toHaveState('newPassword', '12345');
  });

  it('should have a closed confirmation modal', () => {
    expect(wrapper).toHaveState('isConfirmationDialogOpen', false);
  });

  describe('when opening the confirmation dialog', () => {
    beforeEach(() => {
      wrapper.instance().openConfirmationDialog();
    });
    it('should open the confirmation modal', () => {
      expect(wrapper).toHaveState('isConfirmationDialogOpen', true);
    });
    it('should have the reset password title', () => {
      expect(wrapper.find(ConfirmationDialog)).toHaveProp(
        'title',
        'Employee.Details.AccountResetPassword.modalTitle'
      );
    });
    it('should pass correct message to reset confirmation', () => {
      expect(wrapper.find(ConfirmationDialog)).toRender({
        id: 'Employee.Details.AccountResetPassword.modalMessage',
      });
    });

    describe('when confirming "reset password"', () => {
      beforeEach(() => {
        // Confirm reset password
        wrapper.find(ConfirmationDialog).prop('onConfirm')();
      });
      it('should pass manually typed password to action creator', () => {
        expect(props.onPasswordReset).toHaveBeenCalled();
      });
      it('should have a closed confirmation modal', () => {
        expect(wrapper).toHaveState('isConfirmationDialogOpen', false);
      });
      it.skip('should show a success notification', () => {
        expect(props.showNotification).toHaveBeenLastCalledWith({
          kind: 'success',
          text:
            'Employee.Details.AccountResetPassword.passwordResetNotification',
          domain: DOMAINS.SIDE,
        });
      });
      it.skip('should reset the state to the initial state', () => {
        expect(wrapper.state()).toEqual({
          isConfirmationDialogOpen: false,
          newPassword: null,
          useRandomGeneratedPassword: false,
          randomGeneratedPassword: null,
        });
      });
    });
  });

  describe('when using a randomly generated password', () => {
    beforeEach(() => {
      wrapper.find(CheckboxInput).prop('onChange')();
    });
    it('should have a closed confirmation dialog', () => {
      expect(wrapper).toHaveState('isConfirmationDialogOpen', false);
    });
    describe('when opening the confirmation dialog', () => {
      beforeEach(() => {
        wrapper.find(CheckboxInput).prop('onChange')();
        wrapper.instance().openConfirmationDialog();
      });
      it('should have an opened confirmation dialog', () => {
        expect(wrapper).toHaveState('isConfirmationDialogOpen', true);
      });
    });
    describe('when confirming password reset', () => {
      beforeEach(() => {
        wrapper.instance().openConfirmationDialog();
        // Confirm reset password
        wrapper.find(ConfirmationDialog).prop('onConfirm')();
      });
      it('should pass random generated password to action creator', () => {
        expect(props.onPasswordReset).toHaveBeenCalled();
      });
      it('should close confirmation modal', () => {
        expect(wrapper).toHaveState('isConfirmationDialogOpen', false);
      });
      it.skip('should show success notification', () => {
        expect(props.showNotification).toHaveBeenLastCalledWith({
          kind: 'success',
          text:
            'Employee.Details.AccountResetPassword.passwordResetNotification',
          domain: DOMAINS.SIDE,
        });
      });

      it.skip('should reset to initial state after password has been reset', () => {
        expect(wrapper.state()).toEqual({
          isConfirmationDialogOpen: false,
          newPassword: null,
          useRandomGeneratedPassword: false,
          randomGeneratedPassword: null,
        });
      });
    });
  });
});
