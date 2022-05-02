import React from 'react';
import { shallow } from 'enzyme';

import { QuoteEmployeePanel } from './quote-employee-panel';

jest.mock('react-intl', () => {
  const actual = jest.requireActual('react-intl');
  return {
    ...actual,
    useIntl: jest.fn(() => ({
      formatMessage: jest.fn(() => 'formatted message'),
    })),
  };
});

const createTestProps = props => ({
  projectKey: 'project-key-1',
  quote: {
    id: 'quote-id',
    employeeId: 'employee-id',
    employeeEmail: 'employee@company.com',
    company: {
      id: 'company-id',
      name: 'company-name',
    },
  },
  isAuthorized: true,
  ...props,
});

describe('rendering', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<QuoteEmployeePanel {...props} />);
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
