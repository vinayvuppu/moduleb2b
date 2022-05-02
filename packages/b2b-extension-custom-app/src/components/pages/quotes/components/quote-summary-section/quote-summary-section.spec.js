import React from 'react';
import { shallow } from 'enzyme';

import { Text } from '@commercetools-frontend/ui-kit';

import { QuoteSummarySection } from './quote-summary-section';
import QuoteCreateSummary from '../quote-create-summary';

const createTestProps = props => ({
  title: 'test-title',
  quote: {
    id: 'quote-id',
    company: {
      id: 'company-id',
      name: 'company name',
    },
    employeeEmail: 'employee@company.com',
    totalPrice: {
      currencyCode: 'USD',
      centAmount: 0,
    },
  },
  onRemoveLineItem: jest.fn(),
  onChangeLineItemQuantity: jest.fn(),
  ...props,
});

describe('render', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<QuoteSummarySection {...props} />);
  });

  it('should render basic content', () => {
    expect(wrapper.find(Text.Headline)).toHaveProp('children', 'test-title');
  });

  it('should render the `QuoteCreateSummary` component', () => {
    expect(wrapper).toRender(QuoteCreateSummary);
  });
});
