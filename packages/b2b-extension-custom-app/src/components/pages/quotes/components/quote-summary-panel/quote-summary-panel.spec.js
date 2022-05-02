import React from 'react';
import { IntlProvider } from 'react-intl';
import { render } from '@testing-library/react';

import { QuoteSummaryPanel } from './quote-summary-panel';

jest.mock('@commercetools-local/utils/formats/money', () => ({
  formatMoney: money => money.centAmount,
}));
jest.mock('react-intl', () => {
  const actual = jest.requireActual('react-intl');
  return {
    ...actual,
    useIntl: jest.fn(() => ({
      formatNumber: jest.fn(),
      formatMessage: msg => msg.defaultMessage,
    })),
  };
});

describe('QuoteSummaryPanel component', () => {
  test('quote have originalTotalPrice and totalPrice', () => {
    const props = {
      quote: {
        totalPrice: {
          centAmount: 5000,
          currencyCode: 'USD',
          fractionDigits: 2,
        },
        originalTotalPrice: {
          centAmount: 10000,
          currencyCode: 'USD',
          fractionDigits: 2,
        },
        quoteState: 'requested',
      },
    };
    const { getByTestId } = render(
      <IntlProvider locale="en">
        <QuoteSummaryPanel {...props} />
      </IntlProvider>
    );
    const quoteDiscountValue = getByTestId('quote-discount');

    expect(quoteDiscountValue).toHaveTextContent('5000');
  });
  test('quote have originalTotalPrice, totalPrice and prop totalPrice', () => {
    const props = {
      totalPrice: {
        centAmount: 3000,
        currencyCode: 'USD',
        fractionDigits: 2,
      },
      quote: {
        totalPrice: {
          centAmount: 10000,
          currencyCode: 'USD',
          fractionDigits: 2,
        },
        originalTotalPrice: {
          centAmount: 5000,
          currencyCode: 'USD',
          fractionDigits: 2,
        },
        quoteState: 'requested',
      },
    };
    const { getByTestId } = render(
      <IntlProvider locale="en">
        <QuoteSummaryPanel {...props} />
      </IntlProvider>
    );
    const quoteDiscountValue = getByTestId('quote-discount');

    expect(quoteDiscountValue).toHaveTextContent('2000');
  });
  test('quote have only totalPrice', () => {
    const props = {
      totalPrice: {
        centAmount: 3000,
        currencyCode: 'USD',
        fractionDigits: 2,
      },
      quote: {
        totalPrice: {
          centAmount: 300,
          currencyCode: 'USD',
          fractionDigits: 2,
        },
        quoteState: 'requested',
      },
    };
    const { getByTestId } = render(
      <IntlProvider locale="en">
        <QuoteSummaryPanel {...props} />
      </IntlProvider>
    );
    const quoteDiscountValue = getByTestId('originalTotalPrice');

    expect(quoteDiscountValue).toHaveTextContent('300');
  });
});
