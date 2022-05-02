import { intlMock } from '../../../../test-utils';
import { FILTER_TYPES, FIELD_TYPES } from '../../../constants';
import customFieldValidator, { messages } from './custom-field';

const createFilter = custom => ({
  value: {
    type: {
      name: 'SomeType',
    },
    value: 'Some Value',
    ...custom,
  },
});

describe('customFieldValidator', () => {
  let filter;
  let result;
  let expected;

  describe('when the filter is valid', () => {
    beforeEach(() => {
      filter = createFilter();
      result = customFieldValidator(filter, intlMock);
      expected = null;
    });

    it('should return `null`', () => {
      expect(result).toEqual(expected);
    });
  });

  describe('when option is required and not selected', () => {
    beforeEach(() => {
      filter = createFilter({ type: { name: FIELD_TYPES.Money } });
      result = customFieldValidator(filter, intlMock);
      expected = {
        option: intlMock.formatMessage(messages.optionFieldError),
      };
    });

    it('should return an option error', () => {
      expect(result).toEqual(expected);
    });
  });

  describe('when the value is empty', () => {
    beforeEach(() => {
      filter = createFilter({ value: '' });
      result = customFieldValidator(filter, intlMock);
      expected = {
        input: intlMock.formatMessage(messages.inputFieldError),
      };
    });

    it('should return an input error', () => {
      expect(result).toEqual(expected);
    });
  });

  describe('Money type', () => {
    describe('when currency code is empty', () => {
      beforeEach(() => {
        filter = createFilter({
          type: { name: FIELD_TYPES.Money },
          option: 'someOption',
          value: { amount: '200.00' },
        });
        result = customFieldValidator(filter, intlMock);
        expected = {
          input: intlMock.formatMessage(messages.inputFieldError),
        };
      });

      it('should return an input error', () => {
        expect(result).toEqual(expected);
      });
    });

    describe('when amount is empty', () => {
      beforeEach(() => {
        filter = createFilter({
          type: { name: FIELD_TYPES.Money },
          option: 'someOption',
          value: { currencyCode: '' },
        });
        result = customFieldValidator(filter, intlMock);
        expected = {
          input: intlMock.formatMessage(messages.inputFieldError),
        };
      });

      it('should return an input error', () => {
        expect(result).toEqual(expected);
      });
    });
  });

  describe('range filters', () => {
    describe('when `from` value is empty', () => {
      beforeEach(() => {
        filter = createFilter({
          type: { name: FIELD_TYPES.Number },
          option: FILTER_TYPES.range,
          value: { to: 'toValue' },
        });
        result = customFieldValidator(filter, intlMock);
        expected = {
          input: {
            from: intlMock.formatMessage(messages.inputFieldError),
            to: null,
          },
        };
      });

      it('should return a `from-input` error', () => {
        expect(result).toEqual(expected);
      });
    });

    describe('when `to` value is empty', () => {
      beforeEach(() => {
        filter = createFilter({
          type: { name: FIELD_TYPES.Number },
          option: FILTER_TYPES.range,
          value: { from: 'fromValue' },
        });
        result = customFieldValidator(filter, intlMock);
        expected = {
          input: {
            from: null,
            to: intlMock.formatMessage(messages.inputFieldError),
          },
        };
      });

      it('should return a `to-input` error', () => {
        expect(result).toEqual(expected);
      });
    });

    describe('Money type range filter', () => {
      describe('when `from` value is invalid', () => {
        describe('when `currencyCode` is empty', () => {
          beforeEach(() => {
            filter = createFilter({
              type: { name: FIELD_TYPES.Money },
              option: FILTER_TYPES.range,
              value: { from: { amount: '200' } },
            });
            result = customFieldValidator(filter, intlMock);
            expected = {
              input: {
                from: intlMock.formatMessage(messages.inputFieldError),
                to: null,
              },
            };
          });

          it('should return a `to-input` error', () => {
            expect(result).toEqual(expected);
          });
        });

        describe('when `amount` is empty', () => {
          beforeEach(() => {
            filter = createFilter({
              type: { name: FIELD_TYPES.Money },
              option: FILTER_TYPES.range,
              value: { from: { currencyCode: 'EUR' } },
            });
            result = customFieldValidator(filter, intlMock);
            expected = {
              input: {
                from: intlMock.formatMessage(messages.inputFieldError),
                to: null,
              },
            };
          });

          it('should return a `to-input` error', () => {
            expect(result).toEqual(expected);
          });
        });
      });

      describe('when `to` value is invalid', () => {
        describe('when `currencyCode` is empty', () => {
          beforeEach(() => {
            filter = createFilter({
              type: { name: FIELD_TYPES.Money },
              option: FILTER_TYPES.range,
              value: {
                from: { currencyCode: 'EUR', amount: '200' },
                to: { amount: '200' },
              },
            });
            result = customFieldValidator(filter, intlMock);
            expected = {
              input: {
                from: null,
                to: intlMock.formatMessage(messages.inputFieldError),
              },
            };
          });

          it('should return a `to-input` error', () => {
            expect(result).toEqual(expected);
          });
        });

        describe('when `amount` is empty', () => {
          beforeEach(() => {
            filter = createFilter({
              type: { name: FIELD_TYPES.Money },
              option: FILTER_TYPES.range,
              value: {
                from: { currencyCode: 'EUR', amount: '200' },
                to: { currencyCode: 'EUR' },
              },
            });
            result = customFieldValidator(filter, intlMock);
            expected = {
              input: {
                from: null,
                to: intlMock.formatMessage(messages.inputFieldError),
              },
            };
          });

          it('should return a `to-input` error', () => {
            expect(result).toEqual(expected);
          });
        });
      });
    });
  });
});
