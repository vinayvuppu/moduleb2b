export const docToFormValues = doc => ({
  id: (doc && doc.id) || '',
  firstName: (doc && doc.firstName) || '',
  lastName: (doc && doc.lastName) || '',
  phone: (doc && doc.phone) || '',
  email: (doc && doc.email) || '',
  company: (doc && doc.company) || '',
  streetName: (doc && doc.streetName) || '',
  streetNumber: (doc && doc.streetNumber) || '',
  city: (doc && doc.city) || '',
  postalCode: (doc && doc.postalCode) || '',
  region: (doc && doc.region) || '',
  country: (doc && doc.country) || '',
  additionalAddressInfo: (doc && doc.additionalAddressInfo) || '',
  additionalStreetInfo: (doc && doc.additionalStreetInfo) || '',
});

export const formValuesToDoc = formValues => ({
  id: formValues.id,
  firstName: formValues.firstName,
  lastName: formValues.lastName,
  phone: formValues.phone,
  email: formValues.email,
  company: formValues.company,
  streetName: formValues.streetName,
  streetNumber: formValues.streetNumber,
  city: formValues.city,
  postalCode: formValues.postalCode,
  region: formValues.region,
  country: formValues.country,
  additionalAddressInfo: formValues.additionalAddressInfo,
  additionalStreetInfo: formValues.additionalStreetInfo,
});