import {
  injectTransformedLocalizedFields,
  transformLocalizedFieldToString,
} from '@commercetools-local/utils/graphql';

const convertCustomFields = employee => ({
  type: {
    typeId: 'type',
    id: employee.custom.type.id,
    obj: {
      key: employee.custom.type.key,
      name: transformLocalizedFieldToString(
        employee.custom.type.nameAllLocales
      ),
      fieldDefinitions: employee.custom.type.fieldDefinitions.map(
        fieldDefinition => ({
          name: fieldDefinition.name,
          required: fieldDefinition.required,
          type: do {
            if (fieldDefinition.type?.elementType?.name === 'LocalizedEnum')
              ({
                ...fieldDefinition.type,
                elementType: {
                  ...fieldDefinition.type.elementType,
                  values: fieldDefinition.type.elementType.values.map(
                    value => ({
                      key: value.key,
                      label: transformLocalizedFieldToString(
                        value.labelAllLocales
                      ),
                    })
                  ),
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
          label: transformLocalizedFieldToString(
            fieldDefinition.labelAllLocales
          ),
        })
      ),
    },
  },
  fields: employee.custom.customFieldsRaw.reduce(
    (fields, customField) => ({
      ...fields,
      [customField.name]: customField.value,
    }),
    {}
  ),
});

export const mapDataToProps = ({ employeeQuery }) => ({
  employeeQuery: {
    ...employeeQuery,
    employee:
      employeeQuery.loading || !employeeQuery.employee
        ? undefined
        : {
            ...employeeQuery.employee,
            custom: employeeQuery.employee?.custom
              ? convertCustomFields(employeeQuery.employee)
              : null,
            stores:
              employeeQuery.employee?.stores?.length > 0
                ? employeeQuery.employee.stores.map(store =>
                    injectTransformedLocalizedFields(store, [
                      {
                        from: 'nameAllLocales',
                        to: 'name',
                      },
                    ])
                  )
                : [],
          },
  },
});

export default mapDataToProps;
