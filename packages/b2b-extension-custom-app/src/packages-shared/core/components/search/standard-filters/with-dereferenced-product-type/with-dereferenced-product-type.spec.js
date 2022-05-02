import React from 'react';
import withDereferencedProductType, {
  resourceName,
  fragmentSearchItem,
  fragmentSearchResult,
  searchQuery,
  dereferenceQuery,
  getDereferenceVariables,
} from './with-dereferenced-product-type';

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
    it('should be product type', () => {
      expect(resourceName).toBe('productTypes');
    });
  });
  describe('fragmentSearchItem', () => {
    it('should implement product type AST', () => {
      expect(fragmentSearchItem).toMatchSnapshot();
    });
  });
  describe('fragmentSearchResult', () => {
    it('should implement product type results AST', () => {
      expect(fragmentSearchResult).toMatchSnapshot();
    });
  });
  describe('searchQuery', () => {
    it('should implement product types search query AST', () => {
      expect(searchQuery).toMatchSnapshot();
    });
  });
  describe('dereferenceQuery', () => {
    it('should implement product types dereference query AST', () => {
      expect(dereferenceQuery).toMatchSnapshot();
    });
  });
  describe('getDereferenceVariables', () => {
    it('should return variables for product types dereference query', () => {
      expect(getDereferenceVariables('1')).toEqual('id in ("1")');
    });
  });

  describe('withDereferencedProductType', () => {
    beforeEach(() => {
      withDereferencedProductType({ isMulti: true })(InnerComponent);
    });

    it('should invoke dereferenced resource with `resourceName`', () => {
      expect(mockWithDereferencedResource).toHaveBeenCalledWith(
        expect.objectContaining({
          resourceName,
        })
      );
    });

    it('should invoke dereferenced resource with `fragmentSearchItem`', () => {
      expect(mockWithDereferencedResource).toHaveBeenCalledWith(
        expect.objectContaining({
          fragmentSearchItem,
        })
      );
    });

    it('should invoke dereferenced resource with `fragmentSearchResult`', () => {
      expect(mockWithDereferencedResource).toHaveBeenCalledWith(
        expect.objectContaining({
          fragmentSearchResult,
        })
      );
    });

    it('should invoke dereferenced resource with `searchQuery`', () => {
      expect(mockWithDereferencedResource).toHaveBeenCalledWith(
        expect.objectContaining({
          searchQuery,
        })
      );
    });

    it('should invoke dereferenced resource with `getSearchVariables`', () => {
      expect(mockWithDereferencedResource).toHaveBeenCalledWith(
        expect.objectContaining({
          getSearchVariables: expect.any(Function),
        })
      );
    });

    it('should invoke dereferenced resource with `dereferenceQuery`', () => {
      expect(mockWithDereferencedResource).toHaveBeenCalledWith(
        expect.objectContaining({
          dereferenceQuery,
        })
      );
    });

    it('should invoke dereferenced resource with `getDereferenceVariables`', () => {
      expect(mockWithDereferencedResource).toHaveBeenCalledWith(
        expect.objectContaining({
          getDereferenceVariables,
        })
      );
    });

    it('should invoke dereferenced resource with `isMulti`', () => {
      expect(mockWithDereferencedResource).toHaveBeenCalledWith(
        expect.objectContaining({
          isMulti: true,
        })
      );
    });
  });
});
