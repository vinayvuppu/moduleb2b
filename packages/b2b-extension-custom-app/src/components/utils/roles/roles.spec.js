import { getRoles, getRolByValue } from './roles';

const mockFormatMessage = message => message.defaultMessage;

describe('roles', () => {
  describe('getRoles', () => {
    describe('call with correct values', () => {
      it('should return all roles', () => {
        expect(getRoles(mockFormatMessage)).toEqual([
          { label: 'B2B Company Admin', value: 'b2b-company-admin' },
          { label: 'B2B Company Employee', value: 'b2b-company-employee' },
        ]);
      });
    });
    describe('call with format as undefined', () => {
      it('should throw an error', () => {
        expect(() => getRoles()).toThrow(
          Error('Must provided a valid formatMessage intl')
        );
      });
    });
  });
  describe('getRolByValue', () => {
    describe('call with correct values', () => {
      it('should return a specific rol', () => {
        expect(getRolByValue('b2b-company-admin', mockFormatMessage)).toEqual({
          label: 'B2B Company Admin',
          value: 'b2b-company-admin',
        });
      });
    });
    describe('value not found', () => {
      it('should throw an error', () => {
        expect(() => getRolByValue('not-exist', mockFormatMessage)).toThrow(
          Error('Not exist any rol with value not-exist')
        );
      });
    });
  });
});
