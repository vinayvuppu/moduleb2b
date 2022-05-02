const invalidValues = [null, undefined, ''];

export default function isEmpty({ value }) {
  return (
    invalidValues.includes(value) ||
    (invalidValues.includes(value.from) && invalidValues.includes(value.to))
  );
}
