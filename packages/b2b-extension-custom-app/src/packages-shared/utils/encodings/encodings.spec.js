import { stringToBase64, base64ToString } from './encodings';

describe('stringToBase64', () => {
  it('encodes string to base 64', () => {
    expect(stringToBase64('foo')).toBe('Zm9v');
  });

  it('decodes base 64 string to string', () => {
    expect(base64ToString('Zm9v')).toBe('foo');
  });
});

describe('base64ToString', () => {
  it('returns undefined when malformed string', () => {
    expect(base64ToString('9v')).toBeUndefined();
  });

  it('returns undefined when string is not properly encoded', () => {
    expect(base64ToString('a%AFc')).toBeUndefined();
  });
});
