import { formValuesToDoc } from './conversions';

const createFormValues = custom => ({
  salutation: 'Mr.',
  email: 'foo@bar.com',
  customerGroup: 'cg-1',
  dateOfBirth: '2017-02-20',
  externalId: '123',
  companyName: 'Stark industries',
  vatId: '13',
  customerNumber: '444',
  roles: ['rol1', 'rol2'],
  stores: ['store1'],
  ...custom,
});

describe('formValuesToDoc', () => {
  let formValues;
  let doc;

  beforeEach(() => {
    formValues = createFormValues();
    doc = formValuesToDoc(formValues);
  });

  it('should add the `email` property', () => {
    expect(doc).toHaveProperty('email', formValues.email);
  });
  it('should add the `salutation` property', () => {
    expect(doc).toHaveProperty('salutation', formValues.salutation);
  });
  it('should add the `customerGroup` property', () => {
    expect(doc).toHaveProperty('customerGroup', {
      typeId: 'customer-group',
      key: formValues.customerGroup,
    });
  });
  it('should add the `dateOfBirth` property', () => {
    expect(doc).toHaveProperty('dateOfBirth', formValues.dateOfBirth);
  });
  it('should add the `externalId` property', () => {
    expect(doc).toHaveProperty('externalId', formValues.externalId);
  });

  it('should add the `vatId` property', () => {
    expect(doc).toHaveProperty('vatId', formValues.vatId);
  });
  it('should add the `employeeNumber` property', () => {
    expect(doc).toHaveProperty('employeeNumber', formValues.customerNumber);
  });

  it('should add the "stores" array property ', () => {
    expect(doc).toHaveProperty('stores', [{ typeId: 'store', key: 'store1' }]);
  });

  it('should add the "roles" property ', () => {
    expect(doc).toHaveProperty('roles', ['rol1', 'rol2']);
  });

  describe('when the `dateOfBirth` is not defined', () => {
    beforeEach(() => {
      formValues = createFormValues({ dateOfBirth: '' });
      doc = formValuesToDoc(formValues);
    });

    it('should set the `dateOfBirth` property as `undefined`', () => {
      expect(doc).toHaveProperty('dateOfBirth', undefined);
    });
  });
  describe('when the `externalId` is not defined', () => {
    beforeEach(() => {
      formValues = createFormValues({ externalId: '' });
      doc = formValuesToDoc(formValues);
    });

    it('should set the `externalId` property as `undefined`', () => {
      expect(doc).toHaveProperty('externalId', undefined);
    });
  });

  describe('when the `vatId` is not defined', () => {
    beforeEach(() => {
      formValues = createFormValues({ vatId: '' });
      doc = formValuesToDoc(formValues);
    });

    it('should set the `vatId` property as `undefined`', () => {
      expect(doc).toHaveProperty('vatId', undefined);
    });
  });
  describe('when the `customerNumber` is not defined', () => {
    beforeEach(() => {
      formValues = createFormValues({ customerNumber: '' });
      doc = formValuesToDoc(formValues);
    });

    it('should set the `customerNumber` property as `undefined`', () => {
      expect(doc).toHaveProperty('customerNumber', undefined);
    });
  });
});
