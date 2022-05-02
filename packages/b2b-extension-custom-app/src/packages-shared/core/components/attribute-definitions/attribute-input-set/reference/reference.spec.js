import createReferenceSetConfig from './reference';

describe('validation', () => {
  const config = createReferenceSetConfig({
    formatMessage: v => v.defaultMessage,
  });

  it('should detect duplicate values', () => {
    const setValues = [
      { id: 'value_one_1' },
      { id: 'value_two_2' },
      { id: 'value_one_1' },
    ];

    expect(config.customValidator(setValues)).toMatchObject({
      isValid: false,
      invalidValues: [{ id: 'value_one_1' }],
    });
  });
});
