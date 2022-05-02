import { withoutEmptyErrorsByField } from '@commercetools-local/utils/validation';
import { EMAIL_REGEX } from '@commercetools-local/core/components/validated-input';
import { TextInput } from '@commercetools-frontend/ui-kit';

export const validate = values => {
  const errorsByField = { country: {}, email: {} };

  if (TextInput.isEmpty(values.country)) errorsByField.country.missing = true;

  if (!TextInput.isEmpty(values.email) && !EMAIL_REGEX.test(values.email))
    errorsByField.email.format = true;

  return withoutEmptyErrorsByField(errorsByField);
};

export default validate;
