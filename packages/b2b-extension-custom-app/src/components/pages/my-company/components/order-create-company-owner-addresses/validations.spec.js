import { validate } from './validations';

describe('validate', () => {
  describe('on `firstName`', () => {
    describe('when the firstName is missing', () => {
      it('should mark that as an error', () => {
        expect(validate({ firstName: '' }).firstName).toEqual({
          missing: true,
        });
      });
    });
  });
  describe('on `country`', () => {
    describe('when the country is missing', () => {
      it('should mark that as an error', () => {
        expect(validate({ country: '' }).country).toEqual({
          missing: true,
        });
      });
    });
  });
  describe('on `lastName`', () => {
    describe('when the lastName is missing', () => {
      it('should mark that as an error', () => {
        expect(validate({ lastName: '' }).lastName).toEqual({
          missing: true,
        });
      });
    });
  });
  describe('on `streetName`', () => {
    describe('when the streetName is missing', () => {
      it('should mark that as an error', () => {
        expect(validate({ streetName: '' }).streetName).toEqual({
          missing: true,
        });
      });
    });
  });
  describe('on `city`', () => {
    describe('when the city is missing', () => {
      it('should mark that as an error', () => {
        expect(validate({ city: '' }).city).toEqual({
          missing: true,
        });
      });
    });
  });
  describe('on `postalCode`', () => {
    describe('when the postalCode is missing', () => {
      it('should mark that as an error', () => {
        expect(validate({ postalCode: '' }).postalCode).toEqual({
          missing: true,
        });
      });
    });
  });
});
