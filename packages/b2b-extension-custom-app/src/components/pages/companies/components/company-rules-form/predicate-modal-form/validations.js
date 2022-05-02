import { withoutEmptyErrorsByField } from '@commercetools-local/utils/validation';
import { TextInput } from '@commercetools-frontend/ui-kit';
import parser from '../../company-form/parser.pegjs';

export const validate = values => {
  const errorsByField = {
    value: {},
  };
  if (!TextInput.isEmpty(values.value)) {
    try {
      parser.parse(values.value);
    } catch (error) {
      errorsByField.value.invalid = true;
    }
  }

  return withoutEmptyErrorsByField(errorsByField);
};

export default validate;
