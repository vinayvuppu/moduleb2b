export const docToFormValues = doc => ({
  id: doc.id,
  firstName: doc.firstName || '',
  lastName: doc.lastName || '',
  phone: doc.phone || '',
  email: doc.email || '',
  company: doc.company || '',
  streetName: doc.streetName || '',
  streetNumber: doc.streetNumber || '',
  city: doc.city || '',
  postalCode: doc.postalCode || '',
  region: doc.region || '',
  country: doc.country || '',
  additionalAddressInfo: doc.additionalAddressInfo || '',
  additionalStreetInfo: doc.additionalStreetInfo || '',
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
