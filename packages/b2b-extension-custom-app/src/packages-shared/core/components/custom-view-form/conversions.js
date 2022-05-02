import { defaultMemoize } from 'reselect';

// NOTE: at the moment we treat the name field as a normal text field
// even though the data model supports localized values.
// This is to keep the UI simple and to avoid possible confusion when
// in the future we allow settings to be shared etc.
export const nameLocale = 'en';

export const docToFormValues = defaultMemoize(doc => ({
  name: doc?.name[nameLocale] || '',
}));

export const formValuesToDoc = defaultMemoize(formValues => ({
  name: { [nameLocale]: formValues.name },
}));
