import { LocalizedTextInput } from '@commercetools-frontend/ui-kit';
import { withoutEmptyErrorsByField } from '../../../utils/validation';

const validate = values => {
  const errorsByField = {
    name: {},
  };

  if (LocalizedTextInput.isEmpty(values.name)) {
    errorsByField.name.required = true;
  }

  return withoutEmptyErrorsByField(errorsByField);
};

export default validate;
