import camelize from '../camelize';

const regexpData = /^data-/;

export function getDataAttribute(node, key) {
  if (node.dataset) {
    const camelKey = camelize(key.replace(regexpData, ''));
    return node.dataset[camelKey];
  }
  if (node.getAttribute)
    // IE < 11 compatibility
    return node.getAttribute(key);
  return undefined;
}

export function setDataAttribute(node, key, value) {
  if (node.dataset) {
    const camelKey = camelize(key.replace(regexpData, ''));
    // eslint-disable-next-line no-param-reassign
    node.dataset[camelKey] = value;
  } else if (node.setAttribute)
    // IE < 11 compatibility
    node.setAttribute(key, value);
}

export function filterDataAttributes(obj) {
  return Object.keys(obj)
    .filter(p => regexpData.test(p))
    .reduce((acc, p) => {
      // eslint-disable-next-line no-param-reassign
      acc[p] = obj[p];
      return acc;
    }, {});
}
