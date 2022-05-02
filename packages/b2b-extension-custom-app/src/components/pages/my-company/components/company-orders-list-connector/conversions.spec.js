import { transformApiError } from './conversions';

describe('given the error indicates a syntax error in the where predicate', () => {
  const apiError = {
    message: "Syntax error while parsing 'where'",
  };
  let transformedError;

  beforeEach(() => {
    transformedError = transformApiError(apiError);
  });

  it('should indicate the predicate being invalid', () => {
    expect(transformedError).toHaveProperty('predicate.invalid', true);
  });
});

describe('given the error indicates nothing known', () => {
  const apiError = {
    message: 'some other api error',
  };
  let transformedError;

  beforeEach(() => {
    transformedError = transformApiError(apiError);
  });

  it('should return the original error', () => {
    expect(transformedError).toEqual(apiError);
  });
});
