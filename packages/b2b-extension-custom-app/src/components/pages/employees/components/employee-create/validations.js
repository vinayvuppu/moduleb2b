import { withoutEmptyErrorsByField } from '@commercetools-local/utils/validation';
import { EMAIL_REGEX } from '@commercetools-local/core/components/validated-input';
import { TextInput } from '@commercetools-frontend/ui-kit';

export const validate = values => {
  const errorsByField = {
    email: {},
    password: {},
    confirmedPassword: {},
    company: {},
    roles: {},
  };
  if (TextInput.isEmpty(values.email)) errorsByField.email.missing = true;
  if (!EMAIL_REGEX.test(values.email)) errorsByField.email.format = true;

  if (TextInput.isEmpty(values.password)) errorsByField.password.missing = true;
  if (
    !TextInput.isEmpty(values.confirmedPassword) &&
    values.password !== values.confirmedPassword
  )
    errorsByField.password.notMatch = true;

  if (TextInput.isEmpty(values.confirmedPassword))
    errorsByField.confirmedPassword.missing = true;
  if (
    !TextInput.isEmpty(values.confirmedPassword) &&
    values.confirmedPassword !== values.password
  )
    errorsByField.confirmedPassword.notMatch = true;

  if (TextInput.isEmpty(values.company)) errorsByField.company.missing = true;
  if (!values.roles || values.roles.length === 0)
    errorsByField.roles.missing = true;

  return withoutEmptyErrorsByField(errorsByField);
};
export default validate;
