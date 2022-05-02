import { TextInput } from '@commercetools-frontend/ui-kit';

export const formValuesToDoc = ({
  company,
  roles,
  customerNumber,
  ...formValues
}) => ({
  ...formValues,
  customerGroup: !TextInput.isEmpty(formValues.customerGroup)
    ? {
        typeId: 'customer-group',
        key: formValues.customerGroup,
      }
    : undefined,
  confirmedPassword: undefined,
  dateOfBirth: !TextInput.isEmpty(formValues.dateOfBirth)
    ? formValues.dateOfBirth
    : undefined,
  externalId: !TextInput.isEmpty(formValues.externalId)
    ? formValues.externalId
    : undefined,
  vatId: !TextInput.isEmpty(formValues.vatId) ? formValues.vatId : undefined,
  employeeNumber: !TextInput.isEmpty(customerNumber)
    ? customerNumber
    : undefined,
  stores: formValues.stores?.map(storeKey => ({
    typeId: 'store',
    key: storeKey,
  })),
  roles,
});

export const initialValues = {
  salutation: '',
  title: '',
  firstName: '',
  middleName: '',
  lastName: '',
  email: '',
  dateOfBirth: '',
  customerNumber: '',
  externalId: '',
  customerGroup: '',
  password: '',
  confirmedPassword: '',
  vatId: '',
  stores: [],
  company: '',
  roles: [],
};
