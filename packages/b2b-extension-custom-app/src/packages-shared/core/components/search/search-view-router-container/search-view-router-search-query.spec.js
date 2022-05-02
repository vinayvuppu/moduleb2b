import React from 'react';
import { shallow } from 'enzyme';
import { reportErrorToSentry } from '@commercetools-frontend/sentry';
import EnhancedSearchViewRouterSearchQuery, {
  SearchViewRouterSearchQuery,
  withSearchViewRouterSearchQuery,
} from './search-view-router-search-query';
import { VERSION_KEY, omitVersion, encode } from './utils';

jest.mock('@commercetools-frontend/sentry');

const TestComponent = props => <div {...props}>TestComponent</div>;
TestComponent.displayName = 'TestComponent';

const version = 1;
const searchQuery = { foo: 'bar', [VERSION_KEY]: version };
const createTestProps = props => ({
  children: jest.fn(() => <TestComponent />),
  initialSearchQuery: { foo: 'initial-search-query' },
  version,

  // withRouter
  location: {
    search: 'foo-search',
    pathname: 'foo-pathname',
    query: {
      query: encode(searchQuery),
    },
  },
  history: {
    replace: jest.fn(),
    createHref: jest.fn(),
  },

  ...props,
});

describe('rendering', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<SearchViewRouterSearchQuery {...props} />);
  });

  it('should invoke `children`', () => {
    expect(props.children).toHaveBeenCalled();
  });

  describe('`searchQuery`', () => {
    it('should pass `searchQuery` in `searchQuery`', () => {
      expect(props.children).toHaveBeenCalledWith(
        expect.objectContaining({
          searchQuery: omitVersion(searchQuery),
        })
      );
    });

    it('should pass `setSearchQuery` in `searchQuery`', () => {
      expect(props.children).toHaveBeenCalledWith(
        expect.objectContaining({
          setSearchQuery: wrapper.instance().setSearchQuery,
        })
      );
    });

    it('should pass `getSearchQuery` in `searchQuery`', () => {
      expect(props.children).toHaveBeenCalledWith(
        expect.objectContaining({
          getSearchQuery: wrapper.instance().getSearchQuery,
        })
      );
    });
  });

  describe('interacting', () => {
    beforeEach(() => {
      window.localStorage.setItem.mockClear();
      window.localStorage.getItem.mockClear();
      window.localStorage.removeItem.mockClear();
    });
    describe('`getSearchQuery`', () => {
      describe('without `location.search`', () => {
        beforeEach(() => {
          wrapper = shallow(
            <SearchViewRouterSearchQuery
              {...createTestProps({
                query: { query: {} },
              })}
            />
          );
        });

        it('should match snapshot', () => {
          expect(wrapper.instance().getSearchQuery()).toMatchSnapshot();
        });
      });

      describe('with `location.query`', () => {
        beforeEach(() => {
          wrapper = shallow(
            <SearchViewRouterSearchQuery {...createTestProps({})} />
          );
        });

        describe('when `query` contains valid JSON', () => {
          let result;
          beforeEach(() => {
            result = wrapper.instance().getSearchQuery();
          });

          it('should match snapshot', () => {
            expect(wrapper.instance().getSearchQuery()).toMatchSnapshot();
          });

          it('should return the `searchQuery` from the `query`', () => {
            expect(result).toEqual({ foo: 'bar' });
          });

          describe('when not all properties are within `result`', () => {
            beforeEach(() => {
              wrapper = shallow(
                <SearchViewRouterSearchQuery
                  {...createTestProps({
                    initialSearchQuery: { bar: 'bar' },
                  })}
                />
              );

              result = wrapper.instance().getSearchQuery();
            });

            it('should default those with `initialSearchQuery`', () => {
              expect(result).toHaveProperty('foo');
              expect(result).toHaveProperty('bar');
            });
          });
        });

        describe('when `query` contains invalid JSON', () => {
          let result;
          beforeEach(() => {
            wrapper = shallow(
              <SearchViewRouterSearchQuery
                {...createTestProps({
                  location: {
                    query: {
                      query: 'asd222--##',
                    },
                  },
                })}
              />
            );

            result = wrapper.instance().getSearchQuery();
          });

          it('should match snapshot', () => {
            expect(wrapper.instance().getSearchQuery()).toMatchSnapshot();
          });

          it('should return the `initialSearchQuery` as the `searchQuery`', () => {
            expect(result).toEqual(props.initialSearchQuery);
          });

          it('should invoke `reportErrorToSentry`', () => {
            expect(reportErrorToSentry).toHaveBeenCalled();
          });
        });
      });

      describe('when `query` does not match version', () => {
        let result;
        beforeEach(() => {
          wrapper = shallow(
            <SearchViewRouterSearchQuery
              {...createTestProps({
                version: 3,
                location: {
                  query: {
                    version: 1,
                    query: 'asd222--##',
                  },
                },
              })}
            />
          );

          result = wrapper.instance().getSearchQuery();
        });

        it('should match snapshot', () => {
          expect(result).toMatchSnapshot();
        });

        it('should default those with `initialSearchQuery`', () => {
          expect(result).toEqual(props.initialSearchQuery);
        });
      });
    });

    describe('`setSearchQuery`', () => {
      describe('with `storageSlice`', () => {
        beforeEach(() => {
          props = createTestProps({
            storageSlice: 'foo-slice',
          });
          wrapper = shallow(<SearchViewRouterSearchQuery {...props} />);

          wrapper.instance().setSearchQuery(searchQuery);
        });

        it('should invoke `put` on `storage`', () => {
          expect(window.localStorage.setItem).toHaveBeenCalled();
        });
      });

      describe('without `storageSlice`', () => {
        beforeEach(() => {
          props = createTestProps({});
          wrapper = shallow(<SearchViewRouterSearchQuery {...props} />);
          wrapper.instance().setSearchQuery(searchQuery);
        });

        it('should not invoke `put` on `storage`', () => {
          expect(window.localStorage.setItem).not.toHaveBeenCalled();
        });

        it('should `replace` on `history`', () => {
          expect(props.history.replace).toHaveBeenCalled();
        });

        it('should `createHref` on `history`', () => {
          expect(props.history.createHref).toHaveBeenCalled();
        });
      });
    });
  });
});

describe('withSearchViewRouterSearchQuery', () => {
  const createArgs = custom => ({
    version: 3,
    storageSlice: jest.fn(() => 'testStorageSlice'),
    ...custom,
  });
  const createApi = props => ({
    searchQuery,
    setSearchQuery: jest.fn(),
    getSearchQuery: jest.fn(),

    ...props,
  });

  describe('without `propName`', () => {
    let wrapper;
    let args;
    let EnhancedComponent;

    beforeEach(() => {
      args = createArgs();
      EnhancedComponent = withSearchViewRouterSearchQuery(args)(TestComponent);
      wrapper = shallow(<EnhancedComponent />);
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should invoke `storageSlice`', () => {
      expect(args.storageSlice).toHaveBeenCalled();
    });

    describe('<SearchViewRouterSearchQuery>', () => {
      let enhancedComponentWrapper;
      let apiMock;

      beforeEach(() => {
        apiMock = createApi();

        enhancedComponentWrapper = wrapper
          .find(EnhancedSearchViewRouterSearchQuery)
          .renderProp('children')(apiMock);
      });

      it('should pass a the `value` of the `searchQuery` prop to the enhanced component', () => {
        expect(enhancedComponentWrapper.prop('searchQuery').value).toEqual(
          searchQuery
        );
      });

      it('should pass a the `get` for the `searchQuery` prop to the enhanced component', () => {
        expect(enhancedComponentWrapper.prop('searchQuery').get).toEqual(
          apiMock.getSearchQuery
        );
      });

      it('should pass a the `set` for the `searchQuery` prop to the enhanced component', () => {
        expect(enhancedComponentWrapper.prop('searchQuery').set).toEqual(
          apiMock.setSearchQuery
        );
      });

      it('should pass a the `version` for the `searchQuery` to the <SearchViewRouterSearchQuery>', () => {
        expect(
          wrapper.find(EnhancedSearchViewRouterSearchQuery).prop('version')
        ).toEqual(args.version);
      });
    });
  });

  describe('with `propName`', () => {
    let wrapper;
    let args;
    let EnhancedComponent;

    beforeEach(() => {
      args = createArgs({
        propName: 'anotherSearchQuery',
        version: 2,
      });
      EnhancedComponent = withSearchViewRouterSearchQuery(args)(TestComponent);
      wrapper = shallow(<EnhancedComponent />);
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should invoke `storageSlice`', () => {
      expect(args.storageSlice).toHaveBeenCalled();
    });

    describe('<SearchViewRouterSearchQuery>', () => {
      let enhancedComponentWrapper;
      let apiMock;

      beforeEach(() => {
        apiMock = createApi();

        enhancedComponentWrapper = wrapper
          .find(EnhancedSearchViewRouterSearchQuery)
          .renderProp('children')(apiMock);
      });

      it('should pass a the `value` of the `searchQuery` prop to the enhanced component', () => {
        expect(
          enhancedComponentWrapper.prop('anotherSearchQuery').value
        ).toEqual(searchQuery);
      });

      it('should pass a the `get` for the `searchQuery` prop to the enhanced component', () => {
        expect(enhancedComponentWrapper.prop('anotherSearchQuery').get).toEqual(
          apiMock.getSearchQuery
        );
      });

      it('should pass a the `set` for the `searchQuery` prop to the enhanced component', () => {
        expect(enhancedComponentWrapper.prop('anotherSearchQuery').set).toEqual(
          apiMock.setSearchQuery
        );
      });

      it('should pass a the `version` for the `searchQuery` to the <SearchViewRouterSearchQuery>', () => {
        expect(
          wrapper.find(EnhancedSearchViewRouterSearchQuery).prop('version')
        ).toEqual(args.version);
      });
    });
  });
});
