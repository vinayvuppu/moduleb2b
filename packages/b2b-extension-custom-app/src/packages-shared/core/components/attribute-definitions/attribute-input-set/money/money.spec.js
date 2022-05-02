import createMoneySetConfig from './money';

describe('validation', () => {
  const config = createMoneySetConfig({ formatMessage: v => v.defaultMessage });

  it('should detect duplicate values', () => {
    const setValues = [
      { currencyCode: 'EUR', centAmount: '1000' },
      { currencyCode: 'USD', centAmount: '1000' },
      { currencyCode: 'EUR', centAmount: '1001' },
      { currencyCode: 'EUR', centAmount: '1000' },
    ];

    expect(config.customValidator(setValues)).toMatchObject({
      isValid: false,
      invalidValues: [{ currencyCode: 'EUR', centAmount: '1000' }],
    });
  });
});
