import React from 'react';
import { render, cleanup } from '@testing-library/react';
import AmountRolesSection from './amount-roles-section';

jest.mock('react-intl', () => {
  const actual = jest.requireActual('react-intl');
  return {
    ...actual,
    useIntl: jest.fn(() => ({
      formatMessage: jest.fn(() => 'formatted message'),
      locale: 'en',
    })),
  };
});
jest.mock('@commercetools-frontend/application-shell-connectors', () => ({
  useApplicationContext: () => ({
    project: { currencies: ['USD'] },
  }),
}));
jest.mock('@commercetools-frontend/permissions', () => {
  const actual = jest.requireActual('@commercetools-frontend/permissions');
  return {
    ...actual,
    useIsAuthorized: jest.fn(() => true),
  };
});

afterEach(cleanup);

describe('AmountRolesSection component', () => {
  describe('rendering', () => {
    it('should render the correct snapshot', () => {
      const { asFragment } = render(
        <AmountRolesSection
          values={[]}
          setValues={jest.fn()}
          validate={jest.fn()}
          label="foo"
          addLabel="addFoo"
        />
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
