import { renderHook } from '@testing-library/react-hooks';
import useLocalize from './use-localize';

jest.mock('@commercetools-frontend/application-shell-connectors', () => ({
  useApplicationContext: jest.fn(() => ({
    dataLocale: 'en',
    projectLanguages: ['en', 'de', 'fr'],
  })),
}));

describe('useLocalize', () => {
  it('should return the localization value related to the data locale', () => {
    const { result } = renderHook(() => useLocalize());
    expect(
      result.current([
        { locale: 'en', value: 'Hello' },
        { locale: 'de', value: 'Hallo' },
        { locale: 'fr', value: 'Bonjour' },
      ])
    ).toBe('Hello');
  });

  describe('fallback', () => {
    it('should fallback to fallback value when localizedStrings are not provided or empty', () => {
      const { result } = renderHook(() => useLocalize());
      expect(result.current(undefined, 'fallback')).toBe('fallback');
      expect(result.current(null, 'fallback')).toBe('fallback');
      expect(result.current([], 'fallback')).toBe('fallback');
    });

    it('should return an empty string when no locales nor fallback value were provided', () => {
      const { result } = renderHook(() => useLocalize());
      expect(result.current()).toBe('');
    });
  });
});
