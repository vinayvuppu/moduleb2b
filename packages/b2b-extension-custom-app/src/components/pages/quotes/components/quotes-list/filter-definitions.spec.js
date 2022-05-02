import { intlMock } from '@commercetools-local/test-utils';
import createFilterDefinitions from './filter-definitions';

describe('createFilterDefinitions', () => {
  let filters;
  describe('when no filters to exclude', () => {
    beforeEach(() => {
      filters = createFilterDefinitions(intlMock, []);
    });

    it('companyId filter should exist', () => {
      expect(filters).toEqual(
        expect.objectContaining({ companyId: expect.any(Object) })
      );
    });
    it('quoteState filter should exist', () => {
      expect(filters).toEqual(
        expect.objectContaining({ quoteState: expect.any(Object) })
      );
    });
  });

  describe('when columns to exclude', () => {
    beforeEach(() => {
      filters = createFilterDefinitions(intlMock, ['companyId']);
    });

    it('companyId filter should not exist', () => {
      expect(filters).not.toEqual(
        expect.objectContaining({ companyId: expect.any(Object) })
      );
    });
    it('quoteState filter should exist', () => {
      expect(filters).toEqual(
        expect.objectContaining({ quoteState: expect.any(Object) })
      );
    });
  });
});
