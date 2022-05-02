import { getAvailableCountries, getMatchingPrices } from './country-selection';

const createPrice = custom => ({
  value: {
    currencyCode: 'EUR',
  },
  customerGroup: {
    id: 'group-id-a',
  },
  ...custom,
});

// value, currency code, customerGroup

describe('getAvailableCountries', () => {
  describe('when prices with duplicate countries', () => {
    it('should return array with unique countries', () => {
      expect(
        getAvailableCountries([
          createPrice({
            country: 'de',
          }),
          createPrice({
            country: 'es',
          }),
          createPrice({
            country: 'de',
          }),
        ])
      ).toEqual(['de', 'es']);
    });
  });

  describe('when prices with two different countries', () => {
    it('should return array with two countries', () => {
      expect(
        getAvailableCountries([
          createPrice({
            country: 'de',
          }),
          createPrice({
            country: 'es',
          }),
        ])
      ).toEqual(['de', 'es']);
    });
  });
});

describe('getAvailablePrices', () => {
  describe('when prices without customerGroup', () => {
    it('should return array containg the price', () => {
      expect(
        getMatchingPrices(
          [
            createPrice({
              customerGroup: null,
            }),
          ],
          'EUR',
          'group-id-b'
        )
      ).toEqual([
        {
          value: {
            currencyCode: 'EUR',
          },
          customerGroup: null,
        },
      ]);
    });
  });
  describe('when price matches customerGroup', () => {
    it('should return array containg the price', () => {
      expect(getMatchingPrices([createPrice()], 'EUR', 'group-id-a')).toEqual([
        {
          value: {
            currencyCode: 'EUR',
          },
          customerGroup: {
            id: 'group-id-a',
          },
        },
      ]);
    });
  });
  describe("when price does't match customerGroup", () => {
    it('should return empty array', () => {
      expect(getMatchingPrices([createPrice()], 'EUR', 'group-id-b')).toEqual(
        []
      );
    });
  });
});
