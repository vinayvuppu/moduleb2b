import { withoutEmptyErrorsByField } from '@commercetools-local/utils/validation';

const transformErrors = apiErrors => {
  const formErrors = { email: {}, customerNumber: {} };
  let unmappedErrors = [];

  apiErrors.forEach(error => {
    if (error.code === 'DuplicateField') {
      formErrors[error.field].duplicate = true;
    } else if (
      error.code === 'InvalidOperation' &&
      error.message.includes('A Customer number already exists')
    )
      formErrors.customerNumber.duplicate = true;
    else {
      unmappedErrors = unmappedErrors.concat(error);
    }
  });

  return {
    formErrors: withoutEmptyErrorsByField(formErrors),
    unmappedErrors,
  };
};
export default transformErrors;
