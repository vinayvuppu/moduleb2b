const invalidValues = [null, undefined, ''];

export default function validateSingleFilter({ value }) {
  return invalidValues.includes(value);
}
