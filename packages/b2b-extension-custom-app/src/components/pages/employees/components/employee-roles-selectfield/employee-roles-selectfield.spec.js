import React from 'react';
import { render, cleanup, wait } from '@testing-library/react';

import EmployeeRolesSelectField from './employee-roles-selectfield';

jest.mock(
  '@commercetools-local/core/components/custom-field-type-definitions-connector',
  () => ({ children }) =>
    children({
      customFieldTypeDefinitionsFetcher: {
        isLoading: false,
        customFieldTypeDefinitions: {
          results: [
            {
              fieldDefinitions: [
                {
                  name: 'roles',
                  type: {
                    elementType: { values: [{ key: 'foo', label: 'Foo' }] },
                  },
                },
              ],
            },
          ],
        },
      },
    })
);

jest.mock('react-intl', () => {
  const actual = jest.requireActual('react-intl');
  return {
    ...actual,
    useIntl: jest.fn(() => ({
      formatMessage: jest.fn(() => 'formatted message'),
    })),
  };
});

jest.mock('@commercetools-frontend/application-shell-connectors', () => ({
  useApplicationContext: () => ({ projectKey: 'test' }),
}));

const createTestProps = props => ({
  value: [],
  onChange: jest.fn(),
  isRequired: true,
  canManageEmployees: false,
  touched: [false],
  errors: {},
  ...props,
});

afterEach(cleanup);

describe('rendering', () => {
  let props;
  let component;
  beforeEach(async () => {
    props = createTestProps();
    component = render(<EmployeeRolesSelectField {...props} />);
    await wait();
  });

  it('should render the correct message', async () => {
    expect(component.queryByTestId('roles')).toBeInTheDocument();
  });
});
