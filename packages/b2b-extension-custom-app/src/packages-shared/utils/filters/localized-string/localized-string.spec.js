import localizedTextTransformer from './localized-string';

const simpleValue = {
  en: 'test',
};

const multipleValue = {
  en: 'test',
  es: 'prueba',
};

describe('localized string query builder', () => {
  let result;
  let expected;
  it('should correctly build a single value query', () => {
    expected = 'en = "test"';
    result = localizedTextTransformer(simpleValue);
    expect(result).toEqual(expected);
  });

  it('should correctly build a multiple value query', () => {
    expected = 'en = "test" and es = "prueba"';
    result = localizedTextTransformer(multipleValue);
    expect(result).toEqual(expected);
  });
});
