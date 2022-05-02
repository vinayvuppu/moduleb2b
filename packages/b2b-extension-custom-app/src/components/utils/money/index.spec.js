import { sum, subtraction } from '.';

const money = {
  centAmount: 10000,
  fractionDigits: 2,
  type: 'centPrecision',
  currencyCode: 'USD',
};

describe('money utils', () => {
  describe('sum', () => {
    let response;
    describe('pass moneyA and moneyB', () => {
      beforeEach(() => {
        response = sum(money, money);
      });
      it('should return the correct response', () => {
        expect(response).toEqual({ ...money, centAmount: 20000 });
      });
    });
    describe('pass only moneyA', () => {
      beforeEach(() => {
        response = sum(money);
      });
      it('should return moneyA', () => {
        expect(response).toEqual(money);
      });
    });
    describe('pass only moneyB', () => {
      beforeEach(() => {
        response = sum(null, money);
      });
      it('should return moneyB', () => {
        expect(response).toEqual(money);
      });
    });
    describe('dont pass any money', () => {
      beforeEach(() => {
        response = sum();
      });
      it('should return null', () => {
        expect(response).toBeNull();
      });
    });
  });
  describe('subtraction', () => {
    test('subtraction two numbers', () => {
      const actual = subtraction(money, { ...money, centAmount: 2301 });
      expect(actual).toEqual({
        centAmount: 7699,
        currencyCode: 'USD',
        fractionDigits: 2,
        type: 'centPrecision',
      });
    });
    test('first number is lesser than second', () => {
      const actual = subtraction(money, { ...money, centAmount: 23067 });
      expect(actual).toEqual({
        centAmount: -13067,
        currencyCode: 'USD',
        fractionDigits: 2,
        type: 'centPrecision',
      });
    });
  });
});
