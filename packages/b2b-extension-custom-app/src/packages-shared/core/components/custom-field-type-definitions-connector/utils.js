import { transformLocalizedFieldToString } from '@commercetools-local/utils/graphql';
import omit from 'lodash.omit';

export const restDocToForm = customFieldsFromRestResponse => ({
  fields: customFieldsFromRestResponse.fields,
  type: {
    id: customFieldsFromRestResponse.type.id,
    ...customFieldsFromRestResponse.type.obj,
  },
});

export const graphQlDocToForm = typeDefinition => ({
  fields: {},
  type: {
    id: typeDefinition.id,
    key: typeDefinition.key,
    name: transformLocalizedFieldToString(typeDefinition.nameAllLocales),
    fieldDefinitions: typeDefinition.fieldDefinitions.map(fieldDefinition => ({
      name: fieldDefinition.name,
      required: fieldDefinition.required,
      type: do {
        if (fieldDefinition.type?.elementType?.name === 'LocalizedEnum')
          ({
            ...fieldDefinition.type,
            elementType: {
              ...fieldDefinition.type.elementType,
              values: fieldDefinition.type.elementType.values.map(value => ({
                key: value.key,
                label: transformLocalizedFieldToString(value.labelAllLocales),
              })),
            },
          });
        else if (fieldDefinition.type?.name === 'LocalizedEnum')
          ({
            ...fieldDefinition.type,
            values: fieldDefinition.type.values.map(value => ({
              key: value.key,
              label: transformLocalizedFieldToString(value.labelAllLocales),
            })),
          });
        else fieldDefinition.type;
      },
      label: transformLocalizedFieldToString(fieldDefinition.labelAllLocales),
    })),
  },
});

export const formToRestDoc = formCustomFields => ({
  type: {
    id: formCustomFields.type.id,
    typeId: 'type',
    obj: {
      ...formCustomFields.type,
    },
  },
  fields: formCustomFields.fields,
});

export const formToGraphQlDoc = formCustomFields => ({
  type: {
    id: formCustomFields.type.id,
    typeId: 'type',
    obj: {
      ...omit(formCustomFields.type, ['id']),
    },
  },
  fields: formCustomFields.fields || {},
});

export const createEmptyCustomFields = () => ({
  fields: {},
  type: { fieldDefinitions: [] },
});
