import withoutEmptyErrorsByField from './without-empty-errors-by-field';

describe('withoutEmptyErrorsByField', () => {
  describe('with empty errors', () => {
    const errorsByField = {
      fieldA: {
        required: true,
      },
      fieldB: {},
    };

    it('should remove fields without errors', () => {
      expect(withoutEmptyErrorsByField(errorsByField).fieldB).not.toBeDefined();
    });

    it('should keep fields with errors', () => {
      expect(withoutEmptyErrorsByField(errorsByField).fieldA).toBeDefined();
    });

    it('should not change fields with errors', () => {
      expect(withoutEmptyErrorsByField(errorsByField)).toHaveProperty(
        'fieldA',
        errorsByField.fieldA
      );
    });
  });

  describe('without empty errors', () => {
    const errorsByField = {
      fieldA: {
        required: true,
      },
    };
    it('should keep fields with errors', () => {
      expect(withoutEmptyErrorsByField(errorsByField).fieldA).toBeDefined();
    });

    it('should not change fields with errors', () => {
      expect(withoutEmptyErrorsByField(errorsByField)).toHaveProperty(
        'fieldA',
        errorsByField.fieldA
      );
    });
  });

  describe('with nested errors', () => {
    const errorsByField = {
      fieldA: {
        fieldB: {
          required: true,
        },
      },
      fieldC: { fieldD: {} },
    };

    it('should remove fields without errors', () => {
      expect(withoutEmptyErrorsByField(errorsByField).fieldC).not.toBeDefined();
    });

    it('should keep fields with errors', () => {
      expect(withoutEmptyErrorsByField(errorsByField).fieldA).toBeDefined();
      expect(
        withoutEmptyErrorsByField(errorsByField).fieldA.fieldB
      ).toBeDefined();
    });

    it('should not change fields with errors', () => {
      expect(withoutEmptyErrorsByField(errorsByField)).toHaveProperty(
        'fieldA',
        errorsByField.fieldA
      );
    });
  });
});
