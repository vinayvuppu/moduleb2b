import { formValuesToDoc, docToFormValues } from './conversions';

describe('formValuesToDoc', () => {
  let formValues;
  let doc;
  beforeEach(() => {
    formValues = {
      name: 'Test',
    };
    doc = formValuesToDoc(formValues);
  });
  it('should convert form values to doc', () => {
    expect(doc).toEqual(
      expect.objectContaining({
        name: { en: 'Test' },
      })
    );
  });
});

describe('docToFormValues', () => {
  let doc;
  let formValues;
  beforeEach(() => {
    doc = {
      name: { en: 'Test' },
    };
  });
  describe('when doc is not defined', () => {
    beforeEach(() => {
      formValues = docToFormValues();
    });
    it('should return initial values', () => {
      expect(formValues).toEqual({
        name: '',
      });
    });
  });
  describe('when doc is defined', () => {
    beforeEach(() => {
      formValues = docToFormValues(doc);
    });
    it('should return initial values', () => {
      expect(formValues).toEqual({
        name: 'Test',
      });
    });
  });
});
