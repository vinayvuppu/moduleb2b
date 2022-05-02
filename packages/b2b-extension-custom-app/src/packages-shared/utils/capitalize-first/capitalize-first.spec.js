import capitalizeFirst from './capitalize-first';

describe('utility functions', () => {
  it('should capitalize first char', () => {
    expect(capitalizeFirst('foo')).toBe('Foo');
  });
});
