import truncate from './truncate';

describe('truncate', () => {
  it('should return empty string when no text passed', () => {
    expect(truncate()).toBe('');
  });

  it('should return the whole text when text length is lower than max size', () => {
    const text = 'test text';
    expect(truncate(text, 50)).toBe(text);
  });

  it('should return text with ellipsis when text length is bigger than max size', () => {
    const text = 'test text';
    expect(truncate(text, 4)).toBe('test...');
  });

  it('should return text with custom truncate when set', () => {
    const text = 'test text';
    const customEnd = '----';
    expect(truncate(text, 4, customEnd)).toBe('test----');
  });
});
