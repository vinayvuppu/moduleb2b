import React from 'react';
import xhrMock from 'xhr-mock';
import { Route } from 'react-router-dom';
import {
  createGraphqlMock,
  createRosie,
} from '@commercetools-local/test-utils';
import {
  experimentalRenderAppWithRedux,
  waitForElement,
  fireEvent,
  within,
} from '@commercetools-frontend/application-shell/test-utils';
import { allTestPermissions } from '../../../../test-utils/permissions';
import ApplicationCustomersRoutes from '../../../../../routes';

const render = (graphqlMockOptions, renderOptions = {}) => {
  createGraphqlMock(xhrMock, graphqlMockOptions);
  return experimentalRenderAppWithRedux(
    <Route
      path="/:projectKey/b2b-extension/employees"
      render={routerProps => (
        <ApplicationCustomersRoutes match={routerProps.match} />
      )}
    />,
    {
      ...renderOptions,
      addTypeName: true,
      route: {
        pathname: `/my-project/b2b-extension/employees/${graphqlMockOptions.fixtures.ctp.customer.id}/general`,
      },
      permissions: allTestPermissions,
    }
  );
};

describe.skip('Employees Details', () => {
  let rosie;

  beforeEach(() => {
    rosie = createRosie();
    xhrMock.setup();
  });

  afterEach(() => {
    xhrMock.teardown();
  });

  describe('details', () => {
    it('should render Employees Details', async () => {
      const customer = rosie.ctp.Customer.build();
      const customerGroups = rosie.ctp.CustomerGroup.buildList(5);
      const fixtures = { ctp: { customer, customerGroups } };
      const rendered = render({ fixtures });

      await waitForElement(() => rendered.getByTestId('employee-info-details'));
      // First Name
      expect(rendered.queryByLabelText('First name')).toHaveProperty(
        'value',
        customer.firstName
      );
      // Last Name
      expect(rendered.queryByLabelText('Last name')).toHaveProperty(
        'value',
        customer.lastName
      );

      // External ID
      expect(rendered.queryByLabelText('External ID')).toHaveProperty(
        'value',
        customer.externalId
      );

      // Link customer to Store
      expect(
        rendered.queryByText('Account restricted to these stores')
      ).toBeInTheDocument();

      // password
      await waitForElement(() => rendered.getByLabelText('New Password'));
      expect(rendered.queryByTestId('newPassword')).toHaveProperty('value', '');

      // disable button by default
      expect(rendered.queryByTestId('newPasswordButton')).toHaveProperty(
        'disabled',
        true
      );
      expect(rendered.queryByLabelText('Company name')).toBeInTheDocument();
      expect(rendered.queryByLabelText('VAT ID')).toBeInTheDocument();
    });
  });
  describe('without verified email', () => {
    it('should display `Not verified` label', async () => {
      const customer = rosie.ctp.Customer.build({ isEmailVerified: false });
      const fixtures = { ctp: { customer, customerGroups: null } };
      const rendered = render({ fixtures });
      await waitForElement(() => rendered.getByTestId('employee-info-details'));
      expect(rendered.queryByText('Not verified')).toBeInTheDocument();
      expect(rendered.queryByText('Verified')).not.toBeInTheDocument();
    });
  });
  describe('with verified email', () => {
    it('should display `Verified` label', async () => {
      const customer = rosie.ctp.Customer.build();
      const customerGroups = rosie.ctp.CustomerGroup.buildList(5);
      const fixtures = { ctp: { customer, customerGroups } };
      const rendered = render({ fixtures });
      await waitForElement(() => rendered.getByTestId('employee-info-details'));
      expect(rendered.queryByText('Verified')).toBeInTheDocument();
      expect(rendered.queryByText('Not verified')).not.toBeInTheDocument();
    });
  });
  describe('when changing e-mail with wrong format', () => {
    it('should show validation message (valid email address)', async () => {
      const customer = rosie.ctp.Customer.build();
      const customerGroups = rosie.ctp.CustomerGroup.buildList(5);
      const rendered = render({
        fixtures: { ctp: { customer, customerGroups } },
      });
      await waitForElement(() => rendered.getByTestId('employee-info-details'));
      await waitForElement(() => rendered.getByTestId('email'));
      fireEvent.focus(rendered.getByTestId('email'));
      fireEvent.change(rendered.getByTestId('email'), {
        target: { name: 'email', value: 'invalid@value@' },
      });
      fireEvent.blur(rendered.getByTestId('email'));
      await waitForElement(() =>
        rendered.queryByText('Please enter a valid email address.')
      );
      expect(
        rendered.queryByText('Please enter a valid email address.')
      ).toBeInTheDocument();
    });
  });
  describe('when changing e-mail to empty value', () => {
    it('should show validation message (required)', async () => {
      const customer = rosie.ctp.Customer.build();
      const customerGroups = rosie.ctp.CustomerGroup.buildList(5);
      const rendered = render({
        fixtures: { ctp: { customer, customerGroups } },
      });
      await waitForElement(() => rendered.getByTestId('employee-info-details'));
      await waitForElement(() => rendered.getByTestId('email'));
      fireEvent.focus(rendered.getByTestId('email'));
      fireEvent.change(rendered.getByTestId('email'), {
        target: { name: 'email', value: '' },
      });
      fireEvent.blur(rendered.getByTestId('email'));
      await waitForElement(() =>
        rendered.queryByText('Please fill in this required field.')
      );
      expect(
        rendered.queryByText('Please fill in this required field.')
      ).toBeInTheDocument();
    });
  });

  describe('when changing birth day', () => {
    it('should allow choosing birth year', async () => {
      const customer = rosie.ctp.Customer.build();
      const customerGroups = rosie.ctp.CustomerGroup.buildList(1);
      const stores = rosie.ctp.Store.buildList(1);
      const rendered = render({
        fixtures: { ctp: { stores, customer, customerGroups } },
      });
      await waitForElement(() => rendered.getByTestId('employee-info-details'));

      // year
      const wrapperYear = rendered.queryByTestId('year');
      expect(wrapperYear).toBeInTheDocument();
      const selectDropdownYear = wrapperYear.querySelector('input');
      fireEvent.focus(selectDropdownYear);
      fireEvent.keyDown(selectDropdownYear, { key: 'ArrowDown' });
      await waitForElement(() => rendered.queryByText('2019'));
      rendered.queryByText('2019').click();

      // month
      const wrapperMonth = rendered.queryByTestId('month');
      expect(wrapperMonth).toBeInTheDocument();
      const selectDropdownMonth = wrapperMonth.querySelector('input');
      fireEvent.focus(selectDropdownMonth);
      fireEvent.keyDown(selectDropdownMonth, { key: 'ArrowDown' });
      await waitForElement(() => rendered.queryByText('May'));
      rendered.queryByText('May').click();

      // day
      const wrapperDay = rendered.queryByTestId('day');
      expect(wrapperDay).toBeInTheDocument();
      const selectDropdownDay = wrapperDay.querySelector('input');
      fireEvent.focus(selectDropdownDay);
      fireEvent.keyDown(selectDropdownDay, { key: 'ArrowDown' });
      await waitForElement(() => rendered.queryByText('20'));
      rendered.queryByText('20').click();

      // show save toolbar
      await waitForElement(() => rendered.getByTestId('save-toolbar-save'));
    });
  });

  describe('when changing name', () => {
    it('should display SaveToolbar', async () => {
      const customer = rosie.ctp.Customer.build();
      const customerGroups = rosie.ctp.CustomerGroup.buildList(5);
      const stores = rosie.ctp.Store.buildList(5);
      const rendered = render({
        fixtures: { ctp: { stores, customer, customerGroups } },
      });
      await waitForElement(() => rendered.getByTestId('employee-info-details'));
      await waitForElement(() => rendered.getByTestId('firstName'));
      fireEvent.focus(rendered.getByTestId('firstName'));
      fireEvent.change(rendered.getByTestId('firstName'), {
        target: { name: 'firstName', value: 'new customer name' },
      });
      await waitForElement(() => rendered.getByTestId('save-toolbar-save'));
      expect(rendered.queryByTestId('save-toolbar-save')).toBeInTheDocument();
    });
  });

  describe('when changing password', () => {
    it('should enable save new password button and display ConfirmationDialog when setting new password', async () => {
      const customer = rosie.ctp.Customer.build();
      const customerGroups = rosie.ctp.CustomerGroup.buildList(5);
      const stores = rosie.ctp.Store.buildList(5);
      const rendered = render({
        fixtures: { ctp: { stores, customer, customerGroups } },
      });
      await waitForElement(() => rendered.getByTestId('employee-info-details'));
      await waitForElement(() => rendered.getByTestId('newPassword'));
      fireEvent.focus(rendered.getByTestId('newPassword'));
      fireEvent.change(rendered.getByTestId('newPassword'), {
        // sha1 `newPassword`
        target: {
          name: 'newPassword',
          value: '283d47a9338ed1100b5fe2a5aff2d1f7c799bfd0',
        },
      });
      await waitForElement(() => rendered.getByTestId('newPasswordButton'));
      expect(rendered.queryByTestId('newPasswordButton')).toHaveProperty(
        'disabled',
        false
      );
      fireEvent.click(rendered.getByTestId('newPasswordButton'));

      // Modal
      const confirmationDialog = await waitForElement(
        () => rendered.getAllByLabelText(/Set new password/)[0]
      );
      expect(
        within(confirmationDialog).queryByLabelText(/Set new password/)
      ).toBeInTheDocument();
    });
  });
  describe('when generating password', () => {
    it('should enable save new password button and display ConfirmationDialog when setting new password', async () => {
      const customer = rosie.ctp.Customer.build();
      const customerGroups = rosie.ctp.CustomerGroup.buildList(5);
      const stores = rosie.ctp.Store.buildList(5);
      const rendered = render({
        fixtures: { ctp: { stores, customer, customerGroups } },
      });
      await waitForElement(() => rendered.getByTestId('employee-info-details'));
      await waitForElement(() =>
        rendered.getByTestId('generateRandomPassword')
      );
      fireEvent.click(rendered.getByTestId('generateRandomPassword'));
      await waitForElement(() => rendered.getByTestId('newPasswordButton'));
      expect(rendered.queryByTestId('newPasswordButton')).toHaveProperty(
        'disabled',
        false
      );
      fireEvent.click(rendered.getByTestId('newPasswordButton'));

      // Modal
      const confirmationDialog = await waitForElement(
        () => rendered.getAllByLabelText(/Set new password/)[0]
      );
      expect(
        within(confirmationDialog).queryByLabelText(/Set new password/)
      ).toBeInTheDocument();
    });
  });

  describe('without customerNumber', () => {
    it('should display customerNumber field as editable', async () => {
      const customer = rosie.ctp.Customer.build();
      const customerGroups = rosie.ctp.CustomerGroup.buildList(5);
      const stores = rosie.ctp.Store.buildList(5);
      const rendered = render({
        fixtures: { ctp: { stores, customer, customerGroups } },
      });
      await waitForElement(() => rendered.getByTestId('employee-info-details'));
      expect(rendered.queryByLabelText('Customer number')).not.toHaveAttribute(
        'readonly'
      );
    });
  });
  describe('with customerNumber', () => {
    it('should display customerNumber field as readonly', async () => {
      const customer = rosie.ctp.Customer.build({
        customerNumber: 'any-customer-number',
      });
      const customerGroups = rosie.ctp.CustomerGroup.buildList(5);
      const stores = rosie.ctp.Store.buildList(5);
      const rendered = render({
        fixtures: { ctp: { stores, customer, customerGroups } },
      });
      await waitForElement(() => rendered.getByTestId('employee-info-details'));
      expect(rendered.queryByLabelText('Customer number')).toHaveAttribute(
        'readonly'
      );
      expect(rendered.queryByLabelText('Customer number')).toHaveAttribute(
        'value',
        customer.customerNumber
      );
    });
  });
});
