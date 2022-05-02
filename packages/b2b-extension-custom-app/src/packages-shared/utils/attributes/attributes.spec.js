import oneLine from 'common-tags/lib/oneLine';
import { filterEmptyValues, isEmptyValue } from './attributes';

describe('utility functions', () => {
  describe('isEmptyValue', () => {
    describe('empty values', () => {
      it('should be considered empty with empty string and type "text"', () => {
        expect(isEmptyValue('', 'text')).toBe(true);
      });

      it(
        oneLine`
            should be considered empty for null / undefined / empty
            values when the type is "money"
          `,
        () => {
          expect(isEmptyValue(undefined, 'money')).toBe(true);
          expect(isEmptyValue(null, 'money')).toBe(true);
          expect(isEmptyValue({}, 'money')).toBe(true);
        }
      );

      it(
        oneLine`
            should be considered empty for undefined centAmount and type "money"
          `,
        () => {
          expect(
            isEmptyValue({ centAmount: undefined, currencyCode: 'EU' }, 'money')
          ).toBe(true);
        }
      );

      it(
        oneLine`
            should be considered empty for undefined
            currencyCode and type "money"
          `,
        () => {
          expect(
            isEmptyValue({ centAmount: 0, currencyCode: undefined }, 'money')
          ).toBe(true);
        }
      );

      it(
        oneLine`
            should be considered empty for null / undefined / empty
            values when the type is "reference"
          `,
        () => {
          expect(isEmptyValue(undefined, 'reference')).toBe(true);
          expect(isEmptyValue(null, 'reference')).toBe(true);
          expect(isEmptyValue({}, 'reference')).toBe(true);
        }
      );

      it(
        oneLine`
            should be considered empty for empty keys when
            the type is "reference"
          `,
        () => {
          expect(isEmptyValue({ typeId: null, id: null }, 'reference')).toBe(
            true
          );
        }
      );

      it(
        oneLine`
            should be considered empty for empty typeId when
            the type is "reference"
          `,
        () => {
          expect(isEmptyValue({ typeId: null, id: 1337 }, 'reference')).toBe(
            true
          );
        }
      );

      it(
        oneLine`
            should be considered empty for empty id whenthe
            the type is "reference"
          `,
        () => {
          expect(isEmptyValue({ typeId: 1337, id: null }, 'reference')).toBe(
            true
          );
        }
      );

      it(
        oneLine`
            should be considered empty for null / undefined / empty
            values when the type is "enum"
          `,
        () => {
          expect(isEmptyValue(undefined, 'enum')).toBe(true);
          expect(isEmptyValue(null, 'enum')).toBe(true);
          expect(isEmptyValue({}, 'enum')).toBe(true);
        }
      );

      it(
        oneLine`
            should be considered empty for empty keys when
            the type is "enum"
          `,
        () => {
          expect(isEmptyValue({ key: null, label: undefined }, 'enum')).toBe(
            true
          );
        }
      );

      it(
        oneLine`
            should be considered empty for empty label when
            the type is "enum"
          `,
        () => {
          expect(isEmptyValue({ key: 'xxx', label: null }, 'enum')).toBe(true);
        }
      );
    });

    describe('non-empty values', () => {
      it('should consider not empty with type null', () => {
        expect(isEmptyValue([], null)).toBe(false);
        expect(isEmptyValue({}, null)).toBe(false);
      });

      it(
        oneLine`
            should consider not empty when the type is "money"
            and the centAmount is 0
          `,
        () => {
          expect(
            isEmptyValue({ centAmount: 0, currencyCode: 'EU' }, 'money')
          ).toBe(false);
        }
      );

      it(
        oneLine`
            should consider not empty when the type is "reference"
            and the reference attributes are filled
          `,
        () => {
          expect(isEmptyValue({ typeId: 1337, id: 9999 }, 'reference')).toBe(
            false
          );
        }
      );

      it(
        oneLine`
            should consider not empty when the type is "enum"
            and the enum attributes are filled
          `,
        () => {
          expect(isEmptyValue({ key: 'xxx', label: {} }, 'enum')).toBe(false);
        }
      );
    });
  });

  describe('filterEmptyValues', () => {
    describe('type is "text"', () => {
      const mockTextValues = ['not empty text', '', 'empty text?', null];
      const filteredValues = filterEmptyValues(mockTextValues, null);

      it('should have all values without null or empty strings', () => {
        expect(filteredValues).toEqual(['not empty text', 'empty text?']);
      });
    });

    describe('type is "enum"', () => {
      const mockEnum = [
        { key: null, label: undefined },
        { key: 'xxx', label: {} },
        { key: 'xxx', label: null },
        null,
        undefined,
      ];

      it('should have only one value in the set', () => {
        const filteredValues = filterEmptyValues(mockEnum, 'enum');
        expect(filteredValues).toEqual([{ key: 'xxx', label: {} }]);
      });

      it('should have all values without null or undefined', () => {
        const filteredValuesNoDefinition = filterEmptyValues(mockEnum, null);
        expect(filteredValuesNoDefinition).toEqual([
          { key: null, label: undefined },
          { key: 'xxx', label: {} },
          { key: 'xxx', label: null },
        ]);
      });
    });

    describe('type is "money"', () => {
      const mockMoney = [
        { centAmount: undefined, currencyCode: 'EU' },
        { centAmount: 0, currencyCode: undefined },
        { centAmount: 0, currencyCode: 'EU' },
        null,
        undefined,
      ];

      it('should have only one value in the set', () => {
        const filteredValues = filterEmptyValues(mockMoney, 'money');
        expect(filteredValues).toEqual([{ centAmount: 0, currencyCode: 'EU' }]);
      });

      it('should have all values without null or undefined', () => {
        const filteredValuesNoDefinition = filterEmptyValues(mockMoney, null);
        expect(filteredValuesNoDefinition).toEqual([
          { centAmount: undefined, currencyCode: 'EU' },
          { centAmount: 0, currencyCode: undefined },
          { centAmount: 0, currencyCode: 'EU' },
        ]);
      });
    });

    describe('type is "reference"', () => {
      const mockReference = [
        { typeId: null, id: null },
        { typeId: null, id: 1337 },
        { typeId: 1337, id: null },
        { typeId: 1337, id: 9999 },
        null,
        undefined,
      ];

      it('should have only one value in the set', () => {
        const filteredValues = filterEmptyValues(mockReference, 'reference');
        expect(filteredValues).toEqual([{ typeId: 1337, id: 9999 }]);
      });

      it('should have all values without null or undefined', () => {
        const filteredValuesNoDefinition = filterEmptyValues(
          mockReference,
          null
        );
        expect(filteredValuesNoDefinition).toEqual([
          { typeId: null, id: null },
          { typeId: null, id: 1337 },
          { typeId: 1337, id: null },
          { typeId: 1337, id: 9999 },
        ]);
      });
    });
  });
});
