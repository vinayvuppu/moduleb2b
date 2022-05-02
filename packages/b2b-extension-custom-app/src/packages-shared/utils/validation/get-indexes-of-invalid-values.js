import { deepEqual } from 'fast-equals';

export default function getIndexesOfInvalidValues(values, invalidValues = []) {
  if (invalidValues.length === 0) return [];

  const getInvalidIndexes = (acc, value, index) => {
    const isValid = !invalidValues.some(invalidValue =>
      deepEqual(value, invalidValue)
    );
    if (!isValid) acc.push(index);

    return acc;
  };

  return values.reduce(getInvalidIndexes, []);
}
