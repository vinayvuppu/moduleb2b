import createQueryVariables, {
  getIndexOffset,
} from './order-create-owner-pick-connector-query-variables';

const createSearchOptions = custom => ({
  searchText: 'customers',
  filters: {},
  sorting: {
    key: 'createdAt',
    order: 'asc',
  },
  language: 'en',
  page: 1,
  perPage: 10,
  ...custom,
});

describe('createQueryVariables', () => {
  let searchOptions;
  let locale;
  let companyId;

  beforeEach(() => {
    searchOptions = createSearchOptions();
    locale = 'de';
    companyId = 'company-id-1';
  });

  it('should receive `limit` from `props.perPage`', () => {
    expect(
      createQueryVariables(searchOptions, {
        locale,
        companyId,
      })
    ).toHaveProperty('limit', searchOptions.perPage);
  });
  it('should receive `offset` from `(props.page - 1) * props.perPage`', () => {
    expect(
      createQueryVariables(searchOptions, {
        locale,
        companyId,
      })
    ).toHaveProperty(
      'offset',
      (searchOptions.page - 1) * searchOptions.perPage
    );
  });

  it('should receive `sort` property', () => {
    expect(
      createQueryVariables(searchOptions, {
        locale,
        companyId,
      })
    ).toHaveProperty('sort', ['createdAt asc']);
  });
  describe('should query for name matching `searchQuery`', () => {
    beforeEach(() => {
      searchOptions = createSearchOptions({
        searchText: 'search text',
      });
    });
    it('should receive `searchQuery` as provided `searchText`', () => {
      expect(
        createQueryVariables(searchOptions, {
          locale,
          companyId,
        })
      ).toHaveProperty(
        'where',
        `(lowercaseEmail = "${searchOptions.searchText}" or customerNumber = "${searchOptions.searchText}" or companyName = "${searchOptions.searchText}") and customerGroup(id = "${companyId}")`
      );
    });
  });
});

describe('getIndexOffset', () => {
  let page;
  let perPage;
  beforeEach(() => {
    page = 2;
    perPage = 50;
  });
  it('should calculate offset as `((page - 1) * perPage`', () => {
    expect(getIndexOffset(page, perPage)).toBe((page - 1) * perPage);
  });
});
