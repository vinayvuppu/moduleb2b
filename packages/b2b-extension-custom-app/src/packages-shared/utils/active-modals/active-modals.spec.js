import activeModals, { modalQuery } from './active-modals';

describe('modal query string', () => {
  it('should match query selector', () => {
    expect(modalQuery).toBe('.ReactModal__Content');
  });
});
describe('when there are no modals', () => {
  let result;
  beforeEach(() => {
    document.querySelectorAll = jest.fn(() => []);
    result = activeModals();
  });
  it('should return 0', () => {
    expect(result).toBe(0);
  });
});
describe('when there 2 modals', () => {
  let result;
  beforeEach(() => {
    document.querySelectorAll = jest.fn(() => [1, 2]);
    result = activeModals();
  });
  it('should return 2', () => {
    expect(result).toBe(2);
  });
});
