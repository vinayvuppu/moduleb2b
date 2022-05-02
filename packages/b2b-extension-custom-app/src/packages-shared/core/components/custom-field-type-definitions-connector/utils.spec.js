import omit from 'lodash.omit';
import {
  restDocToForm,
  graphQlDocToForm,
  formToRestDoc,
  formToGraphQlDoc,
  createEmptyCustomFields,
} from './utils';

const createRestDoc = custom => ({
  fields: { cf1: 'foo', cf2: 'bar' },
  type: {
    id: 'test-1',
    obj: {
      name: { en: 'hey' },
      key: 'key-1',
      fieldDefinitions: [],
    },
  },
  ...custom,
});

const createGraphQlDoc = custom => ({
  id: 'test',
  key: 'test1',
  nameAllLocales: [{ locale: 'en', value: 'foo' }],
  fieldDefinitions: [],
  ...custom,
});

describe('restDocToForm', () => {
  let result;
  let restResponse;

  beforeEach(() => {
    restResponse = createRestDoc();
    result = restDocToForm(restResponse);
  });

  it('should return an object with empy custom field values', () => {
    expect(result).toHaveProperty('fields', restResponse.fields);
  });

  it('should return an object with the custom field type definition', () => {
    expect(result).toHaveProperty('type', {
      id: restResponse.type.id,
      ...restResponse.type.obj,
    });
  });
});

describe('graphQlDocToForm', () => {
  let result;
  let graphqlResponse;

  beforeEach(() => {
    graphqlResponse = createGraphQlDoc();
    result = graphQlDocToForm(graphqlResponse);
  });

  it('should return an object with empty custom field values', () => {
    expect(result).toHaveProperty('fields', {});
  });

  it('should return an object with the custom field type definition', () => {
    expect(result).toHaveProperty('type', {
      id: graphqlResponse.id,
      key: graphqlResponse.key,
      name: { en: 'foo' },
      fieldDefinitions: [],
    });
  });

  describe('when custom type is a `Set` of `LocalizedEnum`', () => {
    beforeEach(() => {
      graphqlResponse = createGraphQlDoc({
        ...graphqlResponse,
        fieldDefinitions: [
          {
            name: 'field-foo-name',
            labelAllLocales: [{ locale: 'en', value: 'Hello' }],
            required: true,
            type: {
              name: 'LocalizedEnum',
              values: [
                {
                  key: 'hockey',
                  labelAllLocales: [{ locale: 'en', value: 'Hockey' }],
                },
              ],
            },
          },
        ],
      });
      result = graphQlDocToForm(graphqlResponse);
    });

    it('should return an object with the transformed fieldDefinitions', () => {
      expect(result).toHaveProperty('type', {
        id: graphqlResponse.id,
        key: graphqlResponse.key,
        name: { en: 'foo' },
        fieldDefinitions: [
          {
            name: 'field-foo-name',
            label: {
              en: 'Hello',
            },
            required: true,
            type: {
              name: 'LocalizedEnum',
              values: [{ key: 'hockey', label: { en: 'Hockey' } }],
            },
          },
        ],
      });
    });
  });

  describe('when custom type is `LocalizedEnum`', () => {
    beforeEach(() => {
      graphqlResponse = createGraphQlDoc({
        ...graphqlResponse,
        fieldDefinitions: [
          {
            name: 'field-foo-name',
            labelAllLocales: [{ locale: 'en', value: 'Hello' }],
            required: true,
            type: {
              elementType: {
                name: 'LocalizedEnum',
                values: [
                  {
                    key: 'hockey',
                    labelAllLocales: [{ locale: 'en', value: 'Hockey' }],
                  },
                ],
              },
            },
          },
        ],
      });
      result = graphQlDocToForm(graphqlResponse);
    });

    it('should return an object with the transformed fieldDefinitions', () => {
      expect(result).toHaveProperty('type', {
        id: graphqlResponse.id,
        key: graphqlResponse.key,
        name: { en: 'foo' },
        fieldDefinitions: [
          {
            name: 'field-foo-name',
            label: {
              en: 'Hello',
            },
            required: true,
            type: {
              elementType: {
                name: 'LocalizedEnum',
                values: [{ key: 'hockey', label: { en: 'Hockey' } }],
              },
            },
          },
        ],
      });
    });
  });
});

describe('formToRestDoc', () => {
  let result;
  let formCustomFields;

  beforeEach(() => {
    formCustomFields = restDocToForm(createRestDoc());
    result = formToRestDoc(formCustomFields);
  });

  it('should return an object with custom field values', () => {
    expect(result).toHaveProperty('fields', formCustomFields.fields);
  });

  it('should return an object with the custom field type definition', () => {
    expect(result).toHaveProperty('type', {
      id: formCustomFields.type.id,
      typeId: 'type',
      obj: {
        ...formCustomFields.type,
      },
    });
  });
});

describe('formToGraphQlDoc', () => {
  let result;
  let formCustomFields;

  beforeEach(() => {
    formCustomFields = createRestDoc();
    result = formToGraphQlDoc(formCustomFields);
  });

  it('should return an object with custom field values', () => {
    expect(result).toHaveProperty('fields', formCustomFields.fields);
  });

  it('should return an object with the custom field type definition', () => {
    expect(result).toHaveProperty('type', {
      id: formCustomFields.type.id,
      typeId: 'type',
      obj: {
        ...omit(formCustomFields.type, ['id']),
      },
    });
  });
});

describe('createEmptyCustomFields', () => {
  let emptyFormCustomFields;

  beforeEach(() => {
    emptyFormCustomFields = createEmptyCustomFields();
  });

  it('should return an object with empty custom field values', () => {
    expect(emptyFormCustomFields).toHaveProperty('fields', {});
  });

  it('should return an object with empty custom field type definition', () => {
    expect(emptyFormCustomFields).toHaveProperty('type', {
      fieldDefinitions: [],
    });
  });
});
