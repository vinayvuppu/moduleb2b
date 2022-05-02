/**
 * @param mixed value
 * @param String definitionName
 * @return Boolean
 */
export function isEmptyValue(value, definitionName = '') {
  if (typeof value === 'string') return !value.length;

  if (isEmpty(value)) return true;

  /* eslint-disable indent */
  switch (definitionName) {
    case 'enum':
    case 'lenum':
      return isEmpty(value.key) || isEmpty(value.label);
    case 'money':
      return isEmpty(value.centAmount) || isEmpty(value.currencyCode);
    case 'reference':
      return isEmpty(value.typeId) || isEmpty(value.id);
    default:
      return isEmpty(value);
  }
}

/**
 * Filter out the empty values of the attribute-set by its definition
 *
 * @param [] values
 * @param String definitionName
 * @return []
 */
export function filterEmptyValues(values = [], definitionName) {
  return values.filter(value => !isEmptyValue(value, definitionName));
}

function isEmpty(value) {
  return value === undefined || value === null;
}
