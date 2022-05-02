import { docToFormValues, formValuesToDoc } from './conversions';

const createFormValues = custom => ({
  salutation: 'Dear',
  title: 'Doctor',
  firstName: 'Stephen',
  middleName: 'Jay',
  lastName: 'Strange',
  email: 'strange@avengers.com',
  dateOfBirth: '1983-02-01',
  customerNumber: '9999',
  externalId: 'aaa',
  password: 'asdasd123',
  vatId: '123',
  customerGroup: 'cg-1',
  stores: ['store1'],
  roles: ['rol1'],
  custom: {
    type: {
      key: 'employee-type',
    },
    fields: {
      roles: ['rol1'],
    },
  },
  ...custom,
});

const createDoc = custom => ({
  salutation: 'Dear',
  title: 'Doctor',
  firstName: 'Stephen',
  middleName: 'Jay',
  lastName: 'Strange',
  email: 'strange@avengers.com',
  dateOfBirth: '1983-02-01',
  employeeNumber: '9999',
  externalId: 'aaa',
  password: 'asdasd123',
  vatId: '123',
  customerGroup: {
    key: 'cg-1',
  },
  stores: [{ key: 'store1' }],
  custom: {
    type: {
      id: 'employee-type',
    },
    fields: {
      roles: ['rol1'],
    },
  },
  ...custom,
});

describe('docToFormValues', () => {
  let formValues;
  let doc;

  beforeEach(() => {
    doc = createDoc();
    formValues = docToFormValues(doc);
  });

  it('should add the `salutation` property', () => {
    expect(formValues).toHaveProperty('salutation', doc.salutation);
  });

  it('should add the `title` property', () => {
    expect(formValues).toHaveProperty('title', doc.title);
  });

  it('should add the `firstName` property', () => {
    expect(formValues).toHaveProperty('firstName', doc.firstName);
  });

  it('should add the `email` property', () => {
    expect(formValues).toHaveProperty('email', doc.email);
  });

  it('should add the `customerGroup` property', () => {
    expect(formValues).toHaveProperty('customerGroup', doc.customerGroup.key);
  });

  it('should add the `company` property', () => {
    expect(formValues).toHaveProperty('company', doc.customerGroup.key);
  });

  it('should add the `stores` property', () => {
    expect(formValues).toHaveProperty('stores', ['store1']);
  });

  it('should add the `custom` property', () => {
    expect(formValues).toHaveProperty('custom', {
      fields: {
        roles: ['rol1'],
      },
      type: {
        id: 'employee-type',
      },
    });
  });
});

describe('formValuesToDoc', () => {
  let formValues;
  let doc;

  describe('customerGroup', () => {
    describe('when not empty', () => {
      beforeEach(() => {
        formValues = createFormValues();
        doc = formValuesToDoc(formValues);
      });

      it('should add the `customerGroup` property', () => {
        expect(doc).toHaveProperty('customerGroup', {
          typeId: 'customer-group',
          key: formValues.customerGroup,
        });
      });
    });
  });

  describe('stores', () => {
    beforeEach(() => {
      formValues = createFormValues();
      doc = formValuesToDoc(formValues);
    });

    it('should add the `stores` property', () => {
      expect(doc).toHaveProperty('stores', [
        { typeId: 'store', key: 'store1' },
      ]);
    });
  });

  describe('custom', () => {
    beforeEach(() => {
      formValues = createFormValues();
      doc = formValuesToDoc(formValues);
    });

    it('should add the `custom` property', () => {
      expect(doc).toHaveProperty('custom', {
        fields: {
          roles: ['rol1'],
        },
        type: {
          obj: {
            key: 'employee-type',
          },
          typeId: 'type',
        },
      });
    });
  });

  describe('dateOfBirth', () => {
    describe('when not empty', () => {
      beforeEach(() => {
        formValues = createFormValues();
        doc = formValuesToDoc(formValues);
      });

      it('should add the `dateOfBirth` property', () => {
        expect(doc).toHaveProperty('dateOfBirth', formValues.dateOfBirth);
      });
    });
  });

  describe('externalId', () => {
    describe('when not empty', () => {
      beforeEach(() => {
        formValues = createFormValues();
        doc = formValuesToDoc(formValues);
      });

      it('should add the `externalId` property', () => {
        expect(doc).toHaveProperty('externalId', formValues.externalId);
      });
    });
  });

  describe('companyName', () => {
    describe('when not empty', () => {
      beforeEach(() => {
        formValues = createFormValues();
        doc = formValuesToDoc(formValues);
      });

      it('should add the `companyName` property', () => {
        expect(doc).toHaveProperty('companyName', formValues.companyName);
      });
    });
  });

  describe('vatId', () => {
    describe('when not empty', () => {
      beforeEach(() => {
        formValues = createFormValues();
        doc = formValuesToDoc(formValues);
      });

      it('should add the `vatId` property', () => {
        expect(doc).toHaveProperty('vatId', formValues.vatId);
      });
    });
  });

  describe('customerNumber', () => {
    describe('when not empty', () => {
      beforeEach(() => {
        formValues = createFormValues();
        doc = formValuesToDoc(formValues);
      });

      it('should add the `customerNumber` property', () => {
        expect(doc).toHaveProperty('customerNumber', formValues.customerNumber);
      });
    });
  });
});
