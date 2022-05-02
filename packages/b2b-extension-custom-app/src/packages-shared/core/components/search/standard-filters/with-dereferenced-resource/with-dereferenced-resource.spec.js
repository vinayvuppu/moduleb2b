import React from 'react';
import { shallow } from 'enzyme';
import gql from 'graphql-tag';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import { intlMock } from '../../../../../test-utils';
import { createDereferencedResource } from './with-dereferenced-resource';

const createProps = custom => ({
  language: 'en',
  intl: intlMock,
  client: {
    query: jest.fn(),
    readFragment: jest.fn(),
  },
  ...custom,
});

const createDereferencerTestOptions = custom => ({
  resourceName: 'foo',
  fetchPolicy: 'cache-only',
  fragmentSearchItem: gql`
    fragment Foo on Foo {
      bar
    }
  `,
  fragmentSearchResult: gql`
    fragment FooBar on FooBar {
      bar
    }
  `,
  searchQuery: gql`
    {
      foo {
        ... on FooBar {
          bar
        }
      }
    }
  `,
  getSearchVariables: () => ({ foo: 'bar' }),
  dereferenceQuery: gql`
    {
      foo {
        ... on Foo {
          bar
        }
      }
    }
  `,
  getDereferenceVariables: () => ({ foo: 'bar' }),
  ...custom,
});

const InnerComponent = () => <div />;
InnerComponent.displayName = 'InnerComponent';

describe('createDereferencedResource', () => {
  let wrapper;
  let props;
  let options;
  let Component;
  beforeEach(() => {
    props = createProps();
    options = createDereferencerTestOptions({});
    Component = createDereferencedResource(InnerComponent, options);
    wrapper = shallow(<Component {...props} />);
  });
  describe('rendering', () => {
    it('should render the component passed to the HOC', () => {
      expect(wrapper).toRender('InnerComponent');
    });
    it('should set proper displayName on the wrapper component', () => {
      expect(Component.displayName).toBe(
        'FooDereferencedResource(InnerComponent)'
      );
    });
    it('should pass props to component', () => {
      expect(wrapper.props()).toEqual(
        expect.objectContaining({
          ...props,
          loadItems: wrapper.instance().searchItems,
          readItemFromCache: wrapper.instance().readItemFromCache,
        })
      );
    });
  });
  describe('interaction', () => {
    describe('searchItems', () => {
      const results = [{ id: '1' }, { id: '2' }];
      beforeEach(() => {
        props = createProps({
          value: '',
          client: {
            readFragment: jest.fn(() => ({
              id: '1',
              name: 'foo',
            })),
            query: jest.fn(() =>
              Promise.resolve({
                data: {
                  items: {
                    results,
                  },
                },
              })
            ),
          },
        });
        wrapper = shallow(<Component {...props} />);
      });
      it('should return a list of channels', () =>
        wrapper
          .instance()
          .searchItems('asd')
          .then(actual => {
            expect(actual).toEqual(results);
          }));

      describe('when searching', () => {
        beforeEach(() => {
          wrapper.instance().searchItems('asd');
        });
        it('should be called with query and variables', () => {
          expect(props.client.query).toHaveBeenCalledWith({
            query: expect.any(Object),
            variables: {
              target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
              locale: 'en',
              foo: 'bar',
            },
            fetchPolicy: 'cache-only',
          });
        });
      });
    });
    describe('when reading a resource from the cache', () => {
      const results = [{ id: '1' }, { id: '2' }];
      beforeEach(() => {
        props = createProps({
          value: '',
          client: {
            readFragment: jest.fn(() => ({
              id: '1',
              name: 'foo',
            })),
            query: jest.fn(() =>
              Promise.resolve({
                data: {
                  items: {
                    results,
                  },
                },
              })
            ),
          },
        });
        wrapper = shallow(<Component {...props} />);
        wrapper.instance().readItemFromCache('123');
      });
      it('should call readFragment with correct arguments', () => {
        expect(props.client.readFragment).toHaveBeenCalledWith({
          fragment: options.fragmentSearchItem,
          id: '123',
          variables: {
            target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
            locale: 'en',
          },
        });
      });
      describe('when cache does not contain the data', () => {
        beforeEach(() => {
          props = createProps({
            value: '',
            client: {
              readFragment: jest.fn(() => null),
              query: jest.fn(() =>
                Promise.resolve({
                  data: {
                    items: {
                      results,
                    },
                  },
                })
              ),
            },
          });
          wrapper = shallow(<Component {...props} />);
        });

        it('should return false when readFragments throws an error', () => {
          expect(wrapper.instance().readItemFromCache('123')).toBe(null);
        });
      });
    });
  });
});
