export const transformGraphQLErrors = errors =>
  errors.reduce(
    (previousErrors, error) => ({
      ...previousErrors,
      ...(error.code === 'DuplicateField' && {
        [error.field]: { duplicated: true },
      }),
    }),
    {}
  );

export default transformGraphQLErrors;
