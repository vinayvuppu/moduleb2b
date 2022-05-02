import moment from 'moment-timezone';
import { formatDateRangeValue, formatDateTime } from './date';

jest.mock('moment-timezone');

describe('formatDateRangeValue', () => {
  let actual;
  describe('when formatting a `from` date', () => {
    const date = {
      from: '2016-12-31',
      to: null,
    };
    beforeEach(() => {
      moment.tz = {
        guess: jest.fn(() => 'Europe/Madrid'),
      };
      moment.mockImplementation(() => ({
        tz: jest.fn(() => ({
          locale: jest.fn(() => ({
            format: jest.fn(() => '12/31/2016'),
          })),
        })),
      }));
      actual = formatDateRangeValue(date, 'date');
    });
    it('should return a date string prefixed with `from`', () => {
      expect(actual).toBe('from 12/31/2016');
    });
  });
  describe('when formatting a `to` date', () => {
    beforeEach(() => {
      const date = {
        from: null,
        to: '2016-12-31',
      };
      actual = formatDateRangeValue(date, 'date');
    });
    it('should return a date string prefixed with `from`', () => {
      expect(actual).toBe('to 12/31/2016');
    });
  });
  describe('when formatting a date range', () => {
    describe('when `from` is equal to `to`', () => {
      const date = {
        from: '2016-12-31',
        to: '2016-12-31',
      };
      beforeEach(() => {
        moment.tz = {
          guess: jest.fn(() => 'Europe/Madrid'),
        };
        moment.mockImplementation(() => ({
          tz: jest.fn(() => ({
            locale: jest.fn(() => ({
              format: jest.fn(() => '12/31/2016'),
            })),
          })),
        }));
        actual = formatDateRangeValue(date, 'date');
      });
      it('should return a date string prefixed with `from`', () => {
        expect(actual).toBe('12/31/2016');
      });
    });
    describe('when `from` is different to `to`', () => {
      const date = {
        from: '2016-12-28',
        to: '2016-12-31',
      };
      beforeEach(() => {
        moment.tz = {
          guess: jest.fn(() => 'Europe/Madrid'),
        };
        moment.mockImplementation(value => ({
          tz: jest.fn(() => ({
            locale: jest.fn(() => ({
              format: jest.fn(() =>
                value === '2016-12-28' ? '12/28/2016' : '12/31/2016'
              ),
            })),
          })),
        }));
        actual = formatDateRangeValue(date, 'date');
      });
      it('should return a date string prefixed with `from`', () => {
        expect(actual).toBe('12/28/2016 - 12/31/2016');
      });
    });
  });
});

describe('formatDateTime', () => {
  describe('with `time` type', () => {
    let isoTime;
    beforeEach(() => {
      moment.tz = {
        guess: jest.fn(() => 'Europe/Madrid'),
      };
      moment.mockImplementation(() => ({
        tz: jest.fn(() => ({
          locale: jest.fn(() => ({
            format: jest.fn(() => '10:01 AM'),
          })),
        })),
      }));
      isoTime = formatDateTime('time', '2016-12-31T09:01:00.000Z');
    });
    it('gets the time in ISO format', () => {
      expect(isoTime).toBe('10:01 AM');
    });
  });

  describe('with `datetime` type', () => {
    const value = '2016-12-31T13:45:00.000Z';
    let isoDateTime;
    beforeEach(() => {
      moment.tz = {
        guess: jest.fn(() => 'Europe/Madrid'),
      };
      moment.mockImplementation(() => ({
        tz: jest.fn(() => ({
          locale: jest.fn(() => ({
            format: jest.fn(() => '12/31/2016 2:45 PM'),
          })),
        })),
      }));
      isoDateTime = formatDateTime('datetime', value);
    });
    it('gets the date time in ISO format in UTC time', () => {
      expect(isoDateTime).toBe('12/31/2016 2:45 PM');
    });
  });

  describe('with `date` type', () => {
    const value = '2016-12-31';
    let isoDateTime;
    beforeEach(() => {
      moment.tz = {
        guess: jest.fn(() => 'Europe/Madrid'),
      };
      moment.mockImplementation(() => ({
        tz: jest.fn(() => ({
          locale: jest.fn(() => ({
            format: jest.fn(() => '12/31/2016'),
          })),
        })),
      }));
      isoDateTime = formatDateTime('date', value);
    });
    it('gets the date time in ISO format in UTC time', () => {
      expect(isoDateTime).toBe('12/31/2016');
    });
  });

  describe('when no type', () => {
    it('returns the passed value when the type is not datetime/time', () => {
      const value = '12/31/2016 13:45';
      const isoDateValue = formatDateTime('dummyType', value);
      expect(isoDateValue).toBe(value);
    });
  });

  describe('when no options are passed', () => {
    beforeEach(() => {
      moment.tz = {
        guess: jest.fn(() => 'Europe/Madrid'),
      };
      moment.mockImplementation(() => ({
        tz: jest.fn(() => ({
          locale: jest.fn(() => ({
            format: jest.fn(() => '10:01 AM'),
          })),
        })),
      }));
    });
    it('should call guess from moment-timezone', () => {
      const value = '12/31/2016 13:45';
      formatDateTime('dummyType', value);
      expect(moment.tz.guess).toHaveBeenCalled();
    });
  });

  describe('when no timeZone is passed', () => {
    beforeEach(() => {
      moment.tz = {
        guess: jest.fn(() => 'Europe/Madrid'),
      };
      moment.mockImplementation(() => ({
        tz: jest.fn(() => ({
          locale: jest.fn(() => ({
            format: jest.fn(() => '10:01 AM'),
          })),
        })),
      }));
    });
    it('should call guess from moment-timezone', () => {
      const value = '12/31/2016 13:45';
      formatDateTime('dummyType', value, { locale: 'en' });
      expect(moment.tz.guess).toHaveBeenCalled();
    });
  });
});
