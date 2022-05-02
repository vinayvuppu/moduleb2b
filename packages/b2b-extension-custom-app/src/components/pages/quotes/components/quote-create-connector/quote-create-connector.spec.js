import React from 'react';
import { shallow } from 'enzyme';

import { QuoteCreateConnector } from './quote-create-connector';

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
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return { ...actual, useLocation: () => ({}) };
});

const createTestProps = props => ({
  children: jest.fn(childrenProps => <div {...childrenProps} />),
  projectKey: 'project-key-1',
  ...props,
});

describe('rendering', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<QuoteCreateConnector {...props} />);
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should call children prop with params', () => {
    expect(props.children).toHaveBeenCalledWith({
      quote: undefined,
      isLoading: false,
      createQuote: expect.any(Function),
      addLineItem: expect.any(Function),
      removeLineItem: expect.any(Function),
      changeLineItemQuantity: expect.any(Function),
      convertedQuote: expect.any(Function),
    });
  });
});
