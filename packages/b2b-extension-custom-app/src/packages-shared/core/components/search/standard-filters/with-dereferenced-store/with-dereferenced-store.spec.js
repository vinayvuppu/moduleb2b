import React from 'react';
import {
  resourceName,
  createGetSearchVariables,
  getDereferenceVariables,
} from './with-dereferenced-store';

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
    it('should be store', () => {
      expect(resourceName).toBe('store');
    });
  });
  describe('createGetSearchVariables', () => {
    it('should return variables for stores search query', () => {
      expect(createGetSearchVariables()()).toEqual({
        limit: 500,
        sort: ['key asc'],
      });
    });
  });
  describe('getDereferenceVariables', () => {
    it('should return variables for stores dereference query', () => {
      expect(getDereferenceVariables('1')).toEqual({
        where: 'key in ("1")',
      });
    });
  });
});
