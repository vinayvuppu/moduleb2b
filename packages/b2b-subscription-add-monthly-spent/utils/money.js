const convertToNumber = ({ centAmount, fractionDigits }) =>
  centAmount / 10 ** fractionDigits;

const convertToMoney = (number, fractionDigits = 2, currencyCode) => ({
  centAmount: number * 10 ** fractionDigits,
  fractionDigits,
  type: 'centPrecision',
  currencyCode
});

const sum = (moneyA, moneyB) => {
  if (!moneyA && !moneyB) return null;
  if (!moneyA) return moneyB;
  if (!moneyB) return moneyA;

  const sum = convertToNumber(moneyA) + convertToNumber(moneyB);

  return convertToMoney(sum, moneyA.fractionDigits, moneyA.currencyCode);
};

module.exports = {
  sum
};
