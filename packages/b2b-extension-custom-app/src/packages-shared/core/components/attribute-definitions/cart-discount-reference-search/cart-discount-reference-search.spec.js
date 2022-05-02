import React from 'react';
import {
  renderApp,
  waitForElement,
} from '@commercetools-frontend/application-shell/test-utils';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import { CartDiscountsCount } from '../../../actions/reference-search/cart-discount/cart-discount.graphql';
import CartDiscountReferenceSearch from './cart-discount-reference-search';

const createTestProps = customProps => ({
  typeId: 'cart-discount',
  attribute: {
    name: 'cart-discount-ref',
  },
  definition: {
    name: 'cart-discount-reference',
    type: {
      name: 'reference',
    },
    isRequired: false,
  },
  disabled: false,
  isSet: true,
  onBlur: () => {},
  onChange: () => {},
  onBlurValue: () => {},
  onChangeValue: () => {},
  onFocusValue: () => {},
  selectedLanguage: 'en',
  languages: ['en'],
  setInvalidValueState: () => {},

  ...customProps,
});

const mockRequests = {
  withLessThan500: [
    {
      request: {
        query: CartDiscountsCount,
        variables: {
          target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
        },
      },
      result: {
        data: {
          cartDiscounts: {
            __typename: 'CartDiscountQueryResult',
            total: 100,
          },
        },
      },
    },
  ],
  withMoreThan500: [
    {
      request: {
        query: CartDiscountsCount,
        variables: {
          target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
        },
      },
      result: {
        data: {
          cartDiscounts: {
            __typename: 'CartDiscountQueryResult',
            total: 505,
          },
        },
      },
    },
  ],
};

const render = (options = {}) => {
  return renderApp(<CartDiscountReferenceSearch {...options.props} />, {
    addTypename: true,
    mocks: [],
    ...options,
  });
};

const props = createTestProps();

describe('when loading', () => {
  it('should initially render loading spinner', () => {
    const rendered = render({ mocks: mockRequests.withLessThan500, props });

    expect(rendered.queryByTestId('loading-spinner')).toBeInTheDocument();
  });
});

describe('when loaded', () => {
  describe('less than 500 results', () => {
    it('should render reference by name component', async () => {
      const rendered = render({ mocks: mockRequests.withLessThan500, props });

      await waitForElement(() => rendered.queryByTestId(/reference-by-name/i));

      expect(rendered.queryByTestId('reference-by-name')).toBeInTheDocument();
    });
  });

  describe('more than 500 results', () => {
    it('should render reference by id component', async () => {
      const rendered = render({ mocks: mockRequests.withMoreThan500, props });

      await waitForElement(() => rendered.queryByTestId(/reference-by-id/i));

      expect(rendered.queryByTestId('reference-by-id')).toBeInTheDocument();
    });
  });
});
