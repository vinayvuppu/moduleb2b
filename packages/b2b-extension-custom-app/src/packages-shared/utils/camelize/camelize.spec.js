import camelize from './camelize';

describe('utility functions', () => {
  it('should correctly camel cases string', () => {
    expect(camelize('this-is-a-string')).toBe('thisIsAString');
  });
});
