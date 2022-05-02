import { createLocalizedTextSetConfig } from './text';

describe('validation', () => {
  const config = createLocalizedTextSetConfig({
    formatMessage: v => v.defaultMessage,
  });

  it('should detect duplicate values', () => {
    const setValues = [
      { en: 'value_one_1', de: 'value_one_1' },
      { en: 'value_one_2', de: 'value_one_1' },
      { en: 'value_one_1', de: 'value_two_1' },
      { en: 'value_one_1', de: 'value_one_1' },
    ];

    expect(config.customValidator(setValues)).toMatchObject({
      isValid: false,
      invalidValues: [{ en: 'value_one_1', de: 'value_one_1' }],
    });
  });
});
