import React from 'react';
import withDereferencedChannel, {
  resourceName,
  fragmentSearchItem,
  fragmentSearchResult,
  searchQuery,
  createGetSearchVariables,
  dereferenceQuery,
  getDereferenceVariables,
  getIdClause,
  getRolesClause,
} from './with-dereferenced-channel';

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
    it('should be channel', () => {
      expect(resourceName).toBe('channel');
    });
  });
  describe('fragmentSearchItem', () => {
    it('should implement channel AST', () => {
      expect(fragmentSearchItem).toMatchSnapshot();
    });
  });
  describe('fragmentSearchResult', () => {
    it('should implement channel results AST', () => {
      expect(fragmentSearchResult).toMatchSnapshot();
    });
  });
  describe('searchQuery', () => {
    it('should implement channels search query AST', () => {
      expect(searchQuery).toMatchSnapshot();
    });
  });
  describe('createGetSearchVariables', () => {
    describe('without `roles`', () => {
      it('should return variables for channels search query without where clause', () => {
        expect(createGetSearchVariables({ roles: [] })()).toEqual({
          limit: 500,
          sort: ['key asc'],
        });
      });
    });

    describe('with `roles`', () => {
      it('should return variables for channels search query with where clause', () => {
        expect(
          createGetSearchVariables({ roles: ['InventorySupply'] })()
        ).toEqual({
          limit: 500,
          sort: ['key asc'],
          where: expect.any(String),
        });
      });
    });
  });
  describe('dereferenceQuery', () => {
    it('should implement channels dereference query AST', () => {
      expect(dereferenceQuery).toMatchSnapshot();
    });
  });
  describe('getDereferenceVariables', () => {
    it('should return variables for channels dereference query', () => {
      expect(getDereferenceVariables('1')).toEqual({
        where: 'id in ("1")',
      });
    });
  });

  describe('withDereferencedChannel', () => {
    beforeEach(() => {
      withDereferencedChannel({ isMulti: true })(InnerComponent);
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

describe('helpers', () => {
  describe('getIdClause', () => {
    describe('when `isMulti`', () => {
      const value = ['foo-id', 'bar-id'];

      it('should return an `id in` where clause', () => {
        expect(getIdClause(value, true)).toEqual(
          expect.stringContaining('id in')
        );
      });

      it('should return an where clause containing ids', () => {
        expect(getIdClause(value, true)).toEqual(
          expect.stringContaining(value[0])
        );

        expect(getIdClause(value, true)).toEqual(
          expect.stringContaining(value[1])
        );
      });
    });

    describe('when not `isMulti`', () => {
      const value = 'foo-id';

      it('should return an `id in` where clause', () => {
        expect(getIdClause(value, false)).toEqual(
          expect.stringContaining('id in')
        );
      });

      it('should return an where clause containing the id', () => {
        expect(getIdClause(value, false)).toEqual(
          expect.stringContaining(value)
        );
      });
    });
  });

  describe('getRolesClause', () => {
    describe('with `roles`', () => {
      const roles = ['InventorySupply'];

      it('should return an `roles contains any` where clause', () => {
        expect(getRolesClause(roles, false)).toEqual(
          expect.stringContaining('roles contains any')
        );
      });

      it('should return an where clause containing the roles', () => {
        expect(getRolesClause(roles, false)).toEqual(
          expect.stringContaining(roles[0])
        );
      });
    });
  });
});
