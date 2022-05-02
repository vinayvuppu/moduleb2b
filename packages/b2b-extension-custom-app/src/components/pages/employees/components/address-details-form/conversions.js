import { TextInput } from '@commercetools-frontend/ui-kit';

export const formValuesToDoc = formValues => ({
  id: !TextInput.isEmpty(formValues.id) ? formValues.id : undefined,
  externalId: formValues.externalId || undefined,
  key: formValues.key || undefined,
  firstName: !TextInput.isEmpty(formValues.firstName)
    ? formValues.firstName
    : undefined,
  lastName: !TextInput.isEmpty(formValues.lastName)
    ? formValues.lastName
    : undefined,
  phone: !TextInput.isEmpty(formValues.phone) ? formValues.phone : undefined,
  mobile: !TextInput.isEmpty(formValues.mobile) ? formValues.mobile : undefined,
  fax: !TextInput.isEmpty(formValues.fax) ? formValues.fax : undefined,
  email: !TextInput.isEmpty(formValues.email) ? formValues.email : undefined,
  company: !TextInput.isEmpty(formValues.company)
    ? formValues.company
    : undefined,
  streetName: !TextInput.isEmpty(formValues.streetName)
    ? formValues.streetName
    : undefined,
  streetNumber: !TextInput.isEmpty(formValues.streetNumber)
    ? formValues.streetNumber
    : undefined,
  city: !TextInput.isEmpty(formValues.city) ? formValues.city : undefined,
  postalCode: !TextInput.isEmpty(formValues.postalCode)
    ? formValues.postalCode
    : undefined,
  pOBox: !TextInput.isEmpty(formValues.pOBox) ? formValues.pOBox : undefined,
  building: !TextInput.isEmpty(formValues.building)
    ? formValues.building
    : undefined,
  apartment: !TextInput.isEmpty(formValues.apartment)
    ? formValues.apartment
    : undefined,
  region: !TextInput.isEmpty(formValues.region) ? formValues.region : undefined,
  country: !TextInput.isEmpty(formValues.country)
    ? formValues.country
    : undefined,
  state: !TextInput.isEmpty(formValues.state) ? formValues.state : undefined,
  department: !TextInput.isEmpty(formValues.department)
    ? formValues.department
    : undefined,
  title: !TextInput.isEmpty(formValues.title) ? formValues.title : undefined,
  salutation: !TextInput.isEmpty(formValues.salutation)
    ? formValues.salutation
    : undefined,
  additionalStreetInfo: !TextInput.isEmpty(formValues.additionalStreetInfo)
    ? formValues.additionalStreetInfo
    : undefined,
  additionalAddressInfo: !TextInput.isEmpty(formValues.additionalAddressInfo)
    ? formValues.additionalAddressInfo
    : undefined,
});

export const docToFormValues = doc => ({
  id: doc.id || '',
  externalId: doc.externalId || '',
  key: doc.key || '',
  firstName: doc.firstName || '',
  lastName: doc.lastName || '',
  phone: doc.phone || '',
  mobile: doc.mobile || '',
  fax: doc.fax || '',
  email: doc.email || '',
  company: doc.company || '',
  streetName: doc.streetName || '',
  streetNumber: doc.streetNumber || '',
  city: doc.city || '',
  postalCode: doc.postalCode || '',
  pOBox: doc.pOBox || '',
  building: doc.building || '',
  apartment: doc.apartment || '',
  region: doc.region || '',
  country: doc.country || '',
  state: doc.state || '',
  department: doc.department || '',
  title: doc.title || '',
  salutation: doc.salutation || '',
  additionalStreetInfo: doc.additionalStreetInfo || '',
  additionalAddressInfo: doc.additionalAddressInfo || '',
});
