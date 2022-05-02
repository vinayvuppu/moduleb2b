import { withoutEmptyErrorsByField } from '@commercetools-local/utils/validation';

export const validate = values => {
  const errorsByField = {
    firstName: {},
    country: {},
    lastName: {},
    streetName: {},
    streetNumber: {},
    city: {},
    postalCode: {},
  };

  if (!values.firstName || values.firstName.trim().length === 0)
    errorsByField.firstName.missing = true;

  if (!values.country || values.country.trim().length === 0)
    errorsByField.country.missing = true;

  if (!values.lastName || values.lastName.trim().length === 0)
    errorsByField.lastName.missing = true;

  if (!values.streetName || values.streetName.trim().length === 0)
    errorsByField.streetName.missing = true;

  if (!values.city || values.city.trim().length === 0)
    errorsByField.city.missing = true;

  if (!values.postalCode || values.postalCode.trim().length === 0)
    errorsByField.postalCode.missing = true;

  if (!values.streetNumber || values.streetNumber.trim().length === 0)
    errorsByField.streetNumber.missing = true;

  return withoutEmptyErrorsByField(errorsByField);
};

export default validate;
