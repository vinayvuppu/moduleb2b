import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import AmmountRolModalForm from './amount-rol-modal-form';

jest.mock('@commercetools-frontend/application-shell-connectors', () => ({
  useApplicationContext: () => ({
    currencies: ['USD'],
  }),
}));
jest.mock('@commercetools-frontend/permissions', () => ({
  useIsAuthorized: () => true,
}));

const budget = {
  rol: 'b2b-company-admin',
  amount: {
    currencyCode: 'USD',
    amount: '20.00',
  },
};

const Component = props => (
  <IntlProvider locale="en">
    <AmmountRolModalForm
      initialValues={budget}
      handleSubmit={jest.fn}
      handleRemove={jest.fn}
      isOpen={true}
      validate={() => {}}
      close={jest.fn}
      title="foo"
      {...props}
    />
  </IntlProvider>
);

describe('AmmountRolModalForm component', () => {
  let component;
  describe('actions', () => {
    describe('when is editing budget', () => {
      const index = 0;
      describe('click on remove icon', () => {
        let handleRemoveSpy;
        beforeEach(() => {
          handleRemoveSpy = jest.fn();
          component = render(
            <Component
              initialValues={{ ...budget, index }}
              handleRemove={handleRemoveSpy}
            />
          );
          fireEvent.click(component.getByLabelText('Remove budget'));
        });
        it('should call handleRemoved with correct values', () => {
          expect(handleRemoveSpy).toHaveBeenCalledWith(index);
        });
      });
      describe('save an edit budget', () => {
        let handleSubmitSpy;
        beforeEach(async () => {
          handleSubmitSpy = jest.fn();
          component = render(
            <Component
              initialValues={{ ...budget, index }}
              handleSubmit={handleSubmitSpy}
            />
          );
          fireEvent.change(component.getByTestId('amount-field'), {
            target: { value: '30' },
          });
          fireEvent.click(component.getByText('Save'));
          await wait();
        });
        it('should call handleSubmit with correct values', () => {
          expect(handleSubmitSpy).toHaveBeenCalledWith({
            rol: budget.rol,
            amount: {
              centAmount: 3000,
              currencyCode: 'USD',
              fractionDigits: 2,
              type: 'centPrecision',
            },
            index: 0,
          });
        });
      });
    });
    describe('when create new budget', () => {
      describe.skip('click on save', () => {
        let handleSubmitSpy;
        beforeEach(async () => {
          handleSubmitSpy = jest.fn();
          component = render(
            <Component
              initialValues={{
                amount: { currencyCode: 'USD', amount: '' },
                rol: '',
              }}
              handleSubmit={handleSubmitSpy}
            />
          );
          fireEvent.change(component.getByTestId('amount-field'), {
            target: { value: '40' },
          });
          const rolesDropDown = component.getByTestId('rol-field');
          fireEvent.focus(rolesDropDown);
          fireEvent.keyDown(rolesDropDown, { key: 'ArrowDown' });
          component.debug(rolesDropDown);
          fireEvent.click(component.getByText('B2B Company Admin'));
          fireEvent.click(component.getByText('Save'));
          await wait();
        });
        it('should call handleSubmit with correct values', () => {
          expect(handleSubmitSpy).toHaveBeenCalledWith({
            amount: {
              centAmount: 4000,
              currencyCode: 'USD',
              fractionDigits: 2,
              type: 'centPrecision',
            },
            rol: 'b2b-company-admin',
          });
        });
      });
    });
  });
});
