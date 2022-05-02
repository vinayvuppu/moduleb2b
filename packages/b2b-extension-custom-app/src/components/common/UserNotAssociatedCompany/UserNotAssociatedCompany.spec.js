import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import UserNotAssociatedCompany from './UserNotAssociatedCompany';

jest.mock('@commercetools-frontend/application-shell-connectors', () => ({
  useApplicationContext: () => ({ user: { email: 'foo@example.com' } }),
}));

afterEach(cleanup);

describe('UserNotAssociatedCompany component', () => {
  describe('rendering', () => {
    it('should render the correct snapshot', () => {
      const { asFragment } = render(
        <IntlProvider locale="en">
          <UserNotAssociatedCompany />
        </IntlProvider>
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
