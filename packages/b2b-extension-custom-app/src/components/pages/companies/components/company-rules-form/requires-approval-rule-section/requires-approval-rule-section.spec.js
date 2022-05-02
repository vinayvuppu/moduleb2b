import React from 'react';
import { render, cleanup } from '@testing-library/react';
import RequiresApprovalRuleSection from './requires-approval-rule-section';

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

describe('RequiresApprovalRuleSection component', () => {
  describe('rendering', () => {
    it('should render the correct snapshot', () => {
      const { asFragment } = render(
        <RequiresApprovalRuleSection
          validate={jest.fn()}
          label="foo"
          addLabel="addFoo"
          formik={{
            values: {
              requiredApprovalRoles: [],
              rules: '',
            },
            touched: {},
            errors: {},
            handleChange: jest.fn(),
            setFieldValue: jest.fn(),
          }}
        />
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
