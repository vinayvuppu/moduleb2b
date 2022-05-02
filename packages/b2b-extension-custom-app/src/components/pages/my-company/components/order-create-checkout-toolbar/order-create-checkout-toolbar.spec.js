/* eslint-disable react/react-in-jsx-scope */
import { render, fireEvent, wait } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import OrderCreateCheckoutToolbar from './order-create-checkout-toolbar';

jest.mock('react', () => {
  const ActualReact = require.requireActual('react');
  return {
    ...ActualReact,
    useContext: () => ({
      cartDraftState: {
        value: {
          totalPrice: {
            type: 'centPrecision',
            centAmount: 9875,
            currencyCode: 'USD',
            fractionDigits: 2,
          },
        },
      },
    }),
  };
});
jest.mock('react-intl', () => {
  const ActualReactIntl = require.requireActual('react-intl');
  return {
    ...ActualReactIntl,
    useIntl: () => ({
      formatMessage: msg => msg.defaultMessage,
      formatNumber: jest.fn,
    }),
  };
});

const Component = props => (
  <IntlProvider locale="en">
    <OrderCreateCheckoutToolbar
      currentStep={4}
      totalSteps={4}
      isVisible={true}
      onBack={jest.fn}
      onCancel={jest.fn}
      onSave={jest.fn}
      company={{ rules: [] }}
      employee={{}}
      {...props}
    />
  </IntlProvider>
);

describe('OrderCreateCheckoutToolbar component', () => {
  test('employee is approver and have required approval amount', async () => {
    const props = {
      onSave: jest.fn(),
      employee: { roles: ['admin'] },
      company: {
        approverRoles: ['admin'],
        budget: [],
        rules: [],
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
    const { getByText } = render(<Component {...props} />);
    const placeOrderButton = getByText('Place order');

    fireEvent.click(placeOrderButton);
    await wait();

    expect(props.onSave).toHaveBeenCalled();
  });
});
