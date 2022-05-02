import React from 'react';
import { shallow } from 'enzyme';

import { AdminQuotesList } from './admin-quotes-list';
import QuotesList from '../quotes-list';

const createTestProps = props => ({
  ...props,
});

jest.mock('@commercetools-frontend/application-shell-connectors', () => {
  const actual = jest.requireActual(
    '@commercetools-frontend/application-shell-connectors'
  );
  return {
    ...actual,
    useApplicationContext: () => ({
      project: { key: 'test' },
    }),
  };
});

describe('rendering', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<AdminQuotesList {...props} />);
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should set variables props to QuotesList', () => {
    expect(wrapper.find(QuotesList)).toHaveProp('variables', {
      employeeId: undefined,
      companyId: undefined,
    });
  });

  it('should set columnsToExclude props to QuotesList', () => {
    expect(wrapper.find(QuotesList)).toHaveProp('columnsToExclude', [
      'actions',
    ]);
  });

  it('should set generateDetailLink props to QuotesList', () => {
    expect(wrapper.find(QuotesList)).toHaveProp(
      'generateDetailLink',
      expect.any(Function)
    );
  });
});
