import React from 'react';
import withDereferencedCustomerGroup, {
  resourceName,
  fragmentSearchItem,
  fragmentSearchResult,
  searchQuery,
  getSearchVariables,
  dereferenceQuery,
  getDereferenceVariables,
} from './with-dereferenced-customer-group';

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
    it('should be customer group', () => {
      expect(resourceName).toBe('customer-group');
    });
  });
  describe('fragmentSearchItem', () => {
    it('should implement customer group AST', () => {
      expect(fragmentSearchItem).toMatchSnapshot();
    });
  });
  describe('fragmentSearchResult', () => {
    it('should implement customer group results AST', () => {
      expect(fragmentSearchResult).toMatchSnapshot();
    });
  });
  describe('searchQuery', () => {
    it('should implement customer groups search query AST', () => {
      expect(searchQuery).toMatchSnapshot();
    });
  });
  describe('getSearchVariables', () => {
    it('should return variables for customer groups search query', () => {
      expect(getSearchVariables()).toEqual({
        limit: 500,
        sort: ['key asc'],
      });
    });
  });
  describe('dereferenceQuery', () => {
    it('should implement customer groups dereference query AST', () => {
      expect(dereferenceQuery).toMatchSnapshot();
    });
  });
  describe('getDereferenceVariables', () => {
    it('should return variables for customer groups dereference query', () => {
      expect(getDereferenceVariables('1')).toEqual({
        where: 'id in ("1")',
      });
    });
  });

  describe('withDereferencedCustomerGroup', () => {
    beforeEach(() => {
      withDereferencedCustomerGroup({ isMulti: true })(InnerComponent);
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
