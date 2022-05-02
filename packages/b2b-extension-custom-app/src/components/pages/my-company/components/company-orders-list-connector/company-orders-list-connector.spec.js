import React from 'react';
import { shallow } from 'enzyme';
import { Query } from 'react-apollo';
import { intlMock } from '@commercetools-local/test-utils';
import { CompanyOrdersListConnector } from './company-orders-list-connector';

const ChildComponent = () => <div>{'ChildComponent'}</div>;
ChildComponent.displayName = 'ChildComponent';

const orders = {
  total: 1,
  count: 1,
  results: [{ id: 'foo-order-id' }],
};

const createTestProps = customProps => ({
  children: jest.fn(),
  projectKey: 'foo-project-key',
  location: {},
  searchQuery: {
    page: 1,
    perPage: 20,
    searchText: 'foo-search',
    sorting: {
      key: 'foo-key',
      order: 'asc',
    },
    hiddenColumns: ['foo-column'],
    filters: {
      orderNumber: [
        {
          type: 'equalTo',
          value: ['foo'],
        },
      ],
    },
  },
  // withApplicationContext
  userId: 'foo-user-id',
  // graphql
  statesQuery: {
    loading: false,
    states: {
      total: 2,
    },
  },
  // injectIntl
  intl: intlMock,
  // connect
  showNotification: jest.fn(),

  ...customProps,
});

describe('rendering', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<CompanyOrdersListConnector {...props} />)
      .find(Query)
      .renderProp('children')({ loading: false })
      .find(Query)
      .renderProp('children')({
      loading: false,
      data: { orders },
    });
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should invoke `children`', () => {
    expect(props.children).toHaveBeenCalled();
  });

  describe('ordersFetcher', () => {
    it('should invoke `children` with `isLoading`', () => {
      expect(props.children).toHaveBeenCalledWith(
        expect.objectContaining({
          ordersFetcher: expect.objectContaining({
            isLoading: false,
          }),
        })
      );
    });

    it('should invoke `children` with `ordersFetcher`', () => {
      expect(props.children).toHaveBeenCalledWith(
        expect.objectContaining({
          ordersFetcher: expect.objectContaining({
            orders,
          }),
        })
      );
    });
  });

  describe('statesFetcher', () => {
    it('should invoke `children` with `isLoading`', () => {
      expect(props.children).toHaveBeenCalledWith(
        expect.objectContaining({
          statesFetcher: expect.objectContaining({
            isLoading: false,
          }),
        })
      );
    });

    it('should invoke `children` with `hasOrderStates`', () => {
      expect(props.children).toHaveBeenCalledWith(
        expect.objectContaining({
          statesFetcher: expect.objectContaining({
            hasOrderStates: props.statesQuery.states.total > 0,
          }),
        })
      );
    });
  });
});

describe('callbacks', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<CompanyOrdersListConnector {...props} />);
  });

  describe('Query', () => {
    describe('when `onError` in invoked', () => {
      describe('with an error indicating an invalid predicate', () => {
        beforeEach(() => {
          const apiError = {
            message: "Syntax error while parsing 'where'",
          };

          wrapper.find(Query).prop('onError')(apiError);
        });

        it('should show a notification informing about an error', () => {
          expect(props.showNotification).toHaveBeenCalledWith(
            expect.objectContaining({
              kind: 'error',
            })
          );
        });
      });
      describe('with any other error', () => {
        const apiError = {
          message: 'Something really odd happened and the server is in flux',
        };
        beforeEach(() => {
          try {
            wrapper.find(Query).prop('onError')(apiError);
          } catch (e) {
            // Try-caching to prevent the error to be thrown up
          }
        });

        it('should not show a notification informing about any error', () => {
          expect(props.showNotification).not.toHaveBeenCalled();
        });
      });
    });
  });
});
