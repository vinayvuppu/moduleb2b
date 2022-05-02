import CustomFieldTypeDefinitionsConnector from '@commercetools-local/core/components/custom-field-type-definitions-connector';
import {
  docToFormValues,
  formValuesToDoc,
  transformApiErrors,
} from './conversions';

const createDoc = custom => ({
  custom: {
    fields: { foo: 'bar' },
    type: {
      id: 'some-id',
      obj: {
        key: 'some-key',
        fieldDefinitions: [
          {
            name: 'CartCountry',
            type: { name: 'String' },
          },
        ],
      },
    },
  },
  ...custom,
});

const createFormValues = custom => ({
  custom: {
    type: {
      key: 'custom-key',
    },
    fields: {},
  },
  ...custom,
});

const createApiErrors = custom => [
  {
    code: 'RequiredField',
    action: { action: 'setCustomType' },
    ...custom,
  },
];

describe('docToFormValues', () => {
  let formValues;
  let doc;

  describe('when there are custom fields defined', () => {
    beforeEach(() => {
      doc = createDoc();
      formValues = docToFormValues(doc);
    });
    it('should have `custom` attribute', () => {
      expect(formValues).toHaveProperty(
        'custom',
        CustomFieldTypeDefinitionsConnector.restDocToForm(doc.custom)
      );
    });
  });

  describe('when there are no custom fields defined', () => {
    beforeEach(() => {
      doc = createDoc({ custom: undefined });
      formValues = docToFormValues(doc);
    });
    it('should have `custom` attribute with empty draft', () => {
      expect(formValues).toHaveProperty(
        'custom',
        CustomFieldTypeDefinitionsConnector.createEmptyCustomFields()
      );
    });
  });
});

describe('formValuesToDoc', () => {
  let formValues;
  let doc;

  describe('when there are custom fields defined', () => {
    beforeEach(() => {
      formValues = createFormValues();
      doc = formValuesToDoc(formValues);
    });
    it('should have `custom` attribute', () => {
      expect(doc).toHaveProperty(
        'custom',
        CustomFieldTypeDefinitionsConnector.formToRestDoc(formValues.custom)
      );
    });
  });

  describe('when there are no custom fields defined', () => {
    beforeEach(() => {
      formValues = createFormValues({
        custom: {
          type: {},
          fields: {},
        },
      });
      doc = formValuesToDoc(formValues);
    });
    it('should have `custom` attribute undefined', () => {
      expect(doc).toHaveProperty('custom', undefined);
    });
  });
});

describe('transformApiErrors', () => {
  let apiErrors;
  let partitionedErrors;
  describe('when there are known errors', () => {
    beforeEach(() => {
      apiErrors = createApiErrors();
      partitionedErrors = transformApiErrors(apiErrors);
    });
    it('should have `formErrors`', () => {
      expect(partitionedErrors).toHaveProperty('formErrors', apiErrors);
    });
    it('should have empty `unmappedApiErrors`', () => {
      expect(partitionedErrors).toHaveProperty('unmappedApiErrors', []);
    });
  });
  describe('when there are not known errors', () => {
    beforeEach(() => {
      apiErrors = createApiErrors({
        code: 'DuplicatedField',
        action: { action: 'setAddress' },
      });
      partitionedErrors = transformApiErrors(apiErrors);
    });
    it('should have empty `formErrors`', () => {
      expect(partitionedErrors).toHaveProperty('formErrors', []);
    });
    it('should have `unmappedApiErrors`', () => {
      expect(partitionedErrors).toHaveProperty('unmappedApiErrors', apiErrors);
    });
  });
  describe('when there is a mix of known and not known errors', () => {
    let unmappedApiErrors;
    beforeEach(() => {
      unmappedApiErrors = [
        ...createApiErrors({
          code: 'DuplicatedField',
          action: { action: 'setAddress' },
        }),
        ...createApiErrors({
          code: 'InvalidField',
          action: { action: 'setAddress' },
        }),
      ];
      apiErrors = createApiErrors({
        code: 'RequiredField',
        action: { action: 'setCustomType' },
      });
      partitionedErrors = transformApiErrors(
        apiErrors.concat(unmappedApiErrors)
      );
    });
    it('should have `formErrors`', () => {
      expect(partitionedErrors).toHaveProperty('formErrors', apiErrors);
    });
    it('should have `unmappedApiErrors`', () => {
      expect(partitionedErrors).toHaveProperty(
        'unmappedApiErrors',
        unmappedApiErrors
      );
    });
  });
});
