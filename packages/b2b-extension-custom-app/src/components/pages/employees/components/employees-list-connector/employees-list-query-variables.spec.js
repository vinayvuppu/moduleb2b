import createQueryVariables from './employees-list-query-variables';

const createFilters = custom => ({
  lastName: [
    {
      type: 'equalTo',
      value: 'Test',
    },
  ],
  ...custom,
});

const createSearchOptions = custom => ({
  searchText: 'discounts',
  filters: createFilters(),
  sorting: {
    key: 'code',
    order: 'asc',
  },
  language: 'de',
  page: 1,
  perPage: 10,
  ...custom,
});

describe('createQueryVariables', () => {
  let searchOptions;

  describe('with defined searchText', () => {
    beforeEach(() => {
      searchOptions = createSearchOptions();
    });

    it('should return the correct where query based on the props', () => {
      expect(
        createQueryVariables(searchOptions, {
          projectKey: 'foo-key',
          hasGeneralPermissions: true,
          storeKeys: [],
          locale: 'de',
        })
      ).toMatchSnapshot();
    });
  });

  describe('without a searchText defined', () => {
    beforeEach(() => {
      searchOptions = createSearchOptions({ searchText: undefined });
    });

    it('should search using for items with ids defined', () => {
      expect(
        createQueryVariables(searchOptions, { projectKey: 'foo-key' }).where
      ).toEqual('lastName = "Test"');
    });
  });

  describe('with defined sorting', () => {
    beforeEach(() => {
      searchOptions = createSearchOptions();
    });

    it('should return the correct sort order based on the props', () => {
      expect(
        createQueryVariables(searchOptions, {
          projectKey: 'foo-key',
          hasGeneralPermissions: true,
          storeKeys: [],
          locale: 'de',
        })
      ).toMatchSnapshot();
    });
  });

  describe('without a sorting defined', () => {
    beforeEach(() => {
      searchOptions = createSearchOptions({ sorting: undefined });
    });

    it('should sort items according to the `createdAt` attribute', () => {
      const EXPECTED = ['createdAt desc'];
      expect(
        createQueryVariables(searchOptions, { projectKey: 'foo-key' }).sort
      ).toEqual(EXPECTED);
    });
  });
});
