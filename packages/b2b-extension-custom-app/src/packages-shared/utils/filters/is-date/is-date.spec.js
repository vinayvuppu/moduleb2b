import { isValidISOTime, isValidISODate, isValidISODateTime } from './is-date';

describe('is date', () => {
  describe('isValidISOTime', () => {
    describe('when strict flag enabled', () => {
      it('should return true when valid ISO time format and delimiters', () => {
        expect(isValidISOTime({ value: '13:00:00.123' })).toBe(true);
      });
      it('should return false when invalid ISO time format', () => {
        expect(isValidISOTime({ value: '13:0:0.123' })).toBe(false);
      });
      it('should return false when non-strict valid ISO time format', () => {
        expect(isValidISOTime({ value: 'Time 13:00:00.123' })).toBe(false);
      });
    });
    describe('when strict flag disabled', () => {
      it('should return true when non strict valid ISO time format', () => {
        expect(
          isValidISOTime({ value: 'Time 13:00:00.123', strict: false })
        ).toBe(true);
      });
    });
  });
  describe('isValidISODate', () => {
    describe('when strict flag enabled', () => {
      it('should return true when valid ISO date format and delimiters', () => {
        expect(isValidISODate({ value: '2017-06-30' })).toBe(true);
      });
      it('should return false when invalid ISO date format', () => {
        expect(isValidISODate({ value: '2017-6-30' })).toBe(false);
      });
      it('should return false when non-strict valid ISO date format', () => {
        expect(isValidISODate({ value: 'Date 2017-06-30' })).toBe(false);
      });
    });
    describe('when strict flag disabled', () => {
      it('should return true when non strict valid ISO date format', () => {
        expect(
          isValidISODate({ value: 'Date 2017-06-30', strict: false })
        ).toBe(true);
      });
    });
  });
  describe('isValidISODateTime', () => {
    describe('when strict flag enabled', () => {
      it('should return true when valid ISO datetime format and delimiters', () => {
        expect(isValidISODateTime({ value: '2017-06-30T13:00:00.123Z' })).toBe(
          true
        );
      });
      it('should return false when invalid ISO datetime format', () => {
        expect(isValidISODateTime({ value: '2017-6-30T13:00:00.123Z' })).toBe(
          false
        );
      });
      it('should return false when non-strict valid ISO datetime format', () => {
        expect(
          isValidISODateTime({ value: 'Datetime 2017-06-30T13:00:00.123Z' })
        ).toBe(false);
      });
    });
    describe('when strict flag disabled', () => {
      it('should return true when non strict valid ISO datetime format', () => {
        expect(
          isValidISODateTime({
            value: 'Datetime 2017-06-30T13:00:00.123Z',
            strict: false,
          })
        ).toBe(true);
      });
    });
  });
});
