import React from 'react';
import {
  render,
  cleanup,
  wait,
  fireEvent,
  waitForElement,
} from '@testing-library/react';

import CompanySelectField from './company-selectfield';

jest.mock('@commercetools-frontend/application-shell-connectors', () => {
  const actual = jest.requireActual(
    '@commercetools-frontend/application-shell-connectors'
  );
  return {
    ...actual,
    useApplicationContext: () => ({
      environment: { apiUrl: 'url' },
    }),
  };
});

jest.mock('react-intl', () => {
  const actual = jest.requireActual('react-intl');
  return {
    ...actual,
    useIntl: jest.fn(() => ({
      formatMessage: jest.fn(() => 'formatted message'),
    })),
  };
});

jest.mock('../../../companies/api', () => {
  const actual = jest.requireActual('../../../companies/api');
  return {
    ...actual,
    getCompanies: jest
      .fn()
      .mockResolvedValue({ results: [{ id: 'c1', name: 'company-name' }] }),
  };
});

const createTestProps = props => ({
  value: '',
  onChange: jest.fn(),
  isRequired: true,
  touched: false,
  errors: {},
  ...props,
});

afterEach(cleanup);

describe('rendering', () => {
  let props;
  let component;
  beforeEach(async () => {
    props = createTestProps();
    component = render(<CompanySelectField {...props} />);
    await wait();
  });

  it('should render the correct message', async () => {
    expect(component.queryByTestId('company')).toBeInTheDocument();
  });
});

describe('interacting', () => {
  let props;
  beforeEach(async () => {
    props = createTestProps();
    const rendered = render(<CompanySelectField {...props} />);
    const testId = 'company';
    const optionToSelect = 'company-name';

    await waitForElement(() => rendered.getByTestId(testId));
    const selectDropdown = document.querySelector(`#${testId}`);
    fireEvent.focus(selectDropdown);
    fireEvent.keyDown(selectDropdown, { key: 'ArrowDown' });
    await waitForElement(() => rendered.getByText(optionToSelect));
    rendered.getByText(optionToSelect).click();
  });

  it('should call to "onChange" props', () => {
    expect(props.onChange).toHaveBeenCalledWith({
      id: 'c1',
      name: 'company-name',
    });
  });
});
