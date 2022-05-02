import isNil from 'lodash.isnil';
import formatProductAttribute from '../product-attribute';

const attributeTypeNames = {
  Boolean: 'boolean',
  Date: 'date',
  DateTime: 'datetime',
  Enum: 'enum',
  LocalizedEnum: 'lenum',
  LocalizedString: 'ltext',
  Money: 'money',
  Nested: 'nested',
  Reference: 'reference',
  Set: 'set',
  String: 'text',
  Time: 'time',
  Number: 'number',
};

const convertToAttributeType = customFieldType => {
  if (isNil(customFieldType)) return customFieldType;
  const attributeTypeName = attributeTypeNames[customFieldType.name];
  const elementTypeName = attributeTypeNames[customFieldType.elementType?.name];
  return { name: attributeTypeName, elementType: { name: elementTypeName } };
};

const inlineEnumValues = (type, value) => {
  if (isNil(type)) return value;

  if (type.name === 'Set') {
    return value.map(setValue => inlineEnumValues(type.elementType, setValue));
  }
  if (type.name === 'Enum' || type.name === 'LocalizedEnum') {
    return type.values.find(enumValue => enumValue.key === value);
  }
  return value;
};

/**
 * Formats `Custom Fields`: https://docs.commercetools.com/http-api-projects-custom-fields.html
 * Despite having different names, most of `Custom Field` maps one-to-one with an appropriate
 * `Product Attribute Type`, hence we can reuse product attributes formatting logic.
 *
 * The only exception is `Enum` and `LEnum` types. Unlike when dealing with `Product Attribute Types`,
 * value in `Custom Fields` contains a key of an `Enum` entry, and not an entry itself.
 * Therefore, before passing value to attributes formatter we need to replace value with Enum entry.
 */
export default function formatCustomField({
  type,
  value,
  intl,
  language,
  languages,
}) {
  const attributeType = convertToAttributeType(type);

  return formatProductAttribute({
    type: attributeType,
    value: inlineEnumValues(type, value),
    intl,
    language,
    languages,
  });
}
