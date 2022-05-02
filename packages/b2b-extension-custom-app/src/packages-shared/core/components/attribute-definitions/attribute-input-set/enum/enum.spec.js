import createEnumSetConfig from './enum';

describe('validation', () => {
  const config = createEnumSetConfig({ formatMessage: v => v.defaultMessage });

  it('should detect duplicate values', () => {
    const setValues = [
      { key: 'enum_key_1', label: 'enum_label_1' },
      { key: 'enum_key_2', label: 'enum_label_1' },
      { key: 'enum_key_1', label: 'enum_label_2' },
      { key: 'enum_key_1', label: 'enum_label_1' },
    ];

    expect(config.customValidator(setValues)).toMatchObject({
      isValid: false,
      invalidValues: [{ key: 'enum_key_1', label: 'enum_label_1' }],
    });
  });
});
