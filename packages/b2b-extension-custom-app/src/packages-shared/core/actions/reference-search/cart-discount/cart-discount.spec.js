import { searchCartDiscounts, getCartDiscountById } from './cart-discount';

const createCartDiscountsResponse = () => [
  {
    id: 'cd_01',
    nameAllLocales: [
      {
        locale: 'en',
        value: 'something_01',
      },
    ],
    key: 'something-01',
  },
  {
    id: 'cd_02',
    nameAllLocales: [
      {
        locale: 'en',
        value: 'something_02',
      },
    ],
  },
  {
    id: 'cd_03',
    nameAllLocales: [
      {
        locale: 'en',
        value: 'something_03',
      },
    ],
  },
];

describe('searchCartDiscounts', () => {
  let response;
  let apolloClient;
  let result;
  beforeEach(async () => {
    response = {
      data: {
        cartDiscounts: {
          results: createCartDiscountsResponse(),
        },
      },
    };
    apolloClient = {
      query: jest.fn(() => Promise.resolve(response)),
    };
    result = searchCartDiscounts(apolloClient, {
      searchText: 'something',
      language: 'en',
    });
    await result;
  });
  it('should fetch cartDiscounts', async () => {
    await expect(result).resolves.toEqual([
      {
        id: 'cd_01',
        name: {
          en: 'something_01',
        },
        key: 'something-01',
      },
      {
        id: 'cd_02',
        name: {
          en: 'something_02',
        },
      },
      {
        id: 'cd_03',
        name: {
          en: 'something_03',
        },
      },
    ]);
  });
});

describe('getCartDiscountById', () => {
  let cartDiscount;
  let apolloClient;
  let result;
  beforeEach(async () => {
    cartDiscount = {
      id: 'cd_01',
      nameAllLocales: [
        {
          locale: 'en',
          value: 'something_01',
        },
      ],
    };
    const response = {
      data: {
        cartDiscount,
      },
    };
    apolloClient = {
      query: jest.fn(() => Promise.resolve(response)),
    };
    result = getCartDiscountById(apolloClient, {
      cartDiscountId: 'cd_01',
    });
    await result;
  });
  it('should return cartDiscount', async () => {
    await expect(result).resolves.toEqual({
      id: 'cd_01',
      name: {
        en: 'something_01',
      },
    });
  });
});
