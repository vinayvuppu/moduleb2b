export const getMatchingPrices = (prices, cartCurrency, cartCustomerGroupId) =>
  prices.filter(
    price =>
      price.value &&
      price.value.currencyCode === cartCurrency &&
      (!price.customerGroup || price.customerGroup.id === cartCustomerGroupId)
  );

export const getAvailableCountries = prices =>
  prices.reduce((availableCountries, price) => {
    if (price.country && !availableCountries.includes(price.country)) {
      availableCountries.push(price.country);
    }
    return availableCountries;
  }, []);
