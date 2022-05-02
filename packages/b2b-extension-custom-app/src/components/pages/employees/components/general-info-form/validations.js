import { withoutEmptyErrorsByField } from '@commercetools-local/utils/validation';
import { EMAIL_REGEX } from '@commercetools-local/core/components/validated-input';
import { TextInput } from '@commercetools-frontend/ui-kit';

export const validate = values => {
  const errorsByField = { email: {}, company: {}, roles: {} };

  if (TextInput.isEmpty(values.email)) errorsByField.email.missing = true;
  if (!EMAIL_REGEX.test(values.email)) errorsByField.email.format = true;
  if (TextInput.isEmpty(values.company)) errorsByField.company.missing = true;
  if (!values.roles || values.roles.length === 0)
    errorsByField.roles.missing = true;

  return withoutEmptyErrorsByField(errorsByField);
};
export default validate;
