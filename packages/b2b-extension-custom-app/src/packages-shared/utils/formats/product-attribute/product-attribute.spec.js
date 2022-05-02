import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import { reportErrorToSentry } from '@commercetools-frontend/sentry';
import { intlMock } from '../../../test-utils';
import formatProductAttribute from './product-attribute';

jest.mock('@commercetools-frontend/sentry');

const format = (type, value) =>
  formatProductAttribute({
    type,
    value,
    intl: intlMock,
    language: 'en',
    languages: ['en'],
  });

describe('formatProductAttribute', () => {
  describe('simple types', () => {
    it.each([
      ['boolean', true, 'AttributeTypeFormats.boolean.yes'],
      ['text', 'foo', 'foo'],
      ['ltext', { en: 'en-text' }, 'en-text'],
      ['enum', { label: 'enum-label' }, 'enum-label'],
      ['lenum', { label: { en: 'en-enum-label' } }, 'en-enum-label'],
      ['number', 100, 100],
      ['money', { centAmount: 10000, currencyCode: 'EUR' }, 'EUR 100'],
      ['date', '1985-05-29', '29.5.1985'],
      ['time', '03:00:00', '03:00:00'],
      ['datetime', '1985-05-29T10:20:30.000Z', '29.5.1985 (10:20)'],
      ['reference', { id: 'reference-id' }, 'reference-id'],
    ])(
      "formats attribute of type '%s'",
      (attributeTypeName, value, expected) => {
        const type = { name: attributeTypeName };
        const formatted = format(type, value);
        expect(formatted).toEqual(expected);
      }
    );
  });

  describe('composite types', () => {
    it('always returns fallback value for `nested` type', () => {
      const type = { name: 'nested' };
      const value = 'whatever i pass';
      const formatted = format(type, value);
      expect(formatted).toEqual(NO_VALUE_FALLBACK);
    });

    it('formats `set` type', () => {
      const type = { name: 'set', elementType: { name: 'money' } };
      const value = [
        {
          centAmount: 10000,
          currencyCode: 'EUR',
        },
        {
          centAmount: 15000,
          currencyCode: 'EUR',
        },
        {
          centAmount: 20000,
          currencyCode: 'EUR',
        },
      ];
      const formatted = format(type, value);
      expect(formatted).toBe('EUR 100, EUR 150, EUR 200');
    });
  });

  describe('nil values', () => {
    it.each([null, undefined])(
      'replaces `%s` with default fallback value',
      value => {
        const type = { name: 'fake-type' };
        const formatted = format(type, value);
        expect(formatted).toBe(NO_VALUE_FALLBACK);
      }
    );

    it.each([null, undefined])(
      'replaces `%s` with provided fallback value',
      value => {
        const type = { name: 'fake-type' };
        const formatted = formatProductAttribute({
          type,
          value,
          intl: intlMock,
          language: 'en',
          languages: ['en'],
          fallbackValue: '?',
        });
        expect(formatted).toEqual('?');
      }
    );
  });

  describe('unknown types', () => {
    const type = { name: 'unknown-type' };
    const value = 'whatever value';

    it('reports error to sentry', () => {
      format(type, value);
      expect(reportErrorToSentry).toHaveBeenCalled();
    });

    it('replaces provided value with fallback value', () => {
      const formatted = format(type, value);
      expect(formatted).toEqual(NO_VALUE_FALLBACK);
    });
  });

  describe('type was not provided', () => {
    const type = undefined;
    const value = 'whatever value';

    it('reports error to sentry', () => {
      format(type, value);
      expect(reportErrorToSentry).toHaveBeenCalled();
    });

    it('replaces provided value with fallback value', () => {
      const formatted = format(type, value);
      expect(formatted).toEqual(NO_VALUE_FALLBACK);
    });
  });
});
