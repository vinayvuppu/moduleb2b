import CustomFieldTypeDefinitionsConnector from '@commercetools-local/core/components/custom-field-type-definitions-connector';

export const docToFormValues = doc => ({
  ...doc,
  custom: doc.custom
    ? CustomFieldTypeDefinitionsConnector.restDocToForm(doc.custom)
    : CustomFieldTypeDefinitionsConnector.createEmptyCustomFields(),
});

export const formValuesToDoc = formValues => ({
  ...formValues,
  custom: formValues.custom.type.key
    ? CustomFieldTypeDefinitionsConnector.formToGraphQlDoc(formValues.custom)
    : undefined,
});

const knownActions = ['setCustomType', 'setCustomField'];

const knownErrorCodes = ['RequiredField', 'InvalidField'];

export const transformApiErrors = apiErrors =>
  apiErrors.reduce(
    (errors, apiError) => {
      if (
        knownErrorCodes.includes(apiError.code) &&
        knownActions.includes(apiError.action.action)
      ) {
        return {
          ...errors,
          formErrors: [...errors.formErrors, apiError],
        };
      }
      return {
        ...errors,
        unmappedApiErrors: [...errors.unmappedApiErrors, apiError],
      };
    },
    { formErrors: [], unmappedApiErrors: [] }
  );
