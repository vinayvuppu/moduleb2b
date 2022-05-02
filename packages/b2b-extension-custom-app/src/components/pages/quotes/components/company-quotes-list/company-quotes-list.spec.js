import React from 'react';
import { shallow } from 'enzyme';

import { CompanyQuotesList } from './company-quotes-list';
import EmployeeDetailWrapper from '../../../my-company/components/employee-detail-wrapper';
import QuotesList from '../quotes-list';

const createTestProps = props => ({
  projectKey: 'project-key1',
  ...props,
});

const createConnectorProps = props => ({
  company: { id: 'company-id' },
  ...props,
});

describe('rendering', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<CompanyQuotesList {...props} />)
      .find(EmployeeDetailWrapper)
      .renderProp('children')(createConnectorProps());
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should set variables props to QuotesList', () => {
    expect(wrapper.find(QuotesList)).toHaveProp('variables', {
      employeeId: undefined,
      companyId: 'company-id',
    });
  });
  it('should set columnsToExclude props to QuotesList', () => {
    expect(wrapper.find(QuotesList)).toHaveProp('columnsToExclude', [
      'company',
    ]);
  });

  it('should set filtersToExclude props to QuotesList', () => {
    expect(wrapper.find(QuotesList)).toHaveProp('filtersToExclude', [
      'companyId',
    ]);
  });

  it('should set generateDetailLink props to QuotesList', () => {
    expect(wrapper.find(QuotesList)).toHaveProp(
      'generateDetailLink',
      expect.any(Function)
    );
  });
});
