import React from 'react';
import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import CartSummaryAmountForRequiredApproval from './cart-summary-amount-for-required-approval';

jest.mock('@commercetools-frontend/application-shell-connectors', () => ({
  useApplicationContext: () => ({ environment: { apiUrl: 'url' } }),
}));

const Component = props => (
  <IntlProvider locale="en">
    <CartSummaryAmountForRequiredApproval
      company={{ requiredApprovalRoles: [], approverRoles: [] }}
      employeeRoles={['admin']}
      cartTotalPrice={{
        type: 'centPrecision',
        centAmount: 9875,
        currencyCode: 'USD',
        fractionDigits: 2,
      }}
      {...props}
    />
  </IntlProvider>
);

describe('CartSummaryAmountForRequiredApproval component', () => {
  test("company doesn't have requiredApprovalRoles", () => {
    const { queryByTestId } = render(<Component />);
    const comp = queryByTestId('no-approval');

    expect(comp).toBeInTheDocument();
  });

  test('company need required approval', () => {
    const props = {
      company: {
        requiredApprovalRoles: [
          {
            rol: 'admin',
            amount: {
              type: 'centPrecision',
              centAmount: 5000,
              currencyCode: 'USD',
              fractionDigits: 2,
            },
          },
        ],
        approverRoles: [],
      },
    };
    const { queryByText } = render(<Component {...props} />);
    const text = queryByText('You will require approval');

    expect(text).toBeInTheDocument();
  });

  test('employee is approval and have requiredApproval', () => {
    const props = {
      company: {
        approverRoles: ['admin'],
        requiredApprovalRoles: [
          {
            rol: 'admin',
            amount: {
              type: 'centPrecision',
              centAmount: 5000,
              currencyCode: 'USD',
              fractionDigits: 2,
            },
          },
        ],
      },
    };
    const { queryByTestId } = render(<Component {...props} />);
    const comp = queryByTestId('no-approval');

    expect(comp).toBeInTheDocument();
  });
});
