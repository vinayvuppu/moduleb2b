const REGEX_ISO8601 = /(\d{4}-\d{2}-\d{2}[T]\d{2}:\d{2}:\d{2}(\.\d{3}[Z]?))/;
const REGEX_TIME = /\d{2}:\d{2}/;
const REGEX_DATE = /\d{4}-\d{2}-\d{2}/;

/**
 * Map Custom Type values to Attribute values
 * @param {Object} fields - The `fields` object in the Custom-Type
 * @param {Object} definition - The `fieldDefinition` object of a Custom-Type
 * @return {Object}
 */
export function mapToAttributeValue(fields, definition) {
  const { name, type } = definition;
  const fieldName = fields?.[name];
  switch (type.name) {
    case 'Enum':
    case 'LocalizedEnum': {
      let value;
      if (fieldName) value = type.values.find(v => fieldName === v.key);

      return { name, value };
    }
    case 'Set': {
      const setValues = fieldName || [];
      const value = setValues.map(customTypeValue => {
        const attribute = mapToAttributeValue(
          { [name]: customTypeValue },
          {
            name,
            type: type.elementType,
          }
        );
        return attribute.value;
      });
      return { name, value };
    }
    default: {
      return { name, value: fieldName };
    }
  }
}

/**
 * Map a Custom-Type's fieldType to an Attribute-Type
 * @param {Object} type
 * @return {Object} Attribute-Type
 */
export function mapToAttributeType(type) {
  const { name } = type;

  switch (name) {
    case 'String':
      return { name: 'text' };
    case 'LocalizedString':
      return { name: 'ltext' };
    case 'Enum':
    case 'LocalizedEnum':
      return {
        name: name === 'Enum' ? 'enum' : 'lenum',
        values: type.values,
      };
    case 'Set': {
      const elementType = mapToAttributeType(type.elementType);
      return {
        name: name.toLowerCase(),
        elementType: {
          ...type.elementType,
          name: elementType.name,
        },
      };
    }
    case 'Reference':
      return {
        name: name.toLowerCase(),
        referenceTypeId: type.referenceTypeId,
      };
    default:
      return { name: name.toLowerCase() };
  }
}

/**
 * Map a Custom-Type `fieldDefinition` to an Attribute-Type definition
 * @param {Object} definition - The `fieldDefinition` of a Custom-Type
 * @return Attribute-Type definition
 */
export function mapToAttributeDefinition(definition) {
  return {
    name: definition.name,
    label: definition.label,
    inputHint: definition.inputHint,
    // --------------------------------------------------
    // difference between Custom Types FieldType (definition)
    // and AttributeDefinition goes below
    // --------------------------------------------------
    type: mapToAttributeType(definition.type),
    isRequired: definition.required,
  };
}

/**
 * Map an Attribute-Type value to a Custom-Type value
 * @param {Object} attribute - The Attribute-Type value
 * @param {Object} definition - The Custom-Type `fieldDefinition`
 * @return {Object}
 */
export function mapToCustomTypeValue(attribute, definition) {
  const { type } = definition;
  if (isNotDefined(attribute) || isNotDefinedValue(attribute.value, type.name))
    return undefined;

  switch (type.name) {
    case 'Enum':
    case 'LocalizedEnum':
      return attribute.value.key;
    case 'Reference':
      return {
        ...attribute.value,
        typeId: type.referenceTypeId,
      };
    case 'Set': {
      const setValues = attribute.value || [];
      return setValues.map(attributeValue => {
        const customTypeValue = mapToCustomTypeValue(
          { value: attributeValue },
          {
            type: type.elementType,
          }
        );
        return customTypeValue;
      });
    }
    default:
      return attribute.value;
  }
}

/**
 * Filter the `value` key in an updateActions set for Custom-Type
 * @param {Array} updateActions
 * @param {Array} fieldDefinitions
 */
export function filterCustomTypeUpdateActionValues(
  updateActions = [],
  fieldDefinitions = []
) {
  return updateActions.map(updateAction => {
    if (
      updateAction.action === 'setCustomField' &&
      Array.isArray(updateAction.value)
    ) {
      const definition = fieldDefinitions.find(
        field => field.name === updateAction.name
      );

      const definitionName = definition.type.elementType.name;
      return {
        ...updateAction,
        value: filterNotDefinedValues(updateAction.value, definitionName),
      };
    }
    return updateAction;
  });
}

export function filterNotDefinedValues(values = [], definitionName) {
  return values.filter(value => !isNotDefinedValue(value, definitionName));
}

export function isNotDefinedValue(value, definitionName) {
  if (typeof value === 'string') return !value.length;
  if (isNotDefined(value)) return true;

  switch (definitionName) {
    case 'Enum':
    case 'LocalizedEnum':
      return isNotDefined(value.key) || isNotDefined(value.label);
    case 'Money':
      return isNotDefined(value.currencyCode) || isNotDefined(value.centAmount);
    case 'Reference': {
      return isNotDefined(value.typeId) || isNotDefined(value.id);
    }
    default:
      return isNotDefined(value);
  }
}

function isNotDefined(value) {
  return value === undefined || value === null;
}

export function getReferenceTypeId(definition) {
  const { type } = definition;

  return 'elementType' in type
    ? type.elementType.referenceTypeId
    : type.referenceTypeId;
}

export function getTypeNameOfType(type) {
  return type.elementType ? type.elementType.name : type.name;
}

export function getAttributeValueType(value) {
  if (Array.isArray(value)) return getAttributeValueType(value[0]);

  if (typeof value === 'object') {
    const valueKeys = Object.keys(value);
    if (valueKeys.includes('label') && valueKeys.includes('key')) {
      if (typeof value.label === 'object') return 'lenum';

      return 'enum';
    }

    if (valueKeys.includes('centAmount') && valueKeys.includes('currencyCode'))
      return 'money';

    if (valueKeys.includes('id') && valueKeys.includes('typeId'))
      return 'reference';

    return 'ltext';
  }

  if (typeof value === 'boolean') return 'boolean';
  if (typeof value === 'number') return 'number';
  if (REGEX_ISO8601.test(value)) return 'date-time';
  if (REGEX_TIME.test(value)) return 'time';
  if (REGEX_DATE.test(value)) return 'date';

  return 'text';
}

/**
 * Filters out all of those field definitions that are not supporte by
 * CustomAttributes component which are the nested ones (Set of Sets)
 * @param {Array} fieldDefinitions - All the fieldDefinitions
 * @return {Array} fieldDefinitions without nested resources
 */
export function omitNestedFieldDefinitions(fieldDefinitions = []) {
  const nestedFieldDefinitionsByName = fieldDefinitions
    .filter(fieldDefinition => fieldDefinition.type.name === 'Set')
    .filter(fieldDefinition => fieldDefinition.type.elementType.name === 'Set')
    .map(fieldDefinition => fieldDefinition.name);

  return fieldDefinitions.filter(
    fieldDefinition =>
      !nestedFieldDefinitionsByName.includes(fieldDefinition.name)
  );
}
