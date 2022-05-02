import {
  getDataAttribute,
  setDataAttribute,
  filterDataAttributes,
} from './dataset';

describe('getDataAttribute', () => {
  it('returns data attribute', () => {
    const node = {
      dataset: {
        keyOne: 'value',
        keyTwo: 10,
      },
    };
    expect(getDataAttribute(node, 'data-key-one')).toBe(node.dataset.keyOne);
  });

  it('returns data attribute compatibility', () => {
    const node = {
      'data-key-one': 'value',
      'data-key-two': 10,
    };
    node.getAttribute = key => node[key] || null;
    expect(getDataAttribute(node, 'data-key-one')).toBe(node['data-key-one']);
  });
});

describe('setDataAttribute', () => {
  it('sets attribute', () => {
    const node = { dataset: {} };
    const key = 'key';
    const value = 'value';

    setDataAttribute(node, `data-${key}`, value);

    expect(node.dataset[key]).toBe(value);
  });

  it('sets attribute compatibility', () => {
    const node = {};
    node.setAttribute = (key, value) => {
      node[key] = value;
    };
    const key = 'data-key';
    const value = 'value';

    setDataAttribute(node, key, value);

    expect(node[key]).toBe(value);
  });
});

describe('filterDataAttributes', () => {
  it('filters data attributes', () => {
    const dataAttrs = {
      'data-one': 1,
      'data-three': 3,
    };
    const nonDataAttrs = {
      two: 2,
      four: 4,
    };
    const dataObject = {
      ...dataAttrs,
      ...nonDataAttrs,
    };

    expect(filterDataAttributes(dataObject)).toEqual(dataAttrs);
  });
});
