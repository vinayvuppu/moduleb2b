import React from 'react';
import { render, cleanup, wait } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';
import { getCompanies } from '../../api';
import CompaniesList from './companies-list';
import '@testing-library/jest-dom';

jest.mock('@commercetools-frontend/application-shell-connectors', () => ({
  useApplicationContext: () => ({
    project: { key: 'test' },
    environment: { apiUrl: 'url' },
  }),
}));
jest.mock('../../api');

afterEach(cleanup);

const Component = () => (
  <IntlProvider locale="en">
    <MemoryRouter>
      <CompaniesList />
    </MemoryRouter>
  </IntlProvider>
);

describe('CompaniesList component', () => {
  let component;

  describe('rendering', () => {
    describe('when there are no companies', () => {
      beforeEach(async () => {
        getCompanies.mockResolvedValue({
          results: [],
          offset: 0,
          limit: 0,
          count: 0,
          total: 0,
        });
        component = render(<Component />);
        await wait();
      });
      it('should render the correct message', async () => {
        const actual = component.getByText(
          'There are no companies associated to this project.'
        );

        expect(actual).toBeInTheDocument();
      });
    });
  });
});
