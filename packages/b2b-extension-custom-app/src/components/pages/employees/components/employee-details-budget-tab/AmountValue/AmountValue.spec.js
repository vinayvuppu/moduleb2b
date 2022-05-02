import React from 'react';
import { render, cleanup } from '@testing-library/react';
import AmountValue from './AmountValue';

jest.mock('react-intl', () => {
  const actual = jest.requireActual('react-intl');
  return {
    ...actual,
    useIntl: jest.fn(() => ({
      formatNumber: jest.fn(),
      formatMessage: jest.fn(() => 'formatted message'),
    })),
  };
});

afterEach(cleanup);

describe('AmountValue component', () => {
  describe('rendering', () => {
    it('should render the correct snapshot', () => {
      const { asFragment } = render(
        <AmountValue label={'foo'} noValueLabel={'foo-no-value'} />
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
