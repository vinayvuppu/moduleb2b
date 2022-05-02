export const convertToNumber = ({ centAmount, fractionDigits = 2 } = {}) =>
  centAmount ? centAmount / 10 ** fractionDigits : 0;

const convertToMoney = (number, fractionDigits = 2, currencyCode) => ({
  centAmount: Math.round(number * 10 ** fractionDigits),
  fractionDigits,
  type: 'centPrecision',
  currencyCode,
});

export const sum = (moneyA, moneyB) => {
  if (!moneyA && !moneyB) return null;
  if (!moneyA) return moneyB;
  if (!moneyB) return moneyA;

  const total = convertToNumber(moneyA) + convertToNumber(moneyB);

  return convertToMoney(total, moneyA.fractionDigits, moneyA.currencyCode);
};

export const subtraction = (moneyA, moneyB) => {
  if (!moneyA && !moneyB) return null;
  if (!moneyA) return moneyB;
  if (!moneyB) return moneyA;

  const total = convertToNumber(moneyA) - convertToNumber(moneyB);

  return convertToMoney(total, moneyA.fractionDigits, moneyA.currencyCode);
};
