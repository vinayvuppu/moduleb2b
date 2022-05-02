import {
  createDateSetConfig,
  createTimeSetConfig,
  createDateTimeSetConfig,
} from './date';

describe('date validation', () => {
  const config = createDateSetConfig({ formatMessage: v => v.defaultMessage });

  it('should detect duplicate values', () => {
    const setValues = ['2016-01-01', '2054-02-02', '2016-01-01'];

    expect(config.customValidator(setValues)).toMatchObject({
      isValid: false,
      invalidValues: ['2016-01-01'],
    });
  });
});

describe('time validation', () => {
  const config = createTimeSetConfig({ formatMessage: v => v.defaultMessage });

  it('should detect duplicate values', () => {
    const setValues = ['12:00', '12:35', '12:00'];

    expect(config.customValidator(setValues)).toMatchObject({
      isValid: false,
      invalidValues: ['12:00'],
    });
  });
});

describe('datetime validation', () => {
  const config = createDateTimeSetConfig({
    formatMessage: v => v.defaultMessage,
  });

  it('should detect duplicate values', () => {
    const setValues = [
      '2016-01-01T12:00',
      '2016-01-01T12:35',
      '2016-01-01T12:00',
    ];

    expect(config.customValidator(setValues)).toMatchObject({
      isValid: false,
      invalidValues: ['2016-01-01T12:00'],
    });
  });
});
