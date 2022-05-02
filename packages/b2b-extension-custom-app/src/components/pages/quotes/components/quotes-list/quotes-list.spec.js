import React from 'react';
import { shallow } from 'enzyme';
import SearchView from '@commercetools-local/core/components/search/search-view';

import FetchQuotesQuery from '../../graphql/FetchQuotes.graphql';
import { QuotesList } from './quotes-list';

jest.mock('react-intl', () => {
  const actual = jest.requireActual('react-intl');
  return {
    ...actual,
    useIntl: jest.fn(() => ({
      formatMessage: jest.fn(() => 'formatted message'),
    })),
  };
});

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useHistory: jest.fn(() => ({
      push: jest.fn(),
    })),
  };
});

jest.mock('@commercetools-frontend/application-shell-connectors', () => {
  const actual = jest.requireActual(
    '@commercetools-frontend/application-shell-connectors'
  );
  return {
    ...actual,
    useApplicationContext: jest.fn(() => ({
      project: { key: 'project-key' },
    })),
  };
});

jest.mock('react-apollo', () => {
  const actual = jest.requireActual('react-apollo');
  return {
    ...actual,
    useQuery: jest.fn(() => ({
      data: { quotes: { total: 1, count: 1, results: [{ id: 'quote-id' }] } },
      loading: false,
    })),
  };
});

const createTestProps = props => ({
  query: FetchQuotesQuery,
  variables: {
    quoteState: null,
    employeeId: null,
    companyId: null,
  },
  includeAddRequestButton: true,
  generateDetailLink: jest.fn(),
  ...props,
});

const createConnectorProps = props => ({
  rowCount: 1,
  results: [{ id: 'quote-id' }],
  footer: <div />,
  ...props,
});

describe('rendering', () => {
  let props;
  let wrapper;
  let childrenWrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<QuotesList {...props} />);
    childrenWrapper = wrapper.find(SearchView).renderProp('children')(
      createConnectorProps()
    );
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should match children snapshot', () => {
    expect(childrenWrapper).toMatchSnapshot();
  });
});
