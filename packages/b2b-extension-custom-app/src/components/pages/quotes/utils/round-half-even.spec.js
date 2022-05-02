import roundHalfEven from './round-half-even';

describe('round half even', () => {
  describe('when the even is up', () => {
    it('should round half even', () => {
      expect(roundHalfEven(23.6)).toEqual(24);
    });
  });

  describe('when the even is down', () => {
    it('should round half even', () => {
      expect(roundHalfEven(24.6)).toEqual(24);
    });
  });
});
