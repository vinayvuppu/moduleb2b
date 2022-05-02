import React from 'react';
import withDereferencedCategory, {
  resourceName,
  fragmentSearchItem,
  fragmentSearchResult,
  searchQuery,
  getSearchVariables,
  dereferenceQuery,
  getDereferenceVariables,
} from './with-dereferenced-category';

const InnerComponent = () => <div />;
InnerComponent.displayName = 'InnerComponent';

const mockWithDereferencedResource = jest.fn(
  (/* options */) => (/* Component */) => InnerComponent
);
jest.mock('../with-dereferenced-resource', () => (...args) =>
  mockWithDereferencedResource(...args)
);

describe('named exports', () => {
  describe('resourceName', () => {
    it('should be category', () => {
      expect(resourceName).toBe('category');
    });
  });
  describe('fragmentSearchItem', () => {
    it('should implement category AST', () => {
      expect(fragmentSearchItem).toMatchSnapshot();
    });
  });
  describe('fragmentSearchResult', () => {
    it('should implement category results AST', () => {
      expect(fragmentSearchResult).toMatchSnapshot();
    });
  });
  describe('searchQuery', () => {
    it('should implement categories search query AST', () => {
      expect(searchQuery).toMatchSnapshot();
    });
  });
  describe('getSearchVariables', () => {
    it('should return variables for categories search query', () => {
      expect(getSearchVariables('foo', 'en')).toEqual({
        searchText: {
          locale: 'en',
          text: 'foo',
        },
      });
    });
  });
  describe('dereferenceQuery', () => {
    it('should implement categories dereference query AST', () => {
      expect(dereferenceQuery).toMatchSnapshot();
    });
  });
  describe('getDereferenceVariables', () => {
    it('should return variables for categories dereference query', () => {
      expect(getDereferenceVariables('1')).toEqual({
        filters: ['id: "1"'],
      });
    });
  });

  describe('withDereferencedCategory', () => {
    beforeEach(() => {
      withDereferencedCategory({ isMulti: true })(InnerComponent);
    });
    it('should pass correct functions to inner HOC', () => {
      expect(mockWithDereferencedResource).toHaveBeenCalledWith({
        resourceName,
        fragmentSearchItem,
        fragmentSearchResult,
        searchQuery,
        getSearchVariables,
        dereferenceQuery,
        getDereferenceVariables,
        isMulti: true,
      });
    });
  });
});
