import CustomFieldTypeDefinitionsConnector from '@commercetools-local/core/components/custom-field-type-definitions-connector';

export const docToFormValues = doc => ({
  ...doc,
  salutation: doc.salutation || '',
  title: doc.title || '',
  firstName: doc.firstName || '',
  middleName: doc.middleName || '',
  lastName: doc.lastName || '',
  email: doc.email || '',
  dateOfBirth: doc.dateOfBirth || '',
  customerNumber: doc.employeeNumber || '',
  externalId: doc.externalId || '',
  password: doc.password || '',
  vatId: doc.vatId || '',
  customerGroup: doc.customerGroup?.key || '',
  company: doc.customerGroup?.key || '',
  stores: doc.stores?.map(store => store.key) || [],
  roles: doc.roles ? doc.roles : doc.custom?.fields?.roles || [],
  custom: doc.custom
    ? CustomFieldTypeDefinitionsConnector.restDocToForm(doc.custom)
    : CustomFieldTypeDefinitionsConnector.createEmptyCustomFields(),
});

export const formValuesToDoc = ({ company, roles, ...formValues }) => ({
  ...formValues,
  customerGroup: formValues.customerGroup
    ? {
        typeId: 'customer-group',
        key: formValues.customerGroup,
      }
    : undefined,
  dateOfBirth: formValues.dateOfBirth || undefined,
  externalId: formValues.externalId || undefined,
  vatId: formValues.vatId || undefined,
  customerNumber: formValues.customerNumber || undefined,
  stores: formValues.stores?.map(storeKey => ({
    typeId: 'store',
    key: storeKey,
  })),
  roles,
  custom: formValues.custom.type.key
    ? CustomFieldTypeDefinitionsConnector.formToGraphQlDoc({
        ...formValues.custom,
        fields: {
          ...formValues.custom.fields,
          roles,
        },
      })
    : undefined,
});
