import transformErrors from './transform-errors';

const createError = custom => ({
  code: 'DuplicateField',
  field: 'email',
  message: 'A customer with the given email already exists',
  ...custom,
});

describe('when provided with a duplicate `email`', () => {
  let errors;
  let transformedErrors;
  beforeEach(() => {
    errors = [createError()];
    transformedErrors = transformErrors(errors);
  });
  it('should return transformed formErrors', () => {
    expect(transformedErrors.formErrors).toEqual(
      expect.objectContaining({
        email: {
          duplicate: true,
        },
      })
    );
  });
  it('should return empty unmappedErrors', () => {
    expect(transformedErrors.unmappedErrors).toEqual(
      expect.arrayContaining([])
    );
  });
});

describe('when provided with a duplicate `customerNumber`', () => {
  let errors;
  let transformedErrors;
  beforeEach(() => {
    errors = [createError({ field: 'customerNumber' })];
    transformedErrors = transformErrors(errors);
  });
  it('should return transformed formErrors', () => {
    expect(transformedErrors.formErrors).toEqual(
      expect.objectContaining({
        customerNumber: {
          duplicate: true,
        },
      })
    );
  });
  it('should return empty unmappedErrors', () => {
    expect(transformedErrors.unmappedErrors).toEqual(
      expect.arrayContaining([])
    );
  });
});

describe('when provided with a unknown errors', () => {
  let errors;
  let transformedErrors;
  beforeEach(() => {
    errors = [
      createError({
        message: 'The server is on strike. Please try again later.',
        code: 'SomeOther',
        field: 'oneOfThem',
      }),
    ];
    transformedErrors = transformErrors(errors);
  });
  it('should return empty unmappedErrors', () => {
    expect(transformedErrors.unmappedErrors).toEqual(
      expect.arrayContaining(errors)
    );
  });
});
