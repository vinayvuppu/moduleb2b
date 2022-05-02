import { getAncestors, getCategoryLevel, getPathName } from './categories';

const createTestCategory = props => ({
  id: 'fc735952-21eb-4db6-b76c-b83b72b84345',
  version: 1,
  name: { en: 'Nüsse & Kerne', de: 'Nüsse & Kerne' },
  slug: { en: 'nuesse-kerne', de: 'nuesse-kerne' },
  ancestors: [
    {
      typeId: 'category',
      id: 'da5b66e6-7423-4d89-b57a-3de48f6bf4d3',
      obj: {
        id: 'da5b66e6-7423-4d89-b57a-3de48f6bf4d3',
        version: 1,
        name: { en: 'Obst & Gemüse', de: 'Obst & Gemüse' },
        slug: { en: 'obst-gemuese', de: 'obst-gemuese' },
        ancestors: [],
        orderHint: '0.1',
        createdAt: '2016-05-11T15:38:02.023Z',
        lastModifiedAt: '2016-05-11T15:38:02.023Z',
        externalId: '100',
        lastMessageSequenceNumber: 1,
      },
    },
    {
      typeId: 'category',
      id: '6a769249-bb21-4361-8c71-5ab6d8acd799',
      obj: {
        id: '6a769249-bb21-4361-8c71-5ab6d8acd799',
        version: 1,
        name: {
          en: 'Trockenfrüchte, Nüsse & Kerne',
          de: 'Trockenfrüchte, Nüsse & Kerne',
        },
        slug: {
          en: 'trockenfruechte-nuesse-kerne',
          de: 'trockenfruechte-nuesse-kerne',
        },
        ancestors: [
          {
            typeId: 'category',
            id: 'da5b66e6-7423-4d89-b57a-3de48f6bf4d3',
          },
        ],
        parent: {
          typeId: 'category',
          id: 'da5b66e6-7423-4d89-b57a-3de48f6bf4d3',
        },
        orderHint: '0.1',
        createdAt: '2016-05-11T15:38:03.477Z',
        lastModifiedAt: '2016-05-11T15:38:03.477Z',
        externalId: '101',
        lastMessageSequenceNumber: 1,
      },
    },
  ],
  parent: {
    typeId: 'category',
    id: '6a769249-bb21-4361-8c71-5ab6d8acd799',
  },
  ...props,
});

describe('getPathName', () => {
  const category = {
    id: 'example-cat-1',
    obj: {
      id: 'example-cat-1',
      name: { en: 'example-cat-name-1' },
      ancestors: [
        {
          id: 'example-ancestor-2',
          obj: {
            name: { de: 'example-ancestor-name-de' },
          },
        },
        {
          id: 'example-ancestor-1',
          obj: {
            name: { en: 'example-ancestor-name-1' },
          },
        },
      ],
    },
  };

  it('should show complete path name', () => {
    const expected =
      'example-ancestor-name-de (DE) > example-ancestor-name-1 > example-cat-name-1';
    const actual = getPathName(category, 'en', ['de', 'fr']);
    expect(actual).toBe(expected);
  });
});

describe('getAncestors', () => {
  const category = createTestCategory();

  it('should render actual ancestor', () => {
    const actualAncestors = getAncestors(category);
    expect(actualAncestors).toEqual(category.ancestors);
  });

  it('should render last ancestor', () => {
    const actualParent = getAncestors(category, 1);
    expect(actualParent).toEqual([
      category.ancestors[category.ancestors.length - 1],
    ]);
  });

  it('should render ancestors of cate', () => {
    const actualAncestorsExceededLimit = getAncestors(category, 5000);
    expect(actualAncestorsExceededLimit).toEqual(category.ancestors);
  });
});

describe('getCategoryLevel', () => {
  const category = createTestCategory();

  it('should return correct level', () => {
    expect(getCategoryLevel(category)).toBe(3);
  });
});
