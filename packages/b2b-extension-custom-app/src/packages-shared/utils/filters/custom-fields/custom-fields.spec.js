import moment from 'moment';
import customFieldsTransformer from './custom-fields';
import { FILTER_TYPES, FIELD_TYPES } from '../../constants';

const queryDateFormat = 'YYYY-MM-DDTHH:mm:ss.SSSZ';
const dateFormat = 'YYYY-MM-DD';
const dateTimeFormat = 'YYYY-MM-DDTHH:mm:ss.SSS';
const timeFormat = 'HH:mm:ss.SSS';

const todayDate = moment().format(dateFormat);
const tomorrowDate = moment()
  .add(1, 'days')
  .format(dateFormat);
const todayDateTime = moment().format(dateTimeFormat);
const tomorrowDateTime = moment()
  .add(1, 'days')
  .format(dateTimeFormat);
const nowTime = moment()
  .startOf('minute')
  .format(timeFormat);
const laterTime = moment()
  .add(1, 'hour')
  .startOf('minute')
  .format(timeFormat);

const customFieldDefinitions = {
  BooleanField: {
    target: 'booleanField',
    value: { value: 'true' },
    type: { name: FIELD_TYPES.Boolean },
  },
  StringField: {
    target: 'stringField',
    value: 'someText',
    type: { name: FIELD_TYPES.String },
  },
  LocalizedStringField: {
    target: 'localizedStringField',
    value: { en: 'someText' },
    type: { name: FIELD_TYPES.LocalizedString },
  },
  EnumField: {
    target: 'enumField',
    value: { value: 'someEnumKey' },
    type: { name: FIELD_TYPES.Enum },
  },
  LocalizedEnumField: {
    target: 'localizedEnumField',
    value: { value: 'someLocalizedEnumKey' },
    type: { name: FIELD_TYPES.LocalizedEnum },
  },
  NumberField: {
    target: 'numberField',
    value: 1000,
    type: { name: FIELD_TYPES.Number },
    option: FILTER_TYPES.lessThan,
  },
  NumberFieldRange: {
    target: 'numberField',
    value: { from: 1000, to: 2000 },
    type: { name: FIELD_TYPES.Number },
    option: FILTER_TYPES.range,
  },
  DateField: {
    target: 'dateField',
    value: todayDate,
    type: { name: FIELD_TYPES.Date },
    option: FILTER_TYPES.lessThan,
  },
  DateFieldRange: {
    target: 'dateField',
    value: {
      from: todayDate,
      to: tomorrowDate,
    },
    type: { name: FIELD_TYPES.Date },
    option: FILTER_TYPES.range,
  },
  DateTimeField: {
    target: 'dateTimeField',
    value: todayDateTime,
    type: { name: FIELD_TYPES.DateTime },
    option: FILTER_TYPES.lessThan,
  },
  DateTimeFieldRange: {
    target: 'dateTimeField',
    value: {
      from: todayDateTime,
      to: tomorrowDateTime,
    },
    type: { name: FIELD_TYPES.DateTime },
    option: FILTER_TYPES.range,
  },
  TimeField: {
    target: 'timeField',
    value: nowTime,
    type: { name: FIELD_TYPES.Time },
    option: FILTER_TYPES.lessThan,
  },
  TimeFieldRange: {
    target: 'timeField',
    value: {
      from: nowTime,
      to: laterTime,
    },
    type: { name: FIELD_TYPES.Time },
    option: FILTER_TYPES.range,
  },
  MoneyField: {
    target: 'moneyField',
    value: { currencyCode: 'EUR', amount: '10' },
    type: { name: FIELD_TYPES.Money },
    option: FILTER_TYPES.lessThan,
  },
  MoneyFieldRange: {
    target: 'moneyField',
    value: {
      from: { currencyCode: 'EUR', amount: '10' },
      to: { currencyCode: 'EUR', amount: '20' },
    },
    type: { name: FIELD_TYPES.Money },
    option: FILTER_TYPES.range,
  },
};

describe('customFieldsTransformer', () => {
  let result;
  let expected;

  describe('Boolean', () => {
    const { BooleanField } = customFieldDefinitions;
    beforeEach(() => {
      result = customFieldsTransformer([{ value: BooleanField }]);
      expected = '(custom(fields(booleanField = true)))';
    });
    it('should return a boolean predicate', () => {
      expect(result).toEqual(expected);
    });
  });

  describe('String', () => {
    const { StringField } = customFieldDefinitions;
    beforeEach(() => {
      result = customFieldsTransformer([{ value: StringField }]);
      expected = `(custom(fields(stringField = "someText")))`;
    });

    it('should return a string predicate', () => {
      expect(result).toEqual(expected);
    });
  });

  describe('LocalizedString', () => {
    const { LocalizedStringField } = customFieldDefinitions;
    beforeEach(() => {
      result = customFieldsTransformer([{ value: LocalizedStringField }]);
      expected = `(custom(fields(localizedStringField(en = "someText"))))`;
    });

    it('should return a localized string predicate', () => {
      expect(result).toEqual(expected);
    });
  });

  describe('Enum', () => {
    const { EnumField } = customFieldDefinitions;
    beforeEach(() => {
      result = customFieldsTransformer([{ value: EnumField }]);
      expected = `(custom(fields(enumField = "someEnumKey")))`;
    });

    it('should return an enum predicate', () => {
      expect(result).toEqual(expected);
    });
  });

  describe('LocalizedEnum', () => {
    const { LocalizedEnumField } = customFieldDefinitions;
    beforeEach(() => {
      result = customFieldsTransformer([{ value: LocalizedEnumField }]);
      expected = `(custom(fields(localizedEnumField = "someLocalizedEnumKey")))`;
    });

    it('should return a localized enum predicate', () => {
      expect(result).toEqual(expected);
    });
  });

  describe('Time', () => {
    describe('single filter', () => {
      const { TimeField } = customFieldDefinitions;
      beforeEach(() => {
        result = customFieldsTransformer([{ value: TimeField }]);
        expected = `(custom(fields((timeField < "${nowTime}"))))`;
      });

      it('should return a time single predicate', () => {
        expect(result).toEqual(expected);
      });
    });

    describe('range filter', () => {
      const { TimeFieldRange } = customFieldDefinitions;
      const from = moment()
        .startOf('minute')
        .format(timeFormat);
      const to = moment()
        .add(1, 'hours')
        .endOf('minute')
        .format(timeFormat);
      beforeEach(() => {
        result = customFieldsTransformer([{ value: TimeFieldRange }]);
        expected = `(custom(fields(((timeField >= "${from}" and timeField <= "${to}")))))`;
      });

      it('should return a time range predicate', () => {
        expect(result).toEqual(expected);
      });
    });
  });

  describe('Date', () => {
    describe('single filter', () => {
      const { DateField } = customFieldDefinitions;
      beforeEach(() => {
        result = customFieldsTransformer([{ value: DateField }]);
        expected = `(custom(fields((dateField < "${todayDate}"))))`;
      });

      it('should return a date single predicate', () => {
        expect(result).toEqual(expected);
      });
    });

    describe('range filter', () => {
      const { DateFieldRange } = customFieldDefinitions;
      const from = moment()
        .startOf('day')
        .format(queryDateFormat);
      const to = moment()
        .add(1, 'day')
        .endOf('day')
        .format(queryDateFormat);
      beforeEach(() => {
        result = customFieldsTransformer([{ value: DateFieldRange }]);
        expected = `(custom(fields(((dateField >= "${from}" and dateField <= "${to}")))))`;
      });

      it('should return a date range predicate', () => {
        expect(result).toEqual(expected);
      });
    });
  });

  describe('DateTime', () => {
    describe('single filter', () => {
      const { DateTimeField } = customFieldDefinitions;
      beforeEach(() => {
        result = customFieldsTransformer([{ value: DateTimeField }]);
        expected = `(custom(fields((dateTimeField < "${todayDateTime}"))))`;
      });

      it('should return a datetime single predicate', () => {
        expect(result).toEqual(expected);
      });
    });

    describe('range filter', () => {
      const { DateTimeFieldRange } = customFieldDefinitions;
      const from = moment()
        .startOf('day')
        .format(queryDateFormat);
      const to = moment()
        .add(1, 'day')
        .endOf('day')
        .format(queryDateFormat);
      beforeEach(() => {
        result = customFieldsTransformer([{ value: DateTimeFieldRange }]);
        expected = `(custom(fields(((dateTimeField >= "${from}" and dateTimeField <= "${to}")))))`;
      });

      it('should return a datetime range predicate', () => {
        expect(result).toEqual(expected);
      });
    });
  });

  describe('Number', () => {
    describe('single filter', () => {
      const { NumberField } = customFieldDefinitions;
      beforeEach(() => {
        result = customFieldsTransformer([{ value: NumberField }]);
        expected = `(custom(fields(numberField < 1000)))`;
      });

      it('should return a number single predicate', () => {
        expect(result).toEqual(expected);
      });
    });

    describe('range filter', () => {
      const { NumberFieldRange } = customFieldDefinitions;
      beforeEach(() => {
        result = customFieldsTransformer([{ value: NumberFieldRange }]);
        expected = `(custom(fields(numberField >= 1000 and numberField <= 2000)))`;
      });

      it('should return a number range predicate', () => {
        expect(result).toEqual(expected);
      });
    });
  });

  describe('Money', () => {
    describe('single filter', () => {
      const { MoneyField } = customFieldDefinitions;
      beforeEach(() => {
        result = customFieldsTransformer([{ value: MoneyField }]);
        expected = `(custom(fields(moneyField(currencyCode = "EUR" and centAmount < 1000))))`;
      });

      it('should return a money single predicate', () => {
        expect(result).toEqual(expected);
      });
    });

    describe('range filter', () => {
      const { MoneyFieldRange } = customFieldDefinitions;
      beforeEach(() => {
        result = customFieldsTransformer([{ value: MoneyFieldRange }]);
        expected = `(custom(fields(moneyField(currencyCode = "EUR" and centAmount >= 1000 and centAmount <= 2000))))`;
      });

      it('should return a money range predicate', () => {
        expect(result).toEqual(expected);
      });
    });
  });
});
