import { setIn } from 'formik';
import { withoutEmptyErrorsByField } from '@commercetools-local/utils/validation';

/* eslint-disable import/prefer-default-export */
export const transformApiError = apiError => {
  const transformedError = {};

  if (apiError.message.includes("Syntax error while parsing 'where'")) {
    return setIn(transformedError, 'predicate.invalid', true);
  }

  const hasTransformedErrors =
    Object.keys(withoutEmptyErrorsByField(transformedError)).length > 0;

  return hasTransformedErrors ? transformApiError : apiError;
};
