import { formValuesToDoc, docToFormValues } from './conversions';

const createFormValues = custom => ({
  id: 'some-id',
  firstName: 'Jon',
  lastName: 'Snow',
  company: 'Night',
  streetName: '',
  streetNumber: '',
  city: 'Winterfel',
  postalCode: '2233',
  region: '',
  country: '',
  additionalAddressInfo: '',
  ...custom,
});

describe('formValuesToDoc', () => {
  let formValues;
  let doc;

  beforeEach(() => {
    formValues = createFormValues();
    doc = formValuesToDoc(formValues);
  });

  it('should add the `id` property', () => {
    expect(doc).toHaveProperty('id', formValues.id);
  });

  it('should add the `firstName` property', () => {
    expect(doc).toHaveProperty('firstName', formValues.firstName);
  });

  it('should add the `lastName` property', () => {
    expect(doc).toHaveProperty('lastName', formValues.lastName);
  });

  it('should add the `phone` property', () => {
    expect(doc).toHaveProperty('phone', formValues.phone);
  });

  it('should add the `email` property', () => {
    expect(doc).toHaveProperty('email', formValues.email);
  });

  it('should add the `city` property', () => {
    expect(doc).toHaveProperty('city', formValues.city);
  });

  it('should add the `postalCode` property', () => {
    expect(doc).toHaveProperty('postalCode', formValues.postalCode);
  });

  it('should add the `company` property', () => {
    expect(doc).toHaveProperty('company', formValues.company);
  });
});

describe('docToFormValues', () => {
  let formValues;
  let doc;

  beforeEach(() => {
    doc = createFormValues({
      additionalAddressInfo: null,
      email: 'test@yah.com',
      phone: '123123123',
    });
    formValues = docToFormValues(doc);
  });

  it('should add the `id` property', () => {
    expect(formValues).toHaveProperty('id', formValues.id);
  });

  it('should add the `firstName` property', () => {
    expect(formValues).toHaveProperty('firstName', formValues.firstName);
  });

  it('should add the `lastName` property', () => {
    expect(formValues).toHaveProperty('lastName', formValues.lastName);
  });

  it('should add the `phone` property', () => {
    expect(formValues).toHaveProperty('phone', formValues.phone);
  });

  it('should add the `email` property', () => {
    expect(formValues).toHaveProperty('email', formValues.email);
  });

  it('should add the `city` property', () => {
    expect(formValues).toHaveProperty('city', formValues.city);
  });

  it('should add the `postalCode` property', () => {
    expect(formValues).toHaveProperty('postalCode', formValues.postalCode);
  });

  it('should add the `company` property', () => {
    expect(formValues).toHaveProperty('company', formValues.company);
  });

  it('should add the `additionalAddressInfo` property', () => {
    expect(formValues).toHaveProperty('additionalAddressInfo');
  });
});
