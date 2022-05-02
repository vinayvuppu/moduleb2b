import React from 'react';
import { shallow } from 'enzyme';

import { QuoteDetailsGeneralTab } from './quote-details-general-tab';
import QuoteSummaryPanel from '../quote-summary-panel';
import QuoteEmployeePanel from '../quote-employee-panel';
import QuoteItemsPanel from '../quote-items-panel';

const createTestProps = props => ({
  projectKey: 'project-key-1',
  updateQuoteItems: jest.fn(),
  addAmountDiscount: jest.fn(),
  addPercentageDiscount: jest.fn(),
  quote: {
    id: 'quote-id',
  },
  hasCompany: true,
  ...props,
});

jest.mock('@commercetools-frontend/permissions', () => ({
  useIsAuthorized: () => true,
}));

describe('rendering', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<QuoteDetailsGeneralTab {...props} />);
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render QuoteSummaryPanel', () => {
    expect(wrapper).toRender(QuoteSummaryPanel);
  });

  it('should render QuoteEmployeePanel', () => {
    expect(wrapper).toRender(QuoteEmployeePanel);
  });

  it('should render QuoteItemsPanel', () => {
    expect(wrapper).toRender(QuoteItemsPanel);
  });
});
