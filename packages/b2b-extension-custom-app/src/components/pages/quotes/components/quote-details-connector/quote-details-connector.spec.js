import React from 'react';
import { shallow } from 'enzyme';

import { QuoteDetailsConnector } from './quote-details-connector';

jest.mock('react-apollo', () => {
  const actual = jest.requireActual('react-apollo');
  return {
    ...actual,
    useMutation: jest.fn(() => [jest.fn().mockResolvedValue()]),
    useQuery: jest.fn(() => ({
      data: { quote: { id: 'quote-id', version: 1 }, loading: false },
      loading: false,
    })),
  };
});

const createTestProps = props => ({
  children: jest.fn(childrenProps => <div {...childrenProps} />),
  projectKey: 'project-key-1',
  quoteId: 'quote-id',
  ...props,
});

describe('rendering', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<QuoteDetailsConnector {...props} />);
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should call children prop with params', () => {
    expect(props.children).toHaveBeenCalledWith({
      isLoading: true,
      updateQuoteState: expect.any(Function),
      updateQuoteItems: expect.any(Function),
      addAmountDiscount: expect.any(Function),
      addPercentageDiscount: expect.any(Function),
      addComment: expect.any(Function),
    });
  });
});
