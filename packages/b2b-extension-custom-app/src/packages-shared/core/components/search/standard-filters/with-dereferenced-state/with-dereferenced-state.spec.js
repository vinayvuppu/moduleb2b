import React from 'react';
import withDereferencedState, {
  resourceName,
  fragmentSearchItem,
  fragmentSearchResult,
  searchQuery,
  getSearchVariables,
  dereferenceQuery,
  getDereferenceVariables,
} from './with-dereferenced-state';

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
    it('should be state', () => {
      expect(resourceName).toBe('state');
    });
  });
  describe('fragmentSearchItem', () => {
    it('should implement state AST', () => {
      expect(fragmentSearchItem).toMatchSnapshot();
    });
  });
  describe('fragmentSearchResult', () => {
    it('should implement state results AST', () => {
      expect(fragmentSearchResult).toMatchSnapshot();
    });
  });
  describe('searchQuery', () => {
    it('should implement states search query AST', () => {
      expect(searchQuery).toMatchSnapshot();
    });
  });
  describe('getSearchVariables', () => {
    it('should return variables for states search query', () => {
      expect(getSearchVariables(null, null, 'OrderState')).toEqual({
        limit: 500,
        sort: ['key asc'],
        where: 'type in ("OrderState")',
      });
    });
  });
  describe('dereferenceQuery', () => {
    it('should implement states dereference query AST', () => {
      expect(dereferenceQuery).toMatchSnapshot();
    });
  });
  describe('getDereferenceVariables', () => {
    it('should return variables for states dereference query', () => {
      expect(getDereferenceVariables('1', false, 'OrderState')).toEqual({
        where: 'id in ("1") and type in ("OrderState")',
      });
    });
  });

  describe('withDereferencedState', () => {
    beforeEach(() => {
      withDereferencedState({ isMulti: true })(InnerComponent);
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
