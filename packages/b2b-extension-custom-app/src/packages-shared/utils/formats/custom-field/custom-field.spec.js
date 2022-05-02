import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import { reportErrorToSentry } from '@commercetools-frontend/sentry';
import { intlMock } from '../../../test-utils';
import formatCustomField from './custom-field';

jest.mock('@commercetools-frontend/sentry');

const format = (type, value) =>
  formatCustomField({
    type,
    value,
    intl: intlMock,
    language: 'en',
    languages: ['en'],
  });

describe('formatCustomField', () => {
  describe('formatting of types identical to attribute types', () => {
    it.each([
      ['Boolean', true, 'AttributeTypeFormats.boolean.yes'],
      ['String', 'foo', 'foo'],
      ['LocalizedString', { en: 'en-text' }, 'en-text'],
      ['Number', 100, 100],
      ['Money', { centAmount: 10000, currencyCode: 'EUR' }, 'EUR 100'],
      ['Date', '1985-05-29', '29.5.1985'],
      ['Time', '03:00:00', '03:00:00'],
      ['DateTime', '1985-05-29T10:20:30.000Z', '29.5.1985 (10:20)'],
    ])(
      "formats custom field of type '%s'",
      (customFieldTypeName, value, expected) => {
        const type = { name: customFieldTypeName };
        const formatted = format(type, value);
        expect(formatted).toEqual(expected);
      }
    );
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

  describe('formatting peculiar types (i.e. enum types)', () => {
    it('formats custom field of type `Enum`', () => {
      const value = 'enum-key';
      const type = {
        name: 'Enum',
        values: [{ key: 'enum-key', label: 'enum-label' }],
      };
      const formatted = format(type, value);
      expect(formatted).toBe('enum-label');
    });

    it('formats custom field of type `LocalizedEnum`', () => {
      const value = 'enum-key';
      const type = {
        name: 'LocalizedEnum',
        values: [{ key: 'enum-key', label: { en: 'en-enum-label' } }],
      };

      const formatted = format(type, value);
      expect(formatted).toBe('en-enum-label');
    });

    it('formats custom field of type `Set` with `Enum` elements', () => {
      const type = {
        name: 'Set',
        elementType: {
          name: 'Enum',
          values: [
            { key: 'enum-key-1', label: 'enum-label-1' },
            { key: 'enum-key-2', label: 'enum-label-2' },
          ],
        },
      };
      const value = ['enum-key-1', 'enum-key-2'];
      const formatted = format(type, value);
      expect(formatted).toBe('enum-label-1, enum-label-2');
    });
  });
});
