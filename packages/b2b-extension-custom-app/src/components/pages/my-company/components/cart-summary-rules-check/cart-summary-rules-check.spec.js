import React from 'react';
import { render, waitForElement } from '@testing-library/react';

import { IntlProvider } from 'react-intl';
import CartSummaryRulesCheck from './cart-summary-rules-check';

const createTestProps = custom => ({
  company: {
    rules: [
      {
        name: 'rule1',
        parsedValue: `{"any": [{"fact": "totalPrice","path": "$.centAmount","operator": "greaterThanInclusive","value": 1}]}`,
      },
    ],
    approverRoles: [],
  },
  cart: {
    totalPrice: {
      fractionDigits: 2,
      currencyCode: 'USD',
      centAmount: 1000,
    },
    customerEmail: '',
    shippingInfo: {
      price: {
        fractionDigits: 2,
        currencyCode: 'USD',
        centAmount: 1000,
      },
    },
  },
  employee: {
    roles: [],
    email: '',
  },

  ...custom,
});

const Component = props => (
  <IntlProvider locale="en">
    <CartSummaryRulesCheck {...createTestProps(props)} />
  </IntlProvider>
);

describe('CartSummaryRulesCheck component', () => {
  describe('when not satisfy company rules', () => {
    test('requires approval', async () => {
      const props = {};

      const { queryByText } = render(<Component {...props} />);

      const text = await waitForElement(
        () =>
          queryByText(
            `You will require approval because the order does not satisfy company rules: "rule1"`
          ),
        {}
      );

      expect(text).toBeInTheDocument();
    });
  });

  describe('when employee is approval', () => {
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
});
