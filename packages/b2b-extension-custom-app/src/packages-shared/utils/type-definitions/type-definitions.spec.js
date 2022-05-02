import * as typeDefinitions from './type-definitions';

const createCustomType = () => ({
  id: '88380bbf-1b4d-4315-9afb-c9a5e1aeca15',
  version: 1,
  key: 'category-type-attribute-a8673923',
  name: {
    en: 'category-type',
  },
  description: {
    en: 'category-description',
  },
  resourceTypeIds: ['category'],
  fieldDefinitions: [
    {
      name: 'Boolean',
      label: {
        en: 'boolean bfc0ef4e',
      },
      required: false,
      type: {
        name: 'Boolean',
      },
      inputHint: 'SingleLine',
    },
    {
      name: 'String',
      label: {
        en: 'string 67313237',
      },
      required: true,
      type: {
        name: 'String',
      },
      inputHint: 'SingleLine',
    },
    {
      name: 'LocalizedString',
      label: {
        en: 'localizedstring c3d441a2',
      },
      required: true,
      type: {
        name: 'LocalizedString',
      },
      inputHint: 'SingleLine',
    },
    {
      name: 'Enum',
      label: {
        en: 'enum 29960d0d',
      },
      required: false,
      type: {
        name: 'Enum',
        values: [
          {
            key: 'enum_value',
            label: 'enum_label',
          },
        ],
      },
      inputHint: 'SingleLine',
    },
    {
      name: 'LocalizedEnum',
      label: {
        en: 'localizedenum 32ac5837',
      },
      required: true,
      type: {
        name: 'LocalizedEnum',
        values: [
          {
            key: 'enum_label_localized',
            label: {
              en: 'enum_label_localized',
            },
          },
        ],
      },
      inputHint: 'SingleLine',
    },
    {
      name: 'Number',
      label: {
        en: 'number fe84c50d',
      },
      required: true,
      type: {
        name: 'Number',
      },
      inputHint: 'SingleLine',
    },
    {
      name: 'Money',
      label: {
        en: 'money 25fb249b',
      },
      required: false,
      type: {
        name: 'Money',
      },
      inputHint: 'SingleLine',
    },
    {
      name: 'Date',
      label: {
        en: 'date 599eabc4',
      },
      required: true,
      type: {
        name: 'Date',
      },
      inputHint: 'SingleLine',
    },
    {
      name: 'Time',
      label: {
        en: 'time 6deb133b',
      },
      required: true,
      type: {
        name: 'Time',
      },
      inputHint: 'SingleLine',
    },
    {
      name: 'DateTime',
      label: {
        en: 'datetime 2df06d9b',
      },
      required: false,
      type: {
        name: 'DateTime',
      },
      inputHint: 'SingleLine',
    },
    {
      name: 'Reference',
      label: {
        en: 'reference d9877068',
      },
      required: true,
      type: {
        name: 'Reference',
        referenceTypeId: 'category',
      },
      inputHint: 'SingleLine',
    },
    {
      name: 'BooleanSet',
      label: {
        en: 'Boolean SET',
      },
      required: false,
      type: {
        name: 'Set',
        elementType: {
          name: 'Boolean',
        },
      },
      inputHint: 'SingleLine',
    },
    {
      name: 'StringSet',
      label: {
        en: 'String SET',
      },
      required: false,
      type: {
        name: 'Set',
        elementType: {
          name: 'String',
        },
      },
      inputHint: 'SingleLine',
    },
    {
      name: 'LocalizedStringSet',
      label: {
        en: 'LocalizedString SET',
      },
      required: false,
      type: {
        name: 'Set',
        elementType: {
          name: 'LocalizedString',
        },
      },
      inputHint: 'SingleLine',
    },
    {
      name: 'EnumSet',
      label: {
        en: 'Enum SET',
      },
      required: false,
      type: {
        name: 'Set',
        elementType: {
          name: 'Enum',
          values: [
            {
              key: 'enum_value',
              label: 'enum_label',
            },
          ],
        },
      },
      inputHint: 'SingleLine',
    },
    {
      name: 'LocalizedEnumSet',
      label: {
        en: 'LocalizedEnum SET',
      },
      required: false,
      type: {
        name: 'Set',
        elementType: {
          name: 'LocalizedEnum',
          values: [
            {
              key: 'enum_label_localized',
              label: {
                en: 'enum_label_localized',
              },
            },
          ],
        },
      },
      inputHint: 'SingleLine',
    },
    {
      name: 'NumberSet',
      label: {
        en: 'Number SET',
      },
      required: false,
      type: {
        name: 'Set',
        elementType: {
          name: 'Number',
        },
      },
      inputHint: 'SingleLine',
    },
    {
      name: 'MoneySet',
      label: {
        en: 'Money SET',
      },
      required: false,
      type: {
        name: 'Set',
        elementType: {
          name: 'Money',
        },
      },
      inputHint: 'SingleLine',
    },
    {
      name: 'DateSet',
      label: {
        en: 'Date SET',
      },
      required: false,
      type: {
        name: 'Set',
        elementType: {
          name: 'Date',
        },
      },
      inputHint: 'SingleLine',
    },
    {
      name: 'TimeSet',
      label: {
        en: 'Time SET',
      },
      required: false,
      type: {
        name: 'Set',
        elementType: {
          name: 'Time',
        },
      },
      inputHint: 'SingleLine',
    },
    {
      name: 'DateTimeSet',
      label: {
        en: 'DateTime SET',
      },
      required: false,
      type: {
        name: 'Set',
        elementType: {
          name: 'DateTime',
        },
      },
      inputHint: 'SingleLine',
    },
    {
      name: 'ReferenceSet',
      label: {
        en: 'Reference SET',
      },
      required: false,
      type: {
        name: 'Set',
        elementType: {
          name: 'Reference',
          referenceTypeId: 'category',
        },
      },
      inputHint: 'SingleLine',
    },
  ],
  createdAt: '2016-06-08T10:20:08.908Z',
  lastModifiedAt: '2016-06-08T10:20:08.908Z',
});

const createAttributeValue = ({ type, index }) => {
  switch (type) {
    case 'money':
      return {
        centAmount: Math.floor(Math.random() * 101),
        currencyCode: 'EUR',
      };
    case 'lenum':
      return {
        key: `lenum-${index}`,
        label: {
          en: 'lenum',
        },
      };
    case 'enum':
      return {
        key: `enum-${index}`,
        label: 'enum',
      };
    case 'number':
      return Math.floor(Math.random() * 101);
    case 'ltext':
      return {
        en: 'text',
      };
    case 'reference':
      return {
        id: `reference-${index}`,
        typeId: 'reference',
      };
    case 'date-time':
      return '2017-01-16T14:00:34.177Z';
    case 'time':
      return '14:00';
    case 'date':
      return '2017-01-16';
    default:
      return 'text';
  }
};

const createAttribute = ({ type, isSet }) => ({
  name: `attribute-${type}`,
  value: isSet
    ? Array.from({ length: 10 }).map((_, index) =>
        createAttributeValue({ type, index })
      )
    : createAttributeValue({ type, index: 0 }),
});

describe('mapping type definitions', () => {
  const getFieldDefinition = (customType, definitionName) =>
    customType.fieldDefinitions.find(
      definition => definition.name === definitionName
    );
  describe('mapping to custom type value', () => {
    it('maps attribute "text" value to a custom-type "String" value', () => {
      const customType = createCustomType();
      const attribute = { value: 'This is a random string' };
      const customTypeValue = typeDefinitions.mapToCustomTypeValue(
        attribute,
        getFieldDefinition(customType, 'String')
      );

      const expected = 'This is a random string';
      expect(customTypeValue).toBe(expected);
    });

    it('maps attribute text-set value to custom String-set', () => {
      const customType = createCustomType();
      const attribute = { value: ['list', 'of', 'string'] };
      const customTypeValue = typeDefinitions.mapToCustomTypeValue(
        attribute,
        getFieldDefinition(customType, 'String')
      );

      const expected = ['list', 'of', 'string'];
      expect(customTypeValue).toEqual(expected);
    });

    it('maps enum attribute value to a custom value', () => {
      const customType = createCustomType();
      const attribute = {
        value: {
          key: 'enum value',
          label: { en: 'enum label' },
        },
      };

      const customTypeValue = typeDefinitions.mapToCustomTypeValue(
        attribute,
        getFieldDefinition(customType, 'Enum')
      );

      const expected = 'enum value';
      expect(customTypeValue).toBe(expected);
    });

    it('maps set values for enum', () => {
      const customType = createCustomType();
      const attribute = {
        value: [{ key: 'enum_value_1', label: 'enum_value' }],
      };
      const customTypeValue = typeDefinitions.mapToCustomTypeValue(
        attribute,
        getFieldDefinition(customType, 'EnumSet')
      );

      const expected = ['enum_value_1'];
      expect(customTypeValue).toEqual(expected);
    });

    it('returns undefined for enum when the attribute is null', () => {
      const customType = createCustomType();
      const attribute = null;
      const customTypeValue = typeDefinitions.mapToCustomTypeValue(
        attribute,
        getFieldDefinition(customType, 'Enum')
      );

      expect(customTypeValue).toBeUndefined();
    });

    it('returns undefined for enum when the attribute value is null', () => {
      const customType = createCustomType();
      const attribute = { name: 'random-enum', value: null };
      const customTypeValue = typeDefinitions.mapToCustomTypeValue(
        attribute,
        getFieldDefinition(customType, 'Enum')
      );

      expect(customTypeValue).toBeUndefined();
    });

    it('maps money attribute value to a custom value', () => {
      const customType = createCustomType();
      const attribute = { value: { centAmount: 123000, currencyCode: 'EUR' } };
      const customTypeValue = typeDefinitions.mapToCustomTypeValue(
        attribute,
        getFieldDefinition(customType, 'Money')
      );

      const expected = { centAmount: 123000, currencyCode: 'EUR' };
      expect(customTypeValue).toEqual(expected);
    });

    it('returns undefined for money when attribute is null', () => {
      const customType = createCustomType();
      const attribute = null;
      const customTypeValue = typeDefinitions.mapToCustomTypeValue(
        attribute,
        getFieldDefinition(customType, 'Money')
      );

      expect(customTypeValue).toBeUndefined();
    });

    it('returns undefined for money when attribute value is null', () => {
      const customType = createCustomType();
      const attribute = { name: 'random-money', value: null };
      const customTypeValue = typeDefinitions.mapToCustomTypeValue(
        attribute,
        getFieldDefinition(customType, 'Money')
      );

      expect(customTypeValue).toBeUndefined();
    });

    it('maps reference attribute value to custom value', () => {
      const customType = createCustomType();
      const attribute = {
        value: { typeId: 'category', id: '112233' },
      };
      const customTypeValue = typeDefinitions.mapToCustomTypeValue(
        attribute,
        getFieldDefinition(customType, 'Reference')
      );

      const expected = { typeId: 'category', id: '112233' };
      expect(customTypeValue).toEqual(expected);
    });

    it('returns undefined for reference when attribute is null', () => {
      const customType = createCustomType();
      const attribute = null;
      const customTypeValue = typeDefinitions.mapToCustomTypeValue(
        attribute,
        getFieldDefinition(customType, 'Reference')
      );

      expect(customTypeValue).toBeUndefined();
    });

    it('returns undefined for reference when attribute value is null', () => {
      const customType = createCustomType();
      const attribute = { name: 'random-reference', value: null };
      const customTypeValue = typeDefinitions.mapToCustomTypeValue(
        attribute,
        getFieldDefinition(customType, 'Reference')
      );

      expect(customTypeValue).toBeUndefined();
    });
  });

  describe('mapping to attribute definition', () => {
    it('maps Custom-Type String definition to Attribute text definition', () => {
      const customType = createCustomType();
      const stringTypeDefinition = getFieldDefinition(customType, 'String');
      const attributeDefinition = typeDefinitions.mapToAttributeDefinition(
        stringTypeDefinition
      );

      const expected = {
        name: stringTypeDefinition.name,
        label: stringTypeDefinition.label,
        inputHint: stringTypeDefinition.inputHint,
        isRequired: stringTypeDefinition.required,
        type: { name: 'text' },
      };

      expect(attributeDefinition).toEqual(expected);
    });

    it('maps Custom-Type Enum definition to Attribute enum definition', () => {
      const customType = createCustomType();
      const enumTypeDefinition = getFieldDefinition(customType, 'Enum');
      const attributeDefinition = typeDefinitions.mapToAttributeDefinition(
        enumTypeDefinition
      );

      const expected = {
        name: enumTypeDefinition.name,
        label: enumTypeDefinition.label,
        inputHint: enumTypeDefinition.inputHint,
        isRequired: enumTypeDefinition.required,
        type: {
          name: 'enum',
          values: enumTypeDefinition.type.values,
        },
      };

      expect(attributeDefinition).toEqual(expected);
    });

    it('maps LocalizedEnum definition to Attribute lenum definition', () => {
      const customType = createCustomType();
      const localisedEnumTypeDefinition = getFieldDefinition(
        customType,
        'LocalizedEnum'
      );
      const attributeDefinition = typeDefinitions.mapToAttributeDefinition(
        localisedEnumTypeDefinition
      );

      const expected = {
        name: localisedEnumTypeDefinition.name,
        label: localisedEnumTypeDefinition.label,
        inputHint: localisedEnumTypeDefinition.inputHint,
        isRequired: localisedEnumTypeDefinition.required,
        type: {
          name: 'lenum',
          values: localisedEnumTypeDefinition.type.values,
        },
      };

      expect(attributeDefinition).toEqual(expected);
    });

    it('maps Custom-Type Money definition to Attribute money definition', () => {
      const customType = createCustomType();
      const moneyTypeDefinition = getFieldDefinition(customType, 'Money');
      const attributeDefinition = typeDefinitions.mapToAttributeDefinition(
        moneyTypeDefinition
      );

      const expected = {
        name: moneyTypeDefinition.name,
        label: moneyTypeDefinition.label,
        inputHint: moneyTypeDefinition.inputHint,
        isRequired: moneyTypeDefinition.required,
        type: { name: 'money' },
      };
      expect(attributeDefinition).toEqual(expected);
    });

    it('maps Custom-Type Reference to Attribute reference definition', () => {
      const customType = createCustomType();
      const referenceTypeDefinition = getFieldDefinition(
        customType,
        'Reference'
      );

      const attributeDefinition = typeDefinitions.mapToAttributeDefinition(
        referenceTypeDefinition
      );

      const expected = {
        name: referenceTypeDefinition.name,
        label: referenceTypeDefinition.label,
        inputHint: referenceTypeDefinition.inputHint,
        isRequired: referenceTypeDefinition.required,
        type: {
          name: 'reference',
          referenceTypeId: referenceTypeDefinition.type.referenceTypeId,
        },
      };

      expect(attributeDefinition).toEqual(expected);
    });
  });

  describe('mapping to attribute value', () => {
    it('maps Custom-Type String value to Attribute string value', () => {
      const customType = createCustomType();
      const stringTypeDefinition = getFieldDefinition(customType, 'String');
      const fieldValues = { String: 'string' };
      const attributeValue = typeDefinitions.mapToAttributeValue(
        fieldValues,
        stringTypeDefinition
      );

      expect(attributeValue).toEqual({
        name: stringTypeDefinition.name,
        value: 'string',
      });
    });

    it('maps Custom-Type StringSet value to Attribute StringSet value', () => {
      const customType = createCustomType();
      const stringSetDefinition = getFieldDefinition(customType, 'StringSet');
      const fieldValues = { StringSet: ['a', 'string', 'in', 'set'] };
      const attributeSet = typeDefinitions.mapToAttributeValue(
        fieldValues,
        stringSetDefinition
      );

      expect(attributeSet).toEqual({
        name: stringSetDefinition.name,
        value: ['a', 'string', 'in', 'set'],
      });
    });

    it('maps Custom-Type Enum value to Attribute Enum value', () => {
      const customType = createCustomType();
      const enumTypeDefinition = getFieldDefinition(customType, 'Enum');
      const fieldValues = { Enum: 'enum_value' };
      const attributeValue = typeDefinitions.mapToAttributeValue(
        fieldValues,
        enumTypeDefinition
      );

      expect(attributeValue).toEqual({
        name: 'Enum',
        value: {
          key: 'enum_value',
          label: 'enum_label',
        },
      });
    });

    it('maps Custom-Type EnumSet value to Attribute EnumSet value', () => {
      const customType = createCustomType();
      const enumSetDefinition = getFieldDefinition(customType, 'EnumSet');
      const fieldValues = { EnumSet: ['enum_value'] };
      const attributeSet = typeDefinitions.mapToAttributeValue(
        fieldValues,
        enumSetDefinition
      );

      expect(attributeSet).toEqual({
        name: enumSetDefinition.name,
        value: [{ key: 'enum_value', label: 'enum_label' }],
      });
    });

    it('maps Custom-Type Money value to Attribute money value', () => {
      const customType = createCustomType();
      const moneyTypeDefinition = getFieldDefinition(customType, 'Money');
      const fieldValues = {
        Money: {
          currencyCode: 'EUR',
          centAmount: 123000,
        },
      };
      const attributeValue = typeDefinitions.mapToAttributeValue(
        fieldValues,
        moneyTypeDefinition
      );

      expect(attributeValue).toEqual({
        name: 'Money',
        value: {
          currencyCode: 'EUR',
          centAmount: 123000,
        },
      });
    });

    it('maps Custom-Type MoneySet to Attribute MoneySet value', () => {
      const customType = createCustomType();
      const moneySetDefinition = getFieldDefinition(customType, 'MoneySet');
      const fieldValues = {
        MoneySet: [{ centAmount: 10000, currencyCode: 'EUR' }],
      };
      const attributeSet = typeDefinitions.mapToAttributeValue(
        fieldValues,
        moneySetDefinition
      );

      expect(attributeSet).toEqual({
        name: moneySetDefinition.name,
        value: [{ centAmount: 10000, currencyCode: 'EUR' }],
      });
    });

    it('maps Custom-Type Reference value to Attribute reference value', () => {
      const customType = createCustomType();
      const referenceTypeDefinition = getFieldDefinition(
        customType,
        'Reference'
      );

      const fieldValues = {
        Reference: {
          typeId: 'category',
          id: '112233',
        },
      };

      const attributeValue = typeDefinitions.mapToAttributeValue(
        fieldValues,
        referenceTypeDefinition
      );

      expect(attributeValue).toEqual({
        name: 'Reference',
        value: {
          typeId: 'category',
          id: '112233',
        },
      });
    });

    it('maps Custom-Type ReferenceSet to Attribute ReferenceSet value', () => {
      const customType = createCustomType();
      const referenceSetTypeDefinition = getFieldDefinition(
        customType,
        'ReferenceSet'
      );
      const fieldValues = {
        ReferenceSet: [{ typeId: 'category', id: '112233' }],
      };
      const attributeSet = typeDefinitions.mapToAttributeValue(
        fieldValues,
        referenceSetTypeDefinition
      );

      expect(attributeSet).toEqual({
        name: referenceSetTypeDefinition.name,
        value: [{ typeId: 'category', id: '112233' }],
      });
    });
  });

  describe('mapping to attribute type', () => {
    it('maps Custom-Type String to Attribute text', () => {
      const customType = { name: 'String' };
      const attributeType = typeDefinitions.mapToAttributeType(customType);

      expect(attributeType).toEqual({ name: 'text' });
    });

    it('maps Custom-Type LocalisedString to Attribute ltext', () => {
      const customType = { name: 'LocalizedString' };
      const attributeType = typeDefinitions.mapToAttributeType(customType);

      expect(attributeType).toEqual({ name: 'ltext' });
    });

    it('maps Custom-Type Enum to Attribute enum', () => {
      const customType = { name: 'Enum', values: [] };
      const attributeType = typeDefinitions.mapToAttributeType(customType);

      expect(attributeType).toEqual({ name: 'enum', values: [] });
    });

    it('maps Custom-Type LocalizedEnum to Attribute lenum', () => {
      const customType = { name: 'LocalizedEnum', values: [] };
      const attributeType = typeDefinitions.mapToAttributeType(customType);

      expect(attributeType).toEqual({ name: 'lenum', values: [] });
    });

    it('maps Custom-Type Money to Attribute money', () => {
      const customType = { name: 'Money' };
      const attributeType = typeDefinitions.mapToAttributeType(customType);

      expect(attributeType).toEqual({ name: 'money' });
    });

    it('maps Custom-Type Reference to Attribute reference', () => {
      const customType = { name: 'reference' };
      const attributeType = typeDefinitions.mapToAttributeType(customType);

      expect(attributeType).toEqual({ name: 'reference' });
    });
  });

  describe('getting the type name of type', () => {
    it('returns the element type name if there is an element type', () => {
      const type = {
        name: 'set',
        elementType: { name: 'enum' },
      };

      expect(typeDefinitions.getTypeNameOfType(type)).toBe('enum');
    });

    it('returns the type name if there no element type', () => {
      const type = { name: 'enum' };

      expect(typeDefinitions.getTypeNameOfType(type)).toBe('enum');
    });
  });

  describe('get type of an attribute', () => {
    it('should return money as attribute-type', () => {
      const attributeMoney = createAttribute({ type: 'money' });
      expect(typeDefinitions.getAttributeValueType(attributeMoney.value)).toBe(
        'money'
      );

      const attributeMoneySet = createAttribute({
        type: 'money',
        isSet: true,
      });

      expect(
        typeDefinitions.getAttributeValueType(attributeMoneySet.value)
      ).toBe('money');
    });

    it('should return ltext as attribute-type', () => {
      const attributeLocalizedText = createAttribute({ type: 'ltext' });
      expect(
        typeDefinitions.getAttributeValueType(attributeLocalizedText.value)
      ).toBe('ltext');

      const attributeLocalizedTextSet = createAttribute({
        type: 'ltext',
        isSet: true,
      });

      expect(
        typeDefinitions.getAttributeValueType(attributeLocalizedTextSet.value)
      ).toBe('ltext');
    });

    it('should return text as attribute-type', () => {
      const attributeText = createAttribute({ type: 'text' });
      expect(typeDefinitions.getAttributeValueType(attributeText.value)).toBe(
        'text'
      );

      const attributeTextSet = createAttribute({ type: 'text', isSet: true });
      expect(
        typeDefinitions.getAttributeValueType(attributeTextSet.value)
      ).toBe('text');
    });

    it('should return date as attribute-type', () => {
      const attributeDate = createAttribute({ type: 'date' });
      expect(typeDefinitions.getAttributeValueType(attributeDate.value)).toBe(
        'date'
      );

      const attributeDateSet = createAttribute({ type: 'date', isSet: true });
      expect(
        typeDefinitions.getAttributeValueType(attributeDateSet.value)
      ).toBe('date');
    });

    it('should return datetime as attribute-type', () => {
      const attributeDateTime = createAttribute({ type: 'date-time' });
      expect(
        typeDefinitions.getAttributeValueType(attributeDateTime.value)
      ).toBe('date-time');

      const attributeDateTimeSet = createAttribute({
        type: 'date-time',
        isSet: true,
      });

      expect(
        typeDefinitions.getAttributeValueType(attributeDateTimeSet.value)
      ).toBe('date-time');
    });

    it('should return time as attribute-type', () => {
      const attributeTime = createAttribute({ type: 'time' });
      expect(typeDefinitions.getAttributeValueType(attributeTime.value)).toBe(
        'time'
      );

      const attributeTimeSet = createAttribute({ type: 'time', isSet: true });
      expect(
        typeDefinitions.getAttributeValueType(attributeTimeSet.value)
      ).toBe('time');
    });

    it('should return reference as attribute-input', () => {
      const attributeReference = createAttribute({ type: 'reference' });
      expect(
        typeDefinitions.getAttributeValueType(attributeReference.value)
      ).toBe('reference');

      const attributeReferenceSet = createAttribute({
        type: 'reference',
        isSet: true,
      });

      expect(
        typeDefinitions.getAttributeValueType(attributeReferenceSet.value)
      ).toBe('reference');
    });

    it('should return enum as attribute-input', () => {
      const attributeEnum = createAttribute({ type: 'enum' });
      expect(typeDefinitions.getAttributeValueType(attributeEnum.value)).toBe(
        'enum'
      );
    });
  });
});

describe('omitNestedFieldDefinitions', () => {
  let result;
  let type;
  let fieldDefinitions;
  describe('when there are nested resources', () => {
    beforeEach(() => {
      type = createCustomType();
      fieldDefinitions = [
        ...type.fieldDefinitions,
        {
          name: 'nested-definition',
          required: false,
          label: { en: 'nested-definition' },
          type: {
            name: 'Set',
            elementType: {
              name: 'Set',
              elementType: { name: 'String' },
            },
          },
        },
      ];
      result = typeDefinitions.omitNestedFieldDefinitions(fieldDefinitions);
    });
    it('should return fieldDefinitions without nested definitions', () => {
      expect(result).toEqual(
        expect.not.arrayContaining([
          expect.objectContaining({
            name: 'nested-definition',
          }),
        ])
      );
    });
  });
  describe('when there are no nested resources', () => {
    beforeEach(() => {
      type = createCustomType();
      fieldDefinitions = type.fieldDefinitions;
      result = typeDefinitions.omitNestedFieldDefinitions(fieldDefinitions);
    });
    it('should return fieldDefinitions with all the definitions', () => {
      expect(result).toEqual(type.fieldDefinitions);
    });
  });
});
