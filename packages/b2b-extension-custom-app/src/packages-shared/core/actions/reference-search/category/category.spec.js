import { searchCategories, getCategoryById } from './category';

const createCategoriesResponse = () => [
  { id: 'cat_01', nameAllLocales: [{ locale: 'en', value: 'something_01' }] },
  { id: 'cat_02', nameAllLocales: [{ locale: 'en', value: 'something_02' }] },
  { id: 'cat_03', nameAllLocales: [{ locale: 'en', value: 'something_03' }] },
];

describe('searchCategories', () => {
  let response;
  let apolloClient;
  let result;
  beforeEach(async () => {
    response = {
      data: { categories: { results: createCategoriesResponse() } },
    };
    apolloClient = { query: jest.fn(() => Promise.resolve(response)) };
    result = searchCategories(apolloClient, {
      searchText: 'something',
      language: 'en',
    });
    await result;
  });
  it('should fetch categories', async () => {
    await expect(result).resolves.toEqual([
      {
        id: 'cat_01',
        name: { en: 'something_01' },
        slug: null,
      },
      {
        id: 'cat_02',
        name: { en: 'something_02' },
        slug: null,
      },
      {
        id: 'cat_03',
        name: { en: 'something_03' },
        slug: null,
      },
    ]);
  });
});

describe('getCategoryById', () => {
  let category;
  let apolloClient;
  let result;
  beforeEach(async () => {
    category = {
      id: 'cat_01',
      nameAllLocales: [{ locale: 'en', value: 'something_01' }],
    };
    const response = { data: { category } };
    apolloClient = { query: jest.fn(() => Promise.resolve(response)) };
    result = getCategoryById(apolloClient, { categoryId: 'cat_01' });
    await result;
  });
  it('should return category', async () => {
    await expect(result).resolves.toEqual({
      id: 'cat_01',
      name: { en: 'something_01' },
      slug: null,
    });
  });
});
