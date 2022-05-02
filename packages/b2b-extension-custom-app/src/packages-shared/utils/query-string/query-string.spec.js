import { pickFilters, coercion, sanitize } from './query-string';

describe('coercion', () => {
  it('converts a numeric string into an integer', () => {
    expect(coercion({ input: '10' })).toEqual({ input: 10 });
  });

  it('converts a float string into an integer', () => {
    expect(coercion({ input: '10.5' })).toEqual({ input: 10 });
  });

  it('converts a false boolean string into an actual false boolean', () => {
    expect(coercion({ input: 'false' })).toEqual({ input: false });
  });

  it('converts a true boolean string into an actual true boolean', () => {
    expect(coercion({ input: 'true' })).toEqual({ input: true });
  });
});

describe('picking filters', () => {
  it('picks the filters marked as true flags', () => {
    const params = ['flagOne', 'numberOne'];
    const settings = {
      flagOne: true,
      flagTwo: false,
      numberOne: 10,
      stringOne: 'nice',
    };
    const expected = {
      flagOne: true,
      numberOne: 10,
    };

    expect(pickFilters(params, settings)).toEqual(expected);
  });
});

describe('sanitize', () => {
  it('should escape in correct order', () => {
    expect(sanitize('value \\"')).toBe('value \\\\\\"');
  });

  it('should escape reserved character "', () => {
    expect(sanitize('value "')).toBe('value \\"');
  });

  it('should escape reserved character "single backslash"', () => {
    expect(sanitize('value \\')).toBe('value \\\\');
  });

  it('should ignore invalid params', () => {
    expect(sanitize(undefined)).toBe(undefined);
    expect(sanitize(null)).toBe(null);
  });
});
