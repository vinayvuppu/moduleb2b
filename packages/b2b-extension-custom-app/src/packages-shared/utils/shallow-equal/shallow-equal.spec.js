import shallowEqual from './shallow-equal';

describe('equal arguments', () => {
  it('returns true for undefined values', () => {
    expect(
      shallowEqual({ a: 1, b: 2, c: undefined }, { a: 1, b: 2, c: undefined })
    ).toBe(true);
  });
  it('returns true for numeric values ', () => {
    expect(shallowEqual({ a: 1, b: 2, c: 3 }, { a: 1, b: 2, c: 3 })).toBe(true);
  });
  it('returns true for referentially equal values ', () => {
    const o = {};
    expect(shallowEqual({ a: 1, b: 2, c: o }, { a: 1, b: 2, c: o })).toBe(true);
  });
  it('returns true for referentially equal function values ', () => {
    const o = {};
    const d = () => 1;
    expect(shallowEqual({ a: 1, b: 2, c: o, d }, { a: 1, b: 2, c: o, d })).toBe(
      true
    );
  });
});

describe('unequal arguments', () => {
  it('returns false if argument fields are different function identities', () => {
    expect(
      shallowEqual({ a: 1, b: 2, d: () => 1 }, { a: 1, b: 2, d: () => 1 })
    ).toBe(false);
  });

  it('returns false if first argument has too many keys', () => {
    expect(shallowEqual({ a: 1, b: 2, c: 3 }, { a: 1, b: 2 })).toBe(false);
  });

  it('returns false if second argument has too many keys', () => {
    expect(shallowEqual({ a: 1, b: 2 }, { a: 1, b: 2, c: 3 })).toBe(false);
  });

  it('returns false if arguments have different keys', () => {
    expect(
      shallowEqual({ a: 1, b: 2, c: undefined }, { a: 1, bb: 2, c: undefined })
    ).toBe(false);
  });
});
